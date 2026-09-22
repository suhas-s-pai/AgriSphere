import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const sampleMarketData = [
  { name: 'Tomato', price: '₹25/kg', change: '+12%', isPositive: true, color: 'bg-red-500' },
  { name: 'Onion', price: '₹18/kg', change: '-5%', isPositive: false, color: 'bg-purple-600' },
  { name: 'Maize', price: '₹22/kg', change: '+8%', isPositive: true, color: 'bg-amber-500' },
  { name: 'Rice', price: '₹28/kg', change: '+3%', isPositive: true, color: 'bg-amber-700' },
];

const MarketPricesPanel = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-2.5 shadow-2xs space-y-1.5 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[11.5px] font-extrabold text-slate-900">Market Prices (Nearby)</h3>
        <NavLink
          to="/market-prices"
          className="text-[9.5px] font-bold text-agri-600 hover:text-agri-700 flex items-center gap-0.5 transition-colors"
        >
          View All <ArrowRight className="w-2.5 h-2.5" />
        </NavLink>
      </div>

      {/* List */}
      <div className="space-y-1">
        {sampleMarketData.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0 ring-1 ring-slate-100`} />
              <span className="text-[11px] font-semibold text-slate-800">{item.name}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-900">{item.price}</span>
              <span
                className={`inline-flex items-center text-[9px] font-bold px-1 py-0.2 rounded-full ${
                  item.isPositive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                }`}
              >
                {item.isPositive ? (
                  <ArrowUpRight className="w-2 h-2 mr-0.5 stroke-[2.5]" />
                ) : (
                  <ArrowDownRight className="w-2 h-2 mr-0.5 stroke-[2.5]" />
                )}
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketPricesPanel;
