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
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap.jsx';

// Agricultural Schemes Data
const schemesData = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category: 'Income Support',
    level: 'Central Government',
    benefit: '₹6,000 per year directly into bank accounts in 3 equal installments of ₹2,000.',
    eligibility: 'All small and marginal landholder farmer families with cultivable land in their names.',
    documents: ['Aadhaar Card linked with bank account', 'Land ownership documents (RTC / Pahani)', 'Active Bank Account / IFSC'],
    process: 'Apply online via pmkisan.gov.in or visit your local Gram Panchayat / Raitha Samparka Kendra with RTC records.',
    link: 'https://pmkisan.gov.in/',
  },
  {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'Crop Insurance',
    level: 'Central & State Scheme',
    benefit: 'Comprehensive risk coverage from pre-sowing to post-harvest crop losses due to drought, unseasonal rains, or pest attacks.',
    eligibility: 'All farmers growing notified crops (Kharif/Rabi) in notified insurance units. Nominal premium (1.5% - 2%).',
    documents: ['RTC / Land records', 'Sowing Certificate from Village Accountant / RSK', 'Bank Passbook copy', 'Aadhaar Card'],
    process: 'Enroll through designated banks, Common Service Centres (CSC), or via the Samrakshane portal within cutoff date.',
    link: 'https://pmfby.gov.in/',
  },
  {
    id: 'pmksy-drip',
    name: 'Per Drop More Crop - PMKSY Micro-Irrigation',
    category: 'Irrigation & Water',
    level: 'Central & Karnataka Scheme',
    benefit: 'Up to 90% subsidy for small and marginal farmers (SC/ST 90%, General 75%–90%) for installing drip and sprinkler units.',
    eligibility: 'Farmers possessing minimum 0.5 acre cultivable land with an assured perennial water source (borewell/well).',
    documents: ['RTC / 7/12 Extract', 'Water source availability certificate', 'Aadhaar Card', 'Soil & Water test report'],
    process: 'Submit application through Karnataka Raitha Siri / e-Krishi portal or at the Taluk Assistant Director of Agriculture office.',
    link: 'https://pmksy.gov.in/',
  },
  {
    id: 'smam',
    name: 'SMAM (Sub-Mission on Agricultural Mechanization)',
    category: 'Farm Machinery',
    level: 'Central Government',
    benefit: '40% to 50% financial subsidy on purchase of tractors, rotavators, power tillers, seed drills, and sprayers.',
    eligibility: 'Individual farmers, women self-help groups, cooperative societies, and custom hiring entrepreneurs.',
    documents: ['Aadhaar Card', 'Land ownership proof', 'Quotation from authorized machinery dealer', 'Bank passbook'],
    process: 'Apply online at agrimachinery.nic.in, obtain administrative sanction, purchase equipment, and submit invoice for DBT subsidy.',
    link: 'https://agrimachinery.nic.in/',
  },
  {
    id: 'krishi-yantra-dhare',
    name: 'Krishi Yantra Dhare (Custom Hiring Centres)',
    category: 'Farm Machinery',
    level: 'Karnataka State Scheme',
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
    level: 'Karnataka State Scheme',
    benefit: 'Direct incentive of ₹10,000 per hectare (up to 2 hectares) for farmers cultivating minor millets (Ragi, Jowar, Bajra).',
    eligibility: 'Farmers registered on Karnataka FRUITS portal cultivating designated minor millets.',
    documents: ['FRUITS ID (FID)', 'Aadhaar Card', 'RTC showing millet crop crop-cutting survey entry'],
    process: 'Enroll through your local Raitha Samparka Kendra after sowing inspection is completed by agriculture officers.',
    link: 'https://raitamitra.karnataka.gov.in/',
  },
  {
    id: 'soil-health-card',
    name: 'Soil Health Card Scheme',
    category: 'Soil & Nutrients',
    level: 'Central Government',
    benefit: 'Free periodic soil testing with customized crop-specific fertilizer and micronutrient advisory cards every 3 years.',
    eligibility: 'Every farmer cultivating agricultural land.',
    documents: ['Land ownership details', 'Aadhaar Card'],
    process: 'Contact local Agriculture Officer or collect sample as per guidelines and submit to nearest Taluk Soil Testing Lab.',
    link: 'https://soilhealth.dac.gov.in/',
  },
  {
    id: 'krishi-bhagya',
    name: 'Krishi Bhagya Rainwater Harvesting',
    category: 'Irrigation & Water',
    level: 'Karnataka State Scheme',
    benefit: 'Up to 80% subsidy for digging farm ponds (Krishi Honda), polythene lining, diesel pumpsets, and shade-net nurseries.',
    eligibility: 'Farmers in rainfed agro-climatic zones of Karnataka with minimum 1 acre holding.',
    documents: ['RTC', 'FRUITS ID', 'Aadhaar Card', 'Bank account details'],
    process: 'Submit application at Raitha Samparka Kendra. Department engineers verify field suitability before work orders are issued.',
    link: 'https://raitamitra.karnataka.gov.in/',
  },
];

