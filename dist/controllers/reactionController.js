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
exports.addReaction = addReaction;
exports.removeReaction = removeReaction;
exports.getReactionTypes = getReactionTypes;
const db_1 = __importDefault(require("../models/db"));
function addReaction(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { PostID, UserID, ReactionID } = req.body;
        if (!PostID || !UserID || !ReactionID) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        try {
            const [result] = yield db_1.default.execute('INSERT INTO PostReactions (PostID, UserID, ReactionID) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE ReactionID = VALUES(ReactionID)', [PostID, UserID, ReactionID]);
            res.status(201).json({ message: 'Reaction added' });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function removeReaction(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { PostID, UserID } = req.body;
        if (!PostID || !UserID) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        try {
            const [result] = yield db_1.default.execute('DELETE FROM PostReactions WHERE PostID = ? AND UserID = ?', [PostID, UserID]);
            res.status(200).json({ message: 'Reaction removed' });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
function getReactionTypes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [rows] = yield db_1.default.execute('SELECT * FROM Reactions');
            res.status(200).json(rows);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
//# sourceMappingURL=reactionController.js.map