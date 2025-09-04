import pool from '../models/db';
import { Request, Response } from 'express';

export async function createPost(req: Request, res: Response) {
    const { UserID, PostType, Content } = req.body;
    if (!UserID || !PostType || !Content) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    try {
        const [result] = await pool.execute(
            'INSERT INTO Posts (UserID, PostType, Content) VALUES (?, ?, ?)',
            [UserID, PostType, Content]
        );
        res.status(201).json({ message: 'Post created' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export async function getAllPosts(req: Request, res: Response) {
    try {
        const [rows] = await pool.execute(`
            SELECT p.PostID, p.UserID, u.UserName, p.PostType, p.Content, p.CreatedAt 
            FROM Posts p 
            JOIN Users u ON p.UserID = u.UserID 
            ORDER BY p.CreatedAt DESC
        `);
        
        const posts = (rows as any[]).map(post => {
            const parsedPost = { ...post };
            
            if (post.PostType === 'Image' && post.Content.includes('\nImages: ')) {
                const [caption, imagesPart] = post.Content.split('\nImages: ');
                const images = imagesPart.split(', ').map((img: string) => img.trim());
                parsedPost.caption = caption;
                parsedPost.images = images;
                parsedPost.hasImages = true;
            } else {
                parsedPost.caption = post.Content;
                parsedPost.images = [];
                parsedPost.hasImages = false;
            }
            
            return parsedPost;
        });
        
        res.status(200).json(posts);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export async function getPostsWithImages(req: Request, res: Response) {
    try {
        const [rows] = await pool.execute(`
            SELECT p.PostID, p.UserID, u.UserName, p.PostType, p.Content, p.CreatedAt 
            FROM Posts p 
            JOIN Users u ON p.UserID = u.UserID 
            WHERE p.PostType = 'Image'
            ORDER BY p.CreatedAt DESC
        `);
        
        const posts = (rows as any[]).map(post => {
            const parsedPost = { ...post };
            
            if (post.Content.includes('\nImages: ')) {
                const [caption, imagesPart] = post.Content.split('\nImages: ');
                const images = imagesPart.split(', ').map((img: string) => img.trim());
                parsedPost.caption = caption;
                parsedPost.images = images;
                parsedPost.hasImages = true;
            } else {
                parsedPost.caption = post.Content;
                parsedPost.images = [];
                parsedPost.hasImages = false;
            }
            
            return parsedPost;
        });
        
        res.status(200).json(posts);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export async function getPostsByUser(req: Request, res: Response) {
    const { UserID } = req.params;
    if (!UserID) {
        res.status(400).json({ error: 'UserID is required' });
        return;
    }
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM Posts WHERE UserID = ? ORDER BY CreatedAt DESC',
            [UserID]
        );
        res.status(200).json(rows);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}
