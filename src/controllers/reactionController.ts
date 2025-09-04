import PostReaction from '../models/PostReaction';
import Reaction from '../models/Reaction';
import { Request, Response } from 'express';

export async function addReaction(req: Request, res: Response) {
    console.log('🔵 [REACTION] POST /api/reactions - Adding reaction to post');
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    const { PostID, ReactionID } = req.body;
    const user = (req as any).user; // From authenticateToken middleware
    
    if (!PostID || !ReactionID) {
        console.log('❌ [REACTION] Validation failed - Missing required fields');
        res.status(400).json({ error: 'Missing required fields: PostID, ReactionID' });
        return;
    }
    
    if (!user || !user.UserID) {
        console.log('❌ [REACTION] Authentication failed - User not found in request');
        res.status(401).json({ error: 'Authentication required' });
        return;
    }
    
    try {
        console.log('💾 [REACTION] Adding/updating reaction - PostID:', PostID, 'UserID:', user.UserID, 'ReactionID:', ReactionID);
        
        const [reaction, created] = await PostReaction.upsert({
            PostID,
            UserID: user.UserID,
            ReactionID
        });
        
        const action = created ? 'added' : 'updated';
        console.log('✅ [REACTION] Reaction', action, 'successfully');
        console.log('🎉 [REACTION] User', user.UserID, 'reacted to Post', PostID);
        res.status(201).json({ 
            message: `Reaction ${action}`,
            reaction
        });
    } catch (err: any) {
        console.log('❌ [REACTION] Database error:', err.message);
        res.status(500).json({ error: err.message });
    }
}

export async function removeReaction(req: Request, res: Response) {
    console.log('🔵 [REACTION] DELETE /api/reactions - Removing reaction from post');
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    const { PostID } = req.body;
    const user = (req as any).user; // From authenticateToken middleware
    
    if (!PostID) {
        console.log('❌ [REACTION] Validation failed - Missing required fields');
        res.status(400).json({ error: 'Missing required fields: PostID' });
        return;
    }
    
    if (!user || !user.UserID) {
        console.log('❌ [REACTION] Authentication failed - User not found in request');
        res.status(401).json({ error: 'Authentication required' });
        return;
    }
    
    try {
        console.log('💾 [REACTION] Removing reaction - PostID:', PostID, 'UserID:', user.UserID);
        const deletedCount = await PostReaction.destroy({
            where: {
                PostID,
                UserID: user.UserID
            }
        });
        
        if (deletedCount === 0) {
            console.log('❌ [REACTION] No reaction found to remove');
            res.status(404).json({ error: 'Reaction not found' });
            return;
        }
        
        console.log('✅ [REACTION] Reaction removed successfully');
        console.log('🎉 [REACTION] User', user.UserID, 'removed reaction from Post', PostID);
        res.status(200).json({ message: 'Reaction removed' });
    } catch (err: any) {
        console.log('❌ [REACTION] Database error:', err.message);
        res.status(500).json({ error: err.message });
    }
}

export async function getReactionTypes(req: Request, res: Response) {
    console.log('🔵 [REACTION] GET /api/reaction-types - Fetching all reaction types');
    
    try {
        console.log('💾 [REACTION] Fetching reaction types with Sequelize...');
        const reactions = await Reaction.findAll({
            order: [['ReactionID', 'ASC']]
        });
        
        console.log('📊 [REACTION] Retrieved', reactions.length, 'reaction types');
        console.log('✅ [REACTION] Successfully returning reaction types');
        res.status(200).json(reactions);
    } catch (err: any) {
        console.log('❌ [REACTION] Database error:', err.message);
        res.status(500).json({ error: err.message });
    }
}
