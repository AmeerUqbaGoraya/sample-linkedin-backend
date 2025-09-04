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
exports.addComment = addComment;
exports.getCommentsByPost = getCommentsByPost;
exports.getAllComments = getAllComments;
const Comment_1 = __importDefault(require("../models/Comment"));
const User_1 = __importDefault(require("../models/User"));
function addComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🔵 [COMMENT] POST /api/comments - Adding comment to post');
        console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
        const { PostID, Content, ReplyToID } = req.body;
        const user = req.user;
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
            const newComment = yield Comment_1.default.create({
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
        }
        catch (err) {
            console.log('❌ [COMMENT] Database error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });
}
function getCommentsByPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { PostID } = req.params;
        console.log('🔵 [COMMENT] GET /api/comments/post/' + PostID + ' - Fetching comments for post');
        if (!PostID) {
            console.log('❌ [COMMENT] Validation failed - PostID parameter missing');
            res.status(400).json({ error: 'PostID is required' });
            return;
        }
        try {
            console.log('💾 [COMMENT] Fetching comments from database for PostID:', PostID);
            const comments = yield Comment_1.default.findAll({
                where: { PostID },
                include: [
                    {
                        model: User_1.default,
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
        }
        catch (err) {
            console.log('❌ [COMMENT] Database error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });
}
function getAllComments(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🔵 [COMMENT] GET /api/comments - Fetching all comments');
        try {
            console.log('💾 [COMMENT] Fetching all comments from database...');
            const comments = yield Comment_1.default.findAll({
                include: [
                    {
                        model: User_1.default,
                        as: 'author',
                        attributes: ['UserID', 'UserName', 'Email']
                    }
                ],
                order: [['CreatedAt', 'DESC']]
            });
            console.log('📊 [COMMENT] Retrieved', comments.length, 'comments from database');
            console.log('✅ [COMMENT] Successfully returning all comments');
            res.status(200).json(comments);
        }
        catch (err) {
            console.log('❌ [COMMENT] Database error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });
}
//# sourceMappingURL=commentController.js.map