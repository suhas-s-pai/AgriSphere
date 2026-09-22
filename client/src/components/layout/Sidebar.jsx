import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Sprout,
  SunMedium,
  TrendingUp,
  Wrench,
  Bug,
  Layers,
  Landmark,
  ShoppingCart,
  MapPin,
  BookOpen,
  Warehouse,
  Bell,
  Headphones,
} from 'lucide-react';

export const navigationItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Crops', path: '/crops', icon: Sprout },
  { name: 'Weather', path: '/weather', icon: SunMedium },
  { name: 'Market Prices', path: '/market-prices', icon: TrendingUp },
  { name: 'Farming Tools', path: '/farming-tools', icon: Wrench },
  { name: 'Diseases & Pests', path: '/diseases-pests', icon: Bug },
  { name: 'Soil & Fertilizers', path: '/soil-fertilizers', icon: Layers },
  { name: 'Government Schemes', path: '/government-schemes', icon: Landmark },
  { name: 'Marketplace', path: '/marketplace', icon: ShoppingCart },
  { name: 'Maps & Nearby', path: '/maps-nearby', icon: MapPin },
  { name: 'Knowledge Hub', path: '/knowledge-hub', icon: BookOpen },
  { name: 'My Farm', path: '/my-farm', icon: Warehouse },
  { name: 'Notifications', path: '/notifications', icon: Bell },
];

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-52 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto lg:h-[calc(100vh-48px)] shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation Links Area */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 select-none">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium text-[11.5px] transition-all ${
                    isActive
                      ? 'bg-agri-600 text-white shadow-2xs font-semibold'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Support Card */}
        <div className="p-2 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <NavLink
            to="/help-support"
            onClick={onCloseMobile}
            className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200/80 hover:border-agri-300 hover:shadow-2xs transition-all group"
          >
            <div className="w-6 h-6 rounded-md bg-agri-50 text-agri-700 flex items-center justify-center shrink-0 group-hover:bg-agri-600 group-hover:text-white transition-colors">
              <Headphones className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10.5px] font-bold text-slate-800 leading-none">Need Help?</p>
              <p className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">Contact Support</p>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
