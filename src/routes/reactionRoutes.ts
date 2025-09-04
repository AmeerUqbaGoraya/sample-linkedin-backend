import { Router } from 'express';
import { addReaction, removeReaction, getReactionTypes } from '../controllers/reactionController';

const router = Router();

router.post('/reactions', addReaction);
router.delete('/reactions', removeReaction);
router.get('/reaction-types', getReactionTypes);

export default router;
