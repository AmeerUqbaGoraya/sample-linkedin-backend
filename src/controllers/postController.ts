import Post from '../models/Post';
import PostMedia from '../models/PostMedia';
import User from '../models/User';
import sequelize from '../models/database';
import { Request, Response } from 'express';

export async function createPost(req: Request, res: Response) {
    console.log('🔵 [POST] POST /api/posts - Creating new post');
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    const { PostType, Content, MediaURLs } = req.body;
    const user = (req as any).user; 
    
    if (!PostType || (!Content && !MediaURLs)) {
        console.log('❌ [POST] Validation failed - Missing required fields');
        res.status(400).json({ error: 'Missing required fields: PostType and either Content or MediaURLs' });
        return;
    }
    
    if (!user || !user.UserID) {
        console.log('❌ [POST] Authentication failed - User not found in request');
        res.status(401).json({ error: 'Authentication required' });
        return;
    }
    
    try {
        console.log('💾 [POST] Creating post with Sequelize for PostType:', PostType);
        
        let actualPostType = PostType;
        if (Content && MediaURLs && MediaURLs.length > 0) {
            actualPostType = 'Mixed';
        }
        
        const newPost = await Post.create({
            UserID: user.UserID,
            PostType: actualPostType as 'Text' | 'Image' | 'Video' | 'Article' | 'Mixed',
            Content: Content || ''
        });
        
        if (MediaURLs && Array.isArray(MediaURLs) && MediaURLs.length > 0) {
            console.log('💾 [POST] Creating media entries for post:', newPost.PostID);
            const mediaPromises = MediaURLs.map((media: any, index: number) => {
                return PostMedia.create({
                    PostID: newPost.PostID,
                    MediaType: media.type || 'Image',
                    MediaURL: media.url,
                    MediaOrder: index + 1
                });
            });
            
            await Promise.all(mediaPromises);
            console.log('✅ [POST] Media entries created for post:', newPost.PostID);
        }
        
        console.log('✅ [POST] Post created successfully:', newPost.PostID);
        console.log('🎉 [POST] New post added - UserID:', user.UserID, 'PostType:', actualPostType);
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
    console.log('🚨 [DEBUG] getAllPosts function called!');
    
    try {
        console.log('💾 [POST] Fetching all posts with user info and media using raw SQL...');

        const [posts] = await sequelize.query(`
            SELECT 
                p.PostID,
                p.UserID,
                p.PostType,
                p.Content,
                p.CreatedAt,
                u.UserName,
                u.Email,
                GROUP_CONCAT(
                    CASE WHEN pm.MediaID IS NOT NULL 
                    THEN JSON_OBJECT(
                        'mediaId', pm.MediaID,
                        'type', pm.MediaType,
                        'url', pm.MediaURL,
                        'order', pm.MediaOrder
                    ) END
                    ORDER BY pm.MediaOrder
                    SEPARATOR '||MEDIA||'
                ) as MediaData
            FROM Posts p
            JOIN Users u ON p.UserID = u.UserID  
            LEFT JOIN PostMedia pm ON p.PostID = pm.PostID
            GROUP BY p.PostID, p.UserID, p.PostType, p.Content, p.CreatedAt, u.UserName, u.Email
            ORDER BY p.CreatedAt DESC
        `) as any;
        
        console.log('📊 [POST] Retrieved', posts.length, 'posts from database');
        
        const processedPosts = posts.map((post: any) => {
            let media: any[] = [];

            if (post.MediaData) {
                const mediaStrings = post.MediaData.split('||MEDIA||');
                media = mediaStrings
                    .filter((mediaStr: string) => mediaStr && mediaStr.trim())
                    .map((mediaStr: string) => {
                        try {
                            return JSON.parse(mediaStr);
                        } catch (e) {
                            console.log('❌ Error parsing media:', mediaStr);
                            return null;
                        }
                    })
                    .filter((mediaItem: any) => mediaItem !== null);
            }
            
            return {
                PostID: post.PostID,
                UserID: post.UserID,
                PostType: post.PostType,
                Content: post.Content,
                CreatedAt: post.CreatedAt,
                author: {
                    UserID: post.UserID,
                    UserName: post.UserName,
                    Email: post.Email
                },
                content: post.Content,
                media: media,
                hasMedia: media.length > 0,
                mediaCount: media.length
            };
        });
        
        console.log('✅ [POST] Successfully processed and returning', processedPosts.length, 'posts with media');
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
        console.log('💾 [POST] Fetching posts for UserID:', UserID, 'with media using raw SQL...');
        
        const [posts] = await sequelize.query(`
            SELECT 
                p.PostID,
                p.UserID,
                p.PostType,
                p.Content,
                p.CreatedAt,
                u.UserName,
                u.Email,
                GROUP_CONCAT(
                    CASE WHEN pm.MediaID IS NOT NULL 
                    THEN JSON_OBJECT(
                        'mediaId', pm.MediaID,
                        'type', pm.MediaType,
                        'url', pm.MediaURL,
                        'order', pm.MediaOrder
                    ) END
                    ORDER BY pm.MediaOrder
                    SEPARATOR '||MEDIA||'
                ) as MediaData
            FROM Posts p
            JOIN Users u ON p.UserID = u.UserID  
            LEFT JOIN PostMedia pm ON p.PostID = pm.PostID
            WHERE p.UserID = ?
            GROUP BY p.PostID, p.UserID, p.PostType, p.Content, p.CreatedAt, u.UserName, u.Email
            ORDER BY p.CreatedAt DESC
        `, {
            replacements: [UserID]
        }) as any;
        
        console.log('📊 [POST] Retrieved', posts.length, 'posts for UserID:', UserID);
        
        const processedPosts = posts.map((post: any) => {
            let media: any[] = [];
            
            if (post.MediaData) {
                const mediaStrings = post.MediaData.split('||MEDIA||');
                media = mediaStrings
                    .filter((mediaStr: string) => mediaStr && mediaStr.trim())
                    .map((mediaStr: string) => {
                        try {
                            return JSON.parse(mediaStr);
                        } catch (e) {
                            console.log('❌ Error parsing media:', mediaStr);
                            return null;
                        }
                    })
                    .filter((mediaItem: any) => mediaItem !== null);
            }
            
            if (media.length > 0) {
                return {
                    PostID: post.PostID,
                    UserID: post.UserID,
                    PostType: post.PostType,
                    Content: post.Content,
                    CreatedAt: post.CreatedAt,
                    author: {
                        UserID: post.UserID,
                        UserName: post.UserName,
                        Email: post.Email
                    },
                    content: post.Content,
                    media: media,
                    hasMedia: true,
                    mediaCount: media.length
                };
            }

            else if (post.PostType === 'Image' && post.Content.includes('\nImages: ')) {
                const contentParts = post.Content.split('\nImages: ');
                const caption = contentParts[0] || '';
                const imagesPart = contentParts[1];
                const images = imagesPart ? imagesPart.split(', ').map((img: string) => img.trim()) : [];
                return {
                    PostID: post.PostID,
                    UserID: post.UserID,
                    PostType: post.PostType,
                    Content: post.Content,
                    CreatedAt: post.CreatedAt,
                    author: {
                        UserID: post.UserID,
                        UserName: post.UserName,
                        Email: post.Email
                    },
                    content: caption,
                    legacyImages: images,
                    media: [],
                    hasMedia: false,
                    hasLegacyImages: true,
                    mediaCount: images.length
                };
            }
            else {
                return {
                    PostID: post.PostID,
                    UserID: post.UserID,
                    PostType: post.PostType,
                    Content: post.Content,
                    CreatedAt: post.CreatedAt,
                    author: {
                        UserID: post.UserID,
                        UserName: post.UserName,
                        Email: post.Email
                    },
                    content: post.Content,
                    media: [],
                    hasMedia: false,
                    hasLegacyImages: false,
                    mediaCount: 0
                };
            }
        });
        
        console.log('✅ [POST] Successfully returning', processedPosts.length, 'posts for user with media');
        res.status(200).json(processedPosts);
    } catch (err: any) {
        console.log('❌ [POST] Database error:', err.message);
        res.status(500).json({ error: err.message });
    }
}

export async function deletePost(req: Request, res: Response) {
    console.log('🔵 [POST] DELETE /api/posts/:id - Deleting post');
    console.log('📝 Request params:', req.params);
    
    const { id } = req.params;
    const user = (req as any).user; 
    
    if (!id) {
        console.log('❌ [POST] Validation failed - Missing post ID');
        res.status(400).json({ error: 'Post ID is required' });
        return;
    }
    
    if (!user || !user.UserID) {
        console.log('❌ [POST] Authentication failed - User not found in request');
        res.status(401).json({ error: 'Authentication required' });
        return;
    }
    
    try {
        const postId = parseInt(id);
        if (isNaN(postId)) {
            console.log('❌ [POST] Invalid post ID format:', id);
            res.status(400).json({ error: 'Invalid post ID format' });
            return;
        }
        
        console.log('🔍 [POST] Finding post with ID:', postId, 'for UserID:', user.UserID);

        const post = await Post.findOne({
            where: { PostID: postId }
        });
        
        if (!post) {
            console.log('❌ [POST] Post not found with ID:', postId);
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        
        if (post.UserID !== user.UserID && user.UserRole !== 'Admin') {
            console.log('❌ [POST] User does not have permission to delete post. Post UserID:', post.UserID, 'Request UserID:', user.UserID, 'User Role:', user.UserRole);
            res.status(403).json({ error: 'You can only delete your own posts' });
            return;
        }
        
        console.log('🗑️ [POST] Deleting post and all associated data (media, comments, reactions) for PostID:', postId);
        console.log('️ [POST] Deleting associated media for post (media will be deleted, comments/reactions preserved):', postId);
        

        await PostMedia.destroy({
            where: { PostID: postId }
        });
        
        console.log('💾 [POST] Deleting post - comments and reactions will be preserved with NULL PostID');
        
        const deletedRows = await Post.destroy({
            where: { PostID: postId }
        });
        
        if (deletedRows === 0) {
            console.log('❌ [POST] Failed to delete post');
            res.status(500).json({ error: 'Failed to delete post' });
            return;
        }
        
        const isAdminDeletion = post.UserID !== user.UserID && user.UserRole === 'Admin';
        console.log('✅ [POST] Post deleted successfully. PostID:', postId, 'by UserID:', user.UserID, isAdminDeletion ? '(Admin deletion)' : '(Owner deletion)');
        console.log('📝 [POST] Comments and reactions preserved with PostID set to NULL for historical records');
        
        res.status(200).json({ 
            message: 'Post deleted successfully - comments and reactions preserved',
            deletedPostID: postId,
            deletedBy: isAdminDeletion ? 'Admin' : 'Owner',
            originalPostOwner: post.UserID,
            note: 'Comments and reactions preserved for historical records (PostID set to NULL)'
        });
        
    } catch (error) {
        console.error('💥 [POST] Error deleting post:', error);
        res.status(500).json({ error: 'Internal server error while deleting post' });
    }
}
