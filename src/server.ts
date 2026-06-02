import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import syncRoutes from './routes/sync.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORE INTERCEPTORS (Must run before ALL sub-routers)
app.use(cors());
app.use(express.json()); // <-- Parses JSON strings into JavaScript objects (req.body)
app.use(express.urlencoded({ extended: true })); // <-- Handles URL-encoded payloads safely

// 2. SUBSYSTEM ROUTERS
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/sync', syncRoutes);

// 3. MONITORING CHECK
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'operational', system: 'CoreSync Engine' });
});

app.listen(PORT, () => {
  console.log(`📡 CoreSync Standalone Server running on port ${PORT}`);
});