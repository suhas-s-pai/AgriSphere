import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Sprout,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const validate = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your registered email address.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await forgotPassword(email.trim());
      if (res.success) {
        setIsSubmitted(true);
        setSubmittedEmail(email.trim());
        setResendCooldown(60);

        // Timer for resend cooldown
        const interval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(res.message || 'Failed to dispatch password recovery instructions.');
      }
    } catch {
      setError('Network communication failed. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsSubmitting(true);
    try {
      await forgotPassword(submittedEmail);
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setError('Resend failed. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Recover Password"
      subtitle="Enter your registered farmer email to receive secure password reset instructions."
      badgeText="Account Recovery"
    >
      {/* Mobile Branding Header */}
      <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-[#15803D] text-white flex items-center justify-center shadow-xs">
          <Sprout className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#14532D] leading-tight">AgriSphere Recovery</h2>
          <p className="text-[11px] text-[#64748B]">Verify your identity to reset password</p>
        </div>
      </div>

      {isSubmitted ? (
        /* Success Confirmation Card */
        <div className="space-y-5 text-xs text-center py-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shadow-xs border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-black text-[#14532D]">
              Instructions Dispatched
            </h3>
            <p className="text-slate-600 max-w-sm mx-auto leading-relaxed">
              If an AgriSphere farmer account is associated with{' '}
              <strong className="text-slate-900 font-semibold">{submittedEmail}</strong>,
              we have sent a secure link to reset your password.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAF6] border border-slate-200 text-left text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldAlert className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Next Steps:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
              <li>Open your email inbox and look for an email from <strong>AgriSphere Support</strong>.</li>
              <li>Click the password recovery link (valid for 60 minutes).</li>
              <li>Check your Spam or Junk folder if you don't see it within 2 minutes.</li>
            </ul>
          </div>

          {/* Resend button */}
          <div className="pt-2">
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isSubmitting}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#15803D] hover:text-[#14532D] disabled:text-slate-400 disabled:cursor-not-allowed transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
              <span>
                {resendCooldown > 0
                  ? `Resend available in ${resendCooldown}s`
                  : 'Didn’t receive the email? Click to resend'}
              </span>
            </button>
          </div>

          {/* Back to Login */}
          <div className="pt-4 border-t border-slate-200">
            <Link
              to="/login"
              className="w-full py-2.5 px-4 rounded-xl bg-[#15803D] hover:bg-[#14532D] text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Sign In</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Initial Form */
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Registered Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. patil@farm.karnataka.in"
                className="w-full bg-[#F8FAF6] hover:bg-white focus:bg-white border border-slate-200 focus:border-[#15803D] focus:ring-2 focus:ring-emerald-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#1F2937] placeholder-slate-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            We will verify your farmer registration and send you a safe, one-time recovery instruction.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-[#15803D] hover:bg-[#14532D] active:scale-[0.99] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Dispatching Instructions...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Reset Instructions</span>
              </>
            )}
          </button>

          <div className="pt-4 border-t border-slate-200 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#15803D] transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
