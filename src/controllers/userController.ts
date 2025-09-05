import User from '../models/User';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateTokens, verifyRefreshToken } from '../auth/authUtils';
import { getSecureRefreshTokenConfig } from '../auth/cookieSecurity';

export async function addUser(req: Request, res: Response) {
    console.log('🔵 [USER] POST /api/users - Adding new user');
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    const { UserName, Email, Password, UserRole } = req.body;
    
    if (!UserName || !Email || !Password) {
        console.log('❌ [USER] Validation failed - Missing required fields');
        res.status(400).json({ error: 'Missing required fields: UserName, Email, Password' });
        return;
    }
    
    // Default to 'Normal' user if no role specified
    const role = UserRole || 'Normal';
    if (role !== 'Normal' && role !== 'Admin') {
        console.log('❌ [USER] Validation failed - Invalid UserRole');
        res.status(400).json({ error: 'UserRole must be either "Normal" or "Admin". Defaults to "Normal" if not specified.' });
        return;
    }
    
    console.log('👤 [USER] User role determined:', role, UserRole ? '(specified)' : '(default)');
    
    try {
        console.log('🔐 [USER] Hashing password...');
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Password, saltRounds);
        console.log('✅ [USER] Password hashed successfully');
        
        console.log('💾 [USER] Creating user with role:', role);
        const newUser = await User.create({
            UserName,
            Email,
            PasswordHash: hashedPassword,
            UserRole: role as 'Normal' | 'Admin'
        });
        
        console.log('✅ [USER] User created successfully:', newUser.UserID);
        console.log('🎉 [USER] New user added - UserName:', UserName, 'Email:', Email, 'Role:', role);
        res.status(201).json({ 
            message: 'User created successfully',
            user: {
                UserID: newUser.UserID,
                UserName: newUser.UserName,
                Email: newUser.Email,
                UserRole: newUser.UserRole
            }
        });
    } catch (err: any) {
        console.log('❌ [USER] Database error:', err.message);
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(409).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
}

export async function getAllUsers(req: Request, res: Response) {
    console.log('🔵 [USER] GET /api/users - Fetching all users');
    
    try {
        console.log('💾 [USER] Fetching all users from database...');
        const users = await User.findAll({
            attributes: ['UserID', 'UserName', 'Email', 'UserRole', 'CreatedAt'],
            order: [['CreatedAt', 'DESC']]
        });
        
        console.log('📊 [USER] Retrieved', users.length, 'users from database');
        console.log('✅ [USER] Successfully returning users (passwords excluded)');
        res.status(200).json(users);
    } catch (err: any) {
        console.log('❌ [USER] Database error:', err.message);
        res.status(500).json({ error: err.message });
    }
}

export async function loginUser(req: Request, res: Response) {
    console.log('🔵 [USER] POST /api/users/login - User login attempt');
    console.log('📝 Login attempt for email:', req.body.Email);
    
    const { Email, Password } = req.body;
    
    if (!Email || !Password) {
        console.log('❌ [USER] Login validation failed - Missing credentials');
        res.status(400).json({ error: 'Email and Password are required' });
        return;
    }
    
    try {
        console.log('💾 [USER] Checking user credentials...');
        const user = await User.findOne({
            where: { Email }
        });
        
        if (!user) {
            console.log('❌ [USER] Login failed - User not found');
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        
        console.log('🔐 [USER] Verifying password...');
        const passwordMatch = await bcrypt.compare(Password, user.PasswordHash);
        
        if (!passwordMatch) {
            console.log('❌ [USER] Login failed - Invalid password');
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }
        
        console.log('✅ [USER] Login successful for user:', user.UserName, 'Role:', user.UserRole);
        
        const tokens = generateTokens({
            UserID: user.UserID,
            Email: user.Email,
            UserRole: user.UserRole
        });
        
        console.log('🔐 [USER] JWT tokens generated successfully');
        
        const cookieConfig = getSecureRefreshTokenConfig(7 * 24 * 60 * 60 * 1000);
        res.cookie('refreshToken', tokens.refreshToken, cookieConfig);
        
        console.log('🍪 [USER] Refresh token set in httpOnly cookie');
        
        res.status(200).json({
            message: 'Login successful',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                UserID: user.UserID,
                UserName: user.UserName,
                Email: user.Email,
                UserRole: user.UserRole
            }
        });
    } catch (err: any) {
        console.log('❌ [USER] Login error:', err.message);
        res.status(500).json({ error: err.message });
    }
}

