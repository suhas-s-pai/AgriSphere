import { Router } from 'express';
import marketplaceStore from '../db/marketplaceStore.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// All cart routes require authenticated user
router.use(authenticateToken);

/**
 * GET /api/v1/marketplace/cart
 * Retrieve active shopping cart with product snapshots, pricing, and stock status
 */
router.get('/', (req, res) => {
  try {
    const items = marketplaceStore.getUserCart(req.user.id);

    // Calculate subtotal and stock warnings
    let subtotal = 0;
    let hasOutOfStock = false;
    let hasExceededStock = false;

    const formattedItems = items.map((item) => {
      const p = item.product;
      const itemTotal = Number(p.price) * item.quantity;
      subtotal += itemTotal;

      const isOutOfStock = p.available_quantity <= 0;
      const isExceeded = item.quantity > p.available_quantity;

      if (isOutOfStock) hasOutOfStock = true;
      if (isExceeded) hasExceededStock = true;

      return {
        id: item.id,
        product_id: p.id,
        title: p.title,
        price: p.price,
        unit: p.unit,
        quantity: item.quantity,
        total_price: itemTotal,
        image_url: p.image_url,
        available_quantity: p.available_quantity,
        min_order_quantity: p.min_order_quantity || 1,
        seller_id: p.seller_id,
        seller_name: p.seller_name,
        is_harvested_produce: p.is_harvested_produce,
        is_out_of_stock: isOutOfStock,
        is_exceeded_stock: isExceeded,
      };
    });

    return res.status(200).json({
      status: 'success',
      count: formattedItems.length,
      data: {
        items: formattedItems,
        subtotal,
        has_out_of_stock: hasOutOfStock,
        has_exceeded_stock: hasExceededStock,
      },
    });
  } catch (error) {
    console.error('[CART GET ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to retrieve shopping cart.',
    });
  }
});

/**
 * POST /api/v1/marketplace/cart/add
 * Add item to cart
 */
router.post('/add', (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ status: 'error', message: 'productId is required.' });
    }

    const item = marketplaceStore.addToCart(req.user.id, productId, quantity);
    const updatedCart = marketplaceStore.getUserCart(req.user.id);

    return res.status(200).json({
      status: 'success',
      message: 'Item added to cart successfully.',
      data: {
        item,
        total_items: updatedCart.length,
      },
    });
  } catch (error) {
    console.error('[CART ADD ERROR]', error);
    return res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to add item to cart.',
    });
  }
});

/**
 * PUT /api/v1/marketplace/cart/update
 * Update item quantity
 */
router.put('/update', (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined) {
      return res.status(400).json({ status: 'error', message: 'productId and quantity are required.' });
    }

    const item = marketplaceStore.updateCartQuantity(req.user.id, productId, quantity);
    return res.status(200).json({
      status: 'success',
      message: 'Cart quantity updated.',
      data: item,
    });
  } catch (error) {
    console.error('[CART UPDATE ERROR]', error);
    return res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to update cart quantity.',
    });
  }
});

/**
 * DELETE /api/v1/marketplace/cart/remove/:productId
 * Remove specific product from cart
 */
router.delete('/remove/:productId', (req, res) => {
  try {
    marketplaceStore.removeFromCart(req.user.id, req.params.productId);
    return res.status(200).json({
      status: 'success',
      message: 'Item removed from cart.',
    });
  } catch (error) {
    console.error('[CART REMOVE ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to remove item.',
    });
  }
});

/**
 * DELETE /api/v1/marketplace/cart/clear
 * Clear all cart items
 */
router.delete('/clear', (req, res) => {
  try {
    marketplaceStore.clearUserCart(req.user.id);
    return res.status(200).json({
      status: 'success',
      message: 'Shopping cart cleared.',
    });
  } catch (error) {
    console.error('[CART CLEAR ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to clear cart.',
    });
  }
});

export default router;
