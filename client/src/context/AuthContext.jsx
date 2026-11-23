import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, sellerApi } from '../services/api.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'agrisphere_auth_token';
const USER_KEY = 'agrisphere_auth_user';
const SELLER_KEY = 'agrisphere_auth_seller';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [sellerProfile, setSellerProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(SELLER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [authModalState, setAuthModalState] = useState({
    isOpen: false,
    mode: 'login', // 'login' or 'register'
    initialRole: 'buyer', // 'farmer', 'shop', 'buyer', 'fpo'
  });

  // Verify session on mount if token exists
  useEffect(() => {
    if (token) {
      authApi.getMe()
        .then((res) => {
          if (res?.data?.data) {
            const { user: refreshedUser, sellerProfile: refreshedSeller } = res.data.data;
            setUser(refreshedUser);
            setSellerProfile(refreshedSeller);
            localStorage.setItem(USER_KEY, JSON.stringify(refreshedUser));
            if (refreshedSeller) {
              localStorage.setItem(SELLER_KEY, JSON.stringify(refreshedSeller));
            } else {
              localStorage.removeItem(SELLER_KEY);
            }
          }
        })
        .catch(() => {
          // Token invalid or expired
          logout();
        });
    }
  }, [token]);

  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ identifier, password });
      const { token: newToken, user: newUser, sellerProfile: newSeller } = res.data.data;

      setToken(newToken);
      setUser(newUser);
      setSellerProfile(newSeller || null);

      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      if (newSeller) {
        localStorage.setItem(SELLER_KEY, JSON.stringify(newSeller));
      } else {
        localStorage.removeItem(SELLER_KEY);
      }

      closeAuthModal();
      return { success: true, user: newUser, sellerProfile: newSeller };
    } catch (error) {
      const msg = error?.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await authApi.register(formData);
      const { token: newToken, user: newUser, sellerProfile: newSeller } = res.data.data;

      setToken(newToken);
      setUser(newUser);
      setSellerProfile(newSeller || null);

      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      if (newSeller) {
        localStorage.setItem(SELLER_KEY, JSON.stringify(newSeller));
      } else {
        localStorage.removeItem(SELLER_KEY);
      }

      closeAuthModal();
      return { success: true, user: newUser, sellerProfile: newSeller };
    } catch (error) {
      const msg = error?.response?.data?.message || 'Registration failed. Please verify the entered information.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const res = await authApi.forgotPassword({ email });
      return { success: true, message: res?.data?.message || 'Password reset instructions have been sent.' };
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to send password reset request. Please check the email address.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setSellerProfile(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(SELLER_KEY);
    } catch {
      // ignore
    }
  };

  const upgradeToSeller = async (sellerData) => {
    setLoading(true);
    try {
      const res = await authApi.upgradeToSeller(sellerData);
      const { user: updatedUser, sellerProfile: newSeller } = res.data.data;

      setUser(updatedUser);
      setSellerProfile(newSeller);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      localStorage.setItem(SELLER_KEY, JSON.stringify(newSeller));

      return { success: true, sellerProfile: newSeller };
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to create seller profile.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const updateSellerProfile = async (updates) => {
    setLoading(true);
    try {
      const res = await sellerApi.updateProfile(updates);
      const updatedSeller = res.data.data;
      setSellerProfile(updatedSeller);
      localStorage.setItem(SELLER_KEY, JSON.stringify(updatedSeller));
      return { success: true, sellerProfile: updatedSeller };
    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to update seller profile.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const submitDocument = async (docData) => {
    try {
      const res = await sellerApi.uploadDocument(docData);
      return { success: true, document: res.data.data };
    } catch (error) {
      return { success: false, message: error?.response?.data?.message || 'Document submission failed.' };
    }
  };

  const openAuthModal = useCallback((mode = 'login', initialRole = 'buyer') => {
    setAuthModalState({
      isOpen: true,
      mode,
      initialRole,
    });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const isSeller = Boolean(user && ['farmer', 'shop', 'fpo', 'supplier'].includes(user.role));
  const isVerifiedSeller = Boolean(sellerProfile && sellerProfile.verification_status === 'approved' && sellerProfile.is_verified_badge);
  const isAuthenticated = Boolean(token && user);

  const value = {
    user,
    sellerProfile,
    token,
    isAuthenticated,
    isSeller,
    isVerifiedSeller,
    role: user?.role || 'guest',
    loading,
    authModalState,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    forgotPassword,
    logout,
    upgradeToSeller,
    updateSellerProfile,
    submitDocument,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
