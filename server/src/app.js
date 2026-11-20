import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.routes.js';
import diseaseRoutes from './routes/disease.routes.js';
import authRoutes from './routes/auth.routes.js';
import sellerRoutes from './routes/seller.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import reviewRoutes from './routes/review.routes.js';
import shopRoutes from './routes/shop.routes.js';
import addressRoutes from './routes/address.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[API REQUEST] ${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/v1', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/marketplace/sellers', sellerRoutes);
app.use('/api/v1/marketplace/products', productRoutes);
app.use('/api/v1/marketplace/cart', cartRoutes);
app.use('/api/v1/marketplace/orders', orderRoutes);
app.use('/api/v1/marketplace/payments', paymentRoutes);
app.use('/api/v1/marketplace/reviews', reviewRoutes);
app.use('/api/v1/marketplace/shops', shopRoutes);
app.use('/api/v1/marketplace/addresses', addressRoutes);
app.use('/api/v1/marketplace/admin', adminRoutes);
app.use('/api/v1/diseases', diseaseRoutes);

// 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
