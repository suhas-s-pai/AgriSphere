import { Router } from 'express';

const router = Router();

/**
 * GET /api/v1/health
 * Health check endpoint showing system status
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'AgriSphere API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    message: 'AgriSphere REST API is operational.',
  });
});

export default router;

