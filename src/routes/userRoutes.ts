import { Router } from 'express';
import { addUser, getAllUsers, loginUser, refreshToken, logoutUser, updateUserName, updateUserEmail, updateUserPassword } from '../controllers/userController';
import { authenticateToken } from '../auth/authUtils';

const router = Router();

router.post('/users', addUser);
router.get('/users', authenticateToken, getAllUsers);
router.post('/users/login', loginUser);
router.post('/users/refresh', refreshToken);
router.post('/users/logout', logoutUser);

// User update endpoints (require authentication)
router.put('/users/name', authenticateToken, updateUserName);
router.put('/users/email', authenticateToken, updateUserEmail);
router.put('/users/password', authenticateToken, updateUserPassword);

export default router;
