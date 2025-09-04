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
exports.addConnection = addConnection;
exports.updateConnectionStatus = updateConnectionStatus;
exports.getUserConnections = getUserConnections;
exports.getUserConnectionRequests = getUserConnectionRequests;
const Connection_1 = __importDefault(require("../models/Connection"));
const sequelize_1 = require("sequelize");
function addConnection(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🔵 [CONNECTION] POST /api/connections - Creating new connection');
        console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
        const { RecipientID } = req.body;
        const user = req.user; // From authenticateToken middleware
        if (!RecipientID) {
            console.log('❌ [CONNECTION] Validation failed - Missing required fields');
            res.status(400).json({ error: 'Missing required fields: RecipientID' });
            return;
        }
        if (!user || !user.UserID) {
            console.log('❌ [CONNECTION] Authentication failed - User not found in request');
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        try {
            console.log('💾 [CONNECTION] Creating connection - UserID:', user.UserID, '→ RecipientID:', RecipientID);
            const newConnection = yield Connection_1.default.create({
                UserID: user.UserID,
                RecipientID,
                Status: 'Pending' // Default to Pending for new connections
            });
            console.log('✅ [CONNECTION] Connection created successfully');
            console.log('🎉 [CONNECTION] New connection established');
            res.status(201).json({
                message: 'Connection created',
                connection: newConnection
            });
        }
        catch (err) {
            console.log('❌ [CONNECTION] Database error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });
}
function updateConnectionStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🔵 [CONNECTION] PUT /api/connections - Updating connection status');
        console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
        const { RequesterUserID, Status } = req.body;
        const user = req.user; // From authenticateToken middleware (this is the recipient)
        if (!RequesterUserID || !Status) {
            console.log('❌ [CONNECTION] Validation failed - Missing required fields');
            res.status(400).json({ error: 'Missing required fields: RequesterUserID, Status' });
            return;
        }
        if (!user || !user.UserID) {
            console.log('❌ [CONNECTION] Authentication failed - User not found in request');
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        try {
            console.log('💾 [CONNECTION] Updating connection - RequesterUserID:', RequesterUserID, '→ RecipientID:', user.UserID, 'New Status:', Status);
            const [updatedRowsCount] = yield Connection_1.default.update({ Status: Status }, {
                where: {
                    UserID: RequesterUserID,
                    RecipientID: user.UserID
                }
            });
            if (updatedRowsCount === 0) {
                console.log('❌ [CONNECTION] No connection found to update');
                res.status(404).json({ error: 'Connection not found' });
                return;
            }
            console.log('✅ [CONNECTION] Connection status updated successfully');
            console.log('🎉 [CONNECTION] Connection status changed to:', Status);
            res.status(200).json({ message: 'Connection updated' });
        }
        catch (err) {
            console.log('❌ [CONNECTION] Database error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });
}
function getUserConnections(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🔵 [CONNECTION] GET /api/connections - Fetching user connections');
        const user = req.user; // From authenticateToken middleware
        if (!user || !user.UserID) {
            console.log('❌ [CONNECTION] Authentication failed - User not found in request');
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        try {
            console.log('💾 [CONNECTION] Fetching connections for UserID:', user.UserID);
            const connections = yield Connection_1.default.findAll({
                where: {
                    [sequelize_1.Op.or]: [
                        { UserID: user.UserID },
                        { RecipientID: user.UserID }
                    ]
                },
                order: [['CreatedAt', 'DESC']]
            });
            console.log('📊 [CONNECTION] Retrieved', connections.length, 'connections for user');
            console.log('✅ [CONNECTION] Successfully returning user connections');
            res.status(200).json(connections);
        }
        catch (err) {
            console.log('❌ [CONNECTION] Database error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });
}
function getUserConnectionRequests(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🔵 [CONNECTION] GET /api/connections/requests - Fetching user connection requests');
        const user = req.user; // From authenticateToken middleware
        if (!user || !user.UserID) {
            console.log('❌ [CONNECTION] Authentication failed - User not found in request');
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        try {
            console.log('💾 [CONNECTION] Fetching connection requests for UserID:', user.UserID);
            // Get requests sent by user (excluding rejected)
            const sentRequests = yield Connection_1.default.findAll({
                where: {
                    UserID: user.UserID,
                    Status: {
                        [sequelize_1.Op.in]: ['Pending', 'Accepted']
                    }
                },
                order: [['CreatedAt', 'DESC']]
            });
            // Get requests received by user (excluding rejected)
            const receivedRequests = yield Connection_1.default.findAll({
                where: {
                    RecipientID: user.UserID,
                    Status: {
                        [sequelize_1.Op.in]: ['Pending', 'Accepted']
                    }
                },
                order: [['CreatedAt', 'DESC']]
            });
            console.log('📊 [CONNECTION] Retrieved', sentRequests.length, 'sent requests and', receivedRequests.length, 'received requests');
            console.log('✅ [CONNECTION] Successfully returning connection requests');
            res.status(200).json({
                sentRequests: sentRequests,
                receivedRequests: receivedRequests,
                summary: {
                    totalSent: sentRequests.length,
                    totalReceived: receivedRequests.length,
                    pendingSent: sentRequests.filter(req => req.Status === 'Pending').length,
                    pendingReceived: receivedRequests.filter(req => req.Status === 'Pending').length,
                    acceptedSent: sentRequests.filter(req => req.Status === 'Accepted').length,
                    acceptedReceived: receivedRequests.filter(req => req.Status === 'Accepted').length
                }
            });
        }
        catch (err) {
            console.log('❌ [CONNECTION] Database error:', err.message);
            res.status(500).json({ error: err.message });
        }
    });
}
//# sourceMappingURL=connectionController.js.map