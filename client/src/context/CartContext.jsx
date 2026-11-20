import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi, productApi } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    has_out_of_stock: false,
    has_exceeded_stock: false,
  });
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Load cart from backend (if logged in) or local guest storage
  const fetchCart = useCallback(async () => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        const res = await cartApi.getCart();
        if (res.data?.status === 'success') {
          setCart(res.data.data);
        }
      } catch (err) {
        console.warn('Failed to fetch user cart from server:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Load guest cart from localStorage
      try {
        const raw = localStorage.getItem('agrisphere_guest_cart');
        const guestItems = raw ? JSON.parse(raw) : [];
        const subtotal = guestItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setCart({
          items: guestItems,
          subtotal,
          has_out_of_stock: false,
          has_exceeded_stock: false,
        });
      } catch (e) {
        console.error('Error reading guest cart:', e);
      }
    }
  }, [isAuthenticated]);

  // Sync guest cart to backend upon login
  useEffect(() => {
    const syncGuestCart = async () => {
      if (isAuthenticated) {
        try {
          const raw = localStorage.getItem('agrisphere_guest_cart');
          const guestItems = raw ? JSON.parse(raw) : [];
          if (guestItems.length > 0) {
            for (const item of guestItems) {
              await cartApi.addToCart(item.product_id, item.quantity);
            }
            localStorage.removeItem('agrisphere_guest_cart');
          }
        } catch (e) {
          console.warn('Failed to sync guest cart:', e);
        }
        fetchCart();
      } else {
        fetchCart();
      }
    };
    syncGuestCart();
  }, [isAuthenticated, fetchCart]);

  const addToCart = async (product, quantity = 1) => {
    const qty = Math.max(product.min_order_quantity || 1, Number(quantity));

    if (isAuthenticated) {
      try {
        await cartApi.addToCart(product.id, qty);
        await fetchCart();
        setIsCartOpen(true);
        return { success: true };
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to add item to cart.';
        alert(msg);
        return { success: false, message: msg };
      }
    } else {
      // Guest local storage cart
      try {
        const raw = localStorage.getItem('agrisphere_guest_cart');
        let guestItems = raw ? JSON.parse(raw) : [];
        const existingIdx = guestItems.findIndex((i) => i.product_id === product.id);

        if (existingIdx !== -1) {
          guestItems[existingIdx].quantity += qty;
        } else {
          guestItems.push({
            id: `guest-item-${Date.now()}`,
            product_id: product.id,
            title: product.title,
            price: product.price,
            unit: product.unit,
            quantity: qty,
            total_price: product.price * qty,
            image_url: product.image_url || product.images?.[0],
            available_quantity: product.available_quantity ?? product.stock_quantity ?? 10,
            min_order_quantity: product.min_order_quantity || 1,
            seller_id: product.seller_id,
            seller_name: product.seller_name || 'AgriSphere Seller',
          });
        }
        localStorage.setItem('agrisphere_guest_cart', JSON.stringify(guestItems));
        const subtotal = guestItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setCart({
          items: guestItems,
          subtotal,
          has_out_of_stock: false,
          has_exceeded_stock: false,
        });
        setIsCartOpen(true);
        return { success: true };
      } catch (e) {
        console.error('Guest cart save error:', e);
        return { success: false, message: e.message };
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (isAuthenticated) {
      try {
        await cartApi.updateCart(productId, quantity);
        await fetchCart();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to update quantity.');
      }
    } else {
      const raw = localStorage.getItem('agrisphere_guest_cart');
      let guestItems = raw ? JSON.parse(raw) : [];
      if (quantity <= 0) {
        guestItems = guestItems.filter((i) => i.product_id !== productId);
      } else {
        const item = guestItems.find((i) => i.product_id === productId);
        if (item) {
          item.quantity = quantity;
          item.total_price = item.price * quantity;
        }
      }
      localStorage.setItem('agrisphere_guest_cart', JSON.stringify(guestItems));
      const subtotal = guestItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setCart({
        items: guestItems,
        subtotal,
        has_out_of_stock: false,
        has_exceeded_stock: false,
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        await cartApi.removeFromCart(productId);
        await fetchCart();
      } catch (err) {
        console.error('Remove item error:', err);
      }
    } else {
      const raw = localStorage.getItem('agrisphere_guest_cart');
      let guestItems = raw ? JSON.parse(raw) : [];
      guestItems = guestItems.filter((i) => i.product_id !== productId);
      localStorage.setItem('agrisphere_guest_cart', JSON.stringify(guestItems));
      const subtotal = guestItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setCart({
        items: guestItems,
        subtotal,
        has_out_of_stock: false,
        has_exceeded_stock: false,
      });
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartApi.clearCart();
        await fetchCart();
      } catch (err) {
        console.error('Clear cart error:', err);
      }
    } else {
      localStorage.removeItem('agrisphere_guest_cart');
      setCart({
        items: [],
        subtotal: 0,
        has_out_of_stock: false,
        has_exceeded_stock: false,
      });
    }
  };

  const totalItemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        totalItemCount,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
        isCheckoutOpen,
        openCheckout: () => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        },
        closeCheckout: () => setIsCheckoutOpen(false),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
