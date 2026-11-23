import { Router } from 'express';
import bcrypt from 'bcryptjs';
import marketplaceStore from '../db/marketplaceStore.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/v1/auth/register
 * Register a new user as:
 * 1. Farmer / Individual Seller ('farmer')
 * 2. Agricultural Shop / Supplier ('shop' or 'supplier')
 * 3. Buyer ('buyer')
 * 4. Farmer Producer Organization ('fpo')
 */
router.post('/register', async (req, res) => {
  try {
    const {
      full_name,
      email,
      mobile_number,
      password,
      role = 'buyer',
      district = 'Belagavi',
      state = 'Karnataka',
      pincode,
      // Optional seller specific registration payload
      business_name,
      seller_type,
      address,
      village,
      taluk,
      gstin,
    } = req.body;

    if (!full_name || !password || (!email && !mobile_number)) {
      return res.status(400).json({
        status: 'error',
        message: 'Full name, password, and at least an email or mobile number are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check if user already exists
    const existing =
      (email && marketplaceStore.findUserByEmailOrPhone(email)) ||
      (mobile_number && marketplaceStore.findUserByEmailOrPhone(mobile_number));

    if (existing) {
      return res.status(409).json({
        status: 'error',
        message: 'An account with this email or mobile number already exists. Please log in instead.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = marketplaceStore.createUser({
      full_name,
      email,
      mobile_number,
      password_hash,
      role,
      district,
      state,
      pincode,
    });

    let sellerProfile = null;
    const isSellerRole = ['farmer', 'shop', 'fpo', 'supplier'].includes(role);

    if (isSellerRole) {
      sellerProfile = marketplaceStore.createSellerProfile({
        user_id: user.id,
        seller_type: seller_type || role,
        business_name: business_name || `${full_name}'s Farm/Store`,
        contact_number: mobile_number || user.mobile_number,
        email: email || user.email,
        address: address || `${village || district}, ${state}`,
        village: village || null,
        taluk: taluk || null,
        district: district || 'Belagavi',
        state: state || 'Karnataka',
        pincode: pincode || '590001',
        gstin: gstin || null,
        verification_status: 'pending',
        is_verified_badge: false,
      });
    }

    const token = generateToken({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    const safeUser = { ...user };
    delete safeUser.password_hash;

    return res.status(201).json({
      status: 'success',
      message: 'Account registered successfully.',
      data: {
        token,
        user: safeUser,
        sellerProfile,
      },
    });
  } catch (error) {
    console.error('[AUTH REGISTER ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: 'Registration failed due to a server error.',
    });
  }
});

/**
 * POST /api/v1/auth/login
 * Log in using email or mobile number and password
 */
router.post('/login', async (req, res) => {
  try {
    const identifier = req.body.identifier || req.body.email || req.body.mobile_number;
    const { password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email/Mobile number and password are required.',
      });
    }

    const user = marketplaceStore.findUserByEmailOrPhone(identifier);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'No account found matching this email or mobile number.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect password. Please try again.',
      });
    }

    const sellerProfile = marketplaceStore.findSellerProfileByUserId(user.id);

    const token = generateToken({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    const safeUser = { ...user };
    delete safeUser.password_hash;

    return res.status(200).json({
      status: 'success',
      message: 'Logged in successfully.',
      data: {
        token,
        user: safeUser,
        sellerProfile,
      },
    });
  } catch (error) {
    console.error('[AUTH LOGIN ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authentication failed due to a server error.',
    });
  }
});

/**
 * GET /api/v1/auth/me
 * Retrieve the current authenticated user & seller profile
 */
router.get('/me', authenticateToken, (req, res) => {
  const safeUser = { ...req.user };
  delete safeUser.password_hash;

  return res.status(200).json({
    status: 'success',
    data: {
      user: safeUser,
      sellerProfile: req.sellerProfile,
    },
  });
});

/**
 * POST /api/v1/auth/upgrade-to-seller
 * Upgrade an existing buyer account to Farmer, Shop, or FPO seller
 */
router.post('/upgrade-to-seller', authenticateToken, (req, res) => {
  try {
    const existingSeller = marketplaceStore.findSellerProfileByUserId(req.user.id);
    if (existingSeller) {
      return res.status(400).json({
        status: 'error',
        message: 'You already have an active seller profile.',
        data: { sellerProfile: existingSeller },
      });
    }

    const {
      seller_type = 'farmer',
      business_name,
      contact_number,
      address,
      village,
      taluk,
      district,
      state,
      pincode,
      gstin,
    } = req.body;

    if (!business_name || !contact_number || !address || !district || !pincode) {
      return res.status(400).json({
        status: 'error',
        message: 'Business/Farm name, contact number, address, district, and pincode are required.',
      });
    }

    // Update user role to the chosen seller type
    req.user.role = seller_type;
    req.user.updated_at = new Date().toISOString();
    marketplaceStore.persist();

    const sellerProfile = marketplaceStore.createSellerProfile({
      user_id: req.user.id,
      seller_type,
      business_name,
      contact_number,
      email: req.user.email,
      address,
      village,
      taluk,
      district,
      state: state || 'Karnataka',
      pincode,
      gstin: gstin || null,
      verification_status: 'pending',
      is_verified_badge: false,
    });

    const safeUser = { ...req.user };
    delete safeUser.password_hash;

    return res.status(201).json({
      status: 'success',
      message: 'Upgraded to seller successfully! Verification is pending.',
      data: {
        user: safeUser,
        sellerProfile,
      },
    });
  } catch (error) {
    console.error('[UPGRADE SELLER ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to create seller profile.',
    });
  }
});

/**
 * POST /api/v1/auth/forgot-password
 * Request password recovery instructions for registered email
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid registered email address.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = marketplaceStore.findUserByEmailOrPhone(cleanEmail);

    // Note: Ready for future Supabase Authentication dispatch:
    // await supabase.auth.resetPasswordForEmail(cleanEmail, { redirectTo: `${CLIENT_URL}/reset-password` });

    return res.status(200).json({
      status: 'success',
      message: `Password reset instructions have been dispatched to ${cleanEmail}.`,
      data: {
        email: cleanEmail,
        userExists: Boolean(user),
      },
    });
  } catch (error) {
    console.error('[AUTH FORGOT PASSWORD ERROR]', error);
    return res.status(500).json({
      status: 'error',
      message: 'Password reset request failed due to a server error.',
    });
  }
});

export default router;
