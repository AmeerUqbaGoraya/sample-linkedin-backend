"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const authUtils_1 = require("../auth/authUtils");
const router = (0, express_1.Router)();
router.post('/posts', authUtils_1.authenticateToken, postController_1.createPost);
router.get('/posts', postController_1.getAllPosts);
router.get('/posts/images', postController_1.getPostsWithImages);
router.get('/posts/user/:UserID', postController_1.getPostsByUser);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map