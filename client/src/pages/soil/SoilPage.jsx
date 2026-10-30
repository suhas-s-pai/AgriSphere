import React, { useState } from 'react';
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
} from 'lucide-react';

const soilTypes = [
  {
    id: 'black-soil',
    name: 'Deep Black Cotton Soil (Vertisol)',
    texture: 'Clayey, high moisture retentive',
    distribution: 'Bailhongal, Saundatti, and northern Belagavi',
    phRange: '7.5 – 8.5 (Slightly alkaline)',
    favorableCrops: 'Cotton, Sugarcane, Maize, Wheat, Chickpea',
    management: 'Rich in calcium and magnesium. Poor drainage when wet; avoid heavy tillage immediately after rain.',
  },
  {
    id: 'red-loam',
    name: 'Red Loamy Soil (Alfisols)',
    texture: 'Medium textured, well drained, porous',
    distribution: 'Gokak, parts of Chikodi and Belagavi rural',
    phRange: '6.2 – 7.0 (Slightly acidic to neutral)',
    favorableCrops: 'Groundnut, Millets, Vegetables, Horticultural fruits',
    management: 'Moderate nutrient holding capacity. Requires regular addition of farmyard manure (FYM) and balanced NPK.',
  },
  {
    id: 'alluvial',
    name: 'Alluvial River Basin Soil',
    texture: 'Loamy to silty, fertile and deep',
    distribution: 'Ghataprabha and Malaprabha river plains',
    phRange: '6.8 – 7.6 (Optimal neutral)',
    favorableCrops: 'Sugarcane, Banana, Tomato, Paddy, Vegetables',
    management: 'High native fertility. Practice crop rotation and monitor soil organic carbon levels.',
  },
];

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
  const [phInput, setPhInput] = useState('7.0');
  const [searchQuery, setSearchQuery] = useState('');

  const phValue = parseFloat(phInput) || 7.0;

  const getPhStatus = (val) => {
    if (val < 6.0) {
      return {
        label: 'Strongly Acidic (pH < 6.0)',
        status: 'warning',
        color: 'text-amber-800 bg-amber-50 border-amber-200',
        advice: 'Phosphorus and calcium availability is restricted. Apply agricultural lime (200–300 kg/acre) based on soil test to raise pH toward neutral.',
      };
    } else if (val >= 6.0 && val <= 7.5) {
      return {
        label: 'Optimal Soil pH Range (6.0 – 7.5)',
        status: 'ideal',
        color: 'text-[#14532D] bg-[#DCFCE7] border-emerald-300',
        advice: 'Excellent condition for nutrient uptake. Most primary macronutrients (N, P, K) and soil microbes function at maximum efficiency.',
      };
    } else {
      return {
        label: 'Alkaline Soil (pH > 7.5)',
        status: 'warning',
        color: 'text-rose-800 bg-rose-50 border-rose-200',
        advice: 'Micronutrient deficiencies (Zinc, Iron) are common. Incorporate agricultural gypsum, green manure (sunn hemp), and acidic organic compost.',
      };
    }
  };

  const phStatus = getPhStatus(phValue);

  const filteredNutrients = nutrientsData.filter(
    (n) =>
      !searchQuery ||
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.deficiency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Soil Health & Fertilizer Guidance</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Soil & Fertilizers</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Understand soil pH, nutrient balance, organic amendments, and recommended fertilizer application timings.
          </p>
        </div>
      </div>

      {/* Soil pH Checker & Organic Carbon Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* pH Checker */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-[#15803D]" />
                <h2 className="text-base font-bold text-[#1F2937]">
                  Soil pH Advisory Calculator
                </h2>
              </div>
              <span className="text-xs text-[#64748B]">Scale: 0 to 14</span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="text-xs font-semibold text-[#1F2937] block">
                Enter Soil Test pH Value:
                <input
                  type="number"
                  min="3.0"
                  max="11.0"
                  step="0.1"
                  value={phInput}
                  onChange={(e) => setPhInput(e.target.value)}
                  className="mt-1 w-32 rounded-lg border border-slate-200 bg-[#F8FAF6] px-3 py-2 text-lg font-bold text-[#1F2937] outline-none focus:border-[#15803D]"
                />
              </label>

              <div className="flex-1">
                <input
                  type="range"
                  min="4.5"
                  max="9.5"
                  step="0.1"
                  value={phValue}
                  onChange={(e) => setPhInput(e.target.value)}
                  className="w-full accent-[#15803D] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Acidic (4.5)</span>
                  <span className="font-bold text-[#15803D]">Neutral (7.0)</span>
                  <span>Alkaline (9.5)</span>
                </div>
              </div>
            </div>

            <div className={`mt-5 p-4 rounded-xl border ${phStatus.color}`}>
              <span className="text-xs font-bold block mb-1">{phStatus.label}</span>
              <p className="text-xs leading-relaxed">{phStatus.advice}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
            <span>Optimal range for Belagavi crops: 6.5 – 7.5</span>
            <span className="text-[#15803D] font-medium">UAS Dharwad Standard</span>
          </div>
        </div>

        {/* Organic Matter & Soil Care */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sprout className="w-5 h-5 text-[#15803D]" />
              <h2 className="text-base font-bold text-[#1F2937]">
                Organic Carbon & Soil Biology
              </h2>
            </div>

            <p className="text-xs text-[#64748B] mt-4 leading-relaxed">
              Target soil organic carbon is <span className="font-semibold text-[#1F2937]">&gt; 0.75%</span>. Most cultivated soils in North Karnataka range between 0.35% and 0.55%, causing lower fertilizer efficiency.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-start gap-2 p-2.5 bg-[#F8FAF6] rounded-lg border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>Incorporate 8–10 tonnes well-decomposed FYM or compost per acre before sowing.</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 bg-[#F8FAF6] rounded-lg border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                <span>Practice green manuring with Sunnhemp or Dhaincha and incorporate at 45 days.</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-[#64748B]">
            Regular compost addition increases water retention by up to 25%.
          </div>
        </div>
      </div>

      {/* Regional Soil Types Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#14532D]">
            Major Soil Formations in Belagavi District
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Key physical properties, natural drainage, and recommended management practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {soilTypes.map((st) => (
            <div
              key={st.id}
              className="p-4 bg-[#F8FAF6] rounded-xl border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-sm font-bold text-[#1F2937]">{st.name}</h3>
                <span className="text-[11px] text-[#15803D] font-medium block mt-0.5">
                  pH Range: {st.phRange}
                </span>

                <div className="mt-3 space-y-1.5 text-xs text-[#64748B]">
                  <p>
                    <span className="font-semibold text-[#1F2937]">Where found: </span>
                    {st.distribution}
                  </p>
                  <p>
                    <span className="font-semibold text-[#1F2937]">Top Crops: </span>
                    {st.favorableCrops}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/70 text-xs text-[#1F2937]">
                <span className="font-semibold text-[#14532D]">Management: </span>
                {st.management}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrients & Fertilizer Application Guide */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#14532D]">
              Essential Nutrients & Deficiency Guide
            </h2>
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
