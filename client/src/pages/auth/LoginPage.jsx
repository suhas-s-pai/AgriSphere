import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sprout,
  ShieldCheck,
} from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const REMEMBER_EMAIL_KEY = 'agrisphere_remembered_email';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();

  // Form fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Status and Validation states
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Destination after login
  const from = location.state?.from?.pathname || '/dashboard';

  // Load remembered email on mount
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
      if (savedEmail) {
        setIdentifier(savedEmail);
        setRememberMe(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && user && !loginSuccess) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from, loginSuccess]);

  const validate = () => {
    const newErrors = {};
    const trimmedId = identifier.trim();

    if (!trimmedId) {
      newErrors.identifier = 'Email address or mobile number is required.';
    } else if (
      trimmedId.includes('@') &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedId)
    ) {
      newErrors.identifier = 'Please enter a valid email address.';
    } else if (
      /^\d+$/.test(trimmedId) &&
      trimmedId.length !== 10
    ) {
      newErrors.identifier = 'Mobile number must be 10 digits.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
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
      const res = await login(identifier.trim(), password);

      if (res.success) {
        // Handle Remember Me
        try {
          if (rememberMe) {
            localStorage.setItem(REMEMBER_EMAIL_KEY, identifier.trim());
          } else {
            localStorage.removeItem(REMEMBER_EMAIL_KEY);
          }
        } catch {
          // ignore
        }

        setLoginSuccess(true);
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 600);
      } else {
        setServerError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setServerError('Unable to connect to AgriSphere server. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Farmer Sign In"
      subtitle="Access your farm records, live APMC market prices, crop disease insights, and buyer orders."
      badgeText="Secure Farmer Access"
    >
      {/* Mobile Branding Header */}
      <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-[#15803D] text-white flex items-center justify-center shadow-xs">
          <Sprout className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#14532D] leading-tight">AgriSphere Account</h2>
          <p className="text-[11px] text-[#64748B]">Sign in with your registered email or phone</p>
        </div>
      </div>

      {/* Server Error Alert Banner */}
      {serverError && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-2.5 text-xs animate-shake">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Authentication Failed</p>
            <p className="mt-0.5 text-red-700">{serverError}</p>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {loginSuccess && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="font-bold">Welcome back! Redirecting to your dashboard...</p>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Email or Phone field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Email Address or Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errors.identifier) setErrors({ ...errors, identifier: '' });
                if (serverError) setServerError('');
              }}
              placeholder="e.g. patil@farm.karnataka.in or 9845533102"
              className={`w-full bg-[#F8FAF6] hover:bg-white focus:bg-white border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1F2937] placeholder-slate-400 focus:outline-none transition-all ${
                errors.identifier
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                  : 'border-slate-200 focus:ring-2 focus:ring-emerald-200 focus:border-[#15803D]'
              }`}
            />
          </div>
          {errors.identifier && (
            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.identifier}</span>
            </p>
          )}
        </div>

        {/* Password field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">
              Password <span className="text-red-500">*</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] font-semibold text-[#15803D] hover:text-[#14532D] hover:underline transition"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
                if (serverError) setServerError('');
              }}
              placeholder="Enter your password"
              className={`w-full bg-[#F8FAF6] hover:bg-white focus:bg-white border rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#1F2937] placeholder-slate-400 focus:outline-none transition-all ${
                errors.password
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500'
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
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-[#15803D] focus:ring-emerald-500 border-slate-300 transition"
            />
            <span className="text-xs text-slate-600 font-medium">
              Remember me on this device
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || loginSuccess}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-[#15803D] hover:bg-[#14532D] active:scale-[0.99] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In to AgriSphere</span>
            </>
          )}
        </button>
      </form>

      {/* Security & Verification Guarantee */}
      <div className="mt-5 p-3 rounded-xl bg-[#F8FAF6] border border-slate-200/80 flex items-center gap-2.5 text-[11px] text-slate-600">
        <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0" />
        <span>End-to-end encrypted authentication ready for Supabase Auth integration.</span>
      </div>

      {/* Switch to Signup Link */}
      <div className="mt-6 pt-5 border-t border-slate-200 text-center text-xs text-slate-600">
        <p>
          Don't have an account yet?{' '}
          <Link
            to="/signup"
            className="font-bold text-[#15803D] hover:text-[#14532D] hover:underline transition"
          >
            Create Farmer Account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