export async function refreshToken(req: Request, res: Response) {
    console.log('🔵 [USER] POST /api/users/refresh - Refreshing access token');

    const refreshToken = req.cookies.refreshToken || req.headers['x-refresh-token'] as string;
    
    if (!refreshToken) {
        console.log('❌ [USER] No refresh token found in cookies or X-Refresh-Token header');
        res.status(401).json({ error: 'Refresh token required' });
        return;
    }
    
    try {
        console.log('🔐 [USER] Verifying refresh token...');
        const decoded = await verifyRefreshToken(refreshToken);
        
        if (!decoded) {
            console.log('❌ [USER] Invalid or expired refresh token');
            res.status(403).json({ error: 'Invalid or expired refresh token' });
            return;
        }
        
        console.log('✅ [USER] Refresh token verified - generating new tokens');
        const tokens = generateTokens({
            UserID: decoded.UserID,
            Email: decoded.Email,
            UserRole: decoded.UserRole
        });
        
        console.log('✅ [USER] New access token generated for user:', decoded.Email);
        
        const cookieConfig = getSecureRefreshTokenConfig(7 * 24 * 60 * 60 * 1000);
        res.cookie('refreshToken', tokens.refreshToken, cookieConfig);
        
        res.status(200).json({
            message: 'Token refreshed successfully',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken, // Added for visibility during testing
            user: {
                UserID: decoded.UserID,
                UserName: decoded.Email.split('@')[0],
                Email: decoded.Email,
                UserRole: decoded.UserRole
            }
        });
    } catch (err: any) {
        console.log('❌ [USER] Refresh token error:', err.message);
        res.status(500).json({ error: err.message });
    }
}

export async function logoutUser(req: Request, res: Response) {
    console.log('🔵 [USER] POST /api/users/logout - User logout');
    
    const cookieConfig = getSecureRefreshTokenConfig();
    res.clearCookie('refreshToken', cookieConfig);
    
    console.log('✅ [USER] User logged out - refresh token cleared');
    res.status(200).json({ message: 'Logged out successfully' });
}

export async function updateUserName(req: Request, res: Response) {
    console.log('🔵 [USER] PUT /api/users/name - Updating username');
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    const { UserName } = req.body;
    const user = (req as any).user;
    
    if (!UserName) {
        console.log('❌ [USER] Validation failed - Missing UserName');
        res.status(400).json({ error: 'UserName is required' });
        return;
    }
    
    if (!user || !user.UserID) {
        console.log('❌ [USER] Authentication failed - User not found in request');
        res.status(401).json({ error: 'Authentication required' });
        return;
    }
    
    try {
        console.log('💾 [USER] Updating username for UserID:', user.UserID);
        
        const existingUser = await User.findOne({ where: { UserName } });
        if (existingUser && existingUser.UserID !== user.UserID) {
            console.log('❌ [USER] Username already taken:', UserName);
            res.status(409).json({ error: 'Username already exists' });
            return;
        }
        
        const [updatedRows] = await User.update(
            { UserName },
            { where: { UserID: user.UserID } }
        );
        
        if (updatedRows === 0) {
            console.log('❌ [USER] User not found for update');
            res.status(404).json({ error: 'User not found' });
            return;
        }
        
        console.log('✅ [USER] Username updated successfully for UserID:', user.UserID);
        res.status(200).json({ 
            message: 'Username updated successfully',
            UserName: UserName
        });
        
    } catch (error) {
        console.error('💥 [USER] Error updating username:', error);
        res.status(500).json({ error: 'Internal server error while updating username' });
    }
}

