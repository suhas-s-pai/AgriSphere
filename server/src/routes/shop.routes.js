import { Router } from 'express';
import marketplaceStore from '../db/marketplaceStore.js';
import { optionalAuth, authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/v1/marketplace/shops
 * Discover genuine verified agricultural shops with location proximity
 */
router.get('/', optionalAuth, (req, res) => {
  try {
    const { category, district, userLat, userLng, maxDistanceKm } = req.query;

    const lat = userLat ? Number(userLat) : null;
    const lng = userLng ? Number(userLng) : null;

    const shops = marketplaceStore.listShops({
      category,
      district,
      userLat: lat,
      userLng: lng,
      maxDistanceKm,
    });

    return res.status(200).json({
      status: 'success',
      count: shops.length,
      data: shops,
    });
  } catch (error) {
    console.error('[LIST SHOPS ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to retrieve agricultural shops.',
    });
  }
});

/**
 * POST /api/v1/marketplace/shops/suggest
 * Submit unlisted agricultural shop for AgriSphere verification
 */
router.post('/suggest', optionalAuth, (req, res) => {
  try {
    const {
      name,
      category,
      shop_type,
      address,
      district,
      state,
      pincode,
      contact,
      operating_hours,
      latitude,
      longitude,
      inventory_summary,
    } = req.body;

    if (!name || !address || !district || latitude == null || longitude == null) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, address, district, latitude, and longitude are required to list a shop.',
      });
    }

    const shop = marketplaceStore.addShop({
      name,
      category: category || 'General Agricultural Depot',
      shop_type: shop_type || 'Retail Agri Input Store',
      address,
      district,
      state: state || 'Karnataka',
      pincode,
      contact,
      operating_hours,
      latitude: Number(latitude),
      longitude: Number(longitude),
      inventory_summary: Array.isArray(inventory_summary) ? inventory_summary : [inventory_summary || 'Seeds, Fertilizers, Sprayers'],
    });

    return res.status(201).json({
      status: 'success',
      message: 'Agricultural shop submitted successfully. Our team will verify and list it.',
      data: shop,
    });
  } catch (error) {
    console.error('[SUGGEST SHOP ERROR]', error);
    return res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to submit shop.',
    });
  }
});

/**
 * POST /api/v1/marketplace/shops/verify/:id
 * Admin verification endpoint
 */
router.post('/verify/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { verified = true } = req.body;
    const shop = marketplaceStore.verifyShop(req.params.id, verified);
    if (!shop) {
      return res.status(404).json({ status: 'error', message: 'Shop not found.' });
    }
    return res.status(200).json({
      status: 'success',
      message: `Shop has been ${verified ? 'verified and activated' : 'marked unverified'}.`,
      data: shop,
    });
  } catch (error) {
    console.error('[VERIFY SHOP ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update shop verification.',
    });
  }
});

export default router;
