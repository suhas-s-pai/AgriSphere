import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  Tag,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';

const articles = [
  {
    id: 'art-1',
    title: 'Precision Drip Fertigation for Maize and Sugarcane',
    category: 'Water & Irrigation',
    readTime: '4 min read',
    source: 'UAS Dharwad Department of Agronomy',
    summary: 'How combining water-soluble fertilizers with drip irrigation saves 35% nitrogen and increases crop yield.',
    content: `
      Drip fertigation delivers dissolved mineral nutrients directly to the active root zone through irrigation drippers.
      
      Key Agronomic Principles:
      1. Use fully water-soluble fertilizers (e.g. 19:19:19, Potassium Nitrate 13:0:45, Urea) to prevent dripper clogging.
      2. Inject fertilizer during the middle third of the irrigation cycle to prevent nutrient leaching beyond the root zone.
      3. For Sugarcane, split the annual recommended N and K into weekly fertigation doses up to 180 days after planting.
      4. Always flush drip laterals with clean water for 15 minutes after each fertigation run to prevent salt crystallization.
    `,
  },
  {
    id: 'art-2',
    title: 'Step-by-Step Preparation of Jeevamrutha and Bio-Inputs',
    category: 'Organic Farming',
    readTime: '5 min read',
    source: 'Karnataka Natural Farming Mission',
    summary: 'A complete practical guide to fermenting microbial-rich Jeevamrutha for soil revitalization.',
    content: `
      Jeevamrutha is an organic microbial culture that multiplies beneficial soil bacteria and mycorrhizal fungi.

      Ingredients for 200 Liters (1 Acre):
      - 10 kg fresh indigenous cow dung
      - 10 liters indigenous cow urine
      - 2 kg organic jaggery
      - 2 kg pulse flour (besan/gram flour)
      - Handful of virgin soil from field bunds

      Preparation Method:
      Mix all ingredients in a 200L plastic drum with 180L clean water. Stir clockwise twice daily for 48 to 72 hours. Apply through irrigation water or as a 10% foliar spray every 21 days.
    `,
  },
  {
    id: 'art-3',
    title: 'Post-Harvest Grain Drying and Moisture Management',
    category: 'Post-Harvest & Storage',
    readTime: '3 min read',
    source: 'Central Warehousing Corporation Guide',
    summary: 'Preventing mold, mycotoxins, and storage weevils by ensuring proper moisture thresholds.',
    content: `
      Safe storage begins immediately after threshing. Moisture levels must be reduced before bagging:
      
      Safe Moisture Standards:
      - Maize: 13.0% – 13.5%
      - Paddy (Rice): 13.0% – 14.0%
      - Groundnut pods: 8.0% – 9.0%

      Field Tips:
      Sun-dry grains on clean tarpaulins rather than bare ground. Turn layers every 2 hours during peak sunlight. Ensure gunny bags are elevated on wooden pallets 15cm above floor level and 30cm away from walls.
    `,
  },
  {
    id: 'art-4',
    title: 'Integrated Management of Tomato Early Blight',
    category: 'Pest Management',
    readTime: '4 min read',
    source: 'KVK Belagavi Horticultural Bulletin',
    summary: 'Balancing cultural hygiene, resistant varieties, and preventive bio-fungicide sprays.',
    content: `
      Early Blight (Alternaria solani) thrives during warm, humid weather with frequent morning dew.
      
      Integrated Strategy:
      1. Crop Rotation: Rotate solanaceous crops with non-host cereals (Maize or Sorghum) for at least 2 seasons.
      2. Staking & Trellising: Lift foliage off the ground to prevent splash-borne fungal spores.
      3. Preventive Spray: Apply Trichoderma harzianum or Neem oil 5ml/L at 15-day intervals before symptoms appear.
      4. Targeted Remediation: On first notice of concentric brown leaf spots, spray Mancozeb 75% WP @ 2g/L.
    `,
  },
  {
    id: 'art-5',
    title: 'Intercropping Pulses with Sugarcane for Early Income',
    category: 'Crop Production',
    readTime: '5 min read',
    source: 'Indian Institute of Sugarcane Research',
    summary: 'Maximizing wide-row furrow space during the first 90 days with chickpea, soybean, or French beans.',
    content: `
      Sugarcane is widely spaced (4 to 5 feet) and grows slowly during the first 60–90 days.
      
      Recommended Intercrop Combinations:
      - Sugarcane + French Beans (Harvest in 65 days; brings quick interim cash flow)
      - Sugarcane + Chickpea (Adds biological nitrogen to the soil furrow)

      Benefits:
      Suppresses early weed growth in furrows, enhances microclimate moisture, and yields additional revenue of ₹15,000–₹25,000 per acre without reducing main crop cane yield.
    `,
  },
  {
    id: 'art-6',
    title: 'Understanding Soil Test Reports (EC, pH, and NPK Values)',
    category: 'Crop Production',
    readTime: '4 min read',
    source: 'National Soil Health Mission',
    summary: 'How to read your Soil Health Card numbers and convert them into actual fertilizer bag calculations.',
    content: `
      A soil health report lists primary indices:
      
      - pH: Indicates acidity/alkalinity. Ideal: 6.5 – 7.5.
      - Electrical Conductivity (EC): Measure of soluble salts. < 1.0 dS/m is normal; > 2.0 indicates salinity stress.
      - Organic Carbon (OC): Low: < 0.50%, Medium: 0.50 – 0.75%, High: > 0.75%.
      - Available N, P, K: Expressed in kg/hectare. Always cross-reference with recommended dose of fertilizers (RDF) to avoid over-purchasing expensive chemical inputs.
    `,
  },
];

