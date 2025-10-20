import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// CORS che permette richieste da più origini
app.use(cors({
    origin: ['http://localhost:3001','http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'] 
}))

// Routes
app.use('/api/auth', authRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(PORT, () => {
    console.log('Server avviato su porta  ' + PORT);
})

