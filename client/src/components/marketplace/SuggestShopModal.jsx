import React, { useState } from 'react';
import { X, Store, MapPin, AlertCircle, CheckCircle2, Loader2, Navigation } from 'lucide-react';
import { shopApi } from '../../services/api';
import { useLocationContext } from '../../context/LocationContext';

const SuggestShopModal = ({ isOpen, onClose, onShopSuggested }) => {
  const { location } = useLocationContext();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Fertilizer & Pesticide Depot',
    shop_type: 'Agricultural Input Store',
    address: '',
    district: location?.district || 'Belagavi',
    state: location?.state || 'Karnataka',
    pincode: '',
    contact: '',
    operating_hours: 'Mon - Sat: 08:30 AM - 06:00 PM',
    latitude: location?.lat || 15.8595,
    longitude: location?.lng || 74.5075,
    inventory_summary: 'Seeds, Fertilizers, Sprayers, Bio-pesticides',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleUseCurrentLocation = () => {
    if (location?.lat && location?.lng) {
      setFormData((prev) => ({
        ...prev,
        latitude: location.lat,
        longitude: location.lng,
        district: location.district || prev.district,
      }));
    } else {
      alert('Current GPS location is not available. Please allow location access or input manually.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        inventory_summary: formData.inventory_summary.split(',').map((s) => s.trim()).filter(Boolean),
      };

      const res = await shopApi.suggestShop(payload);
      if (res.data?.status === 'success') {
        setSuccessMsg('Thank you! Agricultural shop submitted for admin verification.');
        setTimeout(() => {
          if (onShopSuggested) onShopSuggested(res.data.data);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to submit shop.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-300" />
            <h3 className="text-base font-bold">Suggest / Add Agricultural Shop</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 max-h-[80vh] overflow-y-auto text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Shop / Depot Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Kisan Seva Kendra & Seed Depot"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg"
              >
                <option value="Seeds">Seed Depot</option>
                <option value="Fertilizers">Fertilizers & Nutrients</option>
                <option value="Pesticides">Pesticides & Bio-Controls</option>
                <option value="Machinery">Machinery & Power Tillers</option>
                <option value="Irrigation">Drip & Sprinklers</option>
                <option value="Supplies">General Farm Supplies</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Contact Phone</label>
              <input
                type="tel"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="+91 831 XXXXXXX"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Address / Landmark *</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Main Road, Near APMC Gate"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">District *</label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="Belagavi"
                className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">PIN Code</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                placeholder="590016"
                className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Coordinates */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" /> GPS Coordinates *
              </span>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 text-[11px]"
              >
                <Navigation className="w-3 h-3" /> Use My GPS
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-500 text-[10px] mb-0.5">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-500 text-[10px] mb-0.5">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Items / Inventory Summary (comma separated)</label>
            <input
              type="text"
              value={formData.inventory_summary}
              onChange={(e) => setFormData({ ...formData, inventory_summary: e.target.value })}
              placeholder="Seeds, Fertilizers, Sprayers"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuggestShopModal;
