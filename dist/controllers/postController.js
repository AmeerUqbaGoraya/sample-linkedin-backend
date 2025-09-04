"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = createPost;
exports.getAllPosts = getAllPosts;
exports.getPostsWithImages = getPostsWithImages;
exports.getPostsByUser = getPostsByUser;
const db_1 = __importDefault(require("../models/db"));
function createPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { UserID, PostType, Content } = req.body;
        if (!UserID || !PostType || !Content) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        try {
            const [result] = yield db_1.default.execute('INSERT INTO Posts (UserID, PostType, Content) VALUES (?, ?, ?)', [UserID, PostType, Content]);
            res.status(201).json({ message: 'Post created' });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function getAllPosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [rows] = yield db_1.default.execute(`
            SELECT p.PostID, p.UserID, u.UserName, p.PostType, p.Content, p.CreatedAt 
            FROM Posts p 
            JOIN Users u ON p.UserID = u.UserID 
            ORDER BY p.CreatedAt DESC
        `);
            const posts = rows.map(post => {
                const parsedPost = Object.assign({}, post);
                if (post.PostType === 'Image' && post.Content.includes('\nImages: ')) {
                    const [caption, imagesPart] = post.Content.split('\nImages: ');
                    const images = imagesPart.split(', ').map((img) => img.trim());
                    parsedPost.caption = caption;
                    parsedPost.images = images;
                    parsedPost.hasImages = true;
                }
                else {
                    parsedPost.caption = post.Content;
                    parsedPost.images = [];
                    parsedPost.hasImages = false;
                }
                return parsedPost;
            });
            res.status(200).json(posts);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function getPostsWithImages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [rows] = yield db_1.default.execute(`
            SELECT p.PostID, p.UserID, u.UserName, p.PostType, p.Content, p.CreatedAt 
            FROM Posts p 
            JOIN Users u ON p.UserID = u.UserID 
            WHERE p.PostType = 'Image'
            ORDER BY p.CreatedAt DESC
        `);
            const posts = rows.map(post => {
                const parsedPost = Object.assign({}, post);
                if (post.Content.includes('\nImages: ')) {
                    const [caption, imagesPart] = post.Content.split('\nImages: ');
                    const images = imagesPart.split(', ').map((img) => img.trim());
                    parsedPost.caption = caption;
                    parsedPost.images = images;
                    parsedPost.hasImages = true;
                }
                else {
                    parsedPost.caption = post.Content;
                    parsedPost.images = [];
                    parsedPost.hasImages = false;
                }
                return parsedPost;
            });
            res.status(200).json(posts);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function getPostsByUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { UserID } = req.params;
        if (!UserID) {
            res.status(400).json({ error: 'UserID is required' });
            return;
        }
        try {
            const [rows] = yield db_1.default.execute('SELECT * FROM Posts WHERE UserID = ? ORDER BY CreatedAt DESC', [UserID]);
            res.status(200).json(rows);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
//# sourceMappingURL=postController.js.map