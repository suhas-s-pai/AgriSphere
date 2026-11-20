import React, { useState, useMemo } from 'react';
import {
  Landmark,
  Search,
  ExternalLink,
  MapPin,
  CheckCircle2,
  FileText,
  Clock,
  Building2,
  X,
  Phone,
  ChevronRight,
  ShieldCheck,
  Navigation,
  Globe,
  Sparkles,
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap.jsx';
import { useLocationContext } from '../../context/LocationContext.jsx';
import { calculateDistanceKm } from '../../services/marketService.js';

// Verified Central & State Agricultural Schemes Data
const schemesData = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category: 'Income Support',
    level: 'Central Government',
    targetState: 'All India',
    benefit: '₹6,000 per year directly into bank accounts in 3 equal installments of ₹2,000.',
    eligibility: 'All landholder farmer families with cultivable land in their names across all states.',
    documents: ['Aadhaar Card linked with bank account', 'Land ownership documents (RTC / 7/12 / Pahani)', 'Active Bank Account / IFSC'],
    process: 'Apply online via pmkisan.gov.in or visit your local Gram Panchayat / Raitha Samparka Kendra with land records.',
    link: 'https://pmkisan.gov.in/',
  },
  {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'Crop Insurance',
    level: 'Central & State Scheme',
    targetState: 'All India',
    benefit: 'Comprehensive risk coverage from pre-sowing to post-harvest crop losses due to drought, unseasonal rains, or pest attacks.',
    eligibility: 'All farmers growing notified crops (Kharif/Rabi) in notified insurance units. Nominal premium (1.5% - 2%).',
    documents: ['RTC / Land records', 'Sowing Certificate from Village Accountant / RSK', 'Bank Passbook copy', 'Aadhaar Card'],
    process: 'Enroll through designated banks, Common Service Centres (CSC), or via the Samrakshane / PMFBY portal within cutoff date.',
    link: 'https://pmfby.gov.in/',
  },
  {
    id: 'pmksy-drip',
    name: 'Per Drop More Crop - PMKSY Micro-Irrigation',
    category: 'Irrigation & Water',
    level: 'Central & State Scheme',
    targetState: 'All India',
    benefit: 'Up to 90% subsidy for small and marginal farmers (SC/ST 90%, General 75%–90%) for installing drip and sprinkler units.',
    eligibility: 'Farmers possessing minimum 0.5 acre cultivable land with an assured perennial water source (borewell/well).',
    documents: ['RTC / 7/12 Extract', 'Water source availability certificate', 'Aadhaar Card', 'Soil & Water test report'],
    process: 'Submit application through State Agriculture / Horticulture portal or at the Taluk Assistant Director of Agriculture office.',
    link: 'https://pmksy.gov.in/',
  },
  {
    id: 'smam',
    name: 'SMAM (Sub-Mission on Agricultural Mechanization)',
    category: 'Farm Machinery',
    level: 'Central Government',
    targetState: 'All India',
    benefit: '40% to 50% financial subsidy on purchase of tractors, rotavators, power tillers, seed drills, and sprayers.',
    eligibility: 'Individual farmers, women self-help groups, cooperative societies, and custom hiring entrepreneurs.',
    documents: ['Aadhaar Card', 'Land ownership proof', 'Quotation from authorized machinery dealer', 'Bank passbook'],
    process: 'Apply online at agrimachinery.nic.in, obtain administrative sanction, purchase equipment, and submit invoice for DBT subsidy.',
    link: 'https://agrimachinery.nic.in/',
  },
  {
    id: 'soil-health-card',
    name: 'Soil Health Card Scheme',
    category: 'Soil & Nutrients',
    level: 'Central Government',
    targetState: 'All India',
    benefit: 'Free periodic soil testing with customized crop-specific fertilizer and micronutrient advisory cards every 3 years.',
    eligibility: 'Every farmer cultivating agricultural land.',
    documents: ['Land ownership details', 'Aadhaar Card'],
    process: 'Contact local Agriculture Officer or collect sample as per guidelines and submit to nearest Taluk Soil Testing Lab.',
    link: 'https://soilhealth.dac.gov.in/',
  },
  {
    id: 'krishi-yantra-dhare',
    name: 'Krishi Yantra Dhare (Custom Hiring Centres)',
    category: 'Farm Machinery',
    level: 'State Scheme (Karnataka)',
    targetState: 'Karnataka',
    benefit: 'Rental access to expensive farm machinery (tractors, harvesters, laser levellers) at 40% subsidized hourly rates.',
    eligibility: 'All small and marginal farmers in Karnataka lacking financial capacity to buy high-cost machinery.',
    documents: ['Aadhaar Card', 'Farmer ID (FID) / RTC copy'],
    process: 'Book machinery slots directly at your hobli-level Krishi Yantra Dhare service centre or via the mobile booking app.',
    link: 'https://raitamitra.karnataka.gov.in/',
  },
  {
    id: 'raitha-siri',
    name: 'Raitha Siri Millet Incentive Scheme',
    category: 'State Subsidies',
    level: 'State Scheme (Karnataka)',
    targetState: 'Karnataka',
    benefit: 'Direct incentive of ₹10,000 per hectare (up to 2 hectares) for farmers cultivating minor millets (Ragi, Jowar, Bajra).',
    eligibility: 'Farmers registered on Karnataka FRUITS portal cultivating designated minor millets.',
    documents: ['FRUITS ID (FID)', 'Aadhaar Card', 'RTC showing millet crop crop-cutting survey entry'],
    process: 'Enroll through your local Raitha Samparka Kendra after sowing inspection is completed by agriculture officers.',
    link: 'https://raitamitra.karnataka.gov.in/',
  },
  {
    id: 'krishi-bhagya',
    name: 'Krishi Bhagya Rainwater Harvesting',
    category: 'Irrigation & Water',
    level: 'State Scheme (Karnataka)',
    targetState: 'Karnataka',
    benefit: 'Up to 80% subsidy for digging farm ponds (Krishi Honda), polythene lining, diesel pumpsets, and shade-net nurseries.',
    eligibility: 'Farmers in rainfed agro-climatic zones of Karnataka with minimum 1 acre holding.',
    documents: ['RTC', 'FRUITS ID', 'Aadhaar Card', 'Bank account details'],
    process: 'Submit application at Raitha Samparka Kendra. Department engineers verify field suitability before work orders are issued.',
    link: 'https://raitamitra.karnataka.gov.in/',
  },
  {
    id: 'mahadbt-farmer',
    name: 'MahaDBT Farmer Schemes (Maharashtra)',
    category: 'State Subsidies',
    level: 'State Scheme (Maharashtra)',
    targetState: 'Maharashtra',
    benefit: 'Direct Benefit Transfer subsidies on farm ponds, drip irrigation, shade net houses, and tractor implements.',
    eligibility: 'Resident farmers of Maharashtra with valid 7/12 land extract and Aadhaar linkage.',
    documents: ['Aadhaar Card', '7/12 Extract', '8A Extract', 'Bank Passbook'],
    process: 'Register on mahadbt.maharashtra.gov.in, select agricultural schemes lottery, and upload necessary land records.',
    link: 'https://mahadbt.maharashtra.gov.in/',
  },
];

