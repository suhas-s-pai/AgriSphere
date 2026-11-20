import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Plus,
  ShieldCheck,
  PackageCheck,
  ChevronRight,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { addressApi, orderApi, paymentApi } from '../../services/api';

// Dynamically load Razorpay SDK script if configured
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutModal = ({ onOrderPlaced, onViewOrders }) => {
  const { cart, isCheckoutOpen, closeCheckout, clearCart, refreshCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [deliveryType, setDeliveryType] = useState('local_delivery'); // 'local_delivery' | 'buyer_pickup'
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'razorpay'
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // New address form state
  const [newAddress, setNewAddress] = useState({
    recipient_name: user?.full_name || '',
    phone_number: user?.mobile_number || '',
    address_line1: '',
    address_line2: '',
    landmark: '',
    village_or_city: '',
    district: user?.district || 'Belagavi',
    state: user?.state || 'Karnataka',
    pincode: user?.pincode || '',
    is_default: true,
  });

  // Fetch saved addresses & payment config
  useEffect(() => {
    if (isCheckoutOpen && isAuthenticated) {
      addressApi
        .getAddresses()
        .then((res) => {
          if (res.data?.status === 'success') {
            const list = res.data.data || [];
            setAddresses(list);
            if (list.length > 0) {
              const defaultAddr = list.find((a) => a.is_default) || list[0];
              setSelectedAddressId(defaultAddr.id);
            } else {
              setIsAddingNewAddress(true);
            }
          }
        })
        .catch((err) => {
          console.warn('Failed to load saved addresses:', err);
          setIsAddingNewAddress(true);
        });

      paymentApi
        .getConfig()
        .then((res) => {
          if (res.data?.status === 'success') {
            setPaymentConfig(res.data.data);
          }
        })
        .catch((err) => {
          console.warn('Failed to load payment configuration:', err);
        });
    }
  }, [isCheckoutOpen, isAuthenticated]);

  if (!isCheckoutOpen) return null;

  const isFreeDelivery = cart.subtotal >= 2000 || deliveryType === 'buyer_pickup';
  const deliveryCharge = deliveryType === 'buyer_pickup' ? 0 : isFreeDelivery ? 0 : 60;
  const grandTotal = cart.subtotal + deliveryCharge;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      let finalShippingAddress = null;

      // Determine shipping address
      if (isAddingNewAddress || addresses.length === 0) {
        if (
          !newAddress.recipient_name ||
          !newAddress.phone_number ||
          !newAddress.address_line1 ||
          !newAddress.village_or_city ||
          !newAddress.district ||
          !newAddress.pincode
        ) {
          throw new Error('Please fill all mandatory shipping address fields.');
        }
        try {
          const saveRes = await addressApi.addAddress(newAddress);
          finalShippingAddress = saveRes.data.data;
        } catch {
          finalShippingAddress = newAddress;
        }
      } else {
        finalShippingAddress = addresses.find((a) => a.id === selectedAddressId);
        if (!finalShippingAddress) {
          throw new Error('Please select or add a delivery address.');
        }
      }

      // Format items
      const orderItems = cart.items.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
      }));

      // 1. Create Order(s)
      const orderRes = await orderApi.createOrder({
        items: orderItems,
        shipping_address: finalShippingAddress,
        delivery_type: deliveryType,
        delivery_charges: deliveryCharge,
        payment_method: paymentMethod,
      });

      const createdOrders = orderRes.data?.data || [];
      const primaryOrder = createdOrders[0];

      if (!primaryOrder) {
        throw new Error('Order creation failed on server.');
      }

      // 2. Process Payment
      if (paymentMethod === 'razorpay') {
        if (!paymentConfig?.is_configured) {
          throw new Error(
            'Razorpay test keys are not configured in backend environment (.env). Please select Cash on Delivery (COD) to place your order.'
          );
        }

        // Load Razorpay script
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Failed to load Razorpay checkout SDK. Please check your internet connection or use COD.');
        }

        // Create Razorpay Order on server
        const rzpRes = await paymentApi.createRazorpayOrder({
          order_id: primaryOrder.id,
          amount: grandTotal,
        });

        const rzpData = rzpRes.data?.data;

        // Open Razorpay Standard Checkout Popup
        await new Promise((resolve, reject) => {
          const options = {
            key: rzpData.key_id,
            amount: rzpData.amount,
            currency: rzpData.currency || 'INR',
            name: 'AgriSphere Agricultural Marketplace',
            description: `Order ${primaryOrder.order_number}`,
            order_id: rzpData.razorpay_order_id,
            prefill: {
              name: user?.full_name || finalShippingAddress.recipient_name,
              email: user?.email,
              contact: user?.mobile_number || finalShippingAddress.phone_number,
            },
            theme: {
              color: '#15803D',
            },
            handler: async (response) => {
              try {
                // Verify signature on backend securely
                await paymentApi.verifyRazorpaySignature({
                  order_id: primaryOrder.id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });
                resolve(true);
              } catch (verifyErr) {
                reject(verifyErr);
              }
            },
            modal: {
              ondismiss: () => {
                reject(new Error('Payment window was dismissed. You can pay via Cash on Delivery instead.'));
              },
            },
          };

          const razorpayInstance = new window.Razorpay(options);
          razorpayInstance.open();
        });
      } else {
        // Cash on delivery confirmation
        await paymentApi.confirmCod({
          order_id: primaryOrder.id,
        });
      }

      // 3. Clear cart & set success
      clearCart();
      refreshCart();
      setCompletedOrder({
        order_number: primaryOrder.order_number,
        orders_count: createdOrders.length,
        total_amount: grandTotal,
        delivery_type: deliveryType,
        payment_method: paymentMethod,
        shipping_address: finalShippingAddress,
      });

      if (onOrderPlaced) onOrderPlaced(primaryOrder);
    } catch (err) {
      console.error('[CHECKOUT ERROR]', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to complete order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-300" />
            <h3 className="text-lg font-bold">Checkout & Secure Order</h3>
          </div>
          <button
            onClick={closeCheckout}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {completedOrder ? (
          /* Order Placed Success View */
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-bold text-gray-900">Order Placed Successfully!</h4>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Thank you, <strong>{user?.full_name || 'Farmer'}</strong>. Your agricultural order{' '}
                <span className="font-mono font-bold text-emerald-700">{completedOrder.order_number}</span> has been dispatched to verified supplier(s).
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-left text-xs text-gray-700 space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Payable:</span>
                <span className="font-bold text-emerald-800">₹{completedOrder.total_amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Mode:</span>
                <span className="font-semibold capitalize">
                  {completedOrder.payment_method === 'cod'
                    ? 'Cash on Delivery (Pay at Handover)'
                    : 'Razorpay Verified Online Payment'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fulfillment:</span>
                <span className="font-semibold capitalize">
                  {completedOrder.delivery_type === 'buyer_pickup'
                    ? 'Self-Pickup from Farm / Depot'
                    : 'Direct Farm-gate Delivery'}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  closeCheckout();
                  if (onViewOrders) onViewOrders();
                }}
                className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-sm font-semibold hover:bg-emerald-800 transition shadow-sm"
              >
                Track in My Orders
              </button>
              <button
                onClick={closeCheckout}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <form onSubmit={handlePlaceOrder} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Section 1: Delivery Address */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  1. Delivery Address
                </h4>
                {addresses.length > 0 && !isAddingNewAddress && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(true)}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add New Address
                  </button>
                )}
              </div>

              {!isAddingNewAddress && addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition flex flex-col justify-between ${
                        selectedAddressId === addr.id
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <p className="font-bold text-gray-800">{addr.recipient_name}</p>
                          <p className="text-gray-500">{addr.phone_number}</p>
                          <p className="text-gray-600 mt-1 line-clamp-2">
                            {addr.address_line1}, {addr.village_or_city}, {addr.district} - {addr.pincode}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Recipient / Farm Name *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.recipient_name}
                        onChange={(e) => setNewAddress({ ...newAddress, recipient_name: e.target.value })}
                        placeholder="e.g. Ramesh Patil"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Contact Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={newAddress.phone_number}
                        onChange={(e) => setNewAddress({ ...newAddress, phone_number: e.target.value })}
                        placeholder="+91 98450 12345"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Street / Farm House / Survey No *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.address_line1}
                      onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                      placeholder="e.g. Survey No. 42, Near Cooperative Society"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Village / City *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.village_or_city}
                        onChange={(e) => setNewAddress({ ...newAddress, village_or_city: e.target.value })}
                        placeholder="Bailhongal"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">District *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.district}
                        onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                        placeholder="Belagavi"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">PIN Code *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        placeholder="591102"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(false)}
                      className="text-gray-500 hover:text-gray-800 underline text-xs pt-1"
                    >
                      Cancel and use saved address
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Section 2: Fulfillment Method */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-700" />
                2. Fulfillment Method
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                    deliveryType === 'local_delivery'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'local_delivery'}
                    onChange={() => setDeliveryType('local_delivery')}
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-gray-800">Farm-Gate / Doorstep Delivery</span>
                    <p className="text-gray-500 mt-0.5">
                      {isFreeDelivery ? 'Free Delivery (Above ₹2,000)' : 'Flat ₹60 delivery fee'}
                    </p>
                  </div>
                </label>

                <label
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                    deliveryType === 'buyer_pickup'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'buyer_pickup'}
                    onChange={() => setDeliveryType('buyer_pickup')}
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-gray-800">Self-Pickup at Seller Depot / Farm</span>
                    <p className="text-gray-500 mt-0.5">Direct pickup from seller location (₹0 fee)</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Section 3: Payment Method */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                3. Payment Method
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-gray-800">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                      Cash on Delivery (COD)
                    </div>
                    <p className="text-gray-500 mt-0.5">Pay in cash or UPI upon delivery / pickup</p>
                  </div>
                </label>

                <label
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                    paymentMethod === 'razorpay'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-gray-800">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      Online Payment (Razorpay Test)
                    </div>
                    <p className="text-gray-500 mt-0.5">
                      {paymentConfig?.is_configured
                        ? 'UPI, Cards, NetBanking via Razorpay'
                        : 'API Keys Pending in .env (Use COD)'}
                    </p>
                  </div>
                </label>
              </div>

              {/* Notice if Razorpay is chosen but keys are not in .env */}
              {paymentMethod === 'razorpay' && !paymentConfig?.is_configured && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Razorpay keys not configured in backend environment</p>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      To enable online payment, define <code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code> in{' '}
                      <code>server/.env</code>. For immediate order placement, please select <strong>Cash on Delivery (COD)</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.items.length} items)</span>
                <span className="font-semibold text-gray-800">₹{cart.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span className={deliveryCharge === 0 ? 'font-semibold text-emerald-700' : 'font-semibold text-gray-800'}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Amount</span>
                <span className="text-emerald-700">₹{grandTotal}</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={
                  submitting ||
                  cart.items.length === 0 ||
                  (paymentMethod === 'razorpay' && !paymentConfig?.is_configured)
                }
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Secure Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Place Order (₹{grandTotal})</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
