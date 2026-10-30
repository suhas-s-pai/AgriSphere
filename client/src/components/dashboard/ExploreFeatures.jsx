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
    description: 'Learn about crop varieties, suitability, and cultivation guides.',
    icon: Sprout,
    path: '/crops',
    iconColor: 'bg-green-100 text-green-700',
  },
  {
    id: 'weather',
    title: 'Weather',
    description: 'Real-time weather, rainfall forecast, and field advisories.',
    icon: SunMedium,
    path: '/weather',
    iconColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'market',
    title: 'Market Prices',
    description: 'Check APMC mandi rates and price trends for your crops.',
    icon: TrendingUp,
    path: '/market-prices',
    iconColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'tools',
    title: 'Farming Tools & Maps',
    description: 'Calculate seeds, fertilizers, and irrigation water needs.',
    icon: Calculator,
    path: '/farming-tools',
    iconColor: 'bg-teal-100 text-teal-700',
  },
  {
    id: 'diseases',
    title: 'Diseases & Pests',
    description: 'Identify crop diseases, pest symptoms, and organic remedies.',
    icon: Bug,
    path: '/diseases-pests',
    iconColor: 'bg-red-100 text-red-700',
  },
  {
    id: 'soil',
    title: 'Soil & Fertilizers',
    description: 'Know your soil condition and get fertilizer recommendations.',
    icon: Layers,
    path: '/soil-fertilizers',
    iconColor: 'bg-stone-100 text-amber-900',
  },
  {
    id: 'schemes',
    title: 'Government Schemes',
    description: 'Explore agricultural subsidies, insurance, and state schemes.',
    icon: Landmark,
    path: '/government-schemes',
    iconColor: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    description: 'Buy and sell agricultural equipment, seeds, and produce.',
    icon: ShoppingCart,
    path: '/marketplace',
    iconColor: 'bg-orange-100 text-orange-700',
  },
  {
    id: 'maps',
    title: 'Maps & Nearby Services',
    description: 'Find nearby APMC markets, cold storages, and testing labs.',
    icon: MapPin,
    path: '/maps-nearby',
    iconColor: 'bg-sky-100 text-sky-700',
  },
  {
    id: 'knowledge',
    title: 'Knowledge Hub',
    description: 'Helpful farming articles, best practices, and video tutorials.',
    icon: BookOpen,
    path: '/knowledge-hub',
    iconColor: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'farm',
    title: 'My Farm',
    description: 'Keep track of your farm plots, crops, and seasonal records.',
    icon: Warehouse,
    path: '/my-farm',
    iconColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Stay updated with important farming alerts and notices.',
    icon: Bell,
    path: '/notifications',
    iconColor: 'bg-rose-100 text-rose-700',
  },
];

const ExploreFeatures = () => {
  return (
    <div id="explore-features">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-[#14532D]">
          Explore Features
        </h2>
        <p className="text-sm text-[#64748B] mt-0.5">
          Access all AgriSphere tools and farming resources.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {featureList.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-[#15803D] transition-colors flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-10 h-10 rounded-lg ${item.iconColor} flex items-center justify-center mb-3 transition-transform group-hover:scale-105`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#15803D] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-[#64748B] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#15803D]">
                <span>Open</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreFeatures;
