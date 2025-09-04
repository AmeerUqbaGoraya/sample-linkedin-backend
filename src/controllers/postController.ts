import Post from '../models/Post';
import User from '../models/User';
import { Request, Response } from 'express';

export async function createPost(req: Request, res: Response) {
    console.log('🔵 [POST] POST /api/posts - Creating new post');
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    const { PostType, Content } = req.body;
    const user = (req as any).user; // From authenticateToken middleware
    
    if (!PostType || !Content) {
        console.log('❌ [POST] Validation failed - Missing required fields');
        res.status(400).json({ error: 'Missing required fields: PostType, Content' });
        return;
    }
    
    if (!user || !user.UserID) {
        console.log('❌ [POST] Authentication failed - User not found in request');
        res.status(401).json({ error: 'Authentication required' });
        return;
    }
    
    try {
        console.log('💾 [POST] Creating post with Sequelize for PostType:', PostType);
        const newPost = await Post.create({
            UserID: user.UserID,
            PostType: PostType as 'Text' | 'Image' | 'Video' | 'Article',
            Content
        });
        
        console.log('✅ [POST] Post created successfully:', newPost.PostID);
        console.log('🎉 [POST] New post added - UserID:', user.UserID, 'PostType:', PostType);
        res.status(201).json({ 
            message: 'Post created',
            post: newPost
        });
    } catch (err: any) {
        console.log('❌ [POST] Database error:', err.message);
        res.status(500).json({ error: err.message });
    }
}

export async function getAllPosts(req: Request, res: Response) {
    console.log('🔵 [POST] GET /api/posts - Fetching all posts');
    
    try {
        console.log('💾 [POST] Fetching all posts with user info using Sequelize...');
        const posts = await Post.findAll({
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['UserID', 'UserName', 'Email']
                }
            ],
            order: [['CreatedAt', 'DESC']]
        });
        
        console.log('📊 [POST] Retrieved', posts.length, 'posts from database');
        
        const processedPosts = posts.map(post => {
            const postData = post.toJSON();
            
            if (post.PostType === 'Image' && post.Content.includes('\nImages: ')) {
                const contentParts = post.Content.split('\nImages: ');
                const caption = contentParts[0] || '';
                const imagesPart = contentParts[1];
                const images = imagesPart ? imagesPart.split(', ').map((img: string) => img.trim()) : [];
                return {
                    ...postData,
                    caption,
                    images,
                    hasImages: true
                };
            } else {
                return {
                    ...postData,
                    caption: post.Content,
                    images: [],
                    hasImages: false
                };
            }
        });
        
        console.log('✅ [POST] Successfully processed and returning', processedPosts.length, 'posts');
        res.status(200).json(processedPosts);
    } catch (err: any) {
        console.log('❌ [POST] Database error:', err.message);
        res.status(500).json({ error: err.message });
    }
}

export async function getPostsWithImages(req: Request, res: Response) {
    console.log('🔵 [POST] GET /api/posts/images - Fetching image posts only');
    
    try {
        console.log('💾 [POST] Fetching image posts with Sequelize...');
        const posts = await Post.findAll({
            where: { PostType: 'Image' },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['UserID', 'UserName', 'Email']
                }
            ],
            order: [['CreatedAt', 'DESC']]
        });
        
        console.log('📊 [POST] Retrieved', posts.length, 'image posts from database');
        
        const processedPosts = posts.map(post => {
            const postData = post.toJSON();
            
            if (post.Content.includes('\nImages: ')) {
                const contentParts = post.Content.split('\nImages: ');
                const caption = contentParts[0] || '';
                const imagesPart = contentParts[1];
                const images = imagesPart ? imagesPart.split(', ').map((img: string) => img.trim()) : [];
                return {
                    ...postData,
                    caption,
                    images,
                    hasImages: true
                };
            } else {
                return {
                    ...postData,
                    caption: post.Content,
                    images: [],
                    hasImages: false
                };
            }
        });
        
        console.log('✅ [POST] Successfully processed and returning', processedPosts.length, 'image posts');
        res.status(200).json(processedPosts);
    } catch (err: any) {
        console.log('❌ [POST] Database error:', err.message);
        res.status(500).json({ error: err.message });
    }
}

export async function getPostsByUser(req: Request, res: Response) {
    const { UserID } = req.params;
    console.log('🔵 [POST] GET /api/posts/user/' + UserID + ' - Fetching posts by user');
    
    if (!UserID) {
        console.log('❌ [POST] Validation failed - UserID parameter missing');
        res.status(400).json({ error: 'UserID is required' });
        return;
    }
    
    try {
        console.log('💾 [POST] Fetching posts for UserID:', UserID);
        const posts = await Post.findAll({
            where: { UserID },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['UserID', 'UserName', 'Email']
                }
            ],
            order: [['CreatedAt', 'DESC']]
        });
        
        console.log('📊 [POST] Retrieved', posts.length, 'posts for UserID:', UserID);
        console.log('✅ [POST] Successfully returning posts for user');
        res.status(200).json(posts);
    } catch (err: any) {
        console.log('❌ [POST] Database error:', err.message);
        res.status(500).json({ error: err.message });
    }
}
