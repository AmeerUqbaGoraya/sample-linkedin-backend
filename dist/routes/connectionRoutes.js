"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connectionController_1 = require("../controllers/connectionController");
const authUtils_1 = require("../auth/authUtils");
const router = (0, express_1.Router)();
router.post('/connections', authUtils_1.authenticateToken, connectionController_1.addConnection);
router.get('/connections', authUtils_1.authenticateToken, connectionController_1.getUserConnections);
router.get('/connections/requests', authUtils_1.authenticateToken, connectionController_1.getUserConnectionRequests);
router.put('/connections', authUtils_1.authenticateToken, connectionController_1.updateConnectionStatus);
exports.default = router;
//# sourceMappingURL=connectionRoutes.js.map