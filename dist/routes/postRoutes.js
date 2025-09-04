"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const router = (0, express_1.Router)();
router.post('/posts', postController_1.createPost);
router.get('/posts', postController_1.getAllPosts);
router.get('/posts/images', postController_1.getPostsWithImages);
router.get('/posts/user/:UserID', postController_1.getPostsByUser);
exports.default = router;
//# sourceMappingURL=postRoutes.js.map