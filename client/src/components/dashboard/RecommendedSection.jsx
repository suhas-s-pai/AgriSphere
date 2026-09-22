import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sprout, Droplets, ShieldAlert, BarChart3 } from 'lucide-react';

const recommendations = [
  {
    id: 1,
    title: 'Best Crops to Grow This Season in Belagavi',
    badge: 'Recommendation',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: Sprout,
    path: '/crops',
    bgGradient: 'from-emerald-700 via-green-800 to-teal-900',
  },
  {
    id: 2,
    title: 'Irrigation Tips for Better Yield',
    badge: 'Farming Tip',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Droplets,
    path: '/farming-tools',
    bgGradient: 'from-amber-800 via-yellow-900 to-stone-900',
  },
  {
    id: 3,
    title: 'Common Diseases in Tomato and How to Manage',
    badge: 'Disease Guide',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: ShieldAlert,
    path: '/diseases-pests',
    bgGradient: 'from-lime-800 via-emerald-900 to-green-950',
  },
  {
    id: 4,
    title: 'Current Market Trends in Karnataka',
    badge: 'Market Update',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: BarChart3,
    path: '/market-prices',
    bgGradient: 'from-orange-800 via-amber-900 to-yellow-950',
  },
];

const RecommendedSection = () => {
  return (
    <div className="space-y-1.5 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between leading-none">
        <div>
          <h2 className="text-xs font-black text-slate-900 tracking-tight">
            Recommended for You
          </h2>
          <p className="text-[9.5px] text-slate-400 font-medium leading-none mt-0.5">
            Based on your location (Belagavi) and current season
          </p>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-1">
          <button
            className="p-0.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition-colors shadow-2xs"
            aria-label="Previous recommendation"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <button
            className="p-0.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition-colors shadow-2xs"
            aria-label="Next recommendation"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Grid of 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {recommendations.map((item) => {
          const IconComp = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className="group flex flex-col justify-between bg-white rounded-xl border border-slate-200/80 overflow-hidden hover:border-agri-300 hover:shadow-card transition-all duration-150"
            >
              {/* Card Banner */}
              <div className={`h-14 bg-gradient-to-r ${item.bgGradient} p-2 relative flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <IconComp className="w-10 h-10 text-white/10 absolute -right-2 -bottom-2 stroke-[1.2]" />
                <div className="relative z-10 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white ring-1 ring-white/30 shadow-2xs">
                  <IconComp className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-2 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-[10.5px] font-bold text-slate-900 group-hover:text-agri-700 transition-colors line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span
                    className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded-full border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                  <ArrowRight className="w-2.5 h-2.5 text-slate-400 group-hover:text-agri-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedSection;
