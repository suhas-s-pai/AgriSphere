import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { MapPin, Search, Bell, Sprout, Leaf } from 'lucide-react';

const navigation = [
  { name: 'Home', path: '/' },
  { name: 'Crops', path: '/crops' },
  { name: 'Weather', path: '/weather' },
  { name: 'Market', path: '/market-prices' },
  { name: 'Farming Tools', path: '/farming-tools' },
  { name: 'Government Schemes', path: '/government-schemes' },
  { name: 'Maps & Nearby', path: '/maps-nearby' },
];

const Header = () => {
  const [location, setLocation] = useState('Belagavi, Karnataka');
  const [searchQuery, setSearchQuery] = useState('');

  const handleLocationChange = () => {
    const newLoc = window.prompt('Enter location (e.g. Belagavi, Karnataka):', location);
    if (newLoc?.trim()) setLocation(newLoc.trim());
  };

  const linkClass = ({ isActive }) =>
    `whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold transition sm:text-sm ${
      isActive
        ? 'bg-agri-600 text-white shadow-sm'
        : 'text-slate-600 hover:bg-agri-50 hover:text-agri-700'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex min-h-[72px] items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-agri-600 text-white shadow-sm">
              <Sprout className="h-5 w-5 stroke-[2.4]" />
            </div>
            <div className="leading-none">
              <div className="text-xl font-black tracking-tight text-slate-950">
                Agri<span className="text-agri-600">Sphere</span>
              </div>
              <p className="mt-1 hidden text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:block">
                Farm smarter. Grow better.
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={handleLocationChange}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-agri-200 hover:bg-agri-50 hover:text-agri-700"
            >
              <MapPin className="h-3.5 w-3.5 text-agri-600" />
              <span className="max-w-[125px] truncate">{location}</span>
            </button>
            <Link
              to="/notifications"
              className="relative rounded-full p-2.5 text-slate-500 hover:bg-agri-50 hover:text-agri-700"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
            </Link>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-agri-600 text-xs font-black text-white">RP</div>
              <div className="hidden xl:block">
                <p className="text-xs font-extrabold text-slate-800">Ramesh Patil</p>
                <p className="text-[10px] font-medium text-slate-400">Farmer</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLocationChange}
            className="rounded-full border border-slate-200 p-2.5 text-slate-600 lg:hidden"
            aria-label="Change location"
          >
            <MapPin className="h-4 w-4 text-agri-600" />
          </button>
        </div>

        <div className="border-t border-slate-100 py-2">
          <nav className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {navigation.map((item) => (
              <NavLink key={item.path} to={item.path} className={linkClass}>
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 border-t border-slate-100 py-3 lg:flex">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search crops, diseases, schemes, tools and more..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-agri-400 focus:bg-white focus:ring-4 focus:ring-agri-100"
            />
          </div>
          <div className="flex items-center gap-2 rounded-full bg-agri-50 px-4 py-2.5 text-xs font-bold text-agri-700">
            <Leaf className="h-4 w-4" />
            Better farming starts with better information.
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
