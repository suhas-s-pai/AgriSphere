import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sprout, ArrowRight } from 'lucide-react';

const CallToActionBanner = () => {
  return (
    <div className="rounded-xl bg-gradient-to-r from-agri-600 via-agri-700 to-emerald-700 p-2.5 md:p-3 text-white shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-2 shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/30">
          <Sprout className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div className="leading-none">
          <h2 className="text-xs md:text-sm font-black tracking-tight">
            Ready to grow smarter?
          </h2>
          <p className="text-[10px] text-agri-100 font-medium leading-none mt-0.5">
            Explore our tools, resources and market opportunities today.
          </p>
        </div>
      </div>

      <NavLink
        to="/farming-tools"
        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-agri-950 hover:bg-black text-white text-[10.5px] font-bold shadow-2xs hover:shadow-xs transition-all group shrink-0"
      >
        <span>Explore Now</span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-agri-300" />
      </NavLink>
    </div>
  );
};

export default CallToActionBanner;
