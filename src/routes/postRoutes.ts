import { Router } from 'express';
import { createPost, getAllPosts, getPostsByUser, getPostsWithImages } from '../controllers/postController';
import { authenticateToken } from '../auth/authUtils';

const router = Router();

router.post('/posts', authenticateToken, createPost);
router.get('/posts', getAllPosts);
router.get('/posts/images', getPostsWithImages);
router.get('/posts/user/:UserID', getPostsByUser);

export default router;
