import React, { useState, useMemo } from 'react';
import {
  Sprout,
  Search,
  Filter,
  Droplets,
  Calendar,
  Layers,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap.jsx';

const cropsData = [
  {
    id: 'maize',
    name: 'Maize (Corn)',
    variety: 'Hybrid 900M / CP-818',
    season: 'Kharif / Rabi',
    soil: 'Loamy & Black Soil',
    water: 'Medium (450–600 mm)',
    duration: '90–110 days',
    icon: '🌽',
    suitableForBelagavi: true,
    suitabilityReason: 'Well adapted to Belagavi climate. High yield on well-drained loamy soils during Rabi and Kharif.',
    cultivation: {
      sowing: 'June–July (Kharif) or Oct–Nov (Rabi). Seed rate: 8–10 kg/acre with 60cm x 20cm spacing.',
      fertilizer: 'NPK 60:30:20 kg/acre. Apply full P and K at sowing with 1/3rd N; top dress remaining N in 2 splits.',
      irrigation: 'Critical stages: Knee-high, tasseling, silking, and grain filling. Avoid water stagnation.',
      pests: 'Watch for Fall Armyworm (FAW) on young shoots. Apply neem-based spray or Emamectin Benzoate.',
      harvest: 'Harvest when husks turn dry paper-white and grain moisture is around 20%.',
    },
  },
  {
    id: 'tomato',
    name: 'Tomato',
    variety: 'S-22 / Shivam Hybrid',
    season: 'Kharif / Rabi',
    soil: 'Loamy & Sandy Loam',
    water: 'Medium (600–800 mm)',
    duration: '110–130 days',
    icon: '🍅',
    suitableForBelagavi: true,
    suitabilityReason: 'Very high demand in Belagavi APMC. Thrives in moderate temperatures with drip irrigation.',
    cultivation: {
      sowing: 'Raise nursery seedlings for 25–30 days. Transplant on raised beds at 75cm x 45cm spacing.',
      fertilizer: 'NPK 75:50:50 kg/acre. Incorporate 10 tonnes well-rotted FYM during land preparation.',
      irrigation: 'Drip irrigation recommended every 2–3 days. Avoid flood irrigation to prevent root rot.',
      pests: 'Scout regularly for Early Blight and Leaf Curl virus. Maintain staking for better air circulation.',
      harvest: 'Pick at breaker or pink stage for long-distance transport (Goa/Maharashtra markets).',
    },
  },
  {
    id: 'groundnut',
    name: 'Groundnut (Peanut)',
    variety: 'TMV-2 / JL-24',
    season: 'Kharif / Summer',
    soil: 'Sandy Loam & Red Soil',
    water: 'Medium (400–500 mm)',
    duration: '100–120 days',
    icon: '🥜',
    suitableForBelagavi: true,
    suitabilityReason: 'Ideal for red and sandy loam soils in Bailhongal and Gokak taluks. Enriches soil with nitrogen.',
    cultivation: {
      sowing: 'Sow with onset of monsoon (June–July). Seed rate: 45–50 kg kernels/acre.',
      fertilizer: 'NPK 10:20:10 kg/acre + 200 kg Gypsum/acre at pegging stage to ensure well-filled pods.',
      irrigation: 'Sensitive to moisture stress at flowering and peg development. Ensure moist loose soil.',
      pests: 'Treat seed with Trichoderma. Monitor for Tikka leaf spot and collar rot.',
      harvest: 'Harvest when inside of shell turns dark brown and foliage starts yellowing.',
    },
  },
  {
    id: 'rice',
    name: 'Rice (Paddy)',
    variety: 'Sona Masoori / Jaya',
    season: 'Kharif',
    soil: 'Clay Loam & Heavy Soils',
    water: 'High (1000–1400 mm)',
    duration: '120–140 days',
    icon: '🌾',
    suitableForBelagavi: true,
    suitabilityReason: 'Traditional staple in Khanapur and southern Belagavi belts with assured rainfall or canal water.',
    cultivation: {
      sowing: 'Nursery sowing in June. Transplant 21–25 day old seedlings at 20cm x 15cm spacing.',
      fertilizer: 'NPK 40:20:20 kg/acre. Apply Zinc Sulphate 10 kg/acre in deficient soils.',
      irrigation: 'Maintain shallow water level (2–5 cm) from tillering to grain development stage.',
      pests: 'Monitor for Stem Borer and Brown Plant Hopper. Drain water occasionally to discourage pests.',
      harvest: 'Harvest when 80% grains in the panicle turn golden yellow.',
    },
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    variety: 'Co-86032 / Co-0238',
    season: 'Year-round (Eksali / Adsali)',
    soil: 'Deep Black & Clay Loam',
    water: 'High (1500–2200 mm)',
    duration: '11–14 months',
    icon: '🎋',
    suitableForBelagavi: true,
    suitabilityReason: 'Major commercial crop in Belagavi district with proximity to leading sugar factories.',
    cultivation: {
      sowing: 'Plant 2-bud setts treated with Carbendazim. Furrow spacing: 4 to 5 feet.',
      fertilizer: 'NPK 100:40:50 kg/acre in 4 splits. Earthing up at 90 days after planting.',
      irrigation: 'Sub-surface drip saves 40% water and increases tonnage significantly.',
      pests: 'Watch for Early Shoot Borer and Whitefly. Release Trichogramma parasitoids.',
      harvest: 'Harvest at peak sucrose maturity (Brix > 19%) based on sugar mill crushing schedule.',
    },
  },
  {
    id: 'cotton',
    name: 'Cotton',
    variety: 'Bt Cotton Hybrids',
    season: 'Kharif',
    soil: 'Deep Black Cotton Soil',
    water: 'Medium (600–750 mm)',
    duration: '150–175 days',
    icon: '🌿',
    suitableForBelagavi: true,
    suitabilityReason: 'Well established in Bailhongal and Saundatti black soil plains with high lint recovery.',
    cultivation: {
      sowing: 'June to mid-July. Spacing: 90cm x 60cm or 120cm x 45cm depending on plant architecture.',
      fertilizer: 'NPK 40:20:20 kg/acre with micronutrient spray (Magnesium Sulphate + Boron) during boll stage.',
      irrigation: 'Needs adequate moisture during square formation and boll development.',
      pests: 'Install yellow sticky traps for whitefly and pheromone traps for pink bollworm monitoring.',
      harvest: 'Pick clean, dry, fully opened bolls in sunny weather. Store in clean dry godowns.',
    },
  },
  {
    id: 'ragi',
    name: 'Finger Millet (Ragi)',
    variety: 'GPU-28 / MR-1',
    season: 'Kharif',
    soil: 'Red & Loamy Soils',
    water: 'Low–Medium (350–450 mm)',
    duration: '95–115 days',
    icon: '🌱',
    suitableForBelagavi: false,
    suitabilityReason: 'Drought-tolerant millet. Best for red soil uplands where irrigation is limited.',
    cultivation: {
      sowing: 'July–August. Direct drill or transplant nursery seedlings.',
      fertilizer: 'NPK 20:15:10 kg/acre. Organic farmyard manure highly beneficial.',
      irrigation: 'Largely rainfed. 1–2 life-saving irrigations during dry spells.',
      pests: 'Relatively pest-hardy. Watch for blast disease on leaves during humid weather.',
      harvest: 'Harvest earheads when they turn brown and dry in the field.',
    },
  },
  {
    id: 'chilli',
    name: 'Green Chilli',
    variety: 'Byadagi Dabbi / G4 Hybrid',
    season: 'Kharif / Rabi',
    soil: 'Well-drained Loamy Soil',
    water: 'Medium (500–650 mm)',
    duration: '140–170 days',
    icon: '🌶️',
    suitableForBelagavi: true,
    suitabilityReason: 'Karnataka benchmark spice. Byadagi varieties fetch premium export value.',
    cultivation: {
      sowing: 'Transplant 35-day seedlings on raised ridges at 60cm x 45cm.',
      fertilizer: 'NPK 50:25:25 kg/acre + Neem cake 100 kg/acre during bed preparation.',
      irrigation: 'Frequent light irrigations. Avoid water stagnation which triggers damping-off.',
      pests: 'Scout for thrips and mites causing leaf curl. Use blue sticky traps and neem formulations.',
      harvest: 'Pick green chillies at 10-day intervals or allow to turn dark red for drying.',
    },
  },
];

const regionalLocations = [
  { id: 'belagavi', name: 'Belagavi Central', soil: 'Medium Black & Loam', coords: [15.8497, 74.4977] },
  { id: 'gokak', name: 'Gokak Region', soil: 'Sandy Loam & Red Soil', coords: [16.1667, 74.8333] },
  { id: 'chikodi', name: 'Chikodi Belt', soil: 'Clay Loam & River Soil', coords: [16.4333, 74.6000] },
  { id: 'bailhongal', name: 'Bailhongal Plain', soil: 'Deep Black Cotton Soil', coords: [15.8167, 74.8667] },
];

const CropsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('belagavi');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showRegionalMap, setShowRegionalMap] = useState(false);

  const currentRegion =
    regionalLocations.find((r) => r.id === selectedRegion) || regionalLocations[0];

  const filteredCrops = useMemo(() => {
    return cropsData.filter((crop) => {
      const matchesSeason =
        selectedSeason === 'All' || crop.season.includes(selectedSeason);
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        crop.name.toLowerCase().includes(q) ||
        crop.soil.toLowerCase().includes(q) ||
        crop.variety.toLowerCase().includes(q);
      return matchesSeason && matchesQuery;
    });
  }, [selectedSeason, searchQuery]);

  const mapMarkers = regionalLocations.map((loc) => ({
    id: loc.id,
    title: loc.name,
    type: `Soil: ${loc.soil}`,
    position: loc.coords,
    color: '#15803D',
    description: `Recommended crops suited for ${loc.soil} conditions.`,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <Sprout className="w-3.5 h-3.5" />
            <span>Crop Suitability & Agronomy Guides</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Crop Information</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Discover suitable crops, sowing guidelines, fertilizer schedules, and cultivation best practices for North Karnataka.
          </p>
        </div>

        {/* Region Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-[#64748B]">Region:</span>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#1F2937] outline-none focus:border-[#15803D]"
          >
            {regionalLocations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowRegionalMap(!showRegionalMap)}
            className="p-1.5 rounded-lg border border-slate-200 text-[#15803D] hover:bg-[#DCFCE7] text-xs font-semibold"
            title="Toggle Regional Map"
          >
            <MapPin className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Regional Map Collapsible Box */}
      {showRegionalMap && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#1F2937]">Regional Agro-Ecological Zones</h3>
              <p className="text-xs text-[#64748B]">Click any zone to tune soil and crop suitability recommendations.</p>
            </div>
            <button
              onClick={() => setShowRegionalMap(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <LeafletMap
            center={currentRegion.coords}
            zoom={10}
            markers={mapMarkers}
            selectedId={selectedRegion}
            onSelectMarker={(m) => setSelectedRegion(m.id)}
            height="260px"
          />
        </div>
      )}

      {/* Suitability Banner for Selected Region */}
      <div className="bg-[#DCFCE7]/70 rounded-xl border border-emerald-200 p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#15803D] text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#14532D]">
              Recommended for {currentRegion.name} ({currentRegion.soil})
            </h3>
            <p className="text-xs text-[#15803D] mt-0.5">
              Current Season: <span className="font-semibold">Rabi / Kharif Transitions</span>. Maize, Tomato, and Sugarcane have high historical yield in this zone.
            </p>
          </div>
        </div>

        <span className="text-xs text-[#14532D] bg-white px-3 py-1 rounded-md border border-emerald-300 font-semibold self-start sm:self-auto">
          Zone: Northern Dry / Transition
        </span>
      </div>

      {/* Search & Season Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crop name, variety, or soil type..."
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

        {/* Season Filter Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {['All', 'Kharif', 'Rabi', 'Summer'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSeason(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedSeason === s
                  ? 'bg-[#15803D] text-white'
                  : 'bg-[#F8FAF6] text-[#64748B] hover:text-[#1F2937] border border-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Crops Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCrops.map((crop) => (
          <div
            key={crop.id}
            onClick={() => setSelectedCrop(crop)}
            className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-[#15803D] cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="text-3xl">{crop.icon}</span>
                <span className="text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                  {crop.season}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#15803D] transition-colors mt-3">
                {crop.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">{crop.variety}</p>

              <div className="mt-3 space-y-1 text-xs text-[#64748B]">
                <div className="flex justify-between">
                  <span>Soil:</span>
                  <span className="font-semibold text-[#1F2937]">{crop.soil}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-semibold text-[#1F2937]">{crop.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Water Need:</span>
                  <span className="font-semibold text-[#1F2937]">{crop.water}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#15803D]">
              <span>View Cultivation Guide</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-[#64748B]">
          <Sprout className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#1F2937]">No crops match your search or filter</p>
          <p className="text-xs text-slate-400 mt-1">Try selecting &quot;All&quot; seasons or resetting your search query.</p>
        </div>
      )}

      {/* Comprehensive Cultivation Guide Modal */}
      {selectedCrop && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedCrop(null)}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-slate-200 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedCrop.icon}</span>
                <div>
                  <h2 className="text-lg font-bold text-[#1F2937]">{selectedCrop.name} Guide</h2>
                  <p className="text-xs text-[#64748B]">
                    Variety: {selectedCrop.variety} • Season: {selectedCrop.season}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Suitability Note */}
            <div className="mt-4 p-3 rounded-lg bg-[#DCFCE7] text-xs text-[#14532D] leading-relaxed">
              <span className="font-bold">Regional Suitability: </span>
              {selectedCrop.suitabilityReason}
            </div>

            {/* Agronomic Details */}
            <div className="mt-4 space-y-3.5 text-xs">
              <div className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-200">
                <span className="font-bold text-[#14532D] block mb-1">🌱 Land Preparation & Sowing</span>
                <p className="text-[#1F2937] leading-relaxed">{selectedCrop.cultivation.sowing}</p>
              </div>

              <div className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-200">
                <span className="font-bold text-[#14532D] block mb-1">🧪 Fertilizer & Nutrient Schedule</span>
                <p className="text-[#1F2937] leading-relaxed">{selectedCrop.cultivation.fertilizer}</p>
              </div>

              <div className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-200">
                <span className="font-bold text-[#14532D] block mb-1">💧 Irrigation Guidelines</span>
                <p className="text-[#1F2937] leading-relaxed">{selectedCrop.cultivation.irrigation}</p>
              </div>

              <div className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-200">
                <span className="font-bold text-[#14532D] block mb-1">🛡️ Pest & Disease Management</span>
                <p className="text-[#1F2937] leading-relaxed">{selectedCrop.cultivation.pests}</p>
              </div>

              <div className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-200">
                <span className="font-bold text-[#14532D] block mb-1">🌾 Harvesting & Post-Harvest</span>
                <p className="text-[#1F2937] leading-relaxed">{selectedCrop.cultivation.harvest}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedCrop(null)}
                className="px-4 py-1.5 rounded-lg bg-[#15803D] text-white text-xs font-semibold hover:bg-[#14532D]"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropsPage;
