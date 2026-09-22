import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sprout,
  SunMedium,
  TrendingUp,
  Calculator,
  Bug,
  Layers,
  Landmark,
  ShoppingCart,
  MapPin,
  BookOpen,
  Warehouse,
  Bell,
  ArrowRight,
} from 'lucide-react';

const featureList = [
  {
    id: 'crops',
    title: 'Crop Information',
    description: 'Learn about crops, varieties, and best practices',
    icon: Sprout,
    path: '/crops',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 'weather',
    title: 'Weather',
    description: 'Real-time weather and 7-day forecast',
    icon: SunMedium,
    path: '/weather',
    iconBg: 'bg-amber-50 text-amber-500',
  },
  {
    id: 'market',
    title: 'Market Prices',
    description: 'Check crop prices and market trends',
    icon: TrendingUp,
    path: '/market-prices',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 'tools',
    title: 'Farming Tools',
    description: 'Calculate seeds, fertilizers, irrigation and more',
    icon: Calculator,
    path: '/farming-tools',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 'diseases',
    title: 'Diseases & Pests',
    description: 'Identify and manage crop diseases',
    icon: Bug,
    path: '/diseases-pests',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 'soil',
    title: 'Soil & Fertilizers',
    description: 'Know your soil and get fertilizer guidance',
    icon: Layers,
    path: '/soil-fertilizers',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 'schemes',
    title: 'Government Schemes',
    description: 'Explore relevant schemes and subsidies',
    icon: Landmark,
    path: '/government-schemes',
    iconBg: 'bg-rose-50 text-rose-600',
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    description: 'Buy and sell agricultural products',
    icon: ShoppingCart,
    path: '/marketplace',
    iconBg: 'bg-rose-50 text-rose-600',
  },
  {
    id: 'maps',
    title: 'Maps & Nearby',
    description: 'Find markets, resources and nearby services',
    icon: MapPin,
    path: '/maps-nearby',
    iconBg: 'bg-sky-50 text-sky-600',
  },
  {
    id: 'knowledge',
    title: 'Knowledge Hub',
    description: 'Articles, guides and farming resources',
    icon: BookOpen,
    path: '/knowledge-hub',
    iconBg: 'bg-purple-50 text-purple-600',
  },
  {
    id: 'farm',
    title: 'My Farm',
    description: 'Manage your farm, crops and preferences',
    icon: Warehouse,
    path: '/my-farm',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Important alerts and updates',
    icon: Bell,
    path: '/notifications',
    iconBg: 'bg-rose-50 text-rose-600',
  },
];

const ExploreFeatures = () => {
  return (
    <div className="space-y-1.5 shrink-0">
      <div className="leading-none">
        <h2 className="text-xs font-black text-slate-900 tracking-tight">
          Explore Our Features
        </h2>
        <p className="text-[9.5px] text-slate-400 font-medium leading-none mt-0.5">
          Everything you need for smarter farming, in one place.
        </p>
      </div>

      {/* 4-column ultra-compact grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {featureList.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className="group relative flex flex-col justify-between p-2.5 bg-white rounded-xl border border-slate-200/80 hover:border-agri-300 hover:shadow-card transition-all duration-150 min-h-[66px]"
            >
              <div className="space-y-1">
                <div className={`w-6 h-6 rounded-md ${item.iconBg} flex items-center justify-center shrink-0`}>
                  <IconComponent className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-slate-900 group-hover:text-agri-700 transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[9.5px] text-slate-400 leading-tight mt-0.5 font-medium line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-1">
                <ArrowRight className="w-2.5 h-2.5 text-slate-400 group-hover:text-agri-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreFeatures;