// Verified Regional Agriculture Extension & RSK Offices
const baseAgricultureOffices = [
  {
    id: 'rsk-belagavi',
    name: 'Raitha Samparka Kendra (RSK) Belagavi',
    position: [15.8621, 74.5085],
    color: '#15803D',
    address: 'Near Old PB Road, Agriculture Complex, Belagavi 590001',
    contact: '+91 831 240 7215',
    hours: 'Mon - Fri: 10:00 AM - 05:30 PM',
    description: 'Hobli level office for seed distribution, soil test cards, and PM-KISAN verification.',
  },
  {
    id: 'jda-office',
    name: 'Joint Director of Agriculture (JDA) Office',
    position: [15.8524, 74.4988],
    color: '#14532D',
    address: 'Club Road, Near Deputy Commissioner Office, Belagavi 590001',
    contact: '+91 831 242 0423',
    hours: 'Mon - Fri: 10:00 AM - 05:30 PM',
    description: 'District headquarters for all Central & Karnataka State agricultural scheme administration.',
  },
  {
    id: 'rsk-gokak',
    name: 'Raitha Samparka Kendra Gokak',
    position: [16.1685, 74.8312],
    color: '#2563EB',
    address: 'APMC Market Campus, Ghataprabha Road, Gokak 591307',
    contact: '+91 8332 225 110',
    hours: 'Mon - Fri: 10:00 AM - 05:30 PM',
    description: 'Sub-division office handling drip irrigation subsidies and custom hiring equipment booking.',
  },
  {
    id: 'rsk-chikodi',
    name: 'Raitha Samparka Kendra Chikodi',
    position: [16.4312, 74.5985],
    color: '#D97706',
    address: 'Court Circle, Near Taluk Panchayat, Chikodi 591201',
    contact: '+91 8338 272 104',
    hours: 'Mon - Fri: 10:00 AM - 05:30 PM',
    description: 'Local extension counter for PMFBY insurance claims and subsidized certified seeds.',
  },
  {
    id: 'rsk-bailhongal',
    name: 'Raitha Samparka Kendra Bailhongal',
    position: [15.8155, 74.8612],
    color: '#7C3AED',
    address: 'Station Road, Near Old Bus Stand, Bailhongal 591102',
    contact: '+91 8288 233 045',
    hours: 'Mon - Fri: 10:00 AM - 05:30 PM',
    description: 'Extension center for cotton mechanization, crop loss surveys, and organic farming clusters.',
  },
];

