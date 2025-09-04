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
const db_1 = __importDefault(require("../models/db"));
function addComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { PostID, UserID, CommentText, ReplyToID } = req.body;
        if (!PostID || !UserID || !CommentText) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        try {
            const [result] = yield db_1.default.execute('INSERT INTO Comments (PostID, UserID, CommentText, ReplyToID) VALUES (?, ?, ?, ?)', [PostID, UserID, CommentText, ReplyToID || null]);
            res.status(201).json({ message: 'Comment added' });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function getCommentsByPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { PostID } = req.params;
        if (!PostID) {
            res.status(400).json({ error: 'PostID is required' });
            return;
        }
        try {
            const [rows] = yield db_1.default.execute('SELECT * FROM Comments WHERE PostID = ? ORDER BY CreatedAt ASC', [PostID]);
            res.status(200).json(rows);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
//# sourceMappingURL=commentController.js.map