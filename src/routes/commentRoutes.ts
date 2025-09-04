import { Router } from 'express';
import { addComment, getCommentsByPost } from '../controllers/commentController';

const router = Router();

router.post('/comments', addComment);
router.get('/comments/post/:PostID', getCommentsByPost);

export default router;
