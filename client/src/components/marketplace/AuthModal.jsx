import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Store,
  Users,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLocationContext } from '../../context/LocationContext.jsx';

const ROLES = [
  {
    id: 'farmer',
    label: 'Farmer / Producer',
    icon: User,
    color: '#15803D',
    bgColor: '#DCFCE7',
    description: 'Sell harvested grains, pulses, fruits, and vegetables directly to buyers and bulk traders.',
  },
  {
    id: 'shop',
    label: 'Agri Shop / Supplier',
    icon: Store,
    color: '#2563EB',
    bgColor: '#DBEAFE',
    description: 'Sell certified seeds, fertilizers, bio-inputs, farm machinery, irrigation, and tools.',
  },
  {
    id: 'buyer',
    label: 'Buyer / Consumer',
    icon: ShoppingBag,
    color: '#D97706',
    bgColor: '#FEF3C7',
    description: 'Browse, order, and purchase agricultural inputs and farm-fresh produce with delivery.',
  },
  {
    id: 'fpo',
    label: 'Farmer Co-op (FPO)',
    icon: Users,
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    description: 'Farmer Producer Organizations & cooperative hubs managing bulk agricultural lots.',
  },
];

const AuthModal = () => {
  const { authModalState, closeAuthModal, login, register, loading } = useAuth();
  const { district: locDistrict, state: locState } = useLocationContext();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [selectedRole, setSelectedRole] = useState('buyer');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    identifier: '', // email or phone for login
    password: '',
    full_name: '',
    email: '',
    mobile_number: '',
    district: locDistrict || 'Belagavi',
    state: locState || 'Karnataka',
    pincode: '590001',
    // Seller specific fields
    business_name: '',
    address: '',
    village: '',
    taluk: '',
    gstin: '',
  });

  useEffect(() => {
    if (authModalState.isOpen) {
      setMode(authModalState.mode || 'login');
      setSelectedRole(authModalState.initialRole || 'buyer');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [authModalState]);

  if (!authModalState.isOpen) return null;

  const isSellerRole = ['farmer', 'shop', 'fpo'].includes(selectedRole);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'login') {
      const res = await login(formData.identifier, formData.password);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    } else {
      // Registration
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        mobile_number: formData.mobile_number,
        password: formData.password,
        role: selectedRole,
        district: formData.district,
        state: formData.state,
        pincode: formData.pincode,
      };

      if (isSellerRole) {
        payload.business_name = formData.business_name || `${formData.full_name}'s Farm/Store`;
        payload.seller_type = selectedRole;
        payload.address = formData.address || `${formData.village || formData.district}, ${formData.state}`;
        payload.village = formData.village;
        payload.taluk = formData.taluk;
        payload.gstin = formData.gstin;
      }

      const res = await register(payload);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={closeAuthModal}
    >
      <div
        className="w-full max-w-lg my-8 rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 relative text-[#1F2937]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-5">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`text-sm font-bold pb-1 relative transition-colors ${
              mode === 'login' ? 'text-[#15803D]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In to AgriSphere
            {mode === 'login' && <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#15803D]" />}
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`text-sm font-bold pb-1 relative transition-colors ${
              mode === 'register' ? 'text-[#15803D]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create New Account
            {mode === 'register' && <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#15803D]" />}
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'login' ? (
            /* --- LOGIN MODE --- */
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Address or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. farmer@agrisphere.org or +91 98451 22910"
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] pl-9 pr-3 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#15803D] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] pl-9 pr-3 py-2.5 text-xs text-[#1F2937] outline-none focus:border-[#15803D] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-[#15803D] hover:bg-[#14532D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                </button>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Demo Admin Account: <strong>admin@agrisphere.org</strong> | Password: <strong>password123</strong>
                </span>
              </div>
            </>
          ) : (
            /* --- REGISTRATION MODE --- */
            <>
              {/* Role Selection Grid */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Select Your Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => {
                    const Icon = r.icon;
                    const isSelected = selectedRole === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => setSelectedRole(r.id)}
                        className={`p-2.5 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#15803D] bg-[#DCFCE7]/40 ring-1 ring-[#15803D]'
                            : 'border-slate-200 bg-[#F8FAF6] hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                            style={{ backgroundColor: r.bgColor, color: r.color }}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-[11px] text-[#1F2937] leading-tight">
                            {r.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-2">{r.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patil"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-2 text-xs outline-none focus:border-[#15803D] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98451 XXXXX"
                    value={formData.mobile_number}
                    onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-2 text-xs outline-none focus:border-[#15803D] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh@farm.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-2 text-xs outline-none focus:border-[#15803D] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-2 text-xs outline-none focus:border-[#15803D] focus:bg-white"
                  />
                </div>
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-2 text-xs outline-none focus:border-[#15803D] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-2 text-xs outline-none focus:border-[#15803D] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="590001"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-2 text-xs outline-none focus:border-[#15803D] focus:bg-white"
                  />
                </div>
              </div>

              {/* SELLER SPECIFIC REGISTRATION FIELDS */}
              {isSellerRole && (
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <span>Seller Business / Farm Registration Details</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {selectedRole === 'farmer' ? 'Farm / Holding Name *' : 'Business / Store / FPO Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={selectedRole === 'farmer' ? 'e.g. Patil Organic Farms' : 'e.g. Belagavi Agro Krishi Kendra'}
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#15803D]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Village / Town</label>
                      <input
                        type="text"
                        placeholder="e.g. Sambra"
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#15803D]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Taluk</label>
                      <input
                        type="text"
                        placeholder="e.g. Belagavi Rural"
                        value={formData.taluk}
                        onChange={(e) => setFormData({ ...formData, taluk: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#15803D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Physical Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Survey No. 84, Sambra Road, Near APMC Outpost"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#15803D]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      GSTIN / Trade License / FPO Reg. No. (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 29AAAAA0000A1Z5 or Department Reg. ID"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#15803D]"
                    />
                  </div>

                  <p className="text-[10px] text-emerald-800 leading-relaxed">
                    ℹ️ Verification status is initially marked as <strong>Pending</strong>. You can list products immediately; official badge is awarded upon document review.
                  </p>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-[#15803D] hover:bg-[#14532D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Complete Registration'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
