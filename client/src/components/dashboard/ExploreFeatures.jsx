import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sprout, SunMedium, TrendingUp, Calculator, Bug, Layers, Landmark,
  ShoppingCart, MapPin, BookOpen, Warehouse, Bell, ArrowRight,
} from 'lucide-react';

const featureList = [
  { id: 'crops', title: 'Crop Information', description: 'Learn about crops, varieties, and best practices', icon: Sprout, path: '/crops', iconBg: 'bg-emerald-50 text-emerald-700' },
  { id: 'weather', title: 'Weather', description: 'Real-time weather and 7-day forecast', icon: SunMedium, path: '/weather', iconBg: 'bg-amber-50 text-amber-600' },
  { id: 'market', title: 'Market Prices', description: 'Check crop prices and market trends', icon: TrendingUp, path: '/market-prices', iconBg: 'bg-emerald-50 text-emerald-700' },
  { id: 'tools', title: 'Farming Tools', description: 'Calculate seeds, fertilizers, irrigation and more', icon: Calculator, path: '/farming-tools', iconBg: 'bg-emerald-50 text-emerald-700' },
  { id: 'diseases', title: 'Diseases & Pests', description: 'Identify and manage crop diseases', icon: Bug, path: '/diseases-pests', iconBg: 'bg-emerald-50 text-emerald-700' },
  { id: 'soil', title: 'Soil & Fertilizers', description: 'Know your soil and get fertilizer guidance', icon: Layers, path: '/soil-fertilizers', iconBg: 'bg-emerald-50 text-emerald-700' },
  { id: 'schemes', title: 'Government Schemes', description: 'Explore relevant schemes and subsidies', icon: Landmark, path: '/government-schemes', iconBg: 'bg-rose-50 text-rose-700' },
  { id: 'marketplace', title: 'Marketplace', description: 'Buy and sell agricultural products', icon: ShoppingCart, path: '/marketplace', iconBg: 'bg-orange-50 text-orange-700' },
  { id: 'maps', title: 'Maps & Nearby', description: 'Find markets, resources and nearby services', icon: MapPin, path: '/maps-nearby', iconBg: 'bg-sky-50 text-sky-700' },
  { id: 'knowledge', title: 'Knowledge Hub', description: 'Articles, guides and farming resources', icon: BookOpen, path: '/knowledge-hub', iconBg: 'bg-purple-50 text-purple-700' },
  { id: 'farm', title: 'My Farm', description: 'Manage your farm, crops and preferences', icon: Warehouse, path: '/my-farm', iconBg: 'bg-emerald-50 text-emerald-700' },
  { id: 'notifications', title: 'Notifications', description: 'Important alerts and updates', icon: Bell, path: '/notifications', iconBg: 'bg-rose-50 text-rose-700' },
];

const ExploreFeatures = () => (
  <div>
    <div className="mb-7 max-w-2xl">
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-agri-600">Everything in one place</p>
      <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Explore AgriSphere</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
        Practical information, tools and opportunities to help you make better decisions throughout the farming season.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {featureList.map((item) => {
        const IconComponent = item.icon;
        return (
          <NavLink
            key={item.id}
            to={item.path}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.035)] transition-all duration-200 hover:-translate-y-1 hover:border-agri-200 hover:shadow-[0_16px_35px_rgba(15,23,42,0.08)]"
          >
            <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${item.iconBg}`}>
              <IconComponent className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-agri-700">{item.title}</h3>
            <p className="mt-2 min-h-[42px] text-sm leading-5 text-slate-500">{item.description}</p>
            <div className="mt-5 flex items-center gap-1 text-xs font-extrabold text-agri-600">
              Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </NavLink>
        );
      })}
    </div>
  </div>
);

export default ExploreFeatures;
