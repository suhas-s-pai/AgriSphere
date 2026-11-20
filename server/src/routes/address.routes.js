import { Router } from 'express';
import marketplaceStore from '../db/marketplaceStore.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

/**
 * GET /api/v1/marketplace/addresses
 * List user's saved delivery addresses
 */
router.get('/', (req, res) => {
  try {
    const addresses = marketplaceStore.getDeliveryAddresses(req.user.id);
    return res.status(200).json({
      status: 'success',
      count: addresses.length,
      data: addresses,
    });
  } catch (error) {
    console.error('[GET ADDRESSES ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch delivery addresses.',
    });
  }
});

/**
 * POST /api/v1/marketplace/addresses
 * Add a new delivery address
 */
router.post('/', (req, res) => {
  try {
    const {
      recipient_name,
      phone_number,
      address_line1,
      address_line2,
      landmark,
      village_or_city,
      district,
      state,
      pincode,
      is_default,
    } = req.body;

    if (!recipient_name || !phone_number || !address_line1 || !village_or_city || !district || !pincode) {
      return res.status(400).json({
        status: 'error',
        message: 'recipient_name, phone_number, address_line1, village_or_city, district, and pincode are required.',
      });
    }

    const address = marketplaceStore.addDeliveryAddress(req.user.id, {
      recipient_name,
      phone_number,
      address_line1,
      address_line2,
      landmark,
      village_or_city,
      district,
      state: state || 'Karnataka',
      pincode,
      is_default,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Delivery address saved successfully.',
      data: address,
    });
  } catch (error) {
    console.error('[ADD ADDRESS ERROR]', error);
    return res.status(400).json({
      status: 'error',
      message: error.message || 'Failed to save address.',
    });
  }
});

/**
 * DELETE /api/v1/marketplace/addresses/:id
 * Delete a saved delivery address
 */
router.delete('/:id', (req, res) => {
  try {
    const deleted = marketplaceStore.deleteDeliveryAddress(req.user.id, req.params.id);
    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Address not found or unauthorized.' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Address deleted successfully.',
    });
  } catch (error) {
    console.error('[DELETE ADDRESS ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to delete address.',
    });
  }
});

export default router;
