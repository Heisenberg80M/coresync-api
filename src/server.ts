import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import { isAuthenticatedGuard } from './middleware/auth.guard';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Core Authentication Endpoint Mount
app.use('/api/v1/auth', authRoutes);

// 2. Monitoring Health-check endpoint (Public)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'operational', system: 'CoreSync Engine' });
});

// 3. Guarded Sandbox Endpoint (Requires Authorization header token)
app.get('/api/v1/secure-data', isAuthenticatedGuard, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Data successfully retrieved from guarded system endpoint.',
    identityContext: req.user, // Unpacked metadata cleanly extracted by guard middleware
  });
});

app.listen(PORT, () => {
  console.log(`📡 CoreSync Standalone Server running on port ${PORT}`);
});