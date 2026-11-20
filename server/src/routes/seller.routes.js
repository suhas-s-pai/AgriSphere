import { Router } from 'express';
import marketplaceStore from '../db/marketplaceStore.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/v1/marketplace/sellers
 * Browse approved sellers (with district filtering)
 */
router.get('/', (req, res) => {
  const { district, status = 'approved' } = req.query;
  const sellers = marketplaceStore.listSellers({ status, district });
  return res.status(200).json({
    status: 'success',
    count: sellers.length,
    data: sellers,
  });
});

/**
 * GET /api/v1/marketplace/sellers/profile
 * Get current authenticated seller profile and documents
 */
router.get('/profile', authenticateToken, (req, res) => {
  if (!req.sellerProfile) {
    return res.status(404).json({
      status: 'error',
      message: 'No seller profile found for current user.',
    });
  }

  const documents = marketplaceStore.getVerificationDocuments(req.sellerProfile.id);

  return res.status(200).json({
    status: 'success',
    data: {
      sellerProfile: req.sellerProfile,
      documents,
    },
  });
});

/**
 * PUT /api/v1/marketplace/sellers/profile
 * Update current seller's own profile
 */
router.put('/profile', authenticateToken, (req, res) => {
  if (!req.sellerProfile) {
    return res.status(404).json({
      status: 'error',
      message: 'No seller profile found for current user.',
    });
  }

  const {
    business_name,
    contact_number,
    address,
    village,
    taluk,
    district,
    state,
    pincode,
    gstin,
    bank_account_number,
    bank_ifsc,
    latitude,
    longitude,
  } = req.body;

  // Prevent users from self-verifying: verification_status cannot be updated here
  const updated = marketplaceStore.updateSellerProfile(req.sellerProfile.id, {
    business_name: business_name || req.sellerProfile.business_name,
    contact_number: contact_number || req.sellerProfile.contact_number,
    address: address || req.sellerProfile.address,
    village: village !== undefined ? village : req.sellerProfile.village,
    taluk: taluk !== undefined ? taluk : req.sellerProfile.taluk,
    district: district || req.sellerProfile.district,
    state: state || req.sellerProfile.state,
    pincode: pincode || req.sellerProfile.pincode,
    gstin: gstin !== undefined ? gstin : req.sellerProfile.gstin,
    bank_account_number: bank_account_number !== undefined ? bank_account_number : req.sellerProfile.bank_account_number,
    bank_ifsc: bank_ifsc !== undefined ? bank_ifsc : req.sellerProfile.bank_ifsc,
    latitude: latitude !== undefined ? Number(latitude) : req.sellerProfile.latitude,
    longitude: longitude !== undefined ? Number(longitude) : req.sellerProfile.longitude,
  });

  return res.status(200).json({
    status: 'success',
    message: 'Seller profile updated successfully.',
    data: updated,
  });
});

/**
 * POST /api/v1/marketplace/sellers/documents
 * Submit verification document (Aadhaar, RTC/Pahani, Trade License, FPO Registration)
 */
router.post('/documents', authenticateToken, (req, res) => {
  if (!req.sellerProfile) {
    return res.status(404).json({
      status: 'error',
      message: 'Seller profile required to submit verification documents.',
    });
  }

  const { document_type, document_url, document_name } = req.body;

  if (!document_type || !document_url) {
    return res.status(400).json({
      status: 'error',
      message: 'document_type and document_url are required.',
    });
  }

  const newDoc = marketplaceStore.addVerificationDocument({
    seller_id: req.sellerProfile.id,
    document_type,
    document_url,
    document_name: document_name || document_type,
  });

  return res.status(201).json({
    status: 'success',
    message: 'Verification document submitted successfully.',
    data: newDoc,
  });
});

/**
 * GET /api/v1/marketplace/sellers/admin/pending
 * Admin endpoint: List all sellers awaiting verification review
 */
router.get('/admin/pending', authenticateToken, requireAdmin, (req, res) => {
  const pendingSellers = marketplaceStore.listSellers({ status: 'pending' });
  const enriched = pendingSellers.map((seller) => ({
    ...seller,
    documents: marketplaceStore.getVerificationDocuments(seller.id),
  }));

  return res.status(200).json({
    status: 'success',
    count: enriched.length,
    data: enriched,
  });
});

/**
 * POST /api/v1/marketplace/sellers/admin/:id/verify
 * Admin endpoint: Approve or reject seller verification
 */
router.post('/admin/:id/verify', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({
      status: 'error',
      message: 'Status must be approved, rejected, or pending.',
    });
  }

  const isVerifiedBadge = status === 'approved';

  const updated = marketplaceStore.updateSellerProfile(id, {
    verification_status: status,
    verification_notes: notes || null,
    is_verified_badge: isVerifiedBadge,
  });

  if (!updated) {
    return res.status(404).json({
      status: 'error',
      message: 'Seller profile not found.',
    });
  }

  return res.status(200).json({
    status: 'success',
    message: `Seller verification status set to ${status}.`,
    data: updated,
  });
});

/**
 * GET /api/v1/marketplace/sellers/:id
 * Retrieve specific seller profile by ID
 */
router.get('/:id', (req, res) => {
  const seller = marketplaceStore.findSellerProfileById(req.params.id);
  if (!seller) {
    return res.status(404).json({
      status: 'error',
      message: 'Seller not found.',
    });
  }

  return res.status(200).json({
    status: 'success',
    data: seller,
  });
});

export default router;
