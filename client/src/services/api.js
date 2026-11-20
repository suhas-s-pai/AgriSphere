import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor to automatically attach JWT auth token
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('agrisphere_auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('AgriSphere API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const checkBackendHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.warn('Backend server is currently offline or unreachable.');
    return { status: 'offline', message: 'Backend unreachable' };
  }
};

// Authentication Endpoints
export const authApi = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getMe: () => apiClient.get('/auth/me'),
  upgradeToSeller: (sellerData) => apiClient.post('/auth/upgrade-to-seller', sellerData),
};

// Seller Profile Endpoints
export const sellerApi = {
  listSellers: (params) => apiClient.get('/marketplace/sellers', { params }),
  getProfile: () => apiClient.get('/marketplace/sellers/profile'),
  updateProfile: (data) => apiClient.put('/marketplace/sellers/profile', data),
  uploadDocument: (data) => apiClient.post('/marketplace/sellers/documents', data),
  getSellerById: (id) => apiClient.get(`/marketplace/sellers/${id}`),
};

// Marketplace Products Endpoints
export const productApi = {
  getCategories: () => apiClient.get('/marketplace/products/categories'),
  listProducts: (params) => apiClient.get('/marketplace/products', { params }),
  getProduct: (id, params) => apiClient.get(`/marketplace/products/${id}`, { params }),
  createProduct: (data) => apiClient.post('/marketplace/products', data),
  updateProduct: (id, data) => apiClient.put(`/marketplace/products/${id}`, data),
  deleteProduct: (id) => apiClient.delete(`/marketplace/products/${id}`),
};

// Shopping Cart Endpoints
export const cartApi = {
  getCart: () => apiClient.get('/marketplace/cart'),
  addToCart: (productId, quantity = 1) => apiClient.post('/marketplace/cart/add', { productId, quantity }),
  updateCart: (productId, quantity) => apiClient.put('/marketplace/cart/update', { productId, quantity }),
  removeFromCart: (productId) => apiClient.delete(`/marketplace/cart/remove/${productId}`),
  clearCart: () => apiClient.delete('/marketplace/cart/clear'),
};

// Orders Endpoints
export const orderApi = {
  createOrder: (orderData) => apiClient.post('/marketplace/orders/create', orderData),
  getBuyerOrders: () => apiClient.get('/marketplace/orders/buyer'),
  getSellerOrders: () => apiClient.get('/marketplace/orders/seller'),
  getOrder: (id) => apiClient.get(`/marketplace/orders/${id}`),
  updateStatus: (id, statusData) => apiClient.put(`/marketplace/orders/${id}/status`, statusData),
};

// Payments & Razorpay Integration
export const paymentApi = {
  getConfig: () => apiClient.get('/marketplace/payments/config'),
  createRazorpayOrder: (data) => apiClient.post('/marketplace/payments/create-razorpay-order', data),
  verifyRazorpaySignature: (data) => apiClient.post('/marketplace/payments/verify-razorpay-signature', data),
  confirmCod: (data) => apiClient.post('/marketplace/payments/cod-confirm', data),
};

// Reviews Endpoints
export const reviewApi = {
  getProductReviews: (productId) => apiClient.get(`/marketplace/reviews/product/${productId}`),
  addReview: (reviewData) => apiClient.post('/marketplace/reviews', reviewData),
};

// Nearby Agricultural Shops Endpoints
export const shopApi = {
  listShops: (params) => apiClient.get('/marketplace/shops', { params }),
  suggestShop: (shopData) => apiClient.post('/marketplace/shops/suggest', shopData),
  verifyShop: (id, verified) => apiClient.post(`/marketplace/shops/verify/${id}`, { verified }),
};

// Saved Delivery Addresses
export const addressApi = {
  getAddresses: () => apiClient.get('/marketplace/addresses'),
  addAddress: (addressData) => apiClient.post('/marketplace/addresses', addressData),
  deleteAddress: (id) => apiClient.delete(`/marketplace/addresses/${id}`),
};

// Admin Moderation & Operations
export const adminApi = {
  getStats: () => apiClient.get('/marketplace/admin/stats'),
  getPendingSellers: () => apiClient.get('/marketplace/admin/pending-sellers'),
  verifySeller: (id, data) => apiClient.post(`/marketplace/admin/verify-seller/${id}`, data),
  getPendingShops: () => apiClient.get('/marketplace/admin/pending-shops'),
  verifyShop: (id, data) => apiClient.post(`/marketplace/admin/verify-shop/${id}`, data),
  getAllOrders: () => apiClient.get('/marketplace/admin/orders'),
};

export default apiClient;

