import pool from '../models/db';
import { Request, Response } from 'express';

export async function addReaction(req: Request, res: Response) {
    const { PostID, UserID, ReactionID } = req.body;
    if (!PostID || !UserID || !ReactionID) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    try {
        const [result] = await pool.execute(
            'INSERT INTO PostReactions (PostID, UserID, ReactionID) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE ReactionID = VALUES(ReactionID)',
            [PostID, UserID, ReactionID]
        );
        res.status(201).json({ message: 'Reaction added' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export async function removeReaction(req: Request, res: Response) {
    const { PostID, UserID } = req.body;
    if (!PostID || !UserID) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    try {
        const [result] = await pool.execute(
            'DELETE FROM PostReactions WHERE PostID = ? AND UserID = ?',
            [PostID, UserID]
        );
        res.status(200).json({ message: 'Reaction removed' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export async function getReactionTypes(req: Request, res: Response) {
    try {
        const [rows] = await pool.execute('SELECT * FROM Reactions');
        res.status(200).json(rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}
