import React, { useState } from 'react';
import { MapPin, Search, Bell, ChevronDown, Menu, X, Sprout } from 'lucide-react';

const Header = ({ onToggleMobileSidebar, isMobileSidebarOpen }) => {
  const [location, setLocation] = useState('Belagavi, Karnataka');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLocationChange = () => {
    const newLoc = prompt('Enter location (e.g. Belagavi, Karnataka):', location);
    if (newLoc) setLocation(newLoc);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-3 lg:px-5 py-1.5 shadow-2xs h-[48px] flex items-center">
      <div className="flex items-center justify-between gap-3 max-w-[1440px] w-full mx-auto">
        
        {/* Left: Brand Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-1 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <a href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-agri-600 flex items-center justify-center text-white shadow-2xs group-hover:bg-agri-700 transition-colors">
              <Sprout className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-baseline leading-none">
                <span className="text-base font-extrabold text-slate-900 tracking-tight">Agri</span>
                <span className="text-base font-extrabold text-agri-600 tracking-tight">Sphere</span>
              </div>
              <p className="text-[8.5px] font-semibold text-slate-400 uppercase tracking-wider leading-none mt-0.5 hidden sm:block">
                Farm Smarter. Grow Better.
              </p>
            </div>
          </a>
        </div>

        {/* Center: Location Badge & Search Bar */}
        <div className="hidden md:flex items-center gap-2.5 flex-1 max-w-xl mx-3">
          
          {/* Location Badge */}
          <div className="flex items-center gap-1.5 bg-slate-100/90 hover:bg-slate-200/70 transition-colors px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-slate-700 border border-slate-200/80 shrink-0">
            <MapPin className="w-3 h-3 text-agri-600 shrink-0" />
            <span className="truncate max-w-[110px] lg:max-w-none">{location}</span>
            <button 
              onClick={handleLocationChange}
              className="bg-white hover:bg-slate-50 text-agri-700 px-1.5 py-0.2 rounded-full text-[9.5px] font-extrabold shadow-2xs border border-slate-200 transition-colors"
            >
              Change
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-3 h-3 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crops, diseases, schemes, tools..."
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-agri-500 rounded-full pl-8 pr-3 py-1 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-agri-500/20 transition-all"
            />
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Notification Bell */}
          <a
            href="/notifications"
            className="relative p-1 text-slate-600 hover:text-agri-600 hover:bg-slate-100 rounded-full transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white"></span>
          </a>

          {/* User Profile Pill */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 cursor-pointer group">
            <div className="w-7 h-7 rounded-full bg-agri-600 text-white font-bold text-[10.5px] flex items-center justify-center shadow-2xs ring-2 ring-agri-100">
              RP
            </div>
            <div className="hidden sm:block text-left leading-none">
              <p className="text-[11px] font-bold text-slate-800 group-hover:text-agri-600 transition-colors">
                Ramesh Patil
              </p>
              <p className="text-[9.5px] text-slate-400 font-medium">Farmer</p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:block" />
          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;
