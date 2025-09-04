"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connectionController_1 = require("../controllers/connectionController");
const router = (0, express_1.Router)();
router.post('/connections', connectionController_1.addConnection);
router.put('/connections', connectionController_1.updateConnectionStatus);
exports.default = router;
//# sourceMappingURL=connectionRoutes.js.map