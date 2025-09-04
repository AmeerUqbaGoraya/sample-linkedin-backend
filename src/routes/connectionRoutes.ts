import { Router } from 'express';
import { addConnection, updateConnectionStatus } from '../controllers/connectionController';

const router = Router();

router.post('/connections', addConnection);
router.put('/connections', updateConnectionStatus);

export default router;
