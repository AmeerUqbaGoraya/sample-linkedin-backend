import express from 'express';
import userRoutes from './routes/userRoutes';
import connectionRoutes from './routes/connectionRoutes';
import postRoutes from './routes/postRoutes';
import reactionRoutes from './routes/reactionRoutes';
import commentRoutes from './routes/commentRoutes';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', connectionRoutes);
app.use('/api', postRoutes);
app.use('/api', reactionRoutes);
app.use('/api', commentRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
