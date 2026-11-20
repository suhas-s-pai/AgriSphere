import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  Edit2,
  Trash2,
  Save,
  Loader2,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { orderApi, productApi, sellerApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SellerDashboardModal = ({ isOpen, onClose, onOpenAddProduct, onEditProduct }) => {
  const { user, sellerProfile, refreshUserProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'analytics' | 'profile'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    business_name: '',
    contact_number: '',
    address: '',
    village: '',
    taluk: '',
    district: '',
    state: '',
    pincode: '',
    bank_account_number: '',
    bank_ifsc: '',
    gstin: '',
  });
  const [profileSaveMsg, setProfileSaveMsg] = useState('');

  // Document upload state
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [docType, setDocType] = useState('rtc_pahani');
  const [docName, setDocName] = useState('');
  const [docUrl, setDocUrl] = useState('');

  const loadData = async () => {
    if (!sellerProfile) return;
    setLoading(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        productApi.listProducts({ sellerId: sellerProfile.id }),
        orderApi.getSellerOrders(),
      ]);

      if (prodRes.data?.status === 'success') {
        setProducts(prodRes.data.data);
      }
      if (orderRes.data?.status === 'success') {
        setOrders(orderRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load seller dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && sellerProfile) {
      loadData();
      setProfileForm({
        business_name: sellerProfile.business_name || '',
        contact_number: sellerProfile.contact_number || '',
        address: sellerProfile.address || '',
        village: sellerProfile.village || '',
        taluk: sellerProfile.taluk || '',
        district: sellerProfile.district || '',
        state: sellerProfile.state || 'Karnataka',
        pincode: sellerProfile.pincode || '',
        bank_account_number: sellerProfile.bank_account_number || '',
        bank_ifsc: sellerProfile.bank_ifsc || '',
        gstin: sellerProfile.gstin || '',
      });
    }
  }, [isOpen, sellerProfile]);

  if (!isOpen) return null;

  const handleUpdateStockPrice = async (productId) => {
    try {
      setActionLoading(true);
      await productApi.updateProduct(productId, {
        price: Number(editPrice),
        stock_quantity: Number(editStock),
      });
      setEditingProductId(null);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update listing.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await productApi.deleteProduct(productId);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing.');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setActionLoading(true);
      await orderApi.updateStatus(orderId, { status: newStatus });
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!docName || !docUrl) return;
    try {
      setActionLoading(true);
      await sellerApi.uploadDocument({
        document_type: docType,
        document_name: docName,
        document_url: docUrl,
      });
      alert('Verification document uploaded! Admin will verify your RTC Pahani / GSTIN credentials.');
      setShowDocUpload(false);
      setDocName('');
      setDocUrl('');
      refreshUserProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload document.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaveMsg('');
    try {
      setActionLoading(true);
      await sellerApi.updateProfile(profileForm);
      setProfileSaveMsg('Seller details & bank credentials updated successfully!');
      refreshUserProfile();
      setTimeout(() => setProfileSaveMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setActionLoading(false);
    }
  };

  // Analytics calculations
  const totalSalesRevenue = orders.reduce(
    (sum, o) => (o.order_status !== 'cancelled' ? sum + o.total_amount : sum),
    0
  );
  const completedOrdersCount = orders.filter((o) => o.order_status === 'delivered').length;
  const pendingOrdersCount = orders.filter((o) =>
    ['order_placed', 'order_confirmed', 'processing', 'ready_for_dispatch', 'shipped'].includes(o.order_status)
  ).length;
  const lowStockProducts = products.filter((p) => p.is_low_stock || p.available_quantity <= 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-emerald-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 flex items-center justify-center text-white">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{sellerProfile?.business_name || 'Seller Dashboard'}</h3>
                {sellerProfile?.is_verified_badge ? (
                  <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-400">
                    <CheckCircle2 className="w-3 h-3 text-emerald-200" /> Verified Seller
                  </span>
                ) : (
                  <span className="bg-amber-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Verification Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-100">
                {sellerProfile?.seller_type?.toUpperCase()} • {sellerProfile?.district}, {sellerProfile?.state}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Alert Banner if unverified */}
        {!sellerProfile?.is_verified_badge && (
          <div className="p-3 bg-amber-50 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900 px-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Submit your Karnataka RTC Pahani Survey number or GSTIN to receive the Verified Seller Badge.</span>
            </div>
            <button
              onClick={() => setShowDocUpload(true)}
              className="px-3 py-1 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 text-[11px]"
            >
              Upload Document
            </button>
          </div>
        )}

        {/* Document Upload Modal Overlay */}
        {showDocUpload && (
          <div className="p-4 bg-gray-50 border-b border-gray-200 space-y-3 px-6 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-800">Submit Verification Document</h4>
              <button onClick={() => setShowDocUpload(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUploadDocument} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-600 mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                >
                  <option value="rtc_pahani">Karnataka Bhoomi RTC Pahani</option>
                  <option value="gstin">GSTIN Certificate</option>
                  <option value="trade_license">APMC / Trade License</option>
                  <option value="fpo_registration">FPO Registration Deed</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. RTC Survey No 84"
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Document Web URL / Verification Link</label>
                <input
                  type="url"
                  required
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  placeholder="https://bhoomi.karnataka.gov.in/..."
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                />
              </div>
              <div className="sm:col-span-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDocUpload(false)}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-1.5 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800"
                >
                  Submit Document
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab Controls & Add Product Action */}
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'products' ? 'bg-emerald-700 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              My Listings ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'orders' ? 'bg-emerald-700 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Incoming Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'analytics' ? 'bg-emerald-700 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sales Analytics
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'profile' ? 'bg-emerald-700 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Seller Profile & Bank
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              if (onOpenAddProduct) onOpenAddProduct();
            }}
            className="px-3.5 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Listing
          </button>
        </div>

        {/* Tab 1: Products */}
        {activeTab === 'products' && (
          <div className="p-6 max-h-[65vh] overflow-y-auto space-y-3">
            {loading ? (
              <div className="py-12 flex justify-center text-emerald-700">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-xs">
                <p>You have not published any products yet.</p>
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenAddProduct) onOpenAddProduct();
                  }}
                  className="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-xl font-medium"
                >
                  Create Your First Listing
                </button>
              </div>
            ) : (
              products.map((p) => {
                const isEditing = editingProductId === p.id;
                return (
                  <div
                    key={p.id}
                    className="p-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-200 transition shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=150&q=80'}
                        alt={p.title}
                        className="w-14 h-14 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{p.title}</h4>
                        <p className="text-gray-500">
                          {p.category_name} • {p.unit}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {p.status}
                          </span>
                          {p.is_low_stock && (
                            <span className="text-amber-600 flex items-center gap-0.5 font-bold text-[10px]">
                              <AlertTriangle className="w-3 h-3" /> Low Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stock & Price Controls */}
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <div>
                            <span className="text-[10px] text-gray-500 block">Price (₹)</span>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded font-bold"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 block">Stock Qty</span>
                            <input
                              type="number"
                              value={editStock}
                              onChange={(e) => setEditStock(e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded font-bold"
                            />
                          </div>
                          <button
                            onClick={() => handleUpdateStockPrice(p.id)}
                            disabled={actionLoading}
                            className="p-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition mt-3"
                            title="Save changes"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingProductId(null)}
                            className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition mt-3"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-6">
                          <div>
                            <span className="text-[10px] text-gray-500 block">Current Price</span>
                            <span className="font-bold text-emerald-800 text-sm">
                              ₹{p.price} <span className="text-[10px] font-normal text-gray-500">/{p.unit}</span>
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 block">Available Stock</span>
                            <span className="font-bold text-gray-900 text-sm">
                              {p.available_quantity} {p.unit}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                if (onEditProduct) {
                                  onClose();
                                  onEditProduct(p);
                                } else {
                                  setEditingProductId(p.id);
                                  setEditPrice(p.price);
                                  setEditStock(p.stock_quantity);
                                }
                              }}
                              className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                              title="Full Edit Listing"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
            {orders.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-xs">
                No orders received yet. New buyer orders will appear here automatically.
              </div>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="p-4 bg-white border border-gray-200 rounded-xl space-y-3 text-xs shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                    <div>
                      <span className="font-mono font-bold text-emerald-800">{o.order_number}</span>
                      <span className="text-gray-400 mx-2">•</span>
                      <span className="text-gray-500">
                        {new Date(o.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
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
                  </div>

                  {/* Buyer & Fulfillment Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg">
                    <div>
                      <p className="font-bold text-gray-800">{o.buyer_name || 'Buyer'}</p>
                      <p className="text-gray-500">Phone: {o.buyer_mobile}</p>
                      <p className="text-gray-600 mt-1 line-clamp-1">
                        Shipping: {o.shipping_address_snapshot?.address_line1}, {o.shipping_address_snapshot?.village_or_city}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-semibold text-gray-700 capitalize">Mode: {o.delivery_type?.replace(/_/g, ' ')}</p>
                      <p className="text-gray-500">
                        Payment: <strong className="uppercase">{o.payment?.payment_method}</strong> ({o.payment?.payment_status})
                      </p>
                      <p className="text-emerald-800 font-bold text-sm mt-1">Total: ₹{o.total_amount}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-1">
                    <p className="font-bold text-gray-700">Ordered Items:</p>
                    {o.items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-gray-600 pl-2">
                        <span>
                          {item.product_title} × {item.quantity} {item.unit}
                        </span>
                        <span className="font-semibold text-gray-900">₹{item.total_price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons to update order status */}
                  {o.order_status !== 'delivered' && o.order_status !== 'cancelled' && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 justify-end">
                      {o.order_status === 'order_placed' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(o.id, 'order_confirmed')}
                          disabled={actionLoading}
                          className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800"
                        >
                          Accept & Confirm
                        </button>
                      )}
                      {o.order_status === 'order_confirmed' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(o.id, 'ready_for_dispatch')}
                          disabled={actionLoading}
                          className="px-3 py-1.5 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800"
                        >
                          Mark Ready for Dispatch
                        </button>
                      )}
                      {o.order_status === 'ready_for_dispatch' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(o.id, 'shipped')}
                          disabled={actionLoading}
                          className="px-3 py-1.5 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800"
                        >
                          Mark Dispatched / Out for Delivery
                        </button>
                      )}
                      {o.order_status === 'shipped' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(o.id, 'delivered')}
                          disabled={actionLoading}
                          className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800"
                        >
                          Mark Delivered
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const reason = prompt('Please enter cancellation reason:');
                          if (reason) handleUpdateOrderStatus(o.id, 'cancelled');
                        }}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-gray-200 text-red-700 rounded-lg font-semibold hover:bg-gray-300"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Analytics */}
        {activeTab === 'analytics' && (
          <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6 text-xs">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-gray-500 block">Total Sales Revenue</span>
                <span className="text-2xl font-black text-emerald-800">₹{totalSalesRevenue.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-gray-500 block">Completed Sales</span>
                <span className="text-2xl font-black text-blue-800">{completedOrdersCount}</span>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <span className="text-gray-500 block">Pending Orders</span>
                <span className="text-2xl font-black text-amber-800">{pendingOrdersCount}</span>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                <span className="text-gray-500 block">Active Listings</span>
                <span className="text-2xl font-black text-purple-800">{products.length}</span>
              </div>
            </div>

            {/* Low stock alerts */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Inventory & Stock Health Alerts
              </h4>
              {lowStockProducts.length === 0 ? (
                <p className="text-gray-500 italic p-3 bg-gray-50 rounded-xl">
                  All listings have healthy inventory levels.
                </p>
              ) : (
                <div className="space-y-2">
                  {lowStockProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-gray-800">{p.title}</p>
                        <p className="text-amber-700">
                          Current available stock: <strong>{p.available_quantity} {p.unit}</strong>
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab('products');
                          setEditingProductId(p.id);
                          setEditPrice(p.price);
                          setEditStock(p.stock_quantity);
                        }}
                        className="px-3 py-1 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700"
                      >
                        Restock Now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Seller Profile & Bank Settings */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="p-6 max-h-[65vh] overflow-y-auto space-y-4 text-xs">
            {profileSaveMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileSaveMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Business / Farm Name *</label>
                <input
                  type="text"
                  required
                  value={profileForm.business_name}
                  onChange={(e) => setProfileForm({ ...profileForm, business_name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Contact Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={profileForm.contact_number}
                  onChange={(e) => setProfileForm({ ...profileForm, contact_number: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Farm / Shop Address *</label>
              <input
                type="text"
                required
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Village</label>
                <input
                  type="text"
                  value={profileForm.village}
                  onChange={(e) => setProfileForm({ ...profileForm, village: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Taluk</label>
                <input
                  type="text"
                  value={profileForm.taluk}
                  onChange={(e) => setProfileForm({ ...profileForm, taluk: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">District</label>
                <input
                  type="text"
                  value={profileForm.district}
                  onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">PIN Code</label>
                <input
                  type="text"
                  value={profileForm.pincode}
                  onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Bank details for payouts */}
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5">
              <span className="font-bold text-gray-800 block">Bank Account & Settlement Credentials</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-gray-600 mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    value={profileForm.bank_account_number}
                    onChange={(e) => setProfileForm({ ...profileForm, bank_account_number: e.target.value })}
                    placeholder="XXXXXX5012"
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Bank IFSC Code</label>
                  <input
                    type="text"
                    value={profileForm.bank_ifsc}
                    onChange={(e) => setProfileForm({ ...profileForm, bank_ifsc: e.target.value })}
                    placeholder="SBIN0001234"
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg uppercase"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={profileForm.gstin}
                    onChange={(e) => setProfileForm({ ...profileForm, gstin: e.target.value })}
                    placeholder="29AAAAA0000A1Z5"
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={actionLoading}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2 disabled:bg-gray-400"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SellerDashboardModal;
