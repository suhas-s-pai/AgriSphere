import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Search,
  MapPin,
  Phone,
  Filter,
  Layers,
  Calculator,
  Tractor,
  Droplets,
  RotateCcw,
  Wheat,
  IndianRupee,
  Sprout,
  ExternalLink,
  ChevronRight,
  List,
  Map as MapIcon,
  Tag,
  CheckCircle2,
  X,
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap.jsx';

// Regional Belagavi Demonstration Equipment & Dealer Locations
const equipmentDealers = [
  {
    id: 'jd-belagavi',
    title: 'John Deere Tractor & Implement Hub',
    type: 'Tractors & Harvesters',
    category: 'tractors',
    dealership: 'Authorised Dealer & Custom Hire',
    position: [15.8624, 74.5192],
    color: '#15803D',
    address: 'Plot 42, Mahantesh Nagar, Belagavi',
    contact: '+91 831 247 1820',
    availableEquipment: ['John Deere 5050D (50 HP)', 'Multi-Crop Rotary Tiller', 'Paddy Straw Reaper'],
    pricingType: 'Rental & Purchase',
    rate: 'Rent: ₹750 - ₹1,200/hr | Sale Available',
    description: 'High-power tractor rentals, certified implements, and genuine spare parts with warranty.',
  },
  {
    id: 'mahindra-krishi',
    title: 'Mahindra Krishi Samriddhi Centre',
    type: 'Equipment Dealers',
    category: 'dealers',
    dealership: 'Sales, Service & Rentals',
    position: [15.8391, 74.5028],
    color: '#DC2626',
    address: 'Near 3rd Railway Gate, Khanapur Road, Belagavi',
    contact: '+91 831 248 9931',
    availableEquipment: ['Mahindra Yuvo 575', 'Disc Plough', 'Automatic Seed Drill'],
    pricingType: 'Purchase & EMI',
    rate: 'Govt. Subsidized Rates Available',
    description: 'Complete farm mechanization solutions, demo drives, and finance support for farmers.',
  },
  {
    id: 'vst-tillers',
    title: 'VST Shakti Tillers & Power Sprayers',
    type: 'Sprayers & Pumps',
    category: 'sprayers',
    dealership: 'Dealer & Service',
    position: [15.8715, 74.5312],
    color: '#2563EB',
    address: 'Auto Nagar Industrial Area, Belagavi',
    contact: '+91 94481 20455',
    availableEquipment: ['13 HP Power Tiller', '16L Battery Knapsack Sprayer', '5 HP Solar Water Pump'],
    pricingType: 'Rental & Purchase',
    rate: 'Rent: ₹350/day | Sale: ₹12,000+',
    description: 'Specialized in small-holder farm equipment, horticulture sprayers, and micro-irrigation pump sets.',
  },
  {
    id: 'karnataka-yantra',
    title: 'Krishi Yantra Dhare Custom Hiring Centre',
    type: 'Rental Centres',
    category: 'rental',
    dealership: 'Government Supported Rental Hub',
    position: [15.8452, 74.4821],
    color: '#7C3AED',
    address: 'APMC Market Yard, Bachi Road, Belagavi',
    contact: '+91 831 240 5112',
    availableEquipment: ['Combine Harvester (Paddy/Maize)', 'Laser Land Leveller', 'Rotavator', 'Post Hole Digger'],
    pricingType: 'Subsidized Rental',
    rate: 'Subsidized: ₹400 - ₹900/hr',
    description: 'Karnataka State Agriculture Dept. hiring centre providing affordable machinery for small & marginal farmers.',
  },
  {
    id: 'belagavi-repair',
    title: 'AgriMech Tractor & Machinery Repair Works',
    type: 'Repair & Service',
    category: 'repair',
    dealership: 'Certified Workshop',
    position: [15.8288, 74.5105],
    color: '#D97706',
    address: 'Udyambag Industrial Estate, Belagavi',
    contact: '+91 98452 77103',
    availableEquipment: ['Hydraulic System Repair', 'Engine Overhaul', 'Welding & Blade Sharpening'],
    pricingType: 'Service & Maintenance',
    rate: 'Free Diagnostics for Registered Farmers',
    description: 'Fast breakdown repair, pump motor rewinding, combine harvester maintenance, and on-field emergency visits.',
  },
  {
    id: 'falcon-agro-tools',
    title: 'Falcon Agro Tools & Drip Hardware',
    type: 'Cultivators & Tools',
    category: 'tools',
    dealership: 'Wholesale & Retail',
    position: [15.8562, 74.4951],
    color: '#059669',
    address: 'Near Old Bus Stand, Khade Bazar, Belagavi',
    contact: '+91 831 242 3340',
    availableEquipment: ['Hand Weeders & Cultivators', 'Brush Cutters', 'Chain Saws', 'Drip Lateral Pipes'],
    pricingType: 'Direct Purchase',
    rate: 'Wholesale Farm Prices',
    description: 'Hardware tools, manual weeders, pruning tools, and low-cost farm safety gear.',
  },
];

