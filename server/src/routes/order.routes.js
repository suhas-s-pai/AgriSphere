import { Router } from 'express';
import marketplaceStore from '../db/marketplaceStore.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

/**
 * POST /api/v1/marketplace/orders/create
 * Checkout & create orders (supports multi-seller grouping)
 */
router.post('/create', (req, res) => {
  try {
    const {
      items = [],
      shipping_address,
      delivery_type = 'local_delivery',
      delivery_charges = 0,
      payment_method = 'cod',
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Order items are required.',
      });
    }

    if (!shipping_address) {
      return res.status(400).json({
        status: 'error',
        message: 'Shipping delivery address is required.',
      });
    }

    // Group items by seller_id
    const sellerGroups = {};
    for (const item of items) {
      const prod = marketplaceStore.findProductById(item.product_id);
      if (!prod) {
        return res.status(400).json({
          status: 'error',
          message: `Product ${item.product_id} no longer exists.`,
        });
      }
      const sellerId = prod.seller_id;
      if (!sellerGroups[sellerId]) {
        sellerGroups[sellerId] = [];
      }
      sellerGroups[sellerId].push(item);
    }

    // Create an order for each seller group
    const createdOrders = [];
    const sellerIds = Object.keys(sellerGroups);

    for (const sId of sellerIds) {
      const groupItems = sellerGroups[sId];
      // Proportionate or single delivery charge
      const charge = sellerIds.length === 1 ? delivery_charges : Math.round(Number(delivery_charges) / sellerIds.length);

      const order = marketplaceStore.createOrder({
        buyer_id: req.user.id,
        seller_id: sId,
        items: groupItems,
        shipping_address,
        delivery_type,
        delivery_charges: charge,
        payment_method,
      });

      createdOrders.push(order);
    }

    return res.status(201).json({
      status: 'success',
      message: `Successfully created ${createdOrders.length} order(s).`,
      count: createdOrders.length,
      data: createdOrders,
    });
  } catch (error) {
    console.error('[CREATE ORDER ERROR]', error);
    return res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to place order.',
    });
  }
});

/**
 * GET /api/v1/marketplace/orders/buyer
 * List all orders placed by the authenticated buyer
 */
router.get('/buyer', (req, res) => {
  try {
    const orders = marketplaceStore.listOrdersForBuyer(req.user.id);
    return res.status(200).json({
      status: 'success',
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('[BUYER ORDERS ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch buyer orders.',
    });
  }
});

/**
 * GET /api/v1/marketplace/orders/seller
 * List all orders received by authenticated seller
 */
router.get('/seller', requireRole(['farmer', 'shop', 'fpo', 'supplier', 'seller', 'admin']), (req, res) => {
  try {
    if (!req.sellerProfile && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Active seller profile required to view incoming orders.',
      });
    }

    const sellerId = req.sellerProfile ? req.sellerProfile.id : null;
    const orders = sellerId ? marketplaceStore.listOrdersForSeller(sellerId) : marketplaceStore.listAllOrders();

    return res.status(200).json({
      status: 'success',
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('[SELLER ORDERS ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch seller orders.',
    });
  }
});

/**
 * GET /api/v1/marketplace/orders/:id
 * Get single order details with security check
 */
router.get('/:id', (req, res) => {
  try {
    const order = marketplaceStore.findOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found.' });
    }

    // Authorization: Must be buyer, seller, or admin
    const isBuyer = order.buyer_id === req.user.id;
    const isSeller = req.sellerProfile && order.seller_id === req.sellerProfile.id;
    const isAdmin = req.user.role === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({ status: 'error', message: 'Access denied.' });
    }

    return res.status(200).json({
      status: 'success',
      data: order,
    });
  } catch (error) {
    console.error('[ORDER DETAILS ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch order details.',
    });
  }
});

/**
 * PUT /api/v1/marketplace/orders/:id/status
 * Update order status (Buyer can cancel early; Seller can update progress; Admin can do all)
 */
router.put('/:id/status', (req, res) => {
  try {
    const { status: newStatus, reason } = req.body;
    if (!newStatus) {
      return res.status(400).json({ status: 'error', message: 'New status is required.' });
    }

    const order = marketplaceStore.findOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found.' });
    }

    const isBuyer = order.buyer_id === req.user.id;
    const isSeller = req.sellerProfile && order.seller_id === req.sellerProfile.id;
    const isAdmin = req.user.role === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) {
      return res.status(403).json({ status: 'error', message: 'Access denied.' });
    }

    // Buyer restrictions: can only cancel if order_placed
    if (isBuyer && !isSeller && !isAdmin) {
      if (newStatus !== 'cancelled') {
        return res.status(403).json({
          status: 'error',
          message: 'Buyers can only cancel pending orders.',
        });
      }
      if (order.order_status !== 'order_placed') {
        return res.status(400).json({
          status: 'error',
          message: 'Order has already been processed and cannot be cancelled by buyer.',
        });
      }
    }

    const updated = marketplaceStore.updateOrderStatus(order.id, newStatus, {
      actorId: req.user.id,
      reason,
    });

    return res.status(200).json({
      status: 'success',
      message: `Order status updated to ${newStatus}.`,
      data: updated,
    });
  } catch (error) {
    console.error('[UPDATE ORDER STATUS ERROR]', error);
    return res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to update order status.',
    });
  }
});

export default router;
