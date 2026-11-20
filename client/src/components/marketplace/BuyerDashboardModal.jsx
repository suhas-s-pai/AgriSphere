import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Star,
  Plus,
  Trash2,
  ShieldCheck,
  User,
  ShoppingBag,
} from 'lucide-react';
import { orderApi, addressApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BuyerDashboardModal = ({ isOpen, onClose, onOpenReview }) => {
  const { user, isSeller, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'profile'
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipient_name: user?.full_name || '',
    phone_number: user?.mobile_number || '',
    address_line1: '',
    village_or_city: '',
    district: user?.district || 'Belagavi',
    state: user?.state || 'Karnataka',
    pincode: '',
    is_default: false,
  });
  const [showAddAddr, setShowAddAddr] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [orderRes, addrRes] = await Promise.all([
        orderApi.getBuyerOrders(),
        addressApi.getAddresses(),
      ]);

      if (orderRes.data?.status === 'success') {
        setOrders(orderRes.data.data);
      }
      if (addrRes.data?.status === 'success') {
        setAddresses(addrRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load buyer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderApi.updateStatus(orderId, { status: 'cancelled', reason: 'Cancelled by buyer' });
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await addressApi.addAddress(newAddress);
      setShowAddAddr(false);
      setNewAddress({
        recipient_name: user?.full_name || '',
        phone_number: user?.mobile_number || '',
        address_line1: '',
        village_or_city: '',
        district: user?.district || 'Belagavi',
        state: user?.state || 'Karnataka',
        pincode: '',
        is_default: false,
      });
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add address.');
    }
  };

  const handleDeleteAddress = async (addrId) => {
    try {
      await addressApi.deleteAddress(addrId);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete address.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-emerald-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 flex items-center justify-center text-white">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">My Buyer Dashboard</h3>
              <p className="text-xs text-emerald-100">
                {user?.full_name} • {user?.email} • {user?.district}, {user?.state}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'orders' ? 'bg-emerald-700 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'addresses' ? 'bg-emerald-700 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Delivery Addresses ({addresses.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'profile' ? 'bg-emerald-700 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Profile & Account
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4 text-xs">
            {orders.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>You haven't placed any orders yet.</p>
              </div>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="p-4 bg-white border border-gray-200 rounded-xl space-y-3 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                    <div>
                      <span className="font-mono font-bold text-emerald-800">{o.order_number}</span>
                      <span className="text-gray-400 mx-2">•</span>
                      <span className="text-gray-500">
                        {new Date(o.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        o.order_status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.order_status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {o.order_status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Order Progress Flow */}
                  <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between text-[11px] text-gray-500">
                    <div className="flex items-center gap-1 font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Order Placed</span>
                    </div>
                    <span>→</span>
                    <div
                      className={`flex items-center gap-1 ${
                        ['order_confirmed', 'processing', 'ready_for_dispatch', 'shipped', 'delivered'].includes(
                          o.order_status
                        )
                          ? 'text-emerald-700 font-semibold'
                          : 'text-gray-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirmed</span>
                    </div>
                    <span>→</span>
                    <div
                      className={`flex items-center gap-1 ${
                        ['shipped', 'delivered'].includes(o.order_status)
                          ? 'text-emerald-700 font-semibold'
                          : 'text-gray-400'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>In Transit</span>
                    </div>
                    <span>→</span>
                    <div
                      className={`flex items-center gap-1 ${
                        o.order_status === 'delivered' ? 'text-emerald-700 font-semibold' : 'text-gray-400'
                      }`}
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Delivered</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1">
                    {o.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-1 border-b border-gray-50">
                        <div>
                          <p className="font-bold text-gray-800">{item.product_title}</p>
                          <p className="text-[11px] text-gray-500">
                            Qty: {item.quantity} {item.unit} • ₹{item.unit_price}/{item.unit}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900">₹{item.total_price}</span>
                          {o.order_status === 'delivered' && (
                            <button
                              onClick={() => {
                                if (onOpenReview) onOpenReview(item, o.id);
                              }}
                              className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg font-bold hover:bg-amber-100 flex items-center gap-1 text-[10px]"
                            >
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary & Cancel Option */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-gray-500 text-[11px]">
                      Supplier: <strong>{o.seller_name}</strong> • Mode: <span className="uppercase">{o.payment?.payment_method}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-emerald-800 text-sm">Total: ₹{o.total_amount}</span>
                      {o.order_status === 'order_placed' && (
                        <button
                          onClick={() => handleCancelOrder(o.id)}
                          className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-semibold text-[11px]"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === 'addresses' && (
          <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900">Saved Farm & Home Delivery Addresses</h4>
              <button
                onClick={() => setShowAddAddr(!showAddAddr)}
                className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold hover:bg-emerald-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Address
              </button>
            </div>

            {showAddAddr && (
              <form onSubmit={handleAddAddress} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                <h5 className="font-bold text-gray-800">Add New Address</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-600 mb-1">Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={newAddress.recipient_name}
                      onChange={(e) => setNewAddress({ ...newAddress, recipient_name: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={newAddress.phone_number}
                      onChange={(e) => setNewAddress({ ...newAddress, phone_number: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Address / Street</label>
                  <input
                    type="text"
                    required
                    value={newAddress.address_line1}
                    onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-gray-600 mb-1">Village / City</label>
                    <input
                      type="text"
                      required
                      value={newAddress.village_or_city}
                      onChange={(e) => setNewAddress({ ...newAddress, village_or_city: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">District</label>
                    <input
                      type="text"
                      required
                      value={newAddress.district}
                      onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddAddr(false)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-1 bg-emerald-700 text-white rounded-lg font-bold">
                    Save Address
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="p-3 border border-gray-200 rounded-xl bg-white space-y-1 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{addr.recipient_name}</span>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-gray-500">{addr.phone_number}</p>
                  <p className="text-gray-700">
                    {addr.address_line1}, {addr.village_or_city}, {addr.district} - {addr.pincode}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Profile */}
        {activeTab === 'profile' && (
          <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4 text-xs">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-base">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{user?.full_name}</h4>
                  <p className="text-gray-500">{user?.email}</p>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold uppercase text-[10px]">
                    Role: {user?.role}
                  </span>
                </div>
              </div>
            </div>

            {!isSeller && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <h5 className="font-bold text-emerald-900 text-sm">Want to sell your harvest or agricultural inputs?</h5>
                <p className="text-emerald-700">
                  Upgrade your account to a <strong>Farmer Seller</strong>, <strong>Agricultural Shop</strong>, or <strong>FPO</strong> to publish products directly to thousands of farmers across Karnataka.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    openAuthModal('farmer');
                  }}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg font-bold hover:bg-emerald-800"
                >
                  Register as a Seller
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboardModal;
