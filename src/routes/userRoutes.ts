import { Router } from 'express';
import { addUser, getAllUsers, loginUser, refreshToken, logoutUser } from '../controllers/userController';
import { authenticateToken } from '../auth/authUtils';

const router = Router();

router.post('/users', addUser);
router.get('/users', authenticateToken, getAllUsers);
router.post('/users/login', loginUser);
router.post('/users/refresh', refreshToken);
router.post('/users/logout', logoutUser);

export default router;
