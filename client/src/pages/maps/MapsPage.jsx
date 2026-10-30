import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  ExternalLink,
  Navigation,
  Wheat,
  Warehouse,
  Crosshair,
  Layers3,
  X,
  Phone,
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap.jsx';

const locations = [
  {
    id: 'apmc',
    type: 'APMC Mandi',
    category: 'market',
    title: 'APMC Market Yard · Belagavi',
    description: 'Major agricultural auction yard for grains, vegetables, pulses, and oilseeds.',
    position: [15.8583, 74.5062],
    color: '#15803D',
    address: 'APMC Road, Opposite Railway Bridge, Belagavi',
    contact: '+91 831 245 1102',
  },
  {
    id: 'storage',
    type: 'Cold Storage',
    category: 'storage',
    title: 'Central Warehouse & Multi-Commodity Cold Storage',
    description: 'Temperature-controlled storage for onions, potatoes, seeds, and processed jaggery.',
    position: [15.8424, 74.5124],
    color: '#2563EB',
    address: 'Industrial Estate, Udyambag, Belagavi',
    contact: '+91 831 244 8830',
  },
  {
    id: 'inputs',
    type: 'Agri Inputs',
    category: 'inputs',
    title: 'Raitha Seva Input Kendra & Nursery',
    description: 'Certified foundation seeds, bio-fertilizers, neem cake, and vegetable seedlings.',
    position: [15.8531, 74.4868],
    color: '#D97706',
    address: 'Khanapur Road, Tilakwadi, Belagavi',
    contact: '+91 94481 33201',
  },
  {
    id: 'kvk',
    type: 'KVK Extension',
    category: 'kvk',
    title: 'Krishi Vigyan Kendra (KVK) Mattikopp',
    description: 'ICAR agricultural research station offering soil testing, crop training, and expert advice.',
    position: [15.8277, 74.5211],
    color: '#7C3AED',
    address: 'Mattikopp, Bailhongal Taluk, Belagavi',
    contact: '+91 831 249 8765',
  },
];

const categories = [
  { id: 'all', label: 'All Services' },
  { id: 'market', label: 'APMC Mandis' },
  { id: 'storage', label: 'Cold Storage' },
  { id: 'inputs', label: 'Agri Inputs' },
  { id: 'kvk', label: 'KVK & Extension' },
];

const MapsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);

  const filteredLocations = useMemo(() => {
    return locations.filter((place) => {
      const categoryMatch =
        activeCategory === 'all' || place.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const queryMatch =
        !q ||
        place.title.toLowerCase().includes(q) ||
        place.type.toLowerCase().includes(q) ||
        place.description.toLowerCase().includes(q);
      return categoryMatch && queryMatch;
    });
  }, [activeCategory, searchQuery]);

  const mapMarkers = filteredLocations.map((p) => ({
    id: p.id,
    title: p.title,
    type: p.type,
    position: p.position,
    color: p.color,
    address: p.address,
    contact: p.contact,
    description: p.description,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Geo-Spatial Services Directory</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Maps & Nearby Services</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Locate APMC markets, cold storage facilities, input dealers, and Krishi Vigyan Kendras across Belagavi.
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search APMC mandi, warehouse, cold storage, seed inputs, or KVK..."
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

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-md text-xs whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[#15803D] text-white font-medium'
                  : 'bg-[#F8FAF6] text-[#64748B] hover:text-[#1F2937] border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map and Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Column */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 sticky top-20">
          <div className="flex items-center justify-between mb-3 text-xs text-[#64748B]">
            <span className="font-semibold text-[#1F2937]">Belagavi Agricultural Geo-Map</span>
            <span>{filteredLocations.length} Points Marked</span>
          </div>

          <LeafletMap
            center={selectedPlace ? selectedPlace.position : [15.8497, 74.4977]}
            zoom={selectedPlace ? 14 : 12}
            markers={mapMarkers}
            selectedId={selectedPlace?.id}
            onSelectMarker={(p) => setSelectedPlace(p)}
            height="460px"
          />

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
            <span>Click any marker to view contact and directions</span>
            <span className="text-[#15803D] font-semibold">OpenStreetMap Powered</span>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
            <span className="font-semibold text-[#1F2937]">
              Nearby Services Directory ({filteredLocations.length})
            </span>
          </div>

          {filteredLocations.map((item) => {
            const isSelected = selectedPlace?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedPlace(item)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#DCFCE7]/50 border-[#15803D] shadow-xs'
                    : 'bg-white border-slate-200 hover:border-[#15803D]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{ backgroundColor: '#F1F5F9', color: item.color }}
                  >
                    {item.type}
                  </span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${item.position[0]},${item.position[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-semibold text-[#15803D] hover:underline inline-flex items-center gap-1"
                  >
                    Directions <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <h3 className="text-sm font-bold text-[#1F2937] mt-2">{item.title}</h3>
                <p className="text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500 space-y-0.5">
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{item.address}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#15803D] shrink-0" />
                    <span>{item.contact}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MapsPage;
