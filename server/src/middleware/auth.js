import jwt from 'jsonwebtoken';
import marketplaceStore from '../db/marketplaceStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'agrisphere-dev-secret-key-2026';

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication token is required to access this resource.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = marketplaceStore.findUserById(decoded.userId || decoded.id);

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid session or user no longer exists.',
      });
    }

    req.user = user;
    req.sellerProfile = marketplaceStore.findSellerProfileByUserId(user.id);
    next();
  } catch (err) {
    return res.status(403).json({
      status: 'error',
      message: 'Invalid or expired authentication token.',
    });
  }
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = marketplaceStore.findUserById(decoded.userId || decoded.id);
      if (user) {
        req.user = user;
        req.sellerProfile = marketplaceStore.findSellerProfileByUserId(user.id);
      }
    } catch {
      // ignore optional auth errors
    }
  }
  next();
};

export const requireRole = (allowedRoles) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required.',
      });
    }

    const userRole = req.user.role;
    const isSeller = ['farmer', 'shop', 'fpo', 'supplier'].includes(userRole);
    
    // Check if role matches directly or matches 'seller' generic role
    const hasRole = roles.includes(userRole) || (roles.includes('seller') && isSeller);

    if (!hasRole && userRole !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: `Forbidden: This action requires one of the following roles: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Access restricted to AgriSphere platform administrators.',
    });
  }
  next();
};
