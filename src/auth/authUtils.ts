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

export const verifyRefreshToken = async (token: string): Promise<UserPayload | null> => {
    try {
        console.log('🔐 [AUTH] Verifying refresh token...');
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as UserPayload;
        
        console.log('💾 [AUTH] Fetching fresh user data from database for refresh token - UserID:', decoded.UserID);
        const dbUser = await User.findOne({
            where: {
                UserID: decoded.UserID,
                Email: decoded.Email
            }
        });
        
        if (!dbUser) {
            console.log('❌ [AUTH] User not found in database for refresh token');
            return null;
        }
        
        if (dbUser.Email !== decoded.Email) {
            console.log('❌ [AUTH] Refresh token email mismatch with database');
            return null;
        }
        
        console.log('✅ [AUTH] Refresh token verified against database successfully');
        return {
            UserID: dbUser.UserID,
            Email: dbUser.Email,
            UserRole: dbUser.UserRole
        };
    } catch (error) {
        console.log('❌ [AUTH] Refresh token verification failed:', error);
        return null;
    }
};

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    console.log('🔐 [AUTH] Checking authentication...');
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('❌ [AUTH] No access token provided');
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const user = await verifyAccessToken(token);
        if (!user) {
            console.log('❌ [AUTH] Invalid or expired access token');
            return res.status(403).json({ error: 'Invalid or expired token' });
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
