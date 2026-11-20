import React, { useState, useMemo, useEffect } from 'react';
import {
  Layers,
  FlaskConical,
  Sprout,
  CheckCircle2,
  Droplets,
  AlertCircle,
  HelpCircle,
  Search,
  ChevronRight,
  X,
  FileText,
  Save,
  RotateCcw,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext.jsx';
import {
  CROP_NPK_REQUIREMENTS,
  calculateFertilizerDose,
  evaluatePh,
  saveSoilReport,
  loadSoilReport,
} from '../../services/soilService.js';

const nutrientsData = [
  {
    name: 'Nitrogen (N)',
    category: 'Primary Macronutrient',
    role: 'Promotes rapid vegetative growth, lush green foliage, and healthy tillering.',
    deficiency: 'Uniform yellowing (chlorosis) of older lower leaves, stunted plant height, slender stems.',
    sources: 'Urea (46% N), Ammonium Phosphate, Neem Coated Urea, Well-decomposed FYM.',
    timing: 'Split application: 1/3rd at sowing, 1/3rd at peak tillering, 1/3rd before flowering.',
  },
  {
    name: 'Phosphorus (P)',
    category: 'Primary Macronutrient',
    role: 'Stimulates root elongation, early seedling vigor, flowering, and seed development.',
    deficiency: 'Purplish or reddish-bronze discoloration on older leaves, stunted poor root network.',
    sources: 'Single Super Phosphate (SSP 16% P), Di-Ammonium Phosphate (DAP 46% P).',
    timing: 'Full dose applied as basal dressing placed near root zone at sowing or transplanting.',
  },
  {
    name: 'Potassium (K)',
    category: 'Primary Macronutrient',
    role: 'Improves disease resistance, grain weight, fruit sweetness, and drought tolerance.',
    deficiency: 'Marginal leaf scorch, firing of tips, weak lodged stems, poor fruit filling.',
    sources: 'Muriate of Potash (MOP 60% K), Sulphate of Potash (SOP).',
    timing: 'Apply 50% basal and 50% during panicle initiation or fruit enlargement.',
  },
  {
    name: 'Zinc (Zn)',
    category: 'Essential Micronutrient',
    role: 'Crucial for chlorophyll synthesis and auxin hormone production in cereal crops.',
    deficiency: 'White or bleached bands along leaf midribs in maize (white bud) and khaira in rice.',
    sources: 'Zinc Sulphate (ZnSO4 21% or 33% Chelated Zinc).',
    timing: 'Soil application of 10 kg/acre ZnSO4 once in 2 years, or 0.2% foliar spray.',
  },
];

const SoilPage = () => {
  const { city, district, state, formattedName, isGlobal } = useLocationContext();

  // Soil Test Values State
  const [targetCrop, setTargetCrop] = useState('maize');
  const [areaAcres, setAreaAcres] = useState(2.0);
  const [phInput, setPhInput] = useState(7.0);
  const [nInput, setNInput] = useState(260); // kg/ha
  const [pInput, setPInput] = useState(16); // kg/ha
  const [kInput, setKInput] = useState(180); // kg/ha
  const [ocInput, setOcInput] = useState(0.55); // %
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load previously saved soil report if available
  useEffect(() => {
    const existing = loadSoilReport();
    if (existing) {
      if (existing.ph) setPhInput(existing.ph);
      if (existing.n) setNInput(existing.n);
      if (existing.p) setPInput(existing.p);
      if (existing.k) setKInput(existing.k);
      if (existing.oc) setOcInput(existing.oc);
      if (existing.cropKey) setTargetCrop(existing.cropKey);
      if (existing.areaAcres) setAreaAcres(existing.areaAcres);
    }
  }, []);

  // Crop- and soil-test-responsive nutrient estimate
  const calculation = useMemo(() => {
    return calculateFertilizerDose({
      cropKey: targetCrop,
      nVal: Number.isFinite(Number(nInput)) ? Number(nInput) : 280,
      pVal: Number.isFinite(Number(pInput)) ? Number(pInput) : 15,
      kVal: Number.isFinite(Number(kInput)) ? Number(kInput) : 150,
      phVal: Number.isFinite(Number(phInput)) ? Number(phInput) : 7.0,
      areaAcres: Number(areaAcres) || 1,
    });
  }, [targetCrop, nInput, pInput, kInput, phInput, areaAcres]);

  const handleSaveReport = () => {
    const success = saveSoilReport({
      cropKey: targetCrop,
      areaAcres,
      ph: phInput,
      n: nInput,
      p: pInput,
      k: kInput,
      oc: ocInput,
      district: district || city || 'Regional',
    });
    if (success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const filteredNutrients = nutrientsData.filter(
    (n) =>
      !searchQuery ||
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.deficiency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const regionLabel = isGlobal ? 'Regional' : (district || city || 'Local');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Soil Test & Crop Nutrient Guidance</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Soil & Fertilizers</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Soil-test-based nutrient estimates, crop-specific pH suitability, and soil amendment guidance for {formattedName}.
          </p>
        </div>
      </div>

      {/* Scientific Transparency Notice */}
      <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 text-xs text-blue-900 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Agronomic Transparency Principle: </span>
          Soil chemistry and nutrient levels (N, P, K, pH) cannot be measured accurately via GPS satellites alone. Real agricultural recommendations require your official Soil Health Card or laboratory soil test values entered below.
        </div>
      </div>

      {/* Soil Health Card & STCR Fertilizer Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-[#15803D]" />
              <h2 className="text-base font-bold text-[#1F2937]">Soil Test Values Input</h2>
            </div>
            <span className="text-[11px] text-slate-400">Lab Test Report</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Crop</label>
                <select
                  value={targetCrop}
                  onChange={(e) => setTargetCrop(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#15803D]"
                >
                  {Object.entries(CROP_NPK_REQUIREMENTS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Field Area (Acres)</label>
                <input
                  type="number"
                  min="0.25"
                  max="100"
                  step="0.25"
                  value={areaAcres}
                  onChange={(e) => setAreaAcres(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#15803D]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700">Soil pH: {phInput}</label>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${calculation.phStatus.color}`}>
                  {calculation.phStatus.status}
                </span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.5"
                step="0.1"
                value={phInput}
                onChange={(e) => setPhInput(Number(e.target.value))}
                className="w-full accent-[#15803D] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Acidic (4.5)</span>
                <span className="text-emerald-700 font-bold">Neutral (7.0)</span>
                <span>Alkaline (9.5)</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Avail. N (kg/ha)</label>
                <input
                  type="number"
                  value={nInput}
                  onChange={(e) => setNInput(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-[#15803D]"
                />
                <span className={`text-[9px] font-bold block mt-1 px-1 py-0.5 text-center rounded border ${calculation.ratings.nitrogen.badge}`}>
                  {calculation.ratings.nitrogen.rating} N
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Avail. P (kg/ha)</label>
                <input
                  type="number"
                  value={pInput}
                  onChange={(e) => setPInput(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-[#15803D]"
                />
                <span className={`text-[9px] font-bold block mt-1 px-1 py-0.5 text-center rounded border ${calculation.ratings.phosphorus.badge}`}>
                  {calculation.ratings.phosphorus.rating} P
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Avail. K (kg/ha)</label>
                <input
                  type="number"
                  value={kInput}
                  onChange={(e) => setKInput(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-[#15803D]"
                />
                <span className={`text-[9px] font-bold block mt-1 px-1 py-0.5 text-center rounded border ${calculation.ratings.potassium.badge}`}>
                  {calculation.ratings.potassium.rating} K
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Organic Carbon (OC %)</label>
              <input
                type="number"
                min="0.1"
                max="2.5"
                step="0.05"
                value={ocInput}
                onChange={(e) => setOcInput(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-[#15803D]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handleSaveReport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#15803D] text-white font-semibold text-xs hover:bg-[#14532D] transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Soil Test Record</span>
              </button>
              {savedSuccess && (
                <span className="text-[11px] font-bold text-[#15803D]">Saved to profile!</span>
              )}
            </div>
          </div>
        </div>

        {/* Output: Scientific Fertilizer Dosage */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#14532D]">
                Recommended Fertilizer Dosage ({calculation.cropName})
              </h2>
              <p className="text-[11px] text-[#64748B]">For {calculation.areaAcres} Acre(s) holding</p>
            </div>
            <span className="text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md">
              Indicative estimate
            </span>
          </div>

          {/* Bag count cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#F8FAF6] border border-slate-200 text-center">
              <span className="text-xs text-[#64748B] font-semibold block">Urea (46% N)</span>
              <span className="text-2xl font-extrabold text-[#14532D] my-1 block">
                {calculation.bags.urea45kg}
              </span>
              <span className="text-[10px] text-slate-400">Bags (45 kg each)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAF6] border border-slate-200 text-center">
              <span className="text-xs text-[#64748B] font-semibold block">DAP (18:46:0)</span>
              <span className="text-2xl font-extrabold text-[#14532D] my-1 block">
                {calculation.bags.dap50kg}
              </span>
              <span className="text-[10px] text-slate-400">Bags (50 kg each)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAF6] border border-slate-200 text-center">
              <span className="text-xs text-[#64748B] font-semibold block">MOP Potash (60% K)</span>
              <span className="text-2xl font-extrabold text-[#14532D] my-1 block">
                {calculation.bags.mop50kg}
              </span>
              <span className="text-[10px] text-slate-400">Bags (50 kg each)</span>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-slate-500">
            {calculation.methodNote}
          </p>

          {/* Organic Manure & Critical Growth Stages */}
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950">
              <span className="font-bold block mb-1">🌿 Basal Organic Manure Recommendation:</span>
              <p>Incorporate {calculation.fymTonnes} Tonnes well-rotted Farmyard Manure (FYM) or compost during final land preparation before sowing.</p>
            </div>

            <div className="p-3 rounded-lg bg-[#F8FAF6] border border-slate-200 text-slate-800">
              <span className="font-bold text-[#14532D] block mb-1">⏱️ Split Application & Critical Irrigation Stages:</span>
              <p className="leading-relaxed">{calculation.criticalStages}</p>
            </div>

            <div className={`p-3 rounded-lg border ${calculation.phStatus.color}`}>
              <span className="font-bold block mb-0.5">pH & Crop Suitability ({calculation.phStatus.idealRange} preferred):</span>
              <p>{calculation.phStatus.action}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Soil Types Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#14532D]">
            Major Soil Formations in {regionLabel} Agro-Zone
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Key physical properties, natural drainage, and recommended soil management practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#F8FAF6] rounded-xl border border-slate-200 flex flex-col justify-between text-xs">
            <div>
              <h3 className="text-sm font-bold text-[#1F2937]">Deep Black Cotton Soil (Vertisol)</h3>
              <span className="text-[11px] text-[#15803D] font-medium block mt-0.5">pH Range: 7.5 – 8.5</span>
              <p className="mt-2 text-[#64748B]"><span className="font-semibold text-slate-800">Distribution: </span>Deccan traps, northern river plains, and cotton basins.</p>
              <p className="mt-1 text-[#64748B]"><span className="font-semibold text-slate-800">Suited Crops: </span>Cotton, Sugarcane, Maize, Wheat, Chickpea.</p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/70 text-slate-700">
              <span className="font-semibold text-[#14532D]">Management: </span>High clay content; avoid heavy machinery immediately after irrigation.
            </div>
          </div>

          <div className="p-4 bg-[#F8FAF6] rounded-xl border border-slate-200 flex flex-col justify-between text-xs">
            <div>
              <h3 className="text-sm font-bold text-[#1F2937]">Red Loamy Soil (Alfisol)</h3>
              <span className="text-[11px] text-[#15803D] font-medium block mt-0.5">pH Range: 6.2 – 7.0</span>
              <p className="mt-2 text-[#64748B]"><span className="font-semibold text-slate-800">Distribution: </span>Upland plateaus, transitional belts, and hill slopes.</p>
              <p className="mt-1 text-[#64748B]"><span className="font-semibold text-slate-800">Suited Crops: </span>Groundnut, Millets, Vegetables, Tomato, Chilli.</p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/70 text-slate-700">
              <span className="font-semibold text-[#14532D]">Management: </span>Porous with high drainage; apply FYM and split nitrogen fertilizer.
            </div>
          </div>

          <div className="p-4 bg-[#F8FAF6] rounded-xl border border-slate-200 flex flex-col justify-between text-xs">
            <div>
              <h3 className="text-sm font-bold text-[#1F2937]">Alluvial River Plain Soil (Inceptisol)</h3>
              <span className="text-[11px] text-[#15803D] font-medium block mt-0.5">pH Range: 6.8 – 7.6</span>
              <p className="mt-2 text-[#64748B]"><span className="font-semibold text-slate-800">Distribution: </span>River floodplains, valley bottoms, and canal networks.</p>
              <p className="mt-1 text-[#64748B]"><span className="font-semibold text-slate-800">Suited Crops: </span>Paddy (Rice), Sugarcane, Banana, Vegetables.</p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/70 text-slate-700">
              <span className="font-semibold text-[#14532D]">Management: </span>High natural fertility; maintain balanced potassium and organic residues.
            </div>
          </div>
        </div>
      </div>

      {/* Nutrients & Fertilizer Application Guide */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#14532D]">Essential Nutrients & Deficiency Guide</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Recognize deficiency symptoms and apply correct fertilizer sources at the proper growth stage.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Nitrogen, Zinc, Phosphorus..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#15803D]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNutrients.map((n) => (
            <div
              key={n.name}
              className="p-5 bg-white rounded-xl border border-slate-200 hover:border-[#15803D] transition-colors"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#1F2937]">{n.name}</h3>
                <span className="text-[10px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                  {n.category}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-[#1F2937]">Biological Function: </span>
                  <span className="text-[#64748B]">{n.role}</span>
                </div>

                <div className="p-2.5 bg-rose-50/60 rounded-lg border border-rose-100 text-rose-900">
                  <span className="font-bold block mb-0.5">Deficiency Sign:</span>
                  <span>{n.deficiency}</span>
                </div>

                <div>
                  <span className="font-semibold text-[#14532D]">Common Sources: </span>
                  <span className="text-[#1F2937]">{n.sources}</span>
                </div>

                <div>
                  <span className="font-semibold text-[#14532D]">Application Timing: </span>
                  <span className="text-[#64748B]">{n.timing}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SoilPage;
