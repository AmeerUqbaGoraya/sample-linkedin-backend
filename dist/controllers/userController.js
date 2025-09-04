"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = addUser;
exports.getAllUsers = getAllUsers;
exports.loginUser = loginUser;
exports.refreshToken = refreshToken;
exports.logoutUser = logoutUser;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const authUtils_1 = require("../auth/authUtils");
function addUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const hashedPassword = yield bcrypt_1.default.hash(Password, saltRounds);
            console.log('✅ [USER] Password hashed successfully');
            console.log('💾 [USER] Creating user with role:', role);
            const newUser = yield User_1.default.create({
                UserName,
                Email,
                PasswordHash: hashedPassword,
                UserRole: role
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
        }
        catch (err) {
            console.log('❌ [USER] Database error:', err.message);
            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(409).json({ error: 'Email already exists' });
            }
            else {
                res.status(500).json({ error: err.message });
            }
        }
    });
}
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🔵 [USER] GET /api/users - Fetching all users');
        try {
            console.log('💾 [USER] Fetching all users from database...');
            const users = yield User_1.default.findAll({
                attributes: ['UserID', 'UserName', 'Email', 'UserRole', 'CreatedAt'],
                order: [['CreatedAt', 'DESC']]
            });
            console.log('📊 [USER] Retrieved', users.length, 'users from database');
            console.log('✅ [USER] Successfully returning users (passwords excluded)');
            res.status(200).json(users);
        }
        catch (err) {
            console.log('❌ [USER] Database error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });
}
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const user = yield User_1.default.findOne({
                where: { Email }
            });
            if (!user) {
                console.log('❌ [USER] Login failed - User not found');
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }
            console.log('🔐 [USER] Verifying password...');
            const passwordMatch = yield bcrypt_1.default.compare(Password, user.PasswordHash);
            if (!passwordMatch) {
                console.log('❌ [USER] Login failed - Invalid password');
                res.status(401).json({ error: 'Invalid email or password' });
                return;
            }
            console.log('✅ [USER] Login successful for user:', user.UserName, 'Role:', user.UserRole);
            const tokens = (0, authUtils_1.generateTokens)({
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
                refreshToken: tokens.refreshToken, // Added for visibility during testing
                user: {
                    UserID: user.UserID,
                    UserName: user.UserName,
                    Email: user.Email,
                    UserRole: user.UserRole
                }
            });
        }
        catch (err) {
            console.log('❌ [USER] Login error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });
}
function refreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🔵 [USER] POST /api/users/refresh - Refreshing access token');
        // Check both cookies and headers for refresh token
        const refreshToken = req.cookies.refreshToken || req.headers['x-refresh-token'];
        if (!refreshToken) {
            console.log('❌ [USER] No refresh token found in cookies or X-Refresh-Token header');
            res.status(401).json({ error: 'Refresh token required' });
            return;
        }
        try {
            console.log('🔐 [USER] Verifying refresh token...');
            const decoded = yield (0, authUtils_1.verifyRefreshToken)(refreshToken);
            if (!decoded) {
                console.log('❌ [USER] Invalid or expired refresh token');
                res.status(403).json({ error: 'Invalid or expired refresh token' });
                return;
            }
            console.log('✅ [USER] Refresh token verified - generating new tokens');
            const tokens = (0, authUtils_1.generateTokens)({
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
                refreshToken: tokens.refreshToken, // Added for visibility during testing
                user: {
                    UserID: decoded.UserID,
                    UserName: decoded.Email.split('@')[0],
                    Email: decoded.Email,
                    UserRole: decoded.UserRole
                }
            });
        }
        catch (err) {
            console.log('❌ [USER] Refresh token error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });
}
function logoutUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🔵 [USER] POST /api/users/logout - User logout');
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        console.log('✅ [USER] User logged out - refresh token cleared');
        res.status(200).json({ message: 'Logged out successfully' });
    });
}
//# sourceMappingURL=userController.js.map