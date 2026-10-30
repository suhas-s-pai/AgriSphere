import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const marketData = [
  { crop: 'Tomato', market: 'Belagavi APMC', price: '₹25 / kg', change: '+12%', isUp: true },
  { crop: 'Onion', market: 'Belagavi APMC', price: '₹18 / kg', change: '-5%', isUp: false },
  { crop: 'Maize', market: 'Belagavi APMC', price: '₹22 / kg', change: '+8%', isUp: true },
  { crop: 'Rice (Paddy)', market: 'Belagavi APMC', price: '₹28 / kg', change: '+3%', isUp: true },
  { crop: 'Cotton', market: 'Belagavi APMC', price: '₹72 / kg', change: '+1.5%', isUp: true },
];

const MarketPricesPanel = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#14532D]">Market Prices</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Belagavi APMC Market Rates</p>
        </div>
        <NavLink
          to="/market-prices"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D] hover:underline"
        >
          View All Prices
          <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>

      {/* Clean Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs font-semibold text-[#64748B] uppercase">
              <th className="py-3 px-4">Crop Name</th>
              <th className="py-3 px-4">Market Name</th>
              <th className="py-3 px-4">Market Price</th>
              <th className="py-3 px-4 text-right">Price Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {marketData.map((item) => (
              <tr key={item.crop} className="hover:bg-[#F8FAF6] transition-colors">
                <td className="py-3.5 px-4 font-semibold text-[#1F2937]">{item.crop}</td>
                <td className="py-3.5 px-4 text-[#64748B] text-xs">{item.market}</td>
                <td className="py-3.5 px-4 font-bold text-[#1F2937]">{item.price}</td>
                <td className="py-3.5 px-4 text-right">
                  <span
                    className={`inline-flex items-center text-xs font-semibold ${
                      item.isUp ? 'text-[#15803D]' : 'text-rose-600'
                    }`}
                  >
                    {item.isUp ? (
                      <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                    )}
                    {item.change}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketPricesPanel;
