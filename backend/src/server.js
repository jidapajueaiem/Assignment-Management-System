import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import assignmentRoutes from './routes/assignments.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { initializeDatabase } from './db/initDatabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database
await initializeDatabase();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📝 API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
});