const categories = [
  'All',
  'Income Support',
  'Crop Insurance',
  'Irrigation & Water',
  'Farm Machinery',
  'Soil & Nutrients',
  'State Subsidies',
];

const SchemesPage = () => {
  const {
    latitude,
    longitude,
    city,
    district,
    state,
    formattedName,
    isGps,
    isGlobal,
  } = useLocationContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showOfficesMap, setShowOfficesMap] = useState(false);

  const userLat = latitude ?? 15.8497;
  const userLng = longitude ?? 74.4977;
  const hasUserCoords = latitude != null && longitude != null;

  // Compute live distances for extension offices
  const officesWithDistances = useMemo(() => {
    return baseAgricultureOffices.map((office) => {
      const distanceKm = hasUserCoords
        ? calculateDistanceKm(
            userLat,
            userLng,
            office.position[0],
            office.position[1]
          )
        : null;
      return {
        ...office,
        distanceKm,
      };
    }).sort((a, b) => {
      if (a.distanceKm != null && b.distanceKm != null) return a.distanceKm - b.distanceKm;
      return 0;
    });
  }, [hasUserCoords, userLat, userLng]);

  // Prioritize schemes matching user's active state
  const prioritizedSchemes = useMemo(() => {
    const userState = (state || '').toLowerCase();
    return [...schemesData].sort((a, b) => {
      const aMatches = a.targetState === 'All India' || (userState && a.targetState.toLowerCase().includes(userState));
      const bMatches = b.targetState === 'All India' || (userState && b.targetState.toLowerCase().includes(userState));
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });
  }, [state]);

  const filteredSchemes = useMemo(() => {
    return prioritizedSchemes.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.benefit.toLowerCase().includes(q) ||
        item.eligibility.toLowerCase().includes(q) ||
        item.level.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [prioritizedSchemes, selectedCategory, searchQuery]);

  // Map markers: User location + extension offices
  const mapMarkers = useMemo(() => {
    const list = [];
    if (hasUserCoords) {
      list.push({
        id: 'user-pin',
        title: `Your Active Location (${formattedName})`,
        type: isGps ? 'GPS Verified' : 'Location',
        position: [userLat, userLng],
        color: '#2563EB',
        description: `Coordinates: ${userLat.toFixed(4)}°N, ${userLng.toFixed(4)}°E`,
      });
    }
    return [...list, ...officesWithDistances];
  }, [hasUserCoords, userLat, userLng, formattedName, isGps, officesWithDistances]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <Landmark className="w-3.5 h-3.5" />
            <span>Government Direct Benefit & Subsidy Schemes</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Government Schemes</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Official central and state government agricultural subsidies, income support, and crop insurance schemes for{' '}
            <span className="font-semibold text-slate-800">{state || formattedName}</span>.
          </p>
        </div>

        {/* Action Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-[#F8FAF6] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-[#1F2937]">
            {isGps ? (
              <Navigation className="w-3.5 h-3.5 text-[#15803D]" />
            ) : isGlobal ? (
              <Globe className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-[#15803D]" />
            )}
            <span className="font-semibold truncate max-w-[150px]">{formattedName}</span>
          </div>
          <button
            onClick={() => setShowOfficesMap(!showOfficesMap)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[#15803D] hover:bg-[#DCFCE7] text-xs font-semibold"
          >
            <Building2 className="w-4 h-4" />
            <span>{showOfficesMap ? 'Hide Extension Offices' : 'Extension Offices Map'}</span>
          </button>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="bg-emerald-50/80 rounded-xl border border-emerald-200 p-4 flex items-center justify-between gap-3 text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong className="font-bold">Official Verification: </strong>
            All listed schemes link directly to government portals (.gov.in / .nic.in). Guidelines active for the 2025–2026 financial year.
          </span>
        </div>
        <span className="bg-white text-emerald-800 font-semibold px-2.5 py-1 rounded-md border border-emerald-200 shrink-0 hidden sm:inline-block">
          Direct DBT Portal
        </span>
      </div>

      {/* Extension Offices Map Collapsible */}
      {showOfficesMap && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#1F2937]">
                Raitha Samparka Kendras (RSK) & District Agriculture Offices
              </h3>
              <p className="text-xs text-[#64748B]">
                Visit these verified offices for physical document verification, FRUITS ID creation, and subsidy sanctions.
              </p>
            </div>
            <button
              onClick={() => setShowOfficesMap(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <LeafletMap
            center={[userLat, userLng]}
            zoom={11}
            markers={mapMarkers}
            selectedId="user-pin"
            height="300px"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {officesWithDistances.map((office) => (
              <div
                key={office.id}
                className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-200 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#14532D]">{office.name}</span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded shrink-0">
                      {office.distanceKm != null ? `${office.distanceKm} km` : 'Regional Office'}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1">{office.address}</p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-slate-600">
                  <span className="font-medium">{office.contact}</span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${office.position[0]},${office.position[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#15803D] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Directions
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scheme name, subsidy benefits, or eligibility requirements..."
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

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#15803D] text-white'
                  : 'bg-[#F8FAF6] text-[#64748B] hover:text-[#1F2937] border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            onClick={() => setSelectedScheme(scheme)}
            className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-[#15803D] cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                  {scheme.category}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {scheme.level}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#15803D] transition-colors mt-3">
                {scheme.name}
              </h3>

              <div className="mt-3 p-2.5 rounded-lg bg-[#F8FAF6] border border-slate-200 text-xs text-[#14532D] leading-relaxed">
                <span className="font-bold">Key Benefit: </span>
                {scheme.benefit}
              </div>

              <p className="mt-3 text-xs text-[#64748B] line-clamp-2">
                <span className="font-semibold text-slate-700">Eligibility: </span>
                {scheme.eligibility}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#15803D]">
              <span>View Eligibility & Apply</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-[#64748B]">
          <Landmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#1F2937]">No government schemes match your filter</p>
          <p className="text-xs text-slate-400 mt-1">Try selecting &quot;All&quot; categories or clearing the search text.</p>
        </div>
      )}

      {/* Scheme Detail & Application Modal */}
      {selectedScheme && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedScheme(null)}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-slate-200 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D]">
                  {selectedScheme.level} • {selectedScheme.category}
                </span>
                <h2 className="text-lg font-bold text-[#1F2937] mt-0.5">{selectedScheme.name}</h2>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3.5 rounded-lg bg-[#DCFCE7] border border-emerald-200 text-[#14532D]">
                <span className="font-bold block mb-1">💰 Financial & Direct Benefit</span>
                <p className="leading-relaxed font-medium">{selectedScheme.benefit}</p>
              </div>

              <div>
                <span className="font-bold text-[#1F2937] block mb-1">📋 Eligibility Criteria</span>
                <p className="text-[#64748B] leading-relaxed bg-[#F8FAF6] p-3 rounded-lg border border-slate-200">
                  {selectedScheme.eligibility}
                </p>
              </div>

              <div>
                <span className="font-bold text-[#1F2937] block mb-1.5">📑 Required Documents</span>
                <ul className="space-y-1.5">
                  {selectedScheme.documents.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-700 bg-[#F8FAF6] px-3 py-1.5 rounded-md border border-slate-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-[#1F2937] block mb-1">🚀 Step-by-Step Application Process</span>
                <p className="text-[#64748B] leading-relaxed bg-[#F8FAF6] p-3 rounded-lg border border-slate-200">
                  {selectedScheme.process}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedScheme(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>

              <a
                href={selectedScheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#15803D] text-white text-xs font-bold hover:bg-[#14532D] transition-colors shadow-xs"
              >
                <span>Open Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemesPage;
