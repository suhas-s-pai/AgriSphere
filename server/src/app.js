import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[API REQUEST] ${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/v1', healthRoutes);

// 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

