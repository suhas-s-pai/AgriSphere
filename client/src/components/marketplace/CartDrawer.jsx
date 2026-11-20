import React from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    openCheckout,
    totalItemCount,
  } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 2000;
  const isFreeDelivery = cart.subtotal >= freeDeliveryThreshold;
  const deliveryCharge = cart.items.length === 0 ? 0 : isFreeDelivery ? 0 : 60;
  const grandTotal = cart.subtotal + deliveryCharge;

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      closeCart();
      openAuthModal('buyer');
      return;
    }
    openCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-emerald-800 text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-300" />
              <h2 className="font-bold text-lg">My Agri Cart</h2>
              <span className="bg-emerald-700/80 text-xs px-2 py-0.5 rounded-full font-medium">
                {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">Your cart is empty</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Browse certified seeds, organic fertilizers, farming machinery and fresh farm produce.
                </p>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-medium text-sm hover:bg-emerald-800 transition"
                >
                  Start Browsing
                </button>
              </div>
            ) : (
              <>
                {/* Out of stock warning banner */}
                {(cart.has_out_of_stock || cart.has_exceeded_stock) && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p>
                      Some items exceed current stock or are out of stock. Please adjust quantities before checkout.
                    </p>
                  </div>
                )}

                {/* Items List */}
                {cart.items.map((item) => (
                  <div
                    key={item.id || item.product_id}
                    className="p-3 rounded-xl border border-gray-100 bg-white hover:border-emerald-200 transition shadow-sm space-y-2"
                  >
                    <div className="flex gap-3">
                      <img
                        src={item.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=200&q=80'}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 truncate">{item.title}</h4>
                        <p className="text-xs text-gray-500 truncate">Seller: {item.seller_name}</p>
                        <p className="text-sm font-bold text-emerald-700 mt-1">
                          ₹{item.price} <span className="text-xs font-normal text-gray-500">/ {item.unit}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-gray-400 hover:text-red-600 transition p-1 h-fit"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Modifier & Line Total */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-0.5 bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center rounded bg-white text-gray-700 hover:bg-gray-100 text-xs font-bold"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded bg-white text-gray-700 hover:bg-gray-100 text-xs font-bold"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-gray-500">Total: </span>
                        <span className="text-sm font-bold text-gray-900">
                          ₹{item.total_price || item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Free Delivery Banner */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  {isFreeDelivery ? (
                    <span className="font-medium text-emerald-700">Eligible for Free Agricultural Delivery!</span>
                  ) : (
                    <span>
                      Add <strong>₹{freeDeliveryThreshold - cart.subtotal}</strong> more to get Free Delivery.
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.items.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">₹{cart.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className={isFreeDelivery ? 'font-semibold text-emerald-700' : 'font-semibold text-gray-800'}>
                    {isFreeDelivery ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Grand Total</span>
                  <span className="text-emerald-700">₹{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                disabled={cart.has_out_of_stock || cart.has_exceeded_stock}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-sm shadow-sm transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <span>{isAuthenticated ? 'Proceed to Checkout' : 'Login & Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Buyer Guarantee
                </span>
                <button
                  onClick={clearCart}
                  className="hover:text-red-600 underline transition"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
