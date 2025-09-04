import User from '../models/User';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateTokens, verifyRefreshToken } from '../auth/authUtils';

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
        
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        console.log('🍪 [USER] Refresh token set in httpOnly cookie');
        
        res.status(200).json({
            message: 'Login successful',
            accessToken: tokens.accessToken,
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
    
    const { refreshToken } = req.cookies;
    
    if (!refreshToken) {
        console.log('❌ [USER] No refresh token found in cookies');
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
        
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        res.status(200).json({
            message: 'Token refreshed successfully',
            accessToken: tokens.accessToken,
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
    
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    
    console.log('✅ [USER] User logged out - refresh token cleared');
    res.status(200).json({ message: 'Logged out successfully' });
}
