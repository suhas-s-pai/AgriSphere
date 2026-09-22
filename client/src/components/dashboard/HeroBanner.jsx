import React from 'react';
import { Sprout } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-slate-900 min-h-[130px] md:min-h-[138px] lg:min-h-[142px] shadow-2xs flex items-center shrink-0">
      {/* Background Image Asset */}
      <img
        src="/assets/Farmer.png"
        alt="AgriSphere Agriculture Field"
        className="absolute inset-0 w-full h-full object-cover object-right md:object-center opacity-95"
      />

      {/* Gradient Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />

      {/* Content Container */}
      <div className="relative z-10 p-3.5 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-3">
        
        {/* Left Text Content */}
        <div className="max-w-md space-y-1">
          <div className="leading-none">
            <h1 className="text-base md:text-lg font-black text-white tracking-tight leading-snug">
              Welcome to <span className="text-agri-400">AgriSphere!</span>
            </h1>
            <p className="text-[10.5px] md:text-[11.5px] font-bold text-slate-200 mt-0.5">
              Your complete agriculture companion
            </p>
          </div>

          <p className="text-[9.5px] md:text-[10.5px] text-slate-300 leading-tight font-normal">
            Get real-time information, expert guidance, and better opportunities for a brighter tomorrow.
          </p>

          {/* Quote Badge Pill */}
          <div className="pt-0.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md shadow-2xs text-slate-800 text-[9.5px] font-extrabold border border-white/40">
              "Better Information. Brighter Harvests."
            </span>
          </div>
        </div>

        {/* Right Glass Card */}
        <div className="hidden lg:flex flex-col justify-between p-2.5 rounded-lg bg-agri-950/85 backdrop-blur-md border border-agri-500/30 text-white min-w-[155px] shadow-2xs shrink-0">
          <div className="space-y-0.5 text-[9.5px] font-semibold text-slate-200 leading-tight">
            <p className="text-white font-bold text-[10.5px]">Support Farmers</p>
            <p>Stronger Communities</p>
            <p>A Greener Tomorrow</p>
          </div>
          <div className="flex justify-end mt-1">
            <div className="p-0.5 rounded-md bg-agri-500/20 text-agri-400">
              <Sprout className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroBanner;
