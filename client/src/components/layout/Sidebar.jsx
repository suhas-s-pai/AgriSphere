import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  CloudSun,
  TrendingUp,
  Warehouse,
  Bug,
  Layers,
  Wrench,
  Landmark,
  ShoppingCart,
  BookOpen,
  Bot,
  Bell,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

const navSections = [
  {
    title: 'MAIN',
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'Crop Information', path: '/crops', icon: Sprout },
      { name: 'Weather', path: '/weather', icon: CloudSun },
      { name: 'Market Prices', path: '/market-prices', icon: TrendingUp },
    ],
  },
  {
    title: 'FARM',
    items: [
      { name: 'My Farm', path: '/my-farm', icon: Warehouse },
      { name: 'Diseases & Pests', path: '/diseases-pests', icon: Bug },
      { name: 'Soil & Fertilizers', path: '/soil-fertilizers', icon: Layers },
      { name: 'Farming Tools & Maps', path: '/farming-tools', icon: Wrench },
    ],
  },
  {
    title: 'RESOURCES',
    items: [
      { name: 'Government Schemes', path: '/government-schemes', icon: Landmark },
      { name: 'Marketplace', path: '/marketplace', icon: ShoppingCart },
      { name: 'Knowledge Hub', path: '/knowledge-hub', icon: BookOpen },
      { name: 'AI Chatbot', path: '/ai-chatbot', icon: Bot },
    ],
  },
];

const bottomNavItems = [
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Help & Support', path: '/help-support', icon: HelpCircle },
];

const Sidebar = ({ isMobileOpen, onCloseMobile, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();

  const handleToggle = () => {
    if (isMobileOpen && onCloseMobile) {
      onCloseMobile();
    } else if (onToggleCollapse) {
      onToggleCollapse();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out lg:static lg:z-30 lg:h-screen shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-[88px] lg:w-[88px]' : 'w-[260px] lg:w-[260px]'}`}
      >
        {/* Brand Header */}
        <div
          className={`h-16 border-b border-slate-200 flex items-center justify-between shrink-0 transition-all duration-300 ${
            isCollapsed ? 'px-2' : 'px-3.5'
          }`}
        >
          {/* Left: Brand Logo & Name */}
          <NavLink
            to="/"
            onClick={onCloseMobile}
            className="flex items-center gap-2.5 min-w-0 group shrink-0"
            title={isCollapsed ? 'AgriSphere' : undefined}
          >
            <div className="w-8 h-8 rounded-lg bg-[#15803D] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#14532D] transition-colors">
              <Sprout className="w-4.5 h-4.5" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="text-base font-bold text-[#14532D] tracking-tight block truncate leading-tight">
                  AgriSphere
                </span>
                <p className="text-[10px] text-[#64748B] font-medium leading-none truncate mt-0.5">
                  Smart Farming
                </p>
              </div>
            )}
          </NavLink>

          {/* Right: Toggle Button */}
          <button
            onClick={handleToggle}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200/90 text-[#14532D] hover:text-[#15803D] border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 cursor-pointer group"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            ) : (
              <PanelLeftClose className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-5">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {!isCollapsed ? (
                <p className="px-3 text-[11px] font-semibold text-[#64748B] tracking-wider uppercase mb-1.5">
                  {section.title}
                </p>
              ) : (
                <div className="w-8 h-px bg-slate-200 mx-auto my-2" />
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/' || location.pathname === '/dashboard'
                    : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={onCloseMobile}
                    title={isCollapsed ? item.name : undefined}
                    className={`flex items-center rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-[#15803D] text-white font-medium shadow-xs'
                        : 'text-[#1F2937] hover:bg-[#DCFCE7]/60 hover:text-[#15803D]'
                    } ${
                      isCollapsed
                        ? 'justify-center w-10 h-10 mx-auto p-0'
                        : 'gap-3 px-3 py-2 w-full'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? 'text-white' : 'text-[#64748B]'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-2 border-t border-slate-200 space-y-1 bg-slate-50/50 shrink-0">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onCloseMobile}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-[#15803D] text-white font-medium shadow-xs'
                    : 'text-[#1F2937] hover:bg-slate-100 text-slate-700'
                } ${
                  isCollapsed
                    ? 'justify-center w-10 h-10 mx-auto p-0'
                    : 'gap-3 px-3 py-2 w-full'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-[#64748B]'}`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}

          {/* Farmer Profile Card */}
          <div
            className={`pt-2 mt-2 border-t border-slate-200 flex items-center ${
              isCollapsed ? 'justify-center' : 'gap-3 px-2'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#15803D] text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-xs">
              RP
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#1F2937] truncate">Ramesh Patil</p>
                <p className="text-[11px] text-[#64748B] truncate">Belagavi Farmer</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
