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
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap.jsx';

// APMC Market Yard Locations in Belagavi District
const apmcMarkets = [
  {
    id: 'apmc-belagavi',
    name: 'Belagavi Main APMC Yard',
    position: [15.8583, 74.5062],
    color: '#15803D',
    address: 'APMC Road, Opposite Railway Overbridge, Belagavi 590016',
    contact: '+91 831 245 1102',
    hours: 'Mon - Sat: 06:00 AM - 04:00 PM',
    majorCrops: 'Tomato, Onion, Maize, Potato, Green Chilli, Rice',
    description: 'Largest vegetable and grain auction yard in North Karnataka with daily wholesale trading.',
  },
  {
    id: 'apmc-gokak',
    name: 'Gokak APMC Sub-Yard',
    position: [16.1724, 74.8291],
    color: '#2563EB',
    address: 'Near Old Bus Stand, Ghataprabha Road, Gokak 591307',
    contact: '+91 8332 225 140',
    hours: 'Mon - Sat: 07:00 AM - 03:00 PM',
    majorCrops: 'Maize, Groundnut, Sugarcane, Jowar',
    description: 'Major trading hub for maize and Kharif oilseeds along the Ghataprabha basin.',
  },
  {
    id: 'apmc-chikodi',
    name: 'Chikodi APMC Yard',
    position: [16.4288, 74.5955],
    color: '#D97706',
    address: 'Nipani-Chikodi Highway, Chikodi 591201',
    contact: '+91 8338 272 045',
    hours: 'Mon - Sat: 06:30 AM - 03:30 PM',
    majorCrops: 'Soybean, Sugarcane, Maize, Vegetables',
    description: 'Border transit market connecting Karnataka and Southern Maharashtra produce.',
  },
  {
    id: 'apmc-bailhongal',
    name: 'Bailhongal APMC Yard',
    position: [15.8142, 74.8589],
    color: '#7C3AED',
    address: 'Station Road, Bailhongal 591102',
    contact: '+91 8288 233 118',
    hours: 'Mon - Sat: 07:00 AM - 02:30 PM',
    majorCrops: 'Cotton, Groundnut, Wheat, Bengal Gram',
    description: 'Premier cotton and pulse trading center with official MSP procurement counters.',
  },
];

// Mandi Rates Data
const mandiRatesData = [
  {
    crop: 'Tomato (Local Hybrid)',
    category: 'Vegetables',
    marketId: 'apmc-belagavi',
    marketName: 'Belagavi Main APMC',
    modalPrice: '₹2,500 / qtl',
    perKg: '₹25.00 / kg',
    minMax: '₹2,200 - ₹2,800',
    change: '+12.5%',
    trend: 'up',
    arrivals: '1,250 Qtl',
  },
  {
    crop: 'Onion (Red Bellary)',
    category: 'Vegetables',
    marketId: 'apmc-belagavi',
    marketName: 'Belagavi Main APMC',
    modalPrice: '₹1,800 / qtl',
    perKg: '₹18.00 / kg',
    minMax: '₹1,500 - ₹2,050',
    change: '-5.2%',
    trend: 'down',
    arrivals: '840 Qtl',
  },
  {
    crop: 'Maize (Hybrid Yellow)',
    category: 'Grains & Pulses',
    marketId: 'apmc-gokak',
    marketName: 'Gokak APMC Sub-Yard',
    modalPrice: '₹2,200 / qtl',
    perKg: '₹22.00 / kg',
    minMax: '₹2,050 - ₹2,350',
    change: '+8.0%',
    trend: 'up',
    arrivals: '2,100 Qtl',
  },
  {
    crop: 'Rice (Sona Masoori Paddy)',
    category: 'Grains & Pulses',
    marketId: 'apmc-belagavi',
    marketName: 'Belagavi Main APMC',
    modalPrice: '₹2,800 / qtl',
    perKg: '₹28.00 / kg',
    minMax: '₹2,650 - ₹2,950',
    change: '+3.2%',
    trend: 'up',
    arrivals: '950 Qtl',
  },
  {
    crop: 'Cotton (Medium Staple)',
    category: 'Cash Crops',
    marketId: 'apmc-bailhongal',
    marketName: 'Bailhongal APMC Yard',
    modalPrice: '₹7,200 / qtl',
    perKg: '₹72.00 / kg',
    minMax: '₹6,900 - ₹7,450',
    change: '+1.5%',
    trend: 'up',
    arrivals: '620 Qtl',
  },
  {
    crop: 'Soybean (Yellow)',
    category: 'Oilseeds',
    marketId: 'apmc-chikodi',
    marketName: 'Chikodi APMC Yard',
    modalPrice: '₹4,600 / qtl',
    perKg: '₹46.00 / kg',
    minMax: '₹4,400 - ₹4,800',
    change: '+2.1%',
    trend: 'up',
    arrivals: '780 Qtl',
  },
  {
    crop: 'Groundnut (Pods)',
    category: 'Oilseeds',
    marketId: 'apmc-bailhongal',
    marketName: 'Bailhongal APMC Yard',
    modalPrice: '₹6,100 / qtl',
    perKg: '₹61.00 / kg',
    minMax: '₹5,800 - ₹6,400',
    change: '-1.0%',
    trend: 'down',
    arrivals: '410 Qtl',
  },
  {
    crop: 'Green Chilli (G4)',
    category: 'Vegetables',
    marketId: 'apmc-belagavi',
    marketName: 'Belagavi Main APMC',
    modalPrice: '₹3,400 / qtl',
    perKg: '₹34.00 / kg',
    minMax: '₹3,000 - ₹3,800',
    change: '+6.5%',
    trend: 'up',
    arrivals: '320 Qtl',
  },
];