const categoryTabs = [
  { id: 'all', label: 'All Equipment & Hubs' },
  { id: 'tractors', label: 'Tractors & Harvesters' },
  { id: 'sprayers', label: 'Sprayers & Pumps' },
  { id: 'dealers', label: 'Dealers' },
  { id: 'rental', label: 'Rental Hubs' },
  { id: 'repair', label: 'Repair & Service' },
  { id: 'tools', label: 'Hand Tools' },
];

const farmingCalculators = [
  {
    id: 'fertilizer',
    title: 'NPK Fertilizer Calculator',
    desc: 'Estimate urea and NPK requirement based on plot area and crop nutrient recommendation.',
    icon: Sprout,
  },
  {
    id: 'seed',
    title: 'Seed Quantity Estimator',
    desc: 'Calculate seed bag requirements for wheat, maize, groundnut, or paddy fields.',
    icon: Wheat,
  },
  {
    id: 'water',
    title: 'Irrigation Water Need Estimator',
    desc: 'Estimate daily water volume required for crop acreage based on plant population.',
    icon: Droplets,
  },
  {
    id: 'profit',
    title: 'Farm Profit & Cost Estimator',
    desc: 'Forecast gross crop revenues minus land preparation, seed, and fertilizer costs.',
    icon: IndianRupee,
  },
];

