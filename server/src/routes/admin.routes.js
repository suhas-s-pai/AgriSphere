import { Router } from 'express';
import marketplaceStore from '../db/marketplaceStore.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// All admin routes strictly require admin role
router.use(authenticateToken, requireAdmin);

/**
 * GET /api/v1/marketplace/admin/stats
 * Platform analytics and operational stats
 */
router.get('/stats', (req, res) => {
  try {
    const stats = marketplaceStore.getAdminStats();
    return res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    console.error('[ADMIN STATS ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to load admin stats.',
    });
  }
});

/**
 * GET /api/v1/marketplace/admin/pending-sellers
 * List sellers waiting for credential review
 */
router.get('/pending-sellers', (req, res) => {
  try {
    const pending = marketplaceStore.listSellers({ status: 'pending' });
    const formatted = pending.map((s) => ({
      ...s,
      documents: marketplaceStore.getVerificationDocuments(s.id),
      user: marketplaceStore.findUserById(s.user_id),
    }));

    return res.status(200).json({
      status: 'success',
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error('[ADMIN PENDING SELLERS ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to load pending sellers.',
    });
  }
});

/**
 * POST /api/v1/marketplace/admin/verify-seller/:id
 * Approve or reject seller application
 */
router.post('/verify-seller/:id', (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: "Status must be 'approved', 'rejected', or 'pending'.",
      });
    }

    const updated = marketplaceStore.updateSellerProfile(req.params.id, {
      verification_status: status,
      is_verified_badge: status === 'approved',
      verification_notes: notes || (status === 'approved' ? 'Verified by AgriSphere Admin' : 'Application rejected'),
    });

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Seller profile not found.' });
    }

    return res.status(200).json({
      status: 'success',
      message: `Seller status updated to ${status}.`,
      data: updated,
    });
  } catch (error) {
    console.error('[ADMIN VERIFY SELLER ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to verify seller.',
    });
  }
});

/**
 * GET /api/v1/marketplace/admin/pending-shops
 * List community suggested shops awaiting verification
 */
router.get('/pending-shops', (req, res) => {
  try {
    const shops = marketplaceStore.listShops().filter((s) => !s.is_verified);
    return res.status(200).json({
      status: 'success',
      count: shops.length,
      data: shops,
    });
  } catch (error) {
    console.error('[ADMIN PENDING SHOPS ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to load pending shops.',
    });
  }
});

/**
 * POST /api/v1/marketplace/admin/verify-shop/:id
 * Verify community shop
 */
router.post('/verify-shop/:id', (req, res) => {
  try {
    const { verified = true } = req.body;
    const shop = marketplaceStore.verifyShop(req.params.id, Boolean(verified));
    if (!shop) {
      return res.status(404).json({ status: 'error', message: 'Shop not found.' });
    }

    return res.status(200).json({
      status: 'success',
      message: `Shop ${verified ? 'approved and verified' : 'unverified'}.`,
      data: shop,
    });
  } catch (error) {
    console.error('[ADMIN VERIFY SHOP ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update shop status.',
    });
  }
});

/**
 * GET /api/v1/marketplace/admin/orders
 * All orders across the platform
 */
router.get('/orders', (req, res) => {
  try {
    const orders = marketplaceStore.listAllOrders();
    return res.status(200).json({
      status: 'success',
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('[ADMIN ORDERS ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to load platform orders.',
    });
  }
});

export default router;
