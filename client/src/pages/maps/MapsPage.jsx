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
  Clock,
  ShieldCheck,
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap.jsx';
import { useLocationContext } from '../../context/LocationContext.jsx';
import { calculateDistanceKm } from '../../services/marketService.js';

// Verified Agricultural Public Infrastructure Directory
const verifiedAgriLocations = [
  // APMC Mandis
  {
    id: 'apmc-belagavi',
    type: 'APMC Mandi',
    category: 'market',
    title: 'Belagavi Main APMC Wholesale Market Yard',
    description: 'Premier wholesale agricultural auction yard with e-NAM digital trading and daily modal rates.',
    position: [15.8583, 74.5062],
    color: '#15803D',
    address: 'APMC Road, Opposite Railway Bridge, Belagavi 590016',
    contact: '0831-2451102',
    hours: '06:00 AM – 04:00 PM',
  },
  {
    id: 'apmc-gokak',
    type: 'APMC Mandi',
    category: 'market',
    title: 'Gokak APMC Sub-Yard',
    description: 'Ghataprabha basin trading hub for maize, jowar, and oilseeds.',
    position: [16.1724, 74.8291],
    color: '#15803D',
    address: 'Near Old Bus Stand, Ghataprabha Road, Gokak 591307',
    contact: '08332-225140',
    hours: '07:00 AM – 03:00 PM',
  },
  {
    id: 'apmc-bailhongal',
    type: 'APMC Mandi',
    category: 'market',
    title: 'Bailhongal APMC Cotton & Pulse Yard',
    description: 'Premier cotton ginning and pulse trading center with official MSP procurement counters.',
    position: [15.8142, 74.8589],
    color: '#15803D',
    address: 'Station Road, Bailhongal 591102',
    contact: '08288-233118',
    hours: '07:00 AM – 02:30 PM',
  },
  // Cold Storages & Warehouses
  {
    id: 'storage-cwc-belagavi',
    type: 'Cold Storage & Warehouse',
    category: 'storage',
    title: 'Central Warehousing Corporation (CWC) Multi-Commodity Depot',
    description: 'Government certified temperature-controlled storage for onions, potatoes, grains, and negotiable warehouse receipts (e-NWR).',
    position: [15.8424, 74.5124],
    color: '#2563EB',
    address: 'Plot 18, Udyambag Industrial Estate, Belagavi 590008',
    contact: '0831-2448830',
    hours: '08:30 AM – 06:00 PM',
  },
  {
    id: 'storage-swc-chikodi',
    type: 'Cold Storage & Warehouse',
    category: 'storage',
    title: 'Karnataka State Warehousing Corporation (KSWC) Yard',
    description: 'Subsidized storage space for farmers with 7% interest subvention against pledge financing.',
    position: [16.4250, 74.6012],
    color: '#2563EB',
    address: 'APMC Perimeter, Chikodi 591201',
    contact: '08338-273110',
    hours: '09:00 AM – 05:30 PM',
  },
  // Soil Testing Laboratories
  {
    id: 'soil-lab-belagavi',
    type: 'Soil Testing Lab',
    category: 'soillab',
    title: 'District Soil Testing Laboratory (Dept. of Agriculture)',
    description: 'Official government Soil Health Card laboratory testing pH, EC, N, P, K, and micronutrients at nominal government fee (₹25/sample).',
    position: [15.8512, 74.4988],
    color: '#059669',
    address: 'Joint Director of Agriculture Complex, Club Road, Belagavi 590001',
    contact: '0831-2407215',
    hours: '10:00 AM – 05:30 PM',
  },
  {
    id: 'soil-lab-uas-dharwad',
    type: 'Soil Testing Lab',
    category: 'soillab',
    title: 'University of Agricultural Sciences (UAS) Soil Science Dept.',
    description: 'Advanced testing lab providing atomic absorption spectroscopy for heavy metals and complete micronutrient profiles.',
    position: [15.4890, 74.9824],
    color: '#059669',
    address: 'UAS Campus, Yettinagudda, Dharwad 580005',
    contact: '0836-2217333',
    hours: '09:30 AM – 05:00 PM',
  },
  // Krishi Vigyan Kendras (KVK) & Extension
  {
    id: 'kvk-mattikopp',
    type: 'KVK Extension Centre',
    category: 'kvk',
    title: 'ICAR Krishi Vigyan Kendra (KVK) Mattikopp',
    description: 'ICAR agricultural research station offering soil testing, demonstration fields, high-yield seeds, and expert advisory.',
    position: [15.8277, 74.5211],
    color: '#7C3AED',
    address: 'Mattikopp, Bailhongal Taluk, Belagavi 591147',
    contact: '0831-2498765',
    hours: '09:00 AM – 05:30 PM',
  },
  {
    id: 'rsk-belagavi',
    type: 'Raitha Samparka Kendra',
    category: 'kvk',
    title: 'Raitha Samparka Kendra (RSK) Belagavi Central',
    description: 'Subsidized seed distribution, PM-KISAN verification, PMFBY crop insurance registration, and farm mechanization booking.',
    position: [15.8610, 74.5120],
    color: '#7C3AED',
    address: 'Near Agriculture Office, Court Road, Belagavi 590001',
    contact: '0831-2420119',
    hours: '10:00 AM – 05:30 PM',
  },
  // Seed & Input Depots
  {
    id: 'input-kssc',
    type: 'Certified Seed Depot',
    category: 'inputs',
    title: 'KSSC Certified Seed Depot (Karnataka State Seeds Corp)',
    description: 'Government certified foundation seeds (Paddy, Maize, Groundnut, Soybean) with lab-tested germination guarantee.',
    position: [15.8595, 74.5075],
    color: '#D97706',
    address: 'Gate 2, APMC Market Yard, Belagavi 590016',
    contact: '0831-2458820',
    hours: '08:30 AM – 05:00 PM',
  },
];