const ToolsPage = () => {
  const [activeTab, setActiveTab] = useState('map'); // 'map' or 'calculators'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'map', 'list'
  const [activeCalculator, setActiveCalculator] = useState(null);

  // Filter Dealers
  const filteredDealers = useMemo(() => {
    return equipmentDealers.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        item.availableEquipment.some((eq) => eq.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <Wrench className="w-3.5 h-3.5" />
            <span>Farming Tools & Machinery Directory</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">
            Farming Tools & Equipment Maps
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Discover agricultural machinery, custom hiring rental hubs, repair workshops, and field calculators in Belagavi.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-[#F8FAF6] border border-slate-200 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'map'
                ? 'bg-[#15803D] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            Equipment & Map
          </button>
          <button
            onClick={() => setActiveTab('calculators')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'calculators'
                ? 'bg-[#15803D] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Farming Calculators
          </button>
        </div>
      </div>

      {activeTab === 'map' ? (
        <div className="space-y-6">
          {/* Search & Category Filter Controls */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tractors, harvesters, sprayers, dealers, or repair services..."
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

              {/* View Layout Toggle */}
              <div className="flex items-center gap-1 p-1 bg-[#F8FAF6] border border-slate-200 rounded-lg shrink-0 self-end md:self-auto">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1.5 rounded text-xs font-medium ${
                    viewMode === 'split' ? 'bg-white text-[#15803D] font-bold shadow-xs' : 'text-slate-600'
                  }`}
                  title="Map & List"
                >
                  Split View
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded text-xs font-medium ${
                    viewMode === 'map' ? 'bg-white text-[#15803D] font-bold shadow-xs' : 'text-slate-600'
                  }`}
                  title="Map Only"
                >
                  Map Only
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded text-xs font-medium ${
                    viewMode === 'list' ? 'bg-white text-[#15803D] font-bold shadow-xs' : 'text-slate-600'
                  }`}
                  title="List Only"
                >
                  List Only
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categoryTabs.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-md text-xs whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#15803D] text-white font-medium'
                      : 'bg-[#F8FAF6] text-[#64748B] hover:text-[#1F2937] border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Map and Catalogue Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Map Column */}
            {(viewMode === 'split' || viewMode === 'map') && (
              <div
                className={`${
                  viewMode === 'map' ? 'lg:col-span-12' : 'lg:col-span-7'
                } sticky top-20`}
              >
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-3 text-xs text-[#64748B]">
                    <span className="font-semibold text-[#1F2937]">
                      Belagavi District Equipment & Service Map
                    </span>
                    <span>{filteredDealers.length} Locations Marked</span>
                  </div>

                  <LeafletMap
                    center={selectedDealer ? selectedDealer.position : [15.8497, 74.4977]}
                    zoom={selectedDealer ? 14 : 12}
                    markers={filteredDealers}
                    selectedId={selectedDealer?.id}
                    onSelectMarker={(dealer) => setSelectedDealer(dealer)}
                    height={viewMode === 'map' ? '540px' : '480px'}
                  />

                  <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-[#64748B] gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]" /> Tractors
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" /> Dealers
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /> Sprayers
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" /> Rentals
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> Repair
                      </span>
                    </div>
                    <span>Click any marker for contact & directions</span>
                  </div>
                </div>
              </div>
            )}

            {/* List / Catalogue Column */}
            {(viewMode === 'split' || viewMode === 'list') && (
              <div
                className={`${
                  viewMode === 'list' ? 'lg:col-span-12' : 'lg:col-span-5'
                } space-y-4`}
              >
                <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
                  <span className="font-semibold text-[#1F2937]">
                    Nearby Equipment Providers ({filteredDealers.length})
                  </span>
                  <span>Belagavi Taluks</span>
                </div>

                {filteredDealers.map((item) => {
                  const isSelected = selectedDealer?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedDealer(item)}
                      className={`group bg-white rounded-xl border p-4.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#15803D] ring-2 ring-[#DCFCE7] shadow-xs'
                          : 'border-slate-200 hover:border-[#15803D] shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span
                            className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: '#F1F5F9',
                              color: item.color,
                            }}
                          >
                            {item.type}
                          </span>
                          <h3 className="text-sm font-bold text-[#1F2937] group-hover:text-[#15803D] transition-colors mt-1">
                            {item.title}
                          </h3>
                        </div>

                        <span className="text-[11px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded whitespace-nowrap">
                          {item.pricingType}
                        </span>
                      </div>

                      <p className="text-xs text-[#64748B] mt-2 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Equipment Tags */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {item.availableEquipment.map((eq) => (
                          <span
                            key={eq}
                            className="text-[11px] text-[#1F2937] bg-[#F8FAF6] border border-slate-200 px-2 py-0.5 rounded"
                          >
                            {eq}
                          </span>
                        ))}
                      </div>

                      {/* Pricing, Address, Directions */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs text-[#64748B]">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#14532D]">{item.rate}</span>
                          <span className="text-slate-400">{item.dealership}</span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="flex items-center gap-1 truncate max-w-[200px]">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {item.address}
                          </span>

                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${item.position[0]},${item.position[1]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 font-semibold text-[#15803D] hover:underline shrink-0"
                          >
                            Directions
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredDealers.length === 0 && (
                  <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-[#64748B]">
                    <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-[#1F2937]">No equipment or dealers found</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing your search query or selecting &quot;All Equipment&quot;.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Calculators Tab */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {farmingCalculators.map((calc) => {
              const Icon = calc.icon;
              return (
                <div
                  key={calc.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-[#15803D] transition-colors"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#1F2937]">{calc.title}</h3>
                    <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">{calc.desc}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setActiveCalculator(calc.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] hover:text-[#14532D]"
                    >
                      <span>Open Calculator</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calculator Guidance Note */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
            <div className="text-xs text-[#64748B] leading-relaxed">
              <span className="font-bold text-[#1F2937]">Note for farmers: </span>
              Calculations are agronomic planning estimates for standard Karnataka crop conditions. Actual seed rates and fertilizer dosages may vary based on soil test reports and specific seed variety recommendations.
            </div>
          </div>
        </div>
      )}

      {/* Calculator Modal */}
      {activeCalculator && (
        <CalculatorModal
          type={activeCalculator}
          onClose={() => setActiveCalculator(null)}
        />
      )}
    </div>
  );
};

// Reusable Calculator Modal
function CalculatorModal({ type, onClose }) {
  const [values, setValues] = useState({
    area: 1,
    seedRate: 20,
    plants: 100,
    waterPerPlant: 5,
    yield: 10,
    price: 20,
    cost: 50000,
    n: 40,
    p: 20,
    k: 20,
    fertilizerN: 46,
  });

  const set = (key, value) => setValues((v) => ({ ...v, [key]: value }));

  const result = useMemo(() => {
    if (type === 'seed')
      return `${(Number(values.area) * Number(values.seedRate)).toFixed(1)} kg`;
    if (type === 'water')
      return `${(Number(values.plants) * Number(values.waterPerPlant)).toLocaleString()} L / day`;
    if (type === 'profit') {
      const revenue = Number(values.yield) * Number(values.price) * Number(values.area);
      return `₹${(revenue - Number(values.cost)).toLocaleString()}`;
    }
    return `${((Number(values.area) * Number(values.n)) / Number(values.fertilizerN)).toFixed(1)} kg urea`;
  }, [type, values]);

  const configs = {
    fertilizer: [
      ['area', 'Plot Area (acres)'],
      ['n', 'Nitrogen Target (kg/acre)'],
      ['fertilizerN', 'Nitrogen in Fertilizer (%) (e.g. 46% for Urea)'],
    ],
    seed: [
      ['area', 'Plot Area (acres)'],
      ['seedRate', 'Recommended Seed Rate (kg/acre)'],
    ],
    water: [
      ['plants', 'Total Number of Plants'],
      ['waterPerPlant', 'Water Requirement (Liters/plant/day)'],
    ],
    profit: [
      ['area', 'Plot Area (acres)'],
      ['yield', 'Expected Yield (Quintals/acre)'],
      ['price', 'Expected Market Price (₹/Quintal)'],
      ['cost', 'Total Input & Cultivation Cost (₹)'],
    ],
  };

  const labels = {
    fertilizer: 'Estimated Fertilizer Quantity Needed',
    seed: 'Total Seed Quantity Required',
    water: 'Estimated Daily Irrigation Water Needed',
    profit: 'Projected Net Farming Margin',
  };

  const currentTitle = farmingCalculators.find((c) => c.id === type)?.title;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white p-6 border border-slate-200 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D]">
              Agricultural Calculator
            </span>
            <h2 className="text-lg font-bold text-[#1F2937] mt-0.5">{currentTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 grid gap-3.5">
          {configs[type].map(([key, label]) => (
            <label key={key} className="block text-xs font-semibold text-[#1F2937]">
              {label}
              <input
                type="number"
                min="0"
                value={values[key]}
                onChange={(e) => set(key, e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-[#F8FAF6] focus:bg-white px-3 py-2 text-sm text-[#1F2937] outline-none focus:border-[#15803D]"
              />
            </label>
          ))}
        </div>

        <div className="mt-5 rounded-lg bg-[#DCFCE7] p-4 text-center border border-emerald-200">
          <p className="text-xs font-semibold text-[#14532D]">{labels[type]}</p>
          <p className="text-2xl font-black text-[#15803D] mt-1">{result}</p>
        </div>

        <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <button
            onClick={() =>
              setValues({
                area: 1,
                seedRate: 20,
                plants: 100,
                waterPerPlant: 5,
                yield: 10,
                price: 20,
                cost: 50000,
                n: 40,
                p: 20,
                k: 20,
                fertilizerN: 46,
              })
            }
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#15803D] text-white font-medium hover:bg-[#14532D]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToolsPage;
