import { Router } from 'express';
import crypto from 'crypto';
import marketplaceStore from '../db/marketplaceStore.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

/**
 * GET /api/v1/marketplace/payments/config
 * Check if Razorpay is configured on backend and retrieve public Key ID
 */
router.get('/config', (req, res) => {
  const isConfigured = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
  return res.status(200).json({
    status: 'success',
    data: {
      is_configured: isConfigured,
      key_id: isConfigured ? process.env.RAZORPAY_KEY_ID : null,
      mode: process.env.RAZORPAY_KEY_ID?.startsWith('rzp_live') ? 'live' : 'test',
    },
  });
});

/**
 * POST /api/v1/marketplace/payments/create-razorpay-order
 * Mock/Sandbox Razorpay Order Creation
 */
router.post('/create-razorpay-order', (req, res) => {
  try {
    const { order_id, amount } = req.body;
    if (!order_id || !amount) {
      return res.status(400).json({
        status: 'error',
        message: 'order_id and amount are required.',
      });
    }

    const order = marketplaceStore.findOrderById(order_id);
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found.' });
    }

    if (order.buyer_id !== req.user.id) {
      return res.status(403).json({ status: 'error', message: 'Unauthorized for this order.' });
    }

    // Generate mock Razorpay test order ID
    const razorpay_order_id = `order_test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    marketplaceStore.updatePayment(order_id, {
      gateway_order_id: razorpay_order_id,
      gateway_provider: 'razorpay_test',
    });

    return res.status(200).json({
      status: 'success',
      data: {
        razorpay_order_id,
        amount: Math.round(Number(amount) * 100), // in paise
        currency: 'INR',
        key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_agrisphere_sandbox',
        order_number: order.order_number,
        buyer: {
          name: req.user.full_name,
          email: req.user.email,
          contact: req.user.mobile_number,
        },
      },
    });
  } catch (error) {
    console.error('[PAYMENT ORDER ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to initiate Razorpay payment.',
    });
  }
});

/**
 * POST /api/v1/marketplace/payments/verify-razorpay-signature
 * Verify signature / complete payment in test/mock mode
 */
router.post('/verify-razorpay-signature', (req, res) => {
  try {
    const {
      order_id,
      razorpay_order_id,
      razorpay_payment_id = `pay_test_${Date.now()}`,
      razorpay_signature = 'simulated_valid_test_signature',
    } = req.body;

    if (!order_id || !razorpay_order_id) {
      return res.status(400).json({
        status: 'error',
        message: 'order_id and razorpay_order_id are required.',
      });
    }

    const order = marketplaceStore.findOrderById(order_id);
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found.' });
    }

    if (order.buyer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Unauthorized for this order.' });
    }

    // Cryptographic HMAC Verification if secret is configured
    if (process.env.RAZORPAY_KEY_SECRET) {
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generatedSignature = hmac.digest('hex');
      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
          status: 'error',
          message: 'Payment verification failed: Invalid cryptographic signature.',
        });
      }
    }

    // Update payment record
    const updatedPayment = marketplaceStore.updatePayment(order_id, {
      gateway_order_id: razorpay_order_id,
      gateway_payment_id: razorpay_payment_id,
      gateway_signature: razorpay_signature,
      payment_status: 'captured',
    });

    // Advance order to confirmed
    marketplaceStore.updateOrderStatus(order_id, 'order_confirmed', {
      actorId: req.user.id,
      reason: 'Online payment received via Razorpay Sandbox',
    });

    return res.status(200).json({
      status: 'success',
      message: 'Payment verified and captured successfully.',
      data: {
        order_id,
        payment_id: razorpay_payment_id,
        status: 'captured',
      },
    });
  } catch (error) {
    console.error('[PAYMENT VERIFY ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Payment verification failed.',
    });
  }
});

/**
 * POST /api/v1/marketplace/payments/cod-confirm
 * Confirm order with Cash On Delivery
 */
router.post('/cod-confirm', (req, res) => {
  try {
    const { order_id } = req.body;
    if (!order_id) {
      return res.status(400).json({ status: 'error', message: 'order_id is required.' });
    }

    const order = marketplaceStore.findOrderById(order_id);
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found.' });
    }

    marketplaceStore.updatePayment(order_id, {
      payment_method: 'cod',
      payment_status: 'pending',
    });

    marketplaceStore.updateOrderStatus(order_id, 'order_confirmed', {
      actorId: req.user.id,
      reason: 'Cash on delivery confirmed',
    });

    return res.status(200).json({
      status: 'success',
      message: 'Cash on Delivery order confirmed.',
      data: { order_id, status: 'confirmed' },
    });
  } catch (error) {
    console.error('[COD CONFIRM ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to confirm COD order.',
    });
  }
});

export default router;
