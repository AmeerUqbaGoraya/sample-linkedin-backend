import { Router } from 'express';
import { addUser } from '../controllers/userController';

const router = Router();

router.post('/users', addUser);

export default router;