const categories = [
  { id: 'all', label: 'All Services' },
  { id: 'market', label: 'APMC Mandis' },
  { id: 'storage', label: 'Cold Storage & Warehouses' },
  { id: 'soillab', label: 'Soil Testing Labs' },
  { id: 'kvk', label: 'KVK & Extension' },
  { id: 'inputs', label: 'Certified Seeds' },
];

const MapsPage = () => {
  const { latitude, longitude, formattedName, isGps, isGlobal } = useLocationContext();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);

  const hasCoords = latitude != null && longitude != null;

  // Compute geographical distance to each verified point
  const placesWithDistance = useMemo(() => {
    return verifiedAgriLocations.map((item) => {
      const distance = hasCoords
        ? calculateDistanceKm(latitude, longitude, item.position[0], item.position[1])
        : null;
      return { ...item, distance };
    }).sort((a, b) => {
      if (a.distance != null && b.distance != null) return a.distance - b.distance;
      return 0;
    });
  }, [hasCoords, latitude, longitude]);

  const filteredLocations = useMemo(() => {
    return placesWithDistance.filter((place) => {
      const categoryMatch =
        activeCategory === 'all' || place.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const queryMatch =
        !q ||
        place.title.toLowerCase().includes(q) ||
        place.type.toLowerCase().includes(q) ||
        place.description.toLowerCase().includes(q) ||
        place.address.toLowerCase().includes(q);
      return categoryMatch && queryMatch;
    });
  }, [placesWithDistance, activeCategory, searchQuery]);

  const mapMarkers = useMemo(() => {
    const list = filteredLocations.map((p) => ({
      id: p.id,
      title: `${p.title} ${p.distance != null ? `(${p.distance} km)` : ''}`,
      type: p.type,
      position: p.position,
      color: p.color,
      address: p.address,
      contact: p.contact,
      description: `${p.description} Distance: ${p.distance != null ? `${p.distance} km` : 'Regional'}. Hours: ${p.hours}`,
    }));

    if (hasCoords) {
      list.unshift({
        id: 'user_active_location',
        title: `📍 Your Active Location (${formattedName})`,
        type: isGps ? 'Current GPS Location' : 'Selected Location',
        position: [latitude, longitude],
        color: '#0284C7',
        description: `Coordinates: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`,
      });
    }

    return list;
  }, [filteredLocations, hasCoords, latitude, longitude, formattedName, isGps]);

  const mapCenter = useMemo(() => {
    if (selectedPlace) return selectedPlace.position;
    if (hasCoords) return [latitude, longitude];
    return verifiedAgriLocations[0].position;
  }, [selectedPlace, hasCoords, latitude, longitude]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Geo-Spatial Agricultural Services Directory</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Maps & Nearby Services</h1>
          <p className="text-sm text-[#64748B] mt-1">
            {isGlobal
              ? 'Locate verified APMC markets, cold storage facilities, soil testing labs, and Krishi Vigyan Kendras.'
              : `Locate verified agricultural services sorted by proximity to ${formattedName}.`}
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
            placeholder="Search APMC mandi, warehouse, cold storage, soil lab, seed depot, or KVK..."
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

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-md text-xs whitespace-nowrap transition-colors cursor-pointer ${
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
            <span className="font-semibold text-[#1F2937]">Agricultural Infrastructure Map</span>
            <span>{filteredLocations.length} Verified Points</span>
          </div>

          <LeafletMap
            center={mapCenter}
            zoom={selectedPlace ? 14 : hasCoords ? 11 : 9}
            markers={mapMarkers}
            selectedId={selectedPlace?.id}
            onSelectMarker={(p) => setSelectedPlace(p)}
            height="460px"
          />

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
            <span>Click any marker to view contact, distance, and road navigation</span>
            <span className="text-[#15803D] font-semibold">OpenStreetMap Verified</span>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-5 space-y-3 max-h-[580px] overflow-y-auto">
          <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
            <span className="font-semibold text-[#1F2937]">
              Nearby Services Directory ({filteredLocations.length})
            </span>
            {hasCoords && <span className="text-[#15803D] font-bold">Sorted by Distance</span>}
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
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{ backgroundColor: '#F1F5F9', color: item.color }}
                    >
                      {item.type}
                    </span>
                    {item.distance != null && (
                      <span className="text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-1.5 py-0.5 rounded">
                        {item.distance} km
                      </span>
                    )}
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${item.position[0]},${item.position[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-semibold text-[#15803D] hover:underline inline-flex items-center gap-1 shrink-0"
                  >
                    Directions <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <h3 className="text-sm font-bold text-[#1F2937] mt-2">{item.title}</h3>
                <p className="text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.address}</span>
                  </p>
                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <span className="flex items-center gap-1 text-[#15803D] font-semibold">
                      <Phone className="w-3 h-3" />
                      <span>{item.contact}</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{item.hours}</span>
                    </span>
                  </div>
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
