"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentController_1 = require("../controllers/commentController");
const router = (0, express_1.Router)();
router.post('/comments', commentController_1.addComment);
router.get('/comments/post/:PostID', commentController_1.getCommentsByPost);
exports.default = router;
//# sourceMappingURL=commentRoutes.js.map