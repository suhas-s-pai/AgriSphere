import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Sprout } from 'lucide-react';

const CallToActionBanner = () => (
  <div className="relative overflow-hidden rounded-[2rem] bg-agri-800 px-7 py-10 text-white shadow-[0_18px_45px_rgba(21,108,60,0.18)] sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-12">
    <Sprout className="absolute -right-5 -top-10 h-56 w-56 rotate-12 text-white/5" />
    <div className="relative max-w-2xl">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-agri-200">Make your next decision easier</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Ready to grow smarter?</h2>
      <p className="mt-3 text-sm leading-6 text-agri-100 sm:text-base">
        Explore our farming tools, crop resources, market information and practical guidance today.
      </p>
    </div>
    <NavLink
      to="/farming-tools"
      className="relative mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-agri-800 transition hover:bg-agri-50 lg:mt-0"
    >
      Explore Now <ArrowRight className="h-4 w-4" />
    </NavLink>
  </div>
);

export default CallToActionBanner;
