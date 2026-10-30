import React from 'react';
import { NavLink } from 'react-router-dom';
import { CloudSun, TrendingUp, Sprout, Bell, ChevronRight } from 'lucide-react';

const cards = [
  {
    title: 'Weather',
    value: '26°C',
    detail: 'Partly Cloudy',
    icon: CloudSun,
    link: '/weather',
  },
  {
    title: 'Market Prices',
    value: '₹25 / kg',
    detail: 'Tomato (Belagavi)',
    icon: TrendingUp,
    link: '/market-prices',
  },
  {
    title: 'My Crops',
    value: '3 Crops',
    detail: 'Registered on farm',
    icon: Sprout,
    link: '/my-farm',
  },
  {
    title: 'Farming Alerts',
    value: '2 Alerts',
    detail: 'Require your attention',
    icon: Bell,
    link: '/notifications',
  },
];

const QuickOverviewCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <NavLink
            key={card.title}
            to={card.link}
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-[#15803D] transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                {card.title}
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="my-3">
              <div className="text-2xl font-bold text-[#1F2937] group-hover:text-[#15803D] transition-colors">
                {card.value}
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">{card.detail}</p>
            </div>

            <div className="flex items-center text-xs font-medium text-[#15803D] group-hover:translate-x-0.5 transition-transform">
              <span>View details</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
          </NavLink>
        );
      })}
    </div>
  );
};

export default QuickOverviewCards;
