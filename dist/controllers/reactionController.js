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
const PostReaction_1 = __importDefault(require("../models/PostReaction"));
const Reaction_1 = __importDefault(require("../models/Reaction"));
function addReaction(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🔵 [REACTION] POST /api/reactions - Adding reaction to post');
        console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
        const { PostID, ReactionID } = req.body;
        const user = req.user; // From authenticateToken middleware
        if (!PostID || !ReactionID) {
            console.log('❌ [REACTION] Validation failed - Missing required fields');
            res.status(400).json({ error: 'Missing required fields: PostID, ReactionID' });
            return;
        }
        if (!user || !user.UserID) {
            console.log('❌ [REACTION] Authentication failed - User not found in request');
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        try {
            console.log('💾 [REACTION] Adding/updating reaction - PostID:', PostID, 'UserID:', user.UserID, 'ReactionID:', ReactionID);
            const [reaction, created] = yield PostReaction_1.default.upsert({
                PostID,
                UserID: user.UserID,
                ReactionID
            });
            const action = created ? 'added' : 'updated';
            console.log('✅ [REACTION] Reaction', action, 'successfully');
            console.log('🎉 [REACTION] User', user.UserID, 'reacted to Post', PostID);
            res.status(201).json({
                message: `Reaction ${action}`,
                reaction
            });
        }
        catch (err) {
            console.log('❌ [REACTION] Database error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });
}
function removeReaction(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🔵 [REACTION] DELETE /api/reactions - Removing reaction from post');
        console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
        const { PostID } = req.body;
        const user = req.user; // From authenticateToken middleware
        if (!PostID) {
            console.log('❌ [REACTION] Validation failed - Missing required fields');
            res.status(400).json({ error: 'Missing required fields: PostID' });
            return;
        }
        if (!user || !user.UserID) {
            console.log('❌ [REACTION] Authentication failed - User not found in request');
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        try {
            console.log('💾 [REACTION] Removing reaction - PostID:', PostID, 'UserID:', user.UserID);
            const deletedCount = yield PostReaction_1.default.destroy({
                where: {
                    PostID,
                    UserID: user.UserID
                }
            });
            if (deletedCount === 0) {
                console.log('❌ [REACTION] No reaction found to remove');
                res.status(404).json({ error: 'Reaction not found' });
                return;
            }
            console.log('✅ [REACTION] Reaction removed successfully');
            console.log('🎉 [REACTION] User', user.UserID, 'removed reaction from Post', PostID);
            res.status(200).json({ message: 'Reaction removed' });
        }
        catch (err) {
            console.log('❌ [REACTION] Database error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });
}
function getReactionTypes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🔵 [REACTION] GET /api/reaction-types - Fetching all reaction types');
        try {
            console.log('💾 [REACTION] Fetching reaction types with Sequelize...');
            const reactions = yield Reaction_1.default.findAll({
                order: [['ReactionID', 'ASC']]
            });
            console.log('📊 [REACTION] Retrieved', reactions.length, 'reaction types');
            console.log('✅ [REACTION] Successfully returning reaction types');
            res.status(200).json(reactions);
        }
        catch (err) {
            console.log('❌ [REACTION] Database error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });
}
//# sourceMappingURL=reactionController.js.map