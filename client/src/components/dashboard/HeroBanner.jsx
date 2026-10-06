import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Sprout, ShieldCheck } from 'lucide-react';

const HeroBanner = () => (
  <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:min-h-[480px] lg:min-h-[530px]">
    <img
      src="/assets/Farmer.png"
      alt="Farmer working in an agricultural field"
      className="absolute inset-0 h-full w-full object-cover object-center"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/10" />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

    <div className="relative z-10 flex min-h-[420px] items-end sm:min-h-[480px] lg:min-h-[530px]">
      <div className="max-w-3xl p-7 sm:p-10 lg:p-14">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">
          <Sprout className="h-4 w-4 text-agri-300" />
          Your agriculture companion
        </div>

        <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
          Farm smarter.
          <span className="block text-agri-300">Grow better.</span>
        </h1>

        <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base sm:leading-7">
          Get timely crop information, weather insights, market prices, farming tools and practical guidance — all in one place.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <NavLink
            to="/crops"
            className="inline-flex items-center gap-2 rounded-full bg-agri-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-black/10 transition hover:bg-agri-400"
          >
            Explore Farming Resources
            <ArrowRight className="h-4 w-4" />
          </NavLink>
          <NavLink
            to="/farming-tools"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-extrabold text-white backdrop-blur-md transition hover:bg-white/20"
          >
            Open Farming Tools
          </NavLink>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-300">
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-agri-300" /> Practical guidance</span>
          <span className="inline-flex items-center gap-1.5"><Sprout className="h-4 w-4 text-agri-300" /> Built for farmers</span>
        </div>
      </div>
    </div>
  </div>
);

export default HeroBanner;