const categories = [
  'All',
  'Water & Irrigation',
  'Organic Farming',
  'Pest Management',
  'Crop Production',
  'Post-Harvest & Storage',
];

const KnowledgePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesCategory =
        selectedCategory === 'All' || art.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.source.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Farming Knowledge Base & Best Practices</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Knowledge Hub</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Practical agronomy articles, natural farming guides, irrigation techniques, and storage methods verified by agricultural scientists.
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
            placeholder="Search guides on drip irrigation, organic compost, grain storage, soil testing..."
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

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            onClick={() => setActiveArticle(art)}
            className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-[#15803D] cursor-pointer transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                  {art.category}
                </span>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {art.readTime}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#15803D] transition-colors mt-2.5 leading-snug">
                {art.title}
              </h3>

              <p className="text-xs text-[#64748B] mt-2 line-clamp-3 leading-relaxed">
                {art.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-medium truncate max-w-[170px]">
                {art.source}
              </span>
              <span className="font-semibold text-[#15803D] inline-flex items-center gap-1">
                Read Guide
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-[#64748B]">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#1F2937]">No articles match your search</p>
          <p className="text-xs text-slate-400 mt-1">Try selecting &quot;All&quot; categories or searching for a different keyword.</p>
        </div>
      )}

      {/* Article Reader Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-slate-200 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                  {activeArticle.category} • {activeArticle.readTime}
                </span>
                <h2 className="text-lg font-bold text-[#1F2937] mt-1.5">{activeArticle.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Source: {activeArticle.source}</p>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 p-3 bg-[#F8FAF6] rounded-lg border border-slate-100 text-xs text-[#1F2937] font-medium leading-relaxed">
              <span className="font-bold text-[#14532D]">Key Takeaway: </span>
              {activeArticle.summary}
            </div>

            <div className="mt-4 text-xs text-[#1F2937] leading-relaxed whitespace-pre-line space-y-2">
              {activeArticle.content.trim()}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Verified Agronomic Literature</span>
              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-1.5 rounded-lg bg-[#15803D] text-white font-medium hover:bg-[#14532D]"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgePage;
