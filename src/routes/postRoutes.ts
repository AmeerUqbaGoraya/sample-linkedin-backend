import { Router } from 'express';
import { createPost, getAllPosts, getPostsByUser, getPostsWithImages, deletePost } from '../controllers/postController';
import { authenticateToken } from '../auth/authUtils';

const router = Router();

router.post('/posts', authenticateToken, createPost);
router.get('/posts', getAllPosts);
router.get('/posts/images', getPostsWithImages);
router.get('/posts/user/:UserID', getPostsByUser);
router.delete('/posts/:id', authenticateToken, deletePost);

export default router;
