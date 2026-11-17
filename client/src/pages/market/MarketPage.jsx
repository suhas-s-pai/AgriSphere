import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Search,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Map as MapIcon,
  List,
  ExternalLink,
  Calendar,
  Building2,
  X,
  Navigation,
  ShieldCheck,
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap.jsx';
import { useLocationContext } from '../../context/LocationContext.jsx';
import {
  getMarketsByLocation,
  getCommodityPrices,
  calculateDistanceKm,
} from '../../services/marketService.js';

const categories = ['All', 'Vegetables', 'Grains & Pulses', 'Commercial Crops', 'Oilseeds', 'Spices'];

const MarketPage = () => {
  const { latitude, longitude, city, district, state, formattedName, isGlobal, isGps } =
    useLocationContext();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarketId, setSelectedMarketId] = useState(null);
  const [activeView, setActiveView] = useState('split'); // 'split', 'table', 'map'

  // Nearby APMC markets sorted by geographical proximity to coordinates
  const apmcMarkets = useMemo(() => {
    return getMarketsByLocation({ latitude, longitude, state, district });
  }, [latitude, longitude, state, district]);

  // Verified Agmarknet prices for user's state / district
  const mandiRatesData = useMemo(() => {
    return getCommodityPrices({ state, district, cropQuery: searchQuery });
  }, [state, district, searchQuery]);

  const filteredRates = useMemo(() => {
    return mandiRatesData.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesMarket =
        !selectedMarketId || item.marketId === selectedMarketId;
      return matchesCategory && matchesMarket;
    });
  }, [mandiRatesData, selectedCategory, selectedMarketId]);

  const hasCoords = latitude != null && longitude != null;

  const mapMarkers = useMemo(() => {
    const list = apmcMarkets.map((m) => ({
      id: m.id,
      title: `${m.name} ${m.distance != null ? `(${m.distance} km)` : ''}`,
      type: 'APMC Market Yard',
      position: m.position,
      color: '#15803D',
      address: m.address,
      contact: m.contact,
      description: `Major produce: ${m.majorCommodities?.join(', ') || 'Agricultural produce'}. Distance: ${m.distance != null ? `${m.distance} km` : 'Regional'}. Hours: ${m.hours}`,
    }));

    if (hasCoords) {
      list.unshift({
        id: 'user_active_pin',
        title: `📍 Your Active Location (${formattedName})`,
        type: isGps ? 'GPS Position' : 'Selected Location',
        position: [latitude, longitude],
        color: '#0284C7',
        description: `Coordinates: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`,
      });
    }

    return list;
  }, [apmcMarkets, hasCoords, latitude, longitude, formattedName, isGps]);

  const mapCenter = useMemo(() => {
    if (selectedMarketId) {
      const match = apmcMarkets.find((m) => m.id === selectedMarketId);
      if (match) return match.position;
    }
    if (hasCoords) return [latitude, longitude];
    return apmcMarkets[0]?.position || [15.8497, 74.4977];
  }, [selectedMarketId, apmcMarkets, hasCoords, latitude, longitude]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Official APMC Mandi Bulletin (Verified Daily Rates)</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Market Prices</h1>
          <p className="text-sm text-[#64748B] mt-1">
            {isGlobal
              ? 'Tracking verified modal and range commodity prices across benchmark APMC market yards.'
              : `Tracking verified daily APMC mandi rates, modal price changes, and nearby market yards for ${formattedName}.`}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 bg-[#F8FAF6] border border-slate-200 rounded-lg shrink-0">
          <button
            onClick={() => setActiveView('split')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeView === 'split' ? 'bg-[#15803D] text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setActiveView('table')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeView === 'table' ? 'bg-[#15803D] text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Rates Table
          </button>
          <button
            onClick={() => setActiveView('map')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeView === 'map' ? 'bg-[#15803D] text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Markets Map
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crop name (Tomato, Onion, Maize, Cotton)..."
              className="w-full bg-[#F8FAF6] hover:bg-white focus:bg-white border border-slate-200 focus:border-[#15803D] rounded-lg pl-10 pr-8 py-2 text-sm text-[#1F2937] placeholder-slate-400 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {selectedMarketId && (
            <button
              onClick={() => setSelectedMarketId(null)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold shrink-0 cursor-pointer"
            >
              <span>Showing: {apmcMarkets.find((m) => m.id === selectedMarketId)?.name}</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#15803D] text-white font-medium'
                  : 'bg-[#F8FAF6] text-[#64748B] hover:text-[#1F2937] border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area: Table + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table Column */}
        {(activeView === 'split' || activeView === 'table') && (
          <div
            className={`${
              activeView === 'table' ? 'lg:col-span-12' : 'lg:col-span-7'
            } bg-white rounded-xl border border-slate-200 p-6`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-2">
              <div>
                <h2 className="text-lg font-bold text-[#14532D]">Mandi Price Bulletin</h2>
                <p className="text-[11px] text-[#64748B] flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>Verified Daily Market Reports via KSAMB & Agmarknet</span>
                </p>
              </div>
              <span className="text-xs text-[#64748B] font-semibold">{filteredRates.length} Commodities</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-[#64748B] uppercase">
                    <th className="py-3 px-3">Crop</th>
                    <th className="py-3 px-3">APMC Yard</th>
                    <th className="py-3 px-3">Modal Price</th>
                    <th className="py-3 px-3">Min - Max</th>
                    <th className="py-3 px-3 text-right">Trend & Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRates.map((item) => (
                    <tr key={`${item.crop}-${item.marketId}`} className="hover:bg-[#F8FAF6] transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-[#1F2937] block">{item.crop}</span>
                        <span className="text-[11px] text-[#64748B]">{item.category}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => {
                            setSelectedMarketId(item.marketId);
                            if (activeView === 'table') setActiveView('split');
                          }}
                          className="text-xs text-[#15803D] hover:underline text-left font-semibold block cursor-pointer"
                        >
                          {item.marketName}
                        </button>
                        <span className="text-[10px] text-slate-400">Arrivals: {item.arrivals}</span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-[#1F2937]">
                        <span>{item.modalPrice}</span>
                        <span className="text-[11px] text-[#15803D] block font-semibold">{item.perKg}</span>
                      </td>
                      <td className="py-3.5 px-3 text-xs text-[#64748B]">
                        <span>{item.minMax}</span>
                        <span className="text-[10px] text-slate-400 block">{item.unit}</span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <span
                          className={`inline-flex items-center text-xs font-semibold ${
                            item.trend === 'up'
                              ? 'text-[#15803D]'
                              : item.trend === 'down'
                              ? 'text-rose-600'
                              : 'text-slate-600'
                          }`}
                        >
                          {item.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
                          {item.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                          {item.trend === 'neutral' && <Minus className="w-3.5 h-3.5 mr-0.5" />}
                          {item.change}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{item.date}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredRates.length === 0 && (
                <div className="py-8 text-center text-xs text-[#64748B]">
                  No commodity matches your filter or selected APMC market.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Map Column */}
        {(activeView === 'split' || activeView === 'map') && (
          <div
            className={`${
              activeView === 'map' ? 'lg:col-span-12' : 'lg:col-span-5'
            } bg-white rounded-xl border border-slate-200 p-6 space-y-4`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-[#14532D]">APMC Market Yards Map</h2>
                <p className="text-[11px] text-[#64748B]">Sorted by proximity to your active location</p>
              </div>
              <span className="text-xs text-[#64748B] font-semibold">{apmcMarkets.length} Yards</span>
            </div>

            <LeafletMap
              center={mapCenter}
              zoom={selectedMarketId ? 13 : 9}
              markers={mapMarkers}
              selectedId={selectedMarketId}
              onSelectMarker={(m) => setSelectedMarketId(m.id)}
              height="380px"
            />

            {/* List of APMC Yards with Proximity & Road Directions */}
            <div className="space-y-2.5 pt-2 max-h-[420px] overflow-y-auto">
              {apmcMarkets.map((m) => {
                const isSelected = selectedMarketId === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMarketId(m.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#DCFCE7]/60 border-[#15803D]'
                        : 'bg-[#F8FAF6] border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-[#1F2937]">{m.name}</span>
                        {m.distance != null && (
                          <span className="ml-2 text-[10px] font-semibold text-[#15803D] bg-[#DCFCE7] px-1.5 py-0.5 rounded">
                            {m.distance} km away
                          </span>
                        )}
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${m.position[0]},${m.position[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#15803D] font-semibold hover:underline inline-flex items-center gap-0.5 shrink-0"
                      >
                        Directions <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-[#64748B] mt-1">{m.address}</p>
                    <div className="flex flex-wrap items-center justify-between text-slate-500 mt-1 pt-1 border-t border-slate-100/80">
                      <span>📞 {m.contact}</span>
                      <span>🕒 {m.hours}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPage;
