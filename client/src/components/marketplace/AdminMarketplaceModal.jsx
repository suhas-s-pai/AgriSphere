import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Store,
  Users,
  Package,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { adminApi } from '../../services/api';

const AdminMarketplaceModal = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState(null);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [pendingShops, setPendingShops] = useState([]);
  const [activeTab, setActiveTab] = useState('sellers'); // 'sellers' | 'shops' | 'stats'
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, sellersRes, shopsRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getPendingSellers(),
        adminApi.getPendingShops(),
      ]);

      if (statsRes.data?.status === 'success') setStats(statsRes.data.data);
      if (sellersRes.data?.status === 'success') setPendingSellers(sellersRes.data.data);
      if (shopsRes.data?.status === 'success') setPendingShops(shopsRes.data.data);
    } catch (err) {
      console.error('Failed to load admin verification data:', err);
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

  const handleVerifySeller = async (sellerId, status) => {
    try {
      setActionLoading(true);
      await adminApi.verifySeller(sellerId, {
        status,
        notes: status === 'approved' ? 'Verified by AgriSphere Admin Team' : 'Rejected due to incomplete documentation',
      });
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update seller.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyShop = async (shopId, verified) => {
    try {
      setActionLoading(true);
      await adminApi.verifyShop(shopId, { verified });
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update shop.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-emerald-950 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold">AgriSphere Marketplace Verification Admin</h3>
              <p className="text-xs text-emerald-300">Seller & Physical Depot Credential Moderation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* KPI Strip */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-4 bg-gray-50 border-b border-gray-200 text-xs">
            <div className="p-2.5 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-500 block text-[10px]">Pending Sellers</span>
              <span className="text-lg font-black text-amber-700">{stats.pending_sellers}</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-500 block text-[10px]">Pending Shops</span>
              <span className="text-lg font-black text-amber-700">{stats.pending_shops}</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-500 block text-[10px]">Verified Sellers</span>
              <span className="text-lg font-black text-emerald-800">{stats.approved_sellers}</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-500 block text-[10px]">Total Products</span>
              <span className="text-lg font-black text-gray-800">{stats.total_products}</span>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-500 block text-[10px]">Total Revenue</span>
              <span className="text-lg font-black text-emerald-800">₹{stats.total_revenue?.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="px-6 py-2.5 border-b border-gray-200 flex gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'sellers' ? 'bg-emerald-800 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Pending Sellers ({pendingSellers.length})
          </button>
          <button
            onClick={() => setActiveTab('shops')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'shops' ? 'bg-emerald-800 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Pending Physical Shops ({pendingShops.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
          {loading ? (
            <div className="py-12 flex justify-center text-emerald-800">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : activeTab === 'sellers' ? (
            pendingSellers.length === 0 ? (
              <p className="text-gray-500 italic text-center py-8">No pending seller applications.</p>
            ) : (
              pendingSellers.map((s) => (
                <div key={s.id} className="p-4 bg-white border border-gray-200 rounded-xl space-y-3 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{s.business_name}</h4>
                      <p className="text-gray-500">
                        Applicant: <strong>{s.user?.full_name}</strong> • {s.seller_type?.toUpperCase()} • {s.district}, {s.state}
                      </p>
                      <p className="text-gray-500">Contact: {s.contact_number} • {s.email}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerifySeller(s.id, 'approved')}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold hover:bg-emerald-800 flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Grant Badge
                      </button>
                      <button
                        onClick={() => handleVerifySeller(s.id, 'rejected')}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-gray-200 text-red-700 rounded-lg font-bold hover:bg-gray-300 flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="p-3 bg-gray-50 rounded-lg space-y-1.5">
                    <span className="font-bold text-gray-700 block">Submitted Verification Credentials:</span>
                    {s.documents?.length === 0 ? (
                      <span className="text-gray-400 italic">No verification documents attached yet.</span>
                    ) : (
                      s.documents.map((d) => (
                        <div key={d.id} className="flex items-center justify-between text-gray-700">
                          <span>
                            • <strong>{d.document_type}</strong>: {d.document_name}
                          </span>
                          <a
                            href={d.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
                          >
                            Inspect Document <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )
          ) : (
            pendingShops.length === 0 ? (
              <p className="text-gray-500 italic text-center py-8">No pending physical shops.</p>
            ) : (
              pendingShops.map((shop) => (
                <div key={shop.id} className="p-4 bg-white border border-gray-200 rounded-xl space-y-3 shadow-sm flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{shop.name}</h4>
                    <p className="text-gray-500 capitalize">{shop.category} • {shop.address}, {shop.district}</p>
                    <p className="text-gray-500">Contact: {shop.contact || 'N/A'} • Hours: {shop.operating_hours}</p>
                    <p className="text-gray-500">GPS: {shop.latitude}, {shop.longitude}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVerifyShop(shop.id, true)}
                      disabled={actionLoading}
                      className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold hover:bg-emerald-800 flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verify & List
                    </button>
                    <button
                      onClick={() => handleVerifyShop(shop.id, false)}
                      disabled={actionLoading}
                      className="px-3 py-1.5 bg-gray-200 text-red-700 rounded-lg font-bold hover:bg-gray-300"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMarketplaceModal;
