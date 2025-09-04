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
const Post_1 = __importDefault(require("../models/Post"));
const User_1 = __importDefault(require("../models/User"));
function createPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🔵 [POST] POST /api/posts - Creating new post');
        console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
        const { PostType, Content } = req.body;
        const user = req.user; // From authenticateToken middleware
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
            const newPost = yield Post_1.default.create({
                UserID: user.UserID,
                PostType: PostType,
                Content
            });
            console.log('✅ [POST] Post created successfully:', newPost.PostID);
            console.log('🎉 [POST] New post added - UserID:', user.UserID, 'PostType:', PostType);
            res.status(201).json({
                message: 'Post created',
                post: newPost
            });
        }
        catch (err) {
            console.log('❌ [POST] Database error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });
}
function getAllPosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🔵 [POST] GET /api/posts - Fetching all posts');
        try {
            console.log('💾 [POST] Fetching all posts with user info using Sequelize...');
            const posts = yield Post_1.default.findAll({
                include: [
                    {
                        model: User_1.default,
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
                    const images = imagesPart ? imagesPart.split(', ').map((img) => img.trim()) : [];
                    return Object.assign(Object.assign({}, postData), { caption,
                        images, hasImages: true });
                }
                else {
                    return Object.assign(Object.assign({}, postData), { caption: post.Content, images: [], hasImages: false });
                }
            });
            console.log('✅ [POST] Successfully processed and returning', processedPosts.length, 'posts');
            res.status(200).json(processedPosts);
        }
        catch (err) {
            console.log('❌ [POST] Database error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });
}
function getPostsWithImages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🔵 [POST] GET /api/posts/images - Fetching image posts only');
        try {
            console.log('💾 [POST] Fetching image posts with Sequelize...');
            const posts = yield Post_1.default.findAll({
                where: { PostType: 'Image' },
                include: [
                    {
                        model: User_1.default,
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
                    const images = imagesPart ? imagesPart.split(', ').map((img) => img.trim()) : [];
                    return Object.assign(Object.assign({}, postData), { caption,
                        images, hasImages: true });
                }
                else {
                    return Object.assign(Object.assign({}, postData), { caption: post.Content, images: [], hasImages: false });
                }
            });
            console.log('✅ [POST] Successfully processed and returning', processedPosts.length, 'image posts');
            res.status(200).json(processedPosts);
        }
        catch (err) {
            console.log('❌ [POST] Database error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });
}
function getPostsByUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { UserID } = req.params;
        console.log('🔵 [POST] GET /api/posts/user/' + UserID + ' - Fetching posts by user');
        if (!UserID) {
            console.log('❌ [POST] Validation failed - UserID parameter missing');
            res.status(400).json({ error: 'UserID is required' });
            return;
        }
        try {
            console.log('💾 [POST] Fetching posts for UserID:', UserID);
            const posts = yield Post_1.default.findAll({
                where: { UserID },
                include: [
                    {
                        model: User_1.default,
                        as: 'author',
                        attributes: ['UserID', 'UserName', 'Email']
                    }
                ],
                order: [['CreatedAt', 'DESC']]
            });
            console.log('📊 [POST] Retrieved', posts.length, 'posts for UserID:', UserID);
            console.log('✅ [POST] Successfully returning posts for user');
            res.status(200).json(posts);
        }
        catch (err) {
            console.log('❌ [POST] Database error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });
}
//# sourceMappingURL=postController.js.map