import { Router } from 'express';
import { addReaction, removeReaction, getReactionTypes } from '../controllers/reactionController';
import { authenticateToken } from '../auth/authUtils';

const router = Router();

router.post('/reactions', authenticateToken, addReaction);
router.delete('/reactions', authenticateToken, removeReaction);
router.get('/reactions', getReactionTypes); // Changed from /reaction-types to be consistent

export default router;
