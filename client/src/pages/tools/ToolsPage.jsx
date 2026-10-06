import React, { useMemo, useState } from 'react';
import { Calculator, Droplets, IndianRupee, RotateCcw, Sprout, Wheat, X } from 'lucide-react';

const tools = [
  { id: 'fertilizer', title: 'NPK Fertilizer Calculator', desc: 'Estimate fertilizer quantities from plot size and crop nutrient targets.', icon: Sprout },
  { id: 'seed', title: 'Seed Quantity Estimator', desc: 'Estimate the seed requirement from area and crop seed rate.', icon: Wheat },
  { id: 'water', title: 'Irrigation Water Estimator', desc: 'Estimate daily water requirement from plant count and per-plant need.', icon: Droplets },
  { id: 'profit', title: 'Farm Profit Estimator', desc: 'Compare expected revenue with cultivation costs.', icon: IndianRupee },
];

const ToolCard = ({ tool, onOpen }) => { const Icon = tool.icon; return <button onClick={() => onOpen(tool.id)} className="website-card group p-6 text-left transition hover:-translate-y-1 hover:border-agri-200 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-agri-50 text-agri-700"><Icon className="h-6 w-6" /></div><h3 className="mt-6 text-lg font-black text-slate-950">{tool.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{tool.desc}</p><span className="mt-5 inline-block text-sm font-black text-agri-600">Open calculator →</span></button>; };

const ToolsPage = () => {
  const [active, setActive] = useState(null);
  return <div className="pb-20">
    <section className="bg-agri-800 text-white"><div className="website-section py-16 sm:py-20"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-agri-100"><Calculator className="h-4 w-4" /> Smart tools</span><h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Simple calculators for everyday farm decisions.</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-agri-100 sm:text-base">Quick estimates for seed, fertilizer, irrigation and farm profitability. Enter your numbers and get an instant planning estimate.</p></div></section>
    <section className="website-section py-14 sm:py-16"><div className="grid gap-5 md:grid-cols-2">{tools.map(tool => <ToolCard key={tool.id} tool={tool} onOpen={setActive} />)}</div></section>
    <section className="bg-white border-y border-slate-200/70"><div className="website-section py-14"><div className="max-w-2xl"><p className="text-xs font-black uppercase tracking-[0.18em] text-agri-600">Important</p><h2 className="mt-2 text-3xl font-black text-slate-950">Use estimates as a planning guide</h2><p className="mt-3 text-sm leading-7 text-slate-500">Actual recommendations can change with crop variety, soil test results, local weather, irrigation method and agronomist advice.</p></div></div></section>
    {active && <CalculatorModal type={active} onClose={() => setActive(null)} />}
  </div>;
};

function CalculatorModal({ type, onClose }) {
  const [values, setValues] = useState({ area: 1, seedRate: 20, plants: 100, waterPerPlant: 5, yield: 10, price: 20, cost: 50000, n: 40, p: 20, k: 20, fertilizerN: 46 });
  const set = (key, value) => setValues(v => ({ ...v, [key]: value }));
  const result = useMemo(() => {
    if (type === 'seed') return `${(Number(values.area) * Number(values.seedRate)).toFixed(1)} kg`;
    if (type === 'water') return `${(Number(values.plants) * Number(values.waterPerPlant)).toLocaleString()} L/day`;
    if (type === 'profit') { const revenue = Number(values.yield) * Number(values.price) * Number(values.area); return `₹${(revenue - Number(values.cost)).toLocaleString()}`; }
    return `${((Number(values.area) * Number(values.n)) / Number(values.fertilizerN)).toFixed(1)} kg urea-equivalent`;
  }, [type, values]);
  const configs = { fertilizer: [['area','Area (acres)'],['n','Nitrogen target (kg/acre)'],['fertilizerN','Nitrogen in fertilizer (%)']], seed: [['area','Area (acres)'],['seedRate','Seed rate (kg/acre)']], water: [['plants','Number of plants'],['waterPerPlant','Water per plant (L/day)']], profit: [['area','Area (acres)'],['yield','Expected yield (units/acre)'],['price','Expected price (₹/unit)'],['cost','Total cost (₹)']] };
  const labels = { fertilizer:'Estimated fertilizer requirement', seed:'Estimated seed requirement', water:'Estimated daily water requirement', profit:'Estimated profit / loss' };
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-5" onClick={onClose}><div className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl" onClick={e => e.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-agri-600">Calculator</p><h2 className="mt-2 text-2xl font-black text-slate-950">{tools.find(t=>t.id===type)?.title}</h2></div><button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{configs[type].map(([key,label]) => <label key={key} className="text-sm font-bold text-slate-700">{label}<input type="number" min="0" value={values[key]} onChange={e => set(key,e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-agri-400 focus:ring-4 focus:ring-agri-100" /></label>)}</div><div className="mt-6 rounded-2xl bg-agri-50 p-5"><p className="text-xs font-black uppercase tracking-wider text-agri-700">{labels[type]}</p><p className="mt-2 text-3xl font-black text-agri-800">{result}</p></div><button onClick={() => setValues({ area: 1, seedRate: 20, plants: 100, waterPerPlant: 5, yield: 10, price: 20, cost: 50000, n: 40, p: 20, k: 20, fertilizerN: 46 })} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800"><RotateCcw className="h-4 w-4" /> Reset values</button></div></div>;
}

export default ToolsPage;
