import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  MapPin,
  Bell,
  ChevronDown,
  X,
  Check,
} from 'lucide-react';

const routeTitles = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/crops': 'Crop Information',
  '/weather': 'Weather',
  '/market-prices': 'Market Prices',
  '/my-farm': 'My Farm',
  '/diseases-pests': 'Diseases & Pests',
  '/soil-fertilizers': 'Soil & Fertilizers',
  '/farming-tools': 'Farming Tools & Maps',
  '/government-schemes': 'Government Schemes',
  '/marketplace': 'Marketplace',
  '/maps-nearby': 'Maps & Nearby Services',
  '/knowledge-hub': 'Knowledge Hub',
  '/ai-chatbot': 'AI Chatbot',
  '/notifications': 'Notifications',
  '/help-support': 'Help & Support',
};

const locationsList = [
  'Belagavi, Karnataka',
  'Gokak, Karnataka',
  'Chikodi, Karnataka',
  'Bailhongal, Karnataka',
  'Dharwad, Karnataka',
];

const Header = ({ onToggleMobileSidebar }) => {
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState('Belagavi, Karnataka');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentTitle = routeTitles[location.pathname] || 'AgriSphere';

  const handleSelectLocation = (loc) => {
    setCurrentLocation(loc);
    setIsLocationDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 shrink-0">
      {/* Left: Mobile Toggle + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-[#1F2937] truncate">
          {currentTitle}
        </h1>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crops, prices, weather..."
            className="w-full bg-[#F8FAF6] hover:bg-white focus:bg-white border border-slate-200 focus:border-[#15803D] rounded-lg pl-9 pr-8 py-1.5 text-sm text-[#1F2937] placeholder-slate-400 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Location, Notifications, Farmer Profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Location Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLocationDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-[#1F2937] hover:bg-slate-50 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
            <span className="truncate max-w-[120px] sm:max-w-none">{currentLocation}</span>
            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </button>

          {isLocationDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-slate-200 shadow-md p-1.5 z-50">
              <div className="space-y-0.5">
                {locationsList.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleSelectLocation(loc)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs text-left transition-colors ${
                      currentLocation === loc
                        ? 'bg-[#DCFCE7] text-[#14532D] font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{loc}</span>
                    {currentLocation === loc && <Check className="w-3.5 h-3.5 text-[#15803D]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-lg text-[#64748B] hover:text-[#15803D] hover:bg-slate-50 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </Link>

        {/* Farmer Profile */}
        <Link
          to="/my-farm"
          className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-85 transition-opacity"
          title="View profile"
        >
          <div className="w-8 h-8 rounded-full bg-[#15803D] text-white font-semibold text-xs flex items-center justify-center">
            RP
          </div>
          <span className="text-xs font-medium text-[#1F2937] hidden sm:block">
            Ramesh Patil
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
