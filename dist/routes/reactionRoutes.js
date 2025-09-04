"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reactionController_1 = require("../controllers/reactionController");
const authUtils_1 = require("../auth/authUtils");
const router = (0, express_1.Router)();
router.post('/reactions', authUtils_1.authenticateToken, reactionController_1.addReaction);
router.delete('/reactions', authUtils_1.authenticateToken, reactionController_1.removeReaction);
router.get('/reactions', reactionController_1.getReactionTypes);
exports.default = router;
//# sourceMappingURL=reactionRoutes.js.map