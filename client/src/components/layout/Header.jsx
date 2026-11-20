
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  MapPin,
  Bell,
  ChevronDown,
  X,
  Check,
  Navigation,
  Loader2,
  AlertTriangle,
  Globe,
} from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext.jsx';

const routeTitles = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/my-farm': 'My Farm',
  '/crops': 'Crop Information',
  '/weather': 'Weather',
  '/market-prices': 'Market Prices',
  '/diseases-pests': 'Diseases & Pests',
  '/soil-fertilizers': 'Soil & Fertilizers',
  '/farming-tools': 'Farming Tools & Maps',
  '/maps-nearby': 'Maps & Nearby Services',
  '/marketplace': 'Marketplace',
  '/government-schemes': 'Government Schemes',
  '/knowledge-hub': 'Knowledge Hub',
  '/ai-chatbot': 'AI Chatbot',
  '/notifications': 'Notifications',
  '/help-support': 'Help & Support',
};

// Global search data
const globalSearchItems = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    keywords: 'home overview main dashboard'
  },
  {
    title: 'My Farm',
    path: '/my-farm',
    keywords: 'farm profile land farmer'
  },
  {
    title: 'Crop Information',
    path: '/crops',
    keywords: 'crops crop seeds cultivation plants'
  },
  {
    title: 'Weather',
    path: '/weather',
    keywords: 'weather temperature rain rainfall forecast climate'
  },
  {
    title: 'Market Prices',
    path: '/market-prices',
    keywords: 'market prices rates mandi selling vegetables'
  },
  {
    title: 'Diseases & Pests',
    path: '/diseases-pests',
    keywords: 'disease pest insects crop health diagnosis'
  },
  {
    title: 'Soil & Fertilizers',
    path: '/soil-fertilizers',
    keywords: 'soil fertilizer manure nutrients ph calculator'
  },
  {
    title: 'Farming Tools & Maps',
    path: '/farming-tools',
    keywords: 'tools maps equipment machinery farming'
  },
  {
    title: 'Maps & Nearby Services',
    path: '/maps-nearby',
    keywords: 'nearby services location shops equipment rental'
  },
  {
    title: 'Marketplace',
    path: '/marketplace',
    keywords: 'marketplace buy sell products equipment'
  },
  {
    title: 'Government Schemes',
    path: '/government-schemes',
    keywords: 'government schemes subsidies benefits yojana'
  },
  {
    title: 'Knowledge Hub',
    path: '/knowledge-hub',
    keywords: 'knowledge learning guides articles farming tips'
  },
  {
    title: 'AI Chatbot',
    path: '/ai-chatbot',
    keywords: 'ai chatbot assistant questions help'
  },
  {
    title: 'Notifications',
    path: '/notifications',
    keywords: 'notifications alerts updates messages'
  },
  {
    title: 'Help & Support',
    path: '/help-support',
    keywords: 'help support contact assistance'
  }
];

const Header = ({ onToggleMobileSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    formattedName,
    isGps,
    isManual,
    isGlobal,
    isStale,
    permissionStatus,
    loadingStatus,
    requestCurrentLocation,
    retryLocation,
    setManualLocation,
    setGlobalMode,
    searchLocations,
    presetRegions,
  } = useLocationContext();

  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isHeaderSearchOpen, setIsHeaderSearchOpen] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);

  const [placeSearchQuery, setPlaceSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);

  const normalizedQuery = headerSearchQuery.trim().toLowerCase();

  const headerSearchResults = normalizedQuery.length === 0
    ? []
    : globalSearchItems
        .map((item) => {
          const titleMatch = item.title.toLowerCase().includes(normalizedQuery);

          const keywordMatch = item.keywords
            .toLowerCase()
            .split(/\s+/)
            .some((word) => word.startsWith(normalizedQuery));

          return {
            ...item,
            matches: titleMatch || keywordMatch,
            score: titleMatch ? 2 : keywordMatch ? 1 : 0
          };
        })
        .filter((item) => item.matches)
        .sort((a, b) => b.score - a.score)
        .slice(0, 7);

  const openSearchResult = (item) => {
    if (!item) return;

    navigate(item.path);
    setHeaderSearchQuery('');
    setIsHeaderSearchOpen(false);
    setActiveSearchIndex(0);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsHeaderSearchOpen(false);
      return;
    }

    if (event.key === 'ArrowDown' && headerSearchResults.length > 0) {
      event.preventDefault();
      setActiveSearchIndex(
        (index) => (index + 1) % headerSearchResults.length
      );
    }

    if (event.key === 'ArrowUp' && headerSearchResults.length > 0) {
      event.preventDefault();
      setActiveSearchIndex(
        (index) =>
          (index - 1 + headerSearchResults.length) %
          headerSearchResults.length
      );
    }

    if (event.key === 'Enter' && headerSearchResults.length > 0) {
      event.preventDefault();
      openSearchResult(
        headerSearchResults[activeSearchIndex] ||
        headerSearchResults[0]
      );
    }
  };

  const currentTitle =
    routeTitles[location.pathname.replace(/\/+$/, '') || '/'] || 'AgriSphere';

  // Live place search with debounce
  useEffect(() => {
    const q = placeSearchQuery.trim();

    if (q.length < 2) {
      setSearchResults([]);
      setIsSearchingPlaces(false);
      return;
    }

    setIsSearchingPlaces(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchLocations(q);
        setSearchResults(results);
      } catch (err) {
        console.warn('Place search error:', err);
      } finally {
        setIsSearchingPlaces(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [placeSearchQuery, searchLocations]);

  const handleSelectSearchedPlace = (place) => {
    setManualLocation(place);
    setPlaceSearchQuery('');
    setSearchResults([]);
    setIsLocationDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 shrink-0">

      {/* Left: Mobile Toggle + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-[#1F2937] truncate">
          {currentTitle}
        </h1>
      </div>

      {/* Center: Dynamic Global Search */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
        <div className="relative w-full">

          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

          <input
            type="text"
            value={headerSearchQuery}
            onChange={(e) => {
              setHeaderSearchQuery(e.target.value);
              setActiveSearchIndex(0);
              setIsHeaderSearchOpen(true);
            }}
            onFocus={() => setIsHeaderSearchOpen(true)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search crops, prices, weather..."
            autoComplete="off"
            role="combobox"
            aria-expanded={isHeaderSearchOpen && headerSearchResults.length > 0}
            aria-controls="agrisphere-search-results"
            aria-autocomplete="list"
            className="w-full bg-[#F8FAF6] hover:bg-white focus:bg-white border border-slate-200 focus:border-[#15803D] rounded-lg pl-9 pr-8 py-1.5 text-sm text-[#1F2937] placeholder-slate-400 focus:outline-none transition-colors"
          />

          {headerSearchQuery && (
            <button
              type="button"
              onClick={() => {
                setHeaderSearchQuery('');
                setIsHeaderSearchOpen(false);
                setActiveSearchIndex(0);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {isHeaderSearchOpen && headerSearchQuery.trim() && (
            <div
              id="agrisphere-search-results"
              role="listbox"
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-[60]"
            >
              {headerSearchResults.length > 0 ? (
                <div className="py-1.5">
                  {headerSearchResults.map((item, index) => (
                    <button
                      key={item.path}
                      type="button"
                      role="option"
                      aria-selected={activeSearchIndex === index}
                      onMouseEnter={() => setActiveSearchIndex(index)}
                      onClick={() => openSearchResult(item)}
                      className={`w-full text-left px-3 py-2.5 transition-colors ${
                        activeSearchIndex === index
                          ? 'bg-[#F0FDF4]'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <span className="block text-xs font-semibold text-slate-800">
                        {item.title}
                      </span>

                      <span className="block mt-0.5 text-[10px] text-slate-500">
                        Open {item.title} in AgriSphere
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-3 text-xs text-slate-500">
                  No matching results found.
                  <span className="block mt-1 text-[10px]">
                    Try searching crops, weather, market prices,
                    fertilizer or farming equipment.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Location, Notifications, Farmer Profile */}
      <div className="flex items-center gap-3 shrink-0">

        {/* Location Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLocationDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-[#1F2937] hover:bg-slate-50 transition-colors cursor-pointer"
            title={
              isGps
                ? `GPS Location (${isStale ? 'Cached' : 'Live'})`
                : isManual
                ? 'Manual Location'
                : 'Global Mode'
            }
          >
            {loadingStatus ? (
              <Loader2 className="w-3.5 h-3.5 text-[#15803D] animate-spin shrink-0" />
            ) : permissionStatus === 'denied' ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            ) : isGps ? (
              <Navigation className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
            ) : isGlobal ? (
              <Globe className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
            )}

            <span className="truncate max-w-[130px] sm:max-w-none">
              {loadingStatus
                ? 'Detecting GPS...'
                : permissionStatus === 'denied'
                ? 'Location Denied'
                : formattedName}
            </span>

            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </button>

          {isLocationDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-xl p-2 z-50">

              {/* Option A: Use Current Location (GPS) */}
              <button
                type="button"
                onClick={() => {
                  requestCurrentLocation();
                  setIsLocationDropdownOpen(false);
                }}
                disabled={loadingStatus}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-colors font-semibold cursor-pointer ${
                  isGps && permissionStatus === 'granted'
                    ? 'bg-[#DCFCE7] text-[#14532D]'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {loadingStatus ? (
                    <Loader2 className="w-4 h-4 text-[#15803D] animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4 text-[#15803D]" />
                  )}
                  <span>Current Location (GPS)</span>
                </div>

                {isGps && permissionStatus === 'granted' && (
                  <Check className="w-3.5 h-3.5 text-[#15803D]" />
                )}
              </button>

              {/* Permission Denied Notice */}
              {permissionStatus === 'denied' && (
                <div className="p-2.5 my-1.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 leading-tight">
                  <p className="font-bold text-amber-800 mb-0.5">
                    Location Access Denied
                  </p>

                  <p className="text-amber-700">
                    Enable location in your browser site settings (lock icon in address bar) and retry.
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      retryLocation();
                    }}
                    className="mt-2 w-full py-1.5 rounded-md bg-[#15803D] hover:bg-[#14532D] text-white font-bold text-[10px] text-center cursor-pointer transition-colors"
                  >
                    Retry Location
                  </button>
                </div>
              )}

              {/* Option B: Search Any Real City / Village */}
              <div className="my-1.5 pt-1.5 border-t border-slate-100">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />

                  <input
                    type="text"
                    value={placeSearchQuery}
                    onChange={(e) => setPlaceSearchQuery(e.target.value)}
                    placeholder="Search city, town, or village..."
                    className="w-full bg-[#F8FAF6] border border-slate-200 focus:border-[#15803D] rounded-md pl-8 pr-7 py-1 text-xs text-slate-800 placeholder-slate-400 outline-none"
                  />

                  {placeSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setPlaceSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown List */}
                {isSearchingPlaces && (
                  <div className="py-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin text-[#15803D]" />
                    <span>Searching places...</span>
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="mt-1 max-h-36 overflow-y-auto space-y-0.5 border border-slate-100 rounded-md p-1 bg-slate-50/50">
                    {searchResults.map((place) => (
                      <button
                        key={place.id}
                        type="button"
                        onClick={() => handleSelectSearchedPlace(place)}
                        className="w-full text-left px-2 py-1 rounded text-xs hover:bg-[#DCFCE7] text-slate-800 hover:text-[#14532D] truncate block cursor-pointer transition-colors"
                        title={place.displayName}
                      >
                        <span className="font-semibold">
                          {place.formattedName}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Option C: Quick Preset Regions (Manual) */}
              <div className="my-1 border-t border-slate-100" />

              <p className="px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Preset Regions
              </p>

              <div className="space-y-0.5 max-h-32 overflow-y-auto">
                {presetRegions.map((region) => {
                  const isSelected = isManual && formattedName === region.name;

                  return (
                    <button
                      key={region.id}
                      type="button"
                      onClick={() => {
                        setManualLocation(region);
                        setIsLocationDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#DCFCE7] text-[#14532D] font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{region.name}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#15803D]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Option D: Global Mode */}
              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={() => {
                  setGlobalMode();
                  setIsLocationDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-left transition-colors font-medium cursor-pointer ${
                  isGlobal
                    ? 'bg-[#DCFCE7] text-[#14532D] font-semibold'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>Global Mode (All Regions)</span>
                </div>

                {isGlobal && (
                  <Check className="w-3.5 h-3.5 text-[#15803D]" />
                )}
              </button>
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
