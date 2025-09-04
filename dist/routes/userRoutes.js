"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authUtils_1 = require("../auth/authUtils");
const router = (0, express_1.Router)();
router.post('/users', userController_1.addUser);
router.get('/users', authUtils_1.authenticateToken, userController_1.getAllUsers);
router.post('/users/login', userController_1.loginUser);
router.post('/users/refresh', userController_1.refreshToken);
router.post('/users/logout', userController_1.logoutUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map