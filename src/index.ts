import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { initializeDatabase } from './models/index';
import userRoutes from './routes/userRoutes';
import connectionRoutes from './routes/connectionRoutes';
import postRoutes from './routes/postRoutes';
import reactionRoutes from './routes/reactionRoutes';
import commentRoutes from './routes/commentRoutes';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`\n🌐 [${timestamp}] ${req.method} ${req.originalUrl}`);
    if (req.method !== 'GET' && Object.keys(req.body).length > 0) {
        console.log('📤 Request from:', req.ip);
    }
    next();
});

app.use('/api', userRoutes);
app.use('/api', connectionRoutes);
app.use('/api', postRoutes);
app.use('/api', reactionRoutes);
app.use('/api', commentRoutes);

async function startServer() {
    try {
        const dbInitialized = await initializeDatabase();
        if (!dbInitialized) {
            console.error('❌ Failed to initialize database. Exiting...');
            process.exit(1);
        }
        
        app.listen(port, () => {
            console.log('🚀 LinkedIn API Server Started with Sequelize!');
            console.log(`📍 Server running at http://localhost:${port}`);
            console.log('🔧 Debugging enabled - All API calls will be logged');
            console.log('📱 Ready for Postman testing!\n');
        });
    } catch (error) {
        console.error('❌ Server startup failed:', error);
        process.exit(1);
    }
}

startServer();
