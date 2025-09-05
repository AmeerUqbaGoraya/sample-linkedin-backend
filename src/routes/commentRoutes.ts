import { Router } from 'express';
import { addComment, getCommentsByPost, getAllComments, deleteComment } from '../controllers/commentController';
import { authenticateToken } from '../auth/authUtils';

const router = Router();

router.post('/comments', authenticateToken, addComment);
router.get('/comments', getAllComments);
router.get('/comments/post/:PostID', getCommentsByPost);
router.delete('/comments/:id', authenticateToken, deleteComment);

export default router;
