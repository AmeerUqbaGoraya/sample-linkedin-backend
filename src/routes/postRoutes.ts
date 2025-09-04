import { Router } from 'express';
import { createPost, getAllPosts, getPostsByUser, getPostsWithImages } from '../controllers/postController';

const router = Router();

router.post('/posts', createPost);
router.get('/posts', getAllPosts);
router.get('/posts/images', getPostsWithImages);
router.get('/posts/user/:UserID', getPostsByUser);

export default router;