export async function updateUserEmail(req: Request, res: Response) {
    console.log('🔵 [USER] PUT /api/users/email - Updating email');
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    const { Email } = req.body;
    const user = (req as any).user;
    
    if (!Email) {
        console.log('❌ [USER] Validation failed - Missing Email');
        res.status(400).json({ error: 'Email is required' });
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
        console.log('❌ [USER] Invalid email format:', Email);
        res.status(400).json({ error: 'Invalid email format' });
        return;
    }
    
    if (!user || !user.UserID) {
        console.log('❌ [USER] Authentication failed - User not found in request');
        res.status(401).json({ error: 'Authentication required' });
        return;
    }
    
    try {
        console.log('💾 [USER] Updating email for UserID:', user.UserID);
        
        const existingUser = await User.findOne({ where: { Email } });
        if (existingUser && existingUser.UserID !== user.UserID) {
            console.log('❌ [USER] Email already taken:', Email);
            res.status(409).json({ error: 'Email already exists' });
            return;
        }
        
        const [updatedRows] = await User.update(
            { Email },
            { where: { UserID: user.UserID } }
        );
        
        if (updatedRows === 0) {
            console.log('❌ [USER] User not found for update');
            res.status(404).json({ error: 'User not found' });
            return;
        }
        
        console.log('✅ [USER] Email updated successfully for UserID:', user.UserID);
        res.status(200).json({ 
            message: 'Email updated successfully',
            Email: Email
        });
        
    } catch (error) {
        console.error('💥 [USER] Error updating email:', error);
        res.status(500).json({ error: 'Internal server error while updating email' });
    }
}

export async function updateUserPassword(req: Request, res: Response) {
    console.log('🔵 [USER] PUT /api/users/password - Updating password');
    console.log('📝 Request body keys:', Object.keys(req.body));
    
    const { CurrentPassword, NewPassword } = req.body;
    const user = (req as any).user;
    
    if (!CurrentPassword || !NewPassword) {
        console.log('❌ [USER] Validation failed - Missing CurrentPassword or NewPassword');
        res.status(400).json({ error: 'CurrentPassword and NewPassword are required' });
        return;
    }
    
    if (NewPassword.length < 6) {
        console.log('❌ [USER] Validation failed - Password too short');
        res.status(400).json({ error: 'New password must be at least 6 characters long' });
        return;
    }
    
    if (!user || !user.UserID) {
        console.log('❌ [USER] Authentication failed - User not found in request');
        res.status(401).json({ error: 'Authentication required' });
        return;
    }
    
    try {
        console.log('🔍 [USER] Fetching user for password verification, UserID:', user.UserID);

        const currentUser = await User.findByPk(user.UserID);
        if (!currentUser) {
            console.log('❌ [USER] User not found in database');
            res.status(404).json({ error: 'User not found' });
            return;
        }

        console.log('🔐 [USER] Verifying current password...');
        const isCurrentPasswordValid = await bcrypt.compare(CurrentPassword, currentUser.PasswordHash);
        if (!isCurrentPasswordValid) {
            console.log('❌ [USER] Current password verification failed');
            res.status(400).json({ error: 'Current password is incorrect' });
            return;
        }
        
        console.log('✅ [USER] Current password verified, hashing new password...');

        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(NewPassword, saltRounds);

        const [updatedRows] = await User.update(
            { PasswordHash: hashedNewPassword },
            { where: { UserID: user.UserID } }
        );
        
        if (updatedRows === 0) {
            console.log('❌ [USER] Failed to update password');
            res.status(500).json({ error: 'Failed to update password' });
            return;
        }
        
        console.log('✅ [USER] Password updated successfully for UserID:', user.UserID);
        res.status(200).json({ message: 'Password updated successfully' });
        
    } catch (error) {
        console.error('💥 [USER] Error updating password:', error);
        res.status(500).json({ error: 'Internal server error while updating password' });
    }
}
