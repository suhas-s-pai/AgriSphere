import { Router } from 'express';
import marketplaceStore from '../db/marketplaceStore.js';
import { authenticateToken, optionalAuth, requireRole } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/v1/marketplace/products/categories
 * List all 10 standardized categories
 */
router.get('/categories', (req, res) => {
  const categories = marketplaceStore.listCategories();
  return res.status(200).json({
    status: 'success',
    count: categories.length,
    data: categories,
  });
});

/**
 * GET /api/v1/marketplace/products
 * Query products with multi-attribute filtering & sorting
 */
router.get('/', optionalAuth, (req, res) => {
  const {
    category,
    district,
    search,
    minPrice,
    maxPrice,
    inStockOnly,
    isHarvestedProduce,
    userLat,
    userLng,
    maxDistanceKm,
    sort,
    sellerId,
  } = req.query;

  const lat = userLat ? Number(userLat) : null;
  const lng = userLng ? Number(userLng) : null;

  const products = marketplaceStore.listProducts({
    category,
    district,
    search,
    minPrice,
    maxPrice,
    inStockOnly: inStockOnly === 'true',
    isHarvestedProduce: isHarvestedProduce !== undefined ? isHarvestedProduce === 'true' : undefined,
    userLat: lat,
    userLng: lng,
    maxDistanceKm,
    sort,
    sellerId,
  });

  return res.status(200).json({
    status: 'success',
    count: products.length,
    data: products,
  });
});

/**
 * GET /api/v1/marketplace/products/:id
 * Retrieve single product details with gallery, reviews, and seller credentials
 */
router.get('/:id', optionalAuth, (req, res) => {
  const { userLat, userLng } = req.query;
  const lat = userLat ? Number(userLat) : null;
  const lng = userLng ? Number(userLng) : null;

  const product = marketplaceStore.findProductById(req.params.id, { userLat: lat, userLng: lng });
  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product listing not found.',
    });
  }

  return res.status(200).json({
    status: 'success',
    data: product,
  });
});

/**
 * POST /api/v1/marketplace/products
 * Create product (Restricted to authenticated sellers: farmer, shop, fpo, supplier)
 */
router.post('/', authenticateToken, requireRole(['farmer', 'shop', 'fpo', 'supplier', 'seller']), (req, res) => {
  try {
    if (!req.sellerProfile) {
      return res.status(403).json({
        status: 'error',
        message: 'Active seller profile required to post product listings.',
      });
    }

    const {
      category_id,
      title,
      description,
      price,
      unit,
      min_order_quantity,
      initial_stock = 10,
      image_urls = [],
      is_harvested_produce = false,
      crop_name,
      variety,
      quality_grade,
      harvest_date,
      moisture_percentage,
      wholesale_price,
      retail_price,
      latitude,
      longitude,
    } = req.body;

    if (!category_id || !title || !price || !unit) {
      return res.status(400).json({
        status: 'error',
        message: 'category_id, title, price, and unit are mandatory fields.',
      });
    }

    const newProduct = marketplaceStore.createProduct(
      {
        seller_id: req.sellerProfile.id,
        category_id,
        title,
        description: description || 'No detailed description provided.',
        price,
        unit,
        min_order_quantity,
        location_district: req.sellerProfile.district,
        location_state: req.sellerProfile.state,
        latitude: latitude ?? req.sellerProfile.latitude,
        longitude: longitude ?? req.sellerProfile.longitude,
        contact_number: req.sellerProfile.contact_number,
        is_harvested_produce,
        crop_name,
        variety,
        quality_grade,
        harvest_date,
        moisture_percentage,
        wholesale_price,
        retail_price,
      },
      initial_stock,
      image_urls
    );

    return res.status(201).json({
      status: 'success',
      message: 'Product listing published successfully.',
      data: newProduct,
    });
  } catch (error) {
    console.error('[CREATE PRODUCT ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to create product listing.',
    });
  }
});

/**
 * PUT /api/v1/marketplace/products/:id
 * Update listing (Restricted to owner seller)
 */
router.put('/:id', authenticateToken, requireRole(['farmer', 'shop', 'fpo', 'supplier', 'seller']), (req, res) => {
  try {
    if (!req.sellerProfile) {
      return res.status(403).json({
        status: 'error',
        message: 'Seller profile required.',
      });
    }

    const updated = marketplaceStore.updateProduct(req.params.id, req.sellerProfile.id, req.body);
    if (!updated) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found or you are not authorized to edit this listing.',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Product listing updated successfully.',
      data: updated,
    });
  } catch (error) {
    console.error('[UPDATE PRODUCT ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update product.',
    });
  }
});

/**
 * DELETE /api/v1/marketplace/products/:id
 * Delete listing (Restricted to owner seller)
 */
router.delete('/:id', authenticateToken, requireRole(['farmer', 'shop', 'fpo', 'supplier', 'seller']), (req, res) => {
  try {
    if (!req.sellerProfile) {
      return res.status(403).json({
        status: 'error',
        message: 'Seller profile required.',
      });
    }

    const deleted = marketplaceStore.deleteProduct(req.params.id, req.sellerProfile.id);
    if (!deleted) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found or you are not authorized to delete this listing.',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Product listing deleted successfully.',
    });
  } catch (error) {
    console.error('[DELETE PRODUCT ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to delete product.',
    });
  }
});

export default router;
