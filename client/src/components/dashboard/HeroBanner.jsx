import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Sprout, Calendar, Droplets, Bell, MapPin, Sparkles } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-agri-950 via-agri-900 to-agri-800 text-white shadow-md border border-agri-700/50">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-agri-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 p-6 sm:p-8 lg:p-10">
        {/* Left Text and CTA Content */}
        <div className="max-w-2xl flex-1">
          {/* Top chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-agri-200 backdrop-blur border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-agri-400" />
              Belagavi, Karnataka
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
              <Calendar className="w-3.5 h-3.5 text-emerald-300" />
              Rabi Season Active
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30">
              <Droplets className="w-3.5 h-3.5 text-amber-300" />
              Next Irrigation: Tomorrow
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
            Welcome back, <span className="text-agri-300">Ramesh!</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-agri-100/90 leading-relaxed font-normal max-w-xl">
            Here is your farm summary and agricultural advisories for today in Belagavi. Monitor your crops, check live mandi rates, and explore recommended farming practices.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <NavLink
              to="/crops"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-agri-500 text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-agri-400 transition-all hover:shadow hover:scale-[1.02]"
            >
              <Sprout className="w-4 h-4" />
              Explore Farming Resources
              <ArrowRight className="w-4 h-4" />
            </NavLink>

            <NavLink
              to="/farming-tools"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs sm:text-sm font-bold border border-white/20 backdrop-blur hover:bg-white/20 transition-all"
            >
              Farming Calculators
            </NavLink>

            <NavLink
              to="/ai-chatbot"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-800/80 text-emerald-200 text-xs sm:text-sm font-bold border border-emerald-600/40 hover:bg-emerald-700/80 transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              Ask AI Assistant
            </NavLink>
          </div>
        </div>

        {/* Right Decorative Graphic / Farmer Image */}
        <div className="relative shrink-0 w-48 sm:w-56 lg:w-64 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-agri-600/30 rounded-2xl blur-xl" />
            <img
              src="/assets/Farmer.png"
              alt="Farmer Ramesh Patil"
              className="relative w-44 sm:w-52 lg:w-60 h-auto object-contain rounded-2xl drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