// Reliable Regional Agriculture Extension Centres in Belagavi District
const agricultureOffices = [
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showOfficesMap, setShowOfficesMap] = useState(false);

  const filteredSchemes = useMemo(() => {
    return schemesData.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.benefit.toLowerCase().includes(q) ||
        item.eligibility.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const mapMarkers = agricultureOffices.map((office) => ({
    id: office.id,
    title: office.name,
    type: 'Agriculture Office',
    position: office.position,
    color: office.color,
    address: office.address,
    contact: office.contact,
    description: `${office.description} Hours: ${office.hours}`,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <Landmark className="w-3.5 h-3.5" />
            <span>Government Subsidies & Farmer Welfare</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Government Schemes</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Discover central and Karnataka state agricultural schemes, eligibility rules, subsidy benefits, and application steps.
          </p>
        </div>

        {/* Toggle Offices Map */}
        <button
          onClick={() => setShowOfficesMap(!showOfficesMap)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors self-start sm:self-auto ${
            showOfficesMap
              ? 'bg-[#15803D] text-white'
              : 'bg-[#F8FAF6] text-[#15803D] border border-slate-200 hover:bg-[#DCFCE7]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          {showOfficesMap ? 'Hide Offices Map' : 'Nearby Agriculture Offices Map'}
        </button>
      </div>

      {/* Nearby Agriculture Offices Map (Optional / Toggleable) */}
      {showOfficesMap && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-[#14532D]">
                Belagavi Raitha Samparka Kendras & Agri Offices
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Visit your nearest extension center for physical document verification, scheme registration, and seed distribution.
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
            center={[15.8524, 74.4988]}
            zoom={10}
            markers={mapMarkers}
            height="360px"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {agricultureOffices.map((office) => (
              <div
                key={office.id}
                className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-200 text-xs space-y-1"
              >
                <span className="font-bold text-[#1F2937] block">{office.name}</span>
                <p className="text-[#64748B]">{office.address}</p>
                <p className="text-slate-500">📞 {office.contact}</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${office.position[0]},${office.position[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[#15803D] hover:underline pt-1"
                >
                  Directions <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search schemes (PM-KISAN, crop insurance, drip irrigation, machinery subsidy)..."
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

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#15803D] transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                  {scheme.category}
                </span>
                <span className="text-[11px] text-[#64748B] font-medium">{scheme.level}</span>
              </div>

              <h3 className="text-base font-bold text-[#1F2937] mt-2.5">
                {scheme.name}
              </h3>

              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                <span className="font-semibold text-[#1F2937]">Benefit: </span>
                {scheme.benefit}
              </p>

              <div className="mt-3 p-3 bg-[#F8FAF6] rounded-lg border border-slate-100 text-xs">
                <span className="font-semibold text-[#14532D]">Who is eligible? </span>
                <p className="text-[#64748B] mt-0.5">{scheme.eligibility}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedScheme(scheme)}
                className="text-xs font-semibold text-[#15803D] hover:underline inline-flex items-center gap-1"
              >
                <span>View Eligibility & Application Steps</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#64748B] hover:text-[#15803D] inline-flex items-center gap-1 font-medium"
              >
                Official Portal
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-[#64748B]">
          <Landmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#1F2937]">No government schemes match your search</p>
          <p className="text-xs text-slate-400 mt-1">Try searching for &quot;PM-KISAN&quot;, &quot;insurance&quot;, or &quot;irrigation&quot;.</p>
        </div>
      )}

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedScheme(null)}
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-slate-200 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                  {selectedScheme.category}
                </span>
                <h2 className="text-lg font-bold text-[#1F2937] mt-1.5">{selectedScheme.name}</h2>
                <p className="text-xs text-[#64748B]">{selectedScheme.level}</p>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="p-3 bg-[#DCFCE7]/60 rounded-lg border border-emerald-200">
                <span className="font-bold text-[#14532D] block mb-1">Financial Benefits</span>
                <p className="text-[#14532D] leading-relaxed">{selectedScheme.benefit}</p>
              </div>

              <div>
                <span className="font-bold text-[#1F2937] block mb-1">Eligibility Criteria</span>
                <p className="text-[#64748B] leading-relaxed">{selectedScheme.eligibility}</p>
              </div>

              <div>
                <span className="font-bold text-[#1F2937] block mb-1">Required Documents</span>
                <ul className="list-disc list-inside space-y-1 text-[#64748B]">
                  {selectedScheme.documents.map((doc) => (
                    <li key={doc}>{doc}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-200">
                <span className="font-bold text-[#1F2937] block mb-1">How to Apply</span>
                <p className="text-[#64748B] leading-relaxed">{selectedScheme.process}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedScheme(null)}
                className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs"
              >
                Close
              </button>

              <a
                href={selectedScheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#15803D] text-white text-xs font-semibold hover:bg-[#14532D]"
              >
                Open Official Portal
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
