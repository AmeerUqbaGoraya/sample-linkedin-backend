"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reactionController_1 = require("../controllers/reactionController");
const router = (0, express_1.Router)();
router.post('/reactions', reactionController_1.addReaction);
router.delete('/reactions', reactionController_1.removeReaction);
router.get('/reaction-types', reactionController_1.getReactionTypes);
exports.default = router;
//# sourceMappingURL=reactionRoutes.js.map