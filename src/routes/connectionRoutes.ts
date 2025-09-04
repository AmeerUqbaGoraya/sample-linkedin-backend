import { Router } from 'express';
import { addConnection, updateConnectionStatus, getUserConnections, getUserConnectionRequests, getUserPendingRequests } from '../controllers/connectionController';
import { authenticateToken } from '../auth/authUtils';

const router = Router();

router.post('/connections', authenticateToken, addConnection);
router.get('/connections', authenticateToken, getUserConnections);
router.get('/connections/requests', authenticateToken, getUserConnectionRequests);
router.get('/connections/pending', authenticateToken, getUserPendingRequests);
router.put('/connections', authenticateToken, updateConnectionStatus);

export default router;
