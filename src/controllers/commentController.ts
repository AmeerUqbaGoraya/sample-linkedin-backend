import pool from '../models/db';
import { Request, Response } from 'express';

export async function addComment(req: Request, res: Response) {
    const { PostID, UserID, CommentText, ReplyToID } = req.body;
    if (!PostID || !UserID || !CommentText) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    try {
        const [result] = await pool.execute(
            'INSERT INTO Comments (PostID, UserID, CommentText, ReplyToID) VALUES (?, ?, ?, ?)',
            [PostID, UserID, CommentText, ReplyToID || null]
        );
        res.status(201).json({ message: 'Comment added' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export async function getCommentsByPost(req: Request, res: Response) {
    const { PostID } = req.params;
    if (!PostID) {
        res.status(400).json({ error: 'PostID is required' });
        return;
    }
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM Comments WHERE PostID = ? ORDER BY CreatedAt ASC',
            [PostID]
        );
        res.status(200).json(rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}
