import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const sampleMarketData = [
  { name: 'Tomato', price: '₹25/kg', change: '+12%', isPositive: true, dot: 'bg-red-500' },
  { name: 'Onion', price: '₹18/kg', change: '-5%', isPositive: false, dot: 'bg-purple-600' },
  { name: 'Maize', price: '₹22/kg', change: '+8%', isPositive: true, dot: 'bg-amber-500' },
  { name: 'Rice', price: '₹28/kg', change: '+3%', isPositive: true, dot: 'bg-amber-700' },
];

const MarketPricesPanel = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_25px_rgba(15,23,42,0.04)]">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-agri-600">Nearby markets</p>
        <h3 className="mt-1 text-lg font-black text-slate-950">Market Prices</h3>
      </div>
      <NavLink to="/market-prices" className="inline-flex items-center gap-1 text-xs font-extrabold text-agri-600">
        View all <ArrowRight className="h-3.5 w-3.5" />
      </NavLink>
    </div>

    <div className="mt-6 divide-y divide-slate-100">
      {sampleMarketData.map((item) => (
        <div key={item.name} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
          <div className="flex items-center gap-3">
            <span className={`h-3 w-3 rounded-full ${item.dot}`} />
            <span className="text-sm font-bold text-slate-800">{item.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-slate-950">{item.price}</span>
            <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-extrabold ${item.isPositive ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
              {item.isPositive ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : <ArrowDownRight className="mr-0.5 h-3 w-3" />}
              {item.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default MarketPricesPanel;
