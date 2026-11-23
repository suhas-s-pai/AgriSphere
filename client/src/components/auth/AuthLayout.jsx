import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ArrowLeft,
  TrendingUp,
  ShoppingCart,
  ShieldCheck,
  CloudSun,
  CheckCircle2,
  Users,
} from 'lucide-react';

const AuthLayout = ({
  children,
  title,
  subtitle,
  badgeText = 'Farmer Portal',
}) => {
  return (
    <div className="min-h-screen w-full flex bg-[#F8FAF6] text-[#1F2937] antialiased">
      {/* LEFT: Agricultural Showcase Hero (Desktop / Tablet Large) */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative flex-col justify-between p-10 xl:p-14 bg-gradient-to-br from-[#14532D] via-[#166534] to-[#15803D] text-white overflow-hidden">
        {/* Subtle Decorative Background Farm Patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="currentColor" />
            <path d="M0,70 Q35,55 70,70 T100,70 L100,100 L0,100 Z" fill="currentColor" opacity="0.6" />
          </svg>
        </div>

        {/* Floating Ambient Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-300/10 blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform shadow-lg">
              <Sprout className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white block leading-tight">
                AgriSphere
              </span>
              <span className="text-xs font-semibold text-emerald-200 tracking-wider uppercase">
                Smart Agriculture Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Mission & Highlights */}
        <div className="relative z-10 my-auto py-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-500/30 text-emerald-200 text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Dedicated Farmer & Producer Network</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-black leading-tight text-white">
            Empowering Farmers Across India with Technology & Fair Markets
          </h2>

          <p className="text-sm xl:text-base text-emerald-100/90 leading-relaxed max-w-lg">
            Access certified seed depots, real-time APMC mandi benchmarks, crop disease AI detection, and direct buyer connections all from one unified agricultural portal.
          </p>

          {/* Agricultural Feature Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <TrendingUp className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Live APMC Mandi Rates</h4>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">Karnataka Agmarknet & e-NAM prices</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <ShoppingCart className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Direct Marketplace</h4>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">Zero middlemen, transparent pricing</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <CloudSun className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Weather & Advisory</h4>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">Sowing windows & rain forecasts</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Govt Schemes Access</h4>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">PM-KISAN, Raitha Siri & Subsidies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="relative z-10 pt-4 border-t border-emerald-600/40 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-300" />
            <span>Trusted by 50,000+ Progressive Indian Farmers</span>
          </div>
          <span className="font-semibold text-white/80">Karnataka Hub</span>
        </div>
      </div>

      {/* RIGHT: Main Form Container */}
      <div className="w-full lg:w-7/12 xl:w-1/2 flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-y-auto">
        {/* Top Utility Bar: Back to Home + Mobile Logo */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-[#15803D] hover:border-emerald-300 hover:bg-emerald-50/50 transition shadow-2xs group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-slate-500 group-hover:text-[#15803D]" />
            <span>Back to Dashboard</span>
          </Link>

          {/* Mobile Logo (Visible when left panel is hidden) */}
          <Link to="/" className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#15803D] text-white flex items-center justify-center shadow-xs">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-[#14532D]">AgriSphere</span>
          </Link>

          <span className="text-[11px] font-bold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md hidden sm:inline-block">
            {badgeText}
          </span>
        </div>

        {/* Centered Form Card */}
        <div className="mx-auto w-full max-w-md my-auto py-2">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-[#14532D] tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
            {children}
          </div>
        </div>

        {/* Bottom Simple Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#64748B]">
          <p>© {new Date().getFullYear()} AgriSphere. Made for Indian Agriculture.</p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link to="/help-support" className="hover:text-[#15803D] transition">Help & Support</Link>
            <span>•</span>
            <Link to="/government-schemes" className="hover:text-[#15803D] transition">Farmer Schemes</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
