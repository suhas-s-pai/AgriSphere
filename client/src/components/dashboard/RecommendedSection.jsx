import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Sprout, Droplets, ShieldAlert, BarChart3 } from 'lucide-react';

const recommendations = [
  { id: 1, title: 'Best Crops to Grow This Season in Belagavi', badge: 'Recommendation', icon: Sprout, path: '/crops', bg: 'from-emerald-900 via-green-800 to-teal-700' },
  { id: 2, title: 'Irrigation Tips for Better Yield', badge: 'Farming Tip', icon: Droplets, path: '/farming-tools', bg: 'from-amber-900 via-yellow-800 to-orange-700' },
  { id: 3, title: 'Common Diseases in Tomato and How to Manage', badge: 'Disease Guide', icon: ShieldAlert, path: '/diseases-pests', bg: 'from-lime-900 via-emerald-800 to-green-700' },
  { id: 4, title: 'Current Market Trends in Karnataka', badge: 'Market Update', icon: BarChart3, path: '/market-prices', bg: 'from-orange-900 via-amber-800 to-yellow-700' },
];

const RecommendedSection = () => (
  <div>
    <div className="mb-7">
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-agri-600">Useful right now</p>
      <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Recommended for You</h2>
      <p className="mt-2 text-sm text-slate-500">Based on your location in Belagavi and the current farming season.</p>
    </div>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      {recommendations.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.id}
            to={item.path}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_25px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(15,23,42,0.09)]"
          >
            <div className={`relative flex h-40 items-end overflow-hidden bg-gradient-to-br ${item.bg} p-5`}>
              <div className="absolute -right-4 -top-5 opacity-10"><Icon className="h-36 w-36" /></div>
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="p-5">
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-500">
                {item.badge}
              </span>
              <h3 className="mt-3 min-h-[52px] text-base font-extrabold leading-6 text-slate-900 group-hover:text-agri-700">
                {item.title}
              </h3>
              <div className="mt-5 flex items-center gap-1 text-xs font-extrabold text-agri-600">
                Read more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </NavLink>
        );
      })}
    </div>
  </div>
);

export default RecommendedSection;
