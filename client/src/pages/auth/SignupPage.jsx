import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sprout,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLocationContext } from '../../context/LocationContext.jsx';
import {
  INDIAN_STATES,
  getDistrictsForState,
} from '../../utils/indianLocations.js';

const SignupPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuth();
  const { location, hasCoordinates } = useLocationContext();

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    state: 'Karnataka',
    district: 'Belagavi',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Sync state & district from LocationContext if available
  useEffect(() => {
    if (location?.state && INDIAN_STATES.includes(location.state)) {
      setFormData((prev) => ({
        ...prev,
        state: location.state,
        district: location.district || prev.district,
      }));
    } else if (location?.district) {
      setFormData((prev) => ({
        ...prev,
        district: location.district,
      }));
    }
  }, [location]);

  // If already logged in, redirect
  useEffect(() => {
    if (isAuthenticated && user && !registrationSuccess) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate, registrationSuccess]);

  // District list dynamically based on chosen state
  const availableDistricts = getDistrictsForState(formData.state);

  // Change state handler
  const handleStateChange = (e) => {
    const newState = e.target.value;
    const newDistricts = getDistrictsForState(newState);
    setFormData((prev) => ({
      ...prev,
      state: newState,
      district: newDistricts[0] || '',
    }));
    if (errors.state) setErrors((prev) => ({ ...prev, state: '' }));
  };

  const validate = () => {
    const newErrors = {};

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters.';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Phone (optional, but validate format if entered)
    if (formData.phone.trim()) {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        newErrors.phone = 'Please enter a valid 10-digit mobile number.';
      }
    }

    // State & District
    if (!formData.state) {
      newErrors.state = 'Please select your state.';
    }
    if (!formData.district.trim()) {
      newErrors.district = 'Please select your district.';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    // Terms
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the farmer community terms.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        full_name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile_number: formData.phone.trim() ? `+91 ${formData.phone.replace(/\D/g, '')}` : null,
        password: formData.password,
        role: 'farmer',
        state: formData.state,
        district: formData.district,
        pincode: '590001',
        business_name: `${formData.fullName.trim()}'s Organic Farm`,
        seller_type: 'farmer',
      };

      const res = await register(payload);

      if (res.success) {
        setRegistrationSuccess(true);
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 800);
      } else {
        setServerError(res.message || 'Registration failed. Please check the entered data.');
      }
    } catch (err) {
      setServerError('Unable to connect to AgriSphere server. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create Farmer Account"
      subtitle="Join thousands of Indian farmers using AgriSphere for market prices, crop diagnostics, and direct selling."
      badgeText="Free Farmer Registration"
    >
      {/* Mobile Branding Header */}
      <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-[#15803D] text-white flex items-center justify-center shadow-xs">
          <Sprout className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#14532D] leading-tight">Farmer Onboarding</h2>
          <p className="text-[11px] text-[#64748B]">Set up your free agricultural profile</p>
        </div>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Registration Problem</p>
            <p className="mt-0.5 text-red-700">{serverError}</p>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {registrationSuccess && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="font-bold">Account created successfully! Preparing your personalized farm dashboard...</p>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoComplete="name"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
                if (serverError) setServerError('');
              }}
              placeholder="e.g. Ramesh S. Patil"
              className={`w-full bg-[#F8FAF6] hover:bg-white focus:bg-white border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1F2937] placeholder-slate-400 focus:outline-none transition-all ${
                errors.fullName
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                  : 'border-slate-200 focus:ring-2 focus:ring-emerald-200 focus:border-[#15803D]'
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
                if (serverError) setServerError('');
              }}
              placeholder="farmer@karnataka.in"
              className={`w-full bg-[#F8FAF6] hover:bg-white focus:bg-white border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1F2937] placeholder-slate-400 focus:outline-none transition-all ${
                errors.email
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                  : 'border-slate-200 focus:ring-2 focus:ring-emerald-200 focus:border-[#15803D]'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Phone Number (Optional) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">
              Phone Number
            </label>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Optional
            </span>
          </div>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              placeholder="10-digit number (e.g. 98455 12345)"
              className={`w-full bg-[#F8FAF6] hover:bg-white focus:bg-white border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1F2937] placeholder-slate-400 focus:outline-none transition-all ${
                errors.phone
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                  : 'border-slate-200 focus:ring-2 focus:ring-emerald-200 focus:border-[#15803D]'
              }`}
            />
          </div>
          {errors.phone && (
            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>

        {/* State and District Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* State */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              State <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={formData.state}
                onChange={handleStateChange}
                className="w-full bg-[#F8FAF6] hover:bg-white focus:bg-white border border-slate-200 rounded-xl pl-10 pr-8 py-2.5 text-xs font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-[#15803D] transition-all cursor-pointer"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* District */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              District <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.district}
                onChange={(e) => {
                  setFormData({ ...formData, district: e.target.value });
                  if (errors.district) setErrors({ ...errors, district: '' });
                }}
                className="w-full bg-[#F8FAF6] hover:bg-white focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-[#15803D] transition-all cursor-pointer"
              >
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            {errors.district && (
              <p className="text-[11px] text-red-600 font-medium mt-0.5">
                {errors.district}
              </p>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: '' });
                if (serverError) setServerError('');
              }}
              placeholder="At least 6 characters"
              className={`w-full bg-[#F8FAF6] hover:bg-white focus:bg-white border rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#1F2937] placeholder-slate-400 focus:outline-none transition-all ${
                errors.password
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                  : 'border-slate-200 focus:ring-2 focus:ring-emerald-200 focus:border-[#15803D]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 focus:outline-none"
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-700">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                if (serverError) setServerError('');
              }}
              placeholder="Re-enter password to confirm"
              className={`w-full bg-[#F8FAF6] hover:bg-white focus:bg-white border rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#1F2937] placeholder-slate-400 focus:outline-none transition-all ${
                errors.confirmPassword
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                  : 'border-slate-200 focus:ring-2 focus:ring-emerald-200 focus:border-[#15803D]'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 focus:outline-none"
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.confirmPassword}</span>
            </p>
          )}
        </div>

        {/* Agreement Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              className="w-4 h-4 rounded text-[#15803D] focus:ring-emerald-500 border-slate-300 mt-0.5 transition shrink-0"
            />
            <span className="text-[11px] text-slate-600 leading-tight">
              I agree to the AgriSphere farmer terms, fair mandi trading standards, and agricultural data privacy policy.
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-[11px] text-red-600 font-medium mt-1">
              {errors.agreeTerms}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || registrationSuccess}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-[#15803D] hover:bg-[#14532D] active:scale-[0.99] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Farmer Account...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      {/* Role / Farmer Assurance Note */}
      <div className="mt-4 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center gap-2 text-[11px] text-emerald-900">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>Default role is <strong>Farmer & Producer</strong>. You can list crops and buy inputs immediately.</span>
      </div>

      {/* Link to Login */}
      <div className="mt-5 pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
        <p>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-[#15803D] hover:text-[#14532D] hover:underline transition"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
