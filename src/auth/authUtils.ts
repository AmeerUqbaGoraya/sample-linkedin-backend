import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

interface UserPayload {
    UserID: number;
    Email: string;
    UserRole: string;
    iat?: number;
    exp?: number;
}

export const generateTokens = (user: UserPayload) => {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;
    const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    
    if (!accessSecret || !refreshSecret) {
        throw new Error('JWT secrets not configured');
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    
    const payload = { 
        UserID: user.UserID, 
        Email: user.Email, 
        UserRole: user.UserRole,
        iat: currentTime
    };
    
    const accessToken = jwt.sign(payload, accessSecret, { expiresIn: accessExpiresIn } as any);

    const refreshPayload = { 
        UserID: user.UserID, 
        Email: user.Email,
        iat: currentTime
    };
    
    const refreshToken = jwt.sign(refreshPayload, refreshSecret, { expiresIn: refreshExpiresIn } as any);

    return { accessToken, refreshToken };
};

export const verifyAccessToken = async (token: string): Promise<UserPayload | null> => {
    try {
        console.log('🔐 [AUTH] Verifying access token...');
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as UserPayload;
        
        console.log('💾 [AUTH] Fetching fresh user data from database for UserID:', decoded.UserID);
        const dbUser = await User.findOne({
            where: {
                UserID: decoded.UserID,
                Email: decoded.Email
            }
        });
        
        if (!dbUser) {
            console.log('❌ [AUTH] User not found in database or email mismatch');
            return null;
        }
        
        if (dbUser.Email !== decoded.Email || dbUser.UserRole !== decoded.UserRole) {
            console.log('❌ [AUTH] Token data mismatch with database - Email or Role changed');
            console.log('🔍 [AUTH] Token Email:', decoded.Email, 'DB Email:', dbUser.Email);
            console.log('🔍 [AUTH] Token Role:', decoded.UserRole, 'DB Role:', dbUser.UserRole);
            return null;
        }
        
        console.log('✅ [AUTH] Token verified against database successfully');
        return {
            UserID: dbUser.UserID,
            Email: dbUser.Email,
            UserRole: dbUser.UserRole
        };
    } catch (error) {
        console.log('❌ [AUTH] Token verification failed:', error);
        return null;
    }
};

export const verifyRefreshToken = async (refreshToken: string): Promise<User | null> => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as any;
        
        // Find the user by ID from the decoded token (using UserID, not userId)
        const user = await User.findOne({ 
            where: { 
                UserID: decoded.UserID
            } 
        });

        if (!user) {
            console.log('❌ [REFRESH] User not found for refresh token');
            return null;
        }

        console.log('✅ [REFRESH] Refresh token verified for user:', user.Email);
        return user;
    } catch (error) {
        console.log('❌ [REFRESH] Invalid refresh token:', error);
        return null;
    }
};

// Helper function for automatic token refresh
export const attemptTokenRefresh = async (refreshToken: string): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
} | null> => {
    try {
        console.log('🔄 [REFRESH] Attempting automatic token refresh...');
        
        const user = await verifyRefreshToken(refreshToken);
        if (!user) {
            console.log('❌ [REFRESH] Invalid refresh token for auto-refresh');
            return null;
        }

        // Generate new tokens using the existing generateTokens function
        const newTokens = generateTokens(user);

        console.log('✅ [REFRESH] Tokens automatically refreshed for user:', user.Email);
        return {
            user,
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken
        };
    } catch (error) {
        console.log('❌ [REFRESH] Auto-refresh failed:', error);
        return null;
    }
};

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    console.log('🔐 [AUTH] Authenticating token...');
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('❌ [AUTH] No access token provided');
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const user = await verifyAccessToken(token);
        if (!user) {
            console.log('❌ [AUTH] Invalid or expired access token - checking for refresh token');
            
            // Check if there's a refresh token in headers or cookies
            const refreshToken = req.headers['x-refresh-token'] as string || req.cookies?.refreshToken;
            
            if (!refreshToken) {
                console.log('❌ [AUTH] No refresh token available for automatic refresh');
                return res.status(401).json({ 
                    error: 'Token expired and no refresh token provided',
                    tokenExpired: true 
                });
            }

            try {
                // Try to refresh the token automatically
                const refreshResult = await attemptTokenRefresh(refreshToken);
                if (refreshResult) {
                    console.log('✅ [AUTH] Token automatically refreshed');
                    (req as any).user = refreshResult.user;
                    // Add new tokens to response headers for client to update
                    res.set('X-New-Access-Token', refreshResult.accessToken);
                    res.set('X-New-Refresh-Token', refreshResult.refreshToken);
                    next();
                    return;
                }
            } catch (refreshError) {
                console.log('❌ [AUTH] Automatic token refresh failed:', refreshError);
            }

            return res.status(403).json({ 
                error: 'Token expired and refresh failed',
                tokenExpired: true,
                requiresReauth: true
            });
        }

        console.log('✅ [AUTH] User authenticated:', user.Email, 'Role:', user.UserRole);
        (req as any).user = user;
        next();
    } catch (error) {
        console.log('❌ [AUTH] Authentication error:', error);
        return res.status(500).json({ error: 'Authentication failed' });
    }
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    console.log('🔐 [AUTH] Checking admin privileges...');
    
    const user = (req as any).user;
    if (!user) {
        console.log('❌ [AUTH] No user in request - authentication required first');
        return res.status(401).json({ error: 'Authentication required' });
    }

    if (user.UserRole !== 'Admin') {
        console.log('❌ [AUTH] Access denied - Admin role required. User role:', user.UserRole);
        return res.status(403).json({ error: 'Admin access required' });
    }

    console.log('✅ [AUTH] Admin access granted');
    next();
};
