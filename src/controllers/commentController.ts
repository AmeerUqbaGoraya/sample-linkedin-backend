import Comment from '../models/Comment';
import User from '../models/User';
import { Request, Response } from 'express';

export async function addComment(req: Request, res: Response) {
    console.log('🔵 [COMMENT] POST /api/comments - Adding comment to post');
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    const { PostID, Content, ReplyToID } = req.body;
    const user = (req as any).user; // From authenticateToken middleware
    
    if (!PostID || !Content) {
        console.log('❌ [COMMENT] Validation failed - Missing required fields');
        res.status(400).json({ error: 'Missing required fields: PostID, Content' });
        return;
    }
    
    if (!user || !user.UserID) {
        console.log('❌ [COMMENT] Authentication failed - User not found in request');
        res.status(401).json({ error: 'Authentication required' });
        return;
    }
    
    const commentType = ReplyToID ? 'Reply' : 'Comment';
    console.log('💬 [COMMENT] Adding', commentType, '- PostID:', PostID, 'UserID:', user.UserID, ReplyToID ? 'ReplyToID: ' + ReplyToID : '');
    
    try {
        console.log('💾 [COMMENT] Creating comment with Sequelize...');
        const newComment = await Comment.create({
            PostID,
            UserID: user.UserID,
            CommentText: Content,
            ReplyToID: ReplyToID || null
        });
        
        console.log('✅ [COMMENT]', commentType, 'added successfully:', newComment.CommentID);
        console.log('🎉 [COMMENT] New', commentType.toLowerCase(), 'by User', user.UserID, 'on Post', PostID);
        res.status(201).json({ 
            message: 'Comment added',
            comment: newComment
        });
    } catch (err: any) {
        console.log('❌ [COMMENT] Database error:', err.message);
        res.status(500).json({ error: err.message });
    }
}

export async function getCommentsByPost(req: Request, res: Response) {
    const { PostID } = req.params;
    console.log('🔵 [COMMENT] GET /api/comments/post/' + PostID + ' - Fetching comments for post');
    
    if (!PostID) {
        console.log('❌ [COMMENT] Validation failed - PostID parameter missing');
        res.status(400).json({ error: 'PostID is required' });
        return;
    }
    
    try {
        console.log('💾 [COMMENT] Fetching comments from database for PostID:', PostID);
        const comments = await Comment.findAll({
            where: { PostID },
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['UserID', 'UserName', 'Email']
                }
            ],
            order: [['CreatedAt', 'ASC']]
        });
        
        console.log('📊 [COMMENT] Retrieved', comments.length, 'comments for PostID:', PostID);
        
        const topLevel = comments.filter(c => c.ReplyToID === null);
        const replies = comments.filter(c => c.ReplyToID !== null);
        
        console.log('💬 [COMMENT] Found', topLevel.length, 'top-level comments and', replies.length, 'replies');
        console.log('✅ [COMMENT] Successfully returning comments for post');
        res.status(200).json(comments);
    } catch (err: any) {
        console.log('❌ [COMMENT] Database error:', err.message);
        res.status(500).json({ error: err.message });
    }
}

export async function getAllComments(req: Request, res: Response) {
    console.log('🔵 [COMMENT] GET /api/comments - Fetching all comments');
    
    try {
        console.log('💾 [COMMENT] Fetching all comments from database...');
        const comments = await Comment.findAll({
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['UserID', 'UserName', 'Email']
                }
            ],
            order: [['CreatedAt', 'DESC']]
        });
        
        console.log('📊 [COMMENT] Retrieved', comments.length, 'comments from database');
        console.log('✅ [COMMENT] Successfully returning all comments');
        res.status(200).json(comments);
    } catch (err: any) {
        console.log('❌ [COMMENT] Database error:', err.message);
        res.status(500).json({ error: err.message });
    }
}
