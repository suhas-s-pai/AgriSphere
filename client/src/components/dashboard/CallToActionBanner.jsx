import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ArrowRight,
  Sprout,
  Calculator,
  BookOpen,
  Bot,
  ShieldCheck,
  Award,
} from 'lucide-react';

const CallToActionBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-agri-900 via-agri-800 to-emerald-900 p-6 sm:p-8 lg:p-10 text-white shadow-md border border-agri-700/50">
      <Sprout className="absolute -right-8 -bottom-10 w-64 h-64 text-white/5 pointer-events-none rotate-12" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-agri-200 border border-white/15">
              Decision Support System
            </span>
            <span className="text-xs text-agri-300 font-medium">• Free for Farmers</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Ready to optimize your farming decisions?
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm text-agri-100/90 leading-relaxed font-normal">
            Take advantage of AgriSphere&apos;s field calculators, crop suitability matrix, regional market intelligence, and AI farming assistant to boost your harvest margins.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-agri-200">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-agri-400" />
              Verified Agronomic Data
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Award className="w-4 h-4 text-agri-400" />
              UAS Dharwad & Belagavi APMC Sourced
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <NavLink
            to="/farming-tools"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-agri-900 text-xs sm:text-sm font-extrabold hover:bg-agri-50 transition-all shadow-sm hover:scale-[1.02]"
          >
            <Calculator className="w-4 h-4 text-agri-700" />
            Launch Farming Tools
            <ArrowRight className="w-4 h-4 text-agri-700" />
          </NavLink>

          <div className="flex items-center gap-2">
            <NavLink
              to="/knowledge-hub"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold border border-white/20 hover:bg-white/20 transition-all text-center"
            >
              <BookOpen className="w-3.5 h-3.5 text-agri-300" />
              Knowledge Hub
            </NavLink>

            <NavLink
              to="/ai-chatbot"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-agri-500 text-white text-xs font-bold hover:bg-agri-400 transition-all text-center shadow-xs"
            >
              <Bot className="w-3.5 h-3.5" />
              AI Assistant
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToActionBanner;
