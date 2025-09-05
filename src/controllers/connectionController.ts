import Connection from '../models/Connection';
import { Request, Response } from 'express';
import { Op } from 'sequelize';

export async function addConnection(req: Request, res: Response) {
    console.log('🔵 [CONNECTION] POST /api/connections - Creating new connection');
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    const { RecipientID } = req.body;
    const user = (req as any).user; 
    
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
        const newConnection = await Connection.create({
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
    } catch (err: any) {
        console.log('❌ [CONNECTION] Database error:', err.message);
        res.status(500).json({ error: err.message });
    }
}

export async function updateConnectionStatus(req: Request, res: Response) {
    console.log('🔵 [CONNECTION] PUT /api/connections - Updating connection status');
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    const { RequesterUserID, Status } = req.body;
    const user = (req as any).user; // From authenticateToken middleware (this is the recipient)
    
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
        const [updatedRowsCount] = await Connection.update(
            { Status: Status as 'Pending' | 'Accepted' | 'Rejected' },
            { 
                where: { 
                    UserID: RequesterUserID, 
                    RecipientID: user.UserID 
                }
            }
        );
        
        if (updatedRowsCount === 0) {
            console.log('❌ [CONNECTION] No connection found to update');
            res.status(404).json({ error: 'Connection not found' });
            return;
        }
        
        console.log('✅ [CONNECTION] Connection status updated successfully');
        console.log('🎉 [CONNECTION] Connection status changed to:', Status);
        res.status(200).json({ message: 'Connection updated' });
    } catch (err: any) {
        console.log('❌ [CONNECTION] Database error:', err.message);
        res.status(500).json({ error: err.message });
    }
}

export async function getUserConnections(req: Request, res: Response) {
    console.log('🔵 [CONNECTION] GET /api/connections - Fetching user connections');
    
    const user = (req as any).user; // From authenticateToken middleware
    
    if (!user || !user.UserID) {
        console.log('❌ [CONNECTION] Authentication failed - User not found in request');
        res.status(401).json({ error: 'Authentication required' });
        return;
    }
    
    try {
        console.log('💾 [CONNECTION] Fetching connections for UserID:', user.UserID);
        const connections = await Connection.findAll({
            where: {
                [Op.or]: [
                    { UserID: user.UserID },
                    { RecipientID: user.UserID }
                ]
            },
            order: [['CreatedAt', 'DESC']]
        });
        
        console.log('📊 [CONNECTION] Retrieved', connections.length, 'connections for user');
        console.log('✅ [CONNECTION] Successfully returning user connections');
        res.status(200).json(connections);
    } catch (err: any) {
        console.log('❌ [CONNECTION] Database error:', err.message);
        res.status(500).json({ error: err.message });
    }
}

export async function getUserConnectionRequests(req: Request, res: Response) {
    console.log('🔵 [CONNECTION] GET /api/connections/requests - Fetching user connection requests');
    
    const user = (req as any).user; // From authenticateToken middleware
    
    if (!user || !user.UserID) {
        console.log('❌ [CONNECTION] Authentication failed - User not found in request');
        res.status(401).json({ error: 'Authentication required' });
        return;
    }
    
    try {
        console.log('💾 [CONNECTION] Fetching connection requests for UserID:', user.UserID);
        
        // Get requests sent by user (excluding rejected)
        const sentRequests = await Connection.findAll({
            where: {
                UserID: user.UserID,
                Status: {
                    [Op.in]: ['Pending', 'Accepted']
                }
            },
            order: [['CreatedAt', 'DESC']]
        });
        
        // Get requests received by user (excluding rejected)
        const receivedRequests = await Connection.findAll({
            where: {
                RecipientID: user.UserID,
                Status: {
                    [Op.in]: ['Pending', 'Accepted']
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
    } catch (err: any) {
        console.log('❌ [CONNECTION] Database error:', err.message);
        res.status(500).json({ error: err.message });
    }
}

export async function getUserPendingRequests(req: Request, res: Response) {
    console.log('🔵 [CONNECTION] GET /api/connections/pending - Fetching pending connection requests only');
    
    const user = (req as any).user; // From authenticateToken middleware
    
    if (!user || !user.UserID) {
        console.log('❌ [CONNECTION] Authentication failed - User not found in request');
        res.status(401).json({ error: 'Authentication required' });
        return;
    }
    
    try {
        console.log('💾 [CONNECTION] Fetching pending requests for UserID:', user.UserID);
        
        // Get pending requests sent by user
        const pendingSentRequests = await Connection.findAll({
            where: {
                UserID: user.UserID,
                Status: 'Pending'
            },
            order: [['CreatedAt', 'DESC']]
        });
        
        // Get pending requests received by user
        const pendingReceivedRequests = await Connection.findAll({
            where: {
                RecipientID: user.UserID,
                Status: 'Pending'
            },
            order: [['CreatedAt', 'DESC']]
        });
        
        console.log('📊 [CONNECTION] Retrieved', pendingSentRequests.length, 'pending sent and', pendingReceivedRequests.length, 'pending received');
        console.log('✅ [CONNECTION] Successfully returning pending requests');
        
        res.status(200).json({
            pendingSentRequests: pendingSentRequests,
            pendingReceivedRequests: pendingReceivedRequests,
            summary: {
                totalPendingSent: pendingSentRequests.length,
                totalPendingReceived: pendingReceivedRequests.length,
                actionRequired: pendingReceivedRequests.length // Requests waiting for user's response
            }
        });
    } catch (err: any) {
        console.log('❌ [CONNECTION] Database error:', err.message);
        res.status(500).json({ error: err.message });
    }
}
