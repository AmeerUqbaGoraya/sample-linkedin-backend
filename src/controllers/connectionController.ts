import pool from '../models/db';
import { Request, Response } from 'express';

export async function addConnection(req: Request, res: Response) {
    const { UserID, RecipientID, Status } = req.body;
    if (!UserID || !RecipientID || !Status) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    try {
        const [result] = await pool.execute(
            'INSERT INTO Connections (UserID, RecipientID, Status) VALUES (?, ?, ?)',
            [UserID, RecipientID, Status]
        );
        res.status(201).json({ message: 'Connection created' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export async function updateConnectionStatus(req: Request, res: Response) {
    const { UserID, RecipientID, Status } = req.body;
    if (!UserID || !RecipientID || !Status) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    try {
        const [result] = await pool.execute(
            'UPDATE Connections SET Status = ? WHERE UserID = ? AND RecipientID = ?',
            [Status, UserID, RecipientID]
        );
        res.status(200).json({ message: 'Connection updated' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}
