import { Router } from 'express';
import marketplaceStore from '../db/marketplaceStore.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/v1/marketplace/reviews/product/:productId
 * List reviews for a product
 */
router.get('/product/:productId', (req, res) => {
  try {
    const product = marketplaceStore.findProductById(req.params.productId);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found.' });
    }

    return res.status(200).json({
      status: 'success',
      count: product.reviews.length,
      rating_avg: product.rating_avg,
      data: product.reviews,
    });
  } catch (error) {
    console.error('[REVIEWS GET ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch reviews.',
    });
  }
});

/**
 * POST /api/v1/marketplace/reviews
 * Submit review for a verified delivered purchase
 */
router.post('/', authenticateToken, (req, res) => {
  try {
    const { product_id, order_id, rating, comment } = req.body;

    if (!product_id || !order_id || !rating) {
      return res.status(400).json({
        status: 'error',
        message: 'product_id, order_id, and rating (1-5) are required.',
      });
    }

    const review = marketplaceStore.addReview({
      product_id,
      buyer_id: req.user.id,
      order_id,
      rating: Number(rating),
      comment,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Review submitted successfully. Thank you for rating this product!',
      data: review,
    });
  } catch (error) {
    console.error('[ADD REVIEW ERROR]', error);
    return res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to submit review.',
    });
  }
});

export default router;
