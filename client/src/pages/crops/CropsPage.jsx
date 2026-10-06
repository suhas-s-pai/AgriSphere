import React, { useMemo, useState } from 'react';
import { CalendarDays, Droplets, Filter, Leaf, Search, Sun, Sprout, X } from 'lucide-react';

const crops = [
  { name: 'Rice', season: 'Kharif', soil: 'Clay / Loamy', water: 'High', duration: '110–150 days', icon: '🌾', tip: 'Maintain standing water during key growth stages and avoid prolonged water stress.' },
  { name: 'Ragi', season: 'Kharif', soil: 'Red / Loamy', water: 'Medium', duration: '95–120 days', icon: '🌱', tip: 'Well-drained soil and timely weeding help maintain good plant growth.' },
  { name: 'Maize', season: 'Kharif / Rabi', soil: 'Loamy', water: 'Medium', duration: '90–120 days', icon: '🌽', tip: 'Use good-quality seed and maintain moisture around flowering and grain filling.' },
  { name: 'Tomato', season: 'Kharif / Rabi', soil: 'Loamy', water: 'Medium', duration: '90–140 days', icon: '🍅', tip: 'Use raised beds where drainage is poor and monitor plants regularly for pests.' },
  { name: 'Cotton', season: 'Kharif', soil: 'Black / Loamy', water: 'Medium', duration: '150–180 days', icon: '🌿', tip: 'Keep the field weed-free early and monitor for bollworm and sucking pests.' },
  { name: 'Groundnut', season: 'Kharif / Summer', soil: 'Sandy loam', water: 'Medium', duration: '100–130 days', icon: '🥜', tip: 'Loose, well-drained soil supports peg penetration and pod development.' },
  { name: 'Sugarcane', season: 'Year-round', soil: 'Loamy / Clay', water: 'High', duration: '10–18 months', icon: '🎋', tip: 'Plan irrigation and nutrient application according to crop stage.' },
  { name: 'Chilli', season: 'Kharif / Rabi', soil: 'Loamy', water: 'Medium', duration: '150–180 days', icon: '🌶️', tip: 'Avoid waterlogging and scout regularly for thrips, mites and fungal problems.' },
];

const CropsPage = () => {
  const [query, setQuery] = useState('');
  const [season, setSeason] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => crops.filter((crop) => {
    const matchesQuery = crop.name.toLowerCase().includes(query.toLowerCase()) || crop.soil.toLowerCase().includes(query.toLowerCase());
    const matchesSeason = season === 'All' || crop.season.includes(season);
    return matchesQuery && matchesSeason;
  }), [query, season]);

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden bg-agri-800 text-white">
        <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-agri-500/20 blur-3xl" />
        <div className="website-section relative py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-agri-100"><Sprout className="h-4 w-4" /> Crop library</span>
            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Choose the right crop for the right conditions.</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-agri-100 sm:text-base">Explore crop seasons, soil preferences, water needs and practical cultivation tips in one simple place.</p>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[['8+', 'Crop guides'], ['4', 'Key seasons'], ['3', 'Water levels']].map(([value, label]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur"><p className="text-2xl font-black">{value}</p><p className="mt-1 text-xs font-semibold text-agri-100">{label}</p></div>)}
          </div>
        </div>
      </section>

      <section className="website-section -mt-8 relative z-10">
        <div className="website-card p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_210px_auto]">
            <label className="relative block"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a crop or soil type..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium outline-none focus:border-agri-400 focus:bg-white focus:ring-4 focus:ring-agri-100" /></label>
            <select value={season} onChange={(e) => setSeason(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-agri-400"><option>All</option><option>Kharif</option><option>Rabi</option><option>Summer</option></select>
            <button type="button" onClick={() => { setQuery(''); setSeason('All'); }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"><X className="h-4 w-4" /> Reset</button>
          </div>
        </div>
      </section>

      <section className="website-section py-14 sm:py-16">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-agri-600">Crop guides</p><h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Find a crop</h2></div><span className="hidden items-center gap-2 text-sm font-bold text-slate-400 sm:flex"><Filter className="h-4 w-4" /> {filtered.length} results</span></div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((crop) => <button key={crop.name} type="button" onClick={() => setSelected(crop)} className="group text-left website-card p-6 transition hover:-translate-y-1 hover:border-agri-200 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
            <div className="flex items-start justify-between"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-agri-50 text-3xl">{crop.icon}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500">{crop.season}</span></div>
            <h3 className="mt-6 text-lg font-black text-slate-950">{crop.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{crop.soil} soil · {crop.duration}</p>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold"><span className="flex items-center gap-1.5 text-slate-500"><Droplets className="h-4 w-4 text-sky-500" /> {crop.water} water</span><span className="text-agri-600 group-hover:underline">View guide →</span></div>
          </button>)}
        </div>
        {!filtered.length && <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-12 text-center"><Leaf className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 font-bold text-slate-600">No crops match your search.</p></div>}
      </section>

      <section className="bg-white border-y border-slate-200/70"><div className="website-section py-14"><div className="grid gap-5 md:grid-cols-3"><div className="rounded-2xl bg-agri-50 p-6"><Sun className="h-6 w-6 text-agri-600" /><h3 className="mt-4 font-black text-slate-900">Season first</h3><p className="mt-2 text-sm leading-6 text-slate-500">Check the crop season before choosing seed or planning field preparation.</p></div><div className="rounded-2xl bg-amber-50 p-6"><Droplets className="h-6 w-6 text-amber-600" /><h3 className="mt-4 font-black text-slate-900">Match water needs</h3><p className="mt-2 text-sm leading-6 text-slate-500">Water availability can make a major difference to crop performance and input costs.</p></div><div className="rounded-2xl bg-sky-50 p-6"><CalendarDays className="h-6 w-6 text-sky-600" /><h3 className="mt-4 font-black text-slate-900">Plan the cycle</h3><p className="mt-2 text-sm leading-6 text-slate-500">Use crop duration to coordinate sowing, irrigation, pest scouting and harvest.</p></div></div></div></section>

      {selected && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-5" onClick={() => setSelected(null)}><div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}><div className="flex items-start justify-between"><div><span className="text-4xl">{selected.icon}</span><h2 className="mt-4 text-2xl font-black text-slate-950">{selected.name}</h2></div><button onClick={() => setSelected(null)} className="rounded-full p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Season</p><p className="mt-1 font-black text-slate-800">{selected.season}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Water</p><p className="mt-1 font-black text-slate-800">{selected.water}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Soil</p><p className="mt-1 font-black text-slate-800">{selected.soil}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Duration</p><p className="mt-1 font-black text-slate-800">{selected.duration}</p></div></div><div className="mt-5 rounded-2xl bg-agri-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-agri-700">Practical tip</p><p className="mt-2 text-sm leading-6 text-agri-900">{selected.tip}</p></div></div></div>}
    </div>
  );
};

export default CropsPage;