const categories = ['All', 'Vegetables', 'Grains & Pulses', 'Cash Crops', 'Oilseeds'];

const MarketPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarketId, setSelectedMarketId] = useState(null);
  const [activeView, setActiveView] = useState('split'); // 'split', 'table', 'map'

  const filteredRates = useMemo(() => {
    return mandiRatesData.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.crop.toLowerCase().includes(q) ||
        item.marketName.toLowerCase().includes(q);
      const matchesMarket =
        !selectedMarketId || item.marketId === selectedMarketId;
      return matchesCategory && matchesQuery && matchesMarket;
    });
  }, [selectedCategory, searchQuery, selectedMarketId]);

  const mapMarkers = apmcMarkets.map((m) => ({
    id: m.id,
    title: m.name,
    type: 'APMC Market Yard',
    position: m.position,
    color: m.color,
    address: m.address,
    contact: m.contact,
    description: `Major produce: ${m.majorCrops}. Hours: ${m.hours}`,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Karnataka APMC Mandi Bulletin</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Market Prices</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Track daily APMC mandi rates, modal price changes, and find nearby market yards across Belagavi district.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 bg-[#F8FAF6] border border-slate-200 rounded-lg shrink-0">
          <button
            onClick={() => setActiveView('split')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeView === 'split' ? 'bg-[#15803D] text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setActiveView('table')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeView === 'table' ? 'bg-[#15803D] text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Rates Table
          </button>
          <button
            onClick={() => setActiveView('map')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {selectedMarketId && (
            <button
              onClick={() => setSelectedMarketId(null)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold shrink-0"
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
              className={`px-3 py-1 rounded-md text-xs whitespace-nowrap transition-colors ${
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
              <h2 className="text-lg font-bold text-[#14532D]">Mandi Price Bulletin</h2>
              <span className="text-xs text-[#64748B]">{filteredRates.length} Commodities</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-[#64748B] uppercase">
                    <th className="py-3 px-3">Crop</th>
                    <th className="py-3 px-3">APMC Yard</th>
                    <th className="py-3 px-3">Modal Price</th>
                    <th className="py-3 px-3">Range</th>
                    <th className="py-3 px-3 text-right">Trend</th>
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
                          className="text-xs text-[#15803D] hover:underline text-left font-medium block"
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
                        {item.minMax}
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
              <h2 className="text-lg font-bold text-[#14532D]">APMC Market Yards Map</h2>
              <span className="text-xs text-[#64748B]">{apmcMarkets.length} Yards</span>
            </div>

            <p className="text-xs text-[#64748B]">
              Locate physical market yards across Belagavi district with trading schedules and road directions.
            </p>

            <LeafletMap
              center={
                selectedMarketId
                  ? apmcMarkets.find((m) => m.id === selectedMarketId)?.position
                  : [15.8497, 74.4977]
              }
              zoom={selectedMarketId ? 13 : 10}
              markers={mapMarkers}
              selectedId={selectedMarketId}
              onSelectMarker={(m) => setSelectedMarketId(m.id)}
              height="380px"
            />

            {/* List of APMC Yards */}
            <div className="space-y-2.5 pt-2">
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
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-[#1F2937]">{m.name}</span>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${m.position[0]},${m.position[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#15803D] font-semibold hover:underline inline-flex items-center gap-0.5"
                      >
                        Directions <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-[#64748B] mt-1">{m.address}</p>
                    <p className="text-slate-500 mt-0.5">📞 {m.contact} • {m.hours}</p>
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
