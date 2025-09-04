import pool from '../models/db';
import { Request, Response } from 'express';

export async function addUser(req: Request, res: Response) {
    const { UserName, Email, PasswordHash } = req.body;
    if (!UserName || !Email || !PasswordHash) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    try {
        const [result] = await pool.execute(
            'INSERT INTO Users (UserName, Email, PasswordHash) VALUES (?, ?, ?)',
            [UserName, Email, PasswordHash]
        );
        res.status(201).json({ message: 'User created' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}
