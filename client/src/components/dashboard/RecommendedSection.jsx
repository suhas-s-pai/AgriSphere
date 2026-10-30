import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const recommendations = [
  {
    id: 1,
    title: 'Best Crops to Grow',
    description: 'Recommended crops suitable for current season in Belagavi.',
    image: '/assets/Crop.png',
    path: '/crops',
  },
  {
    id: 2,
    title: 'Irrigation Tips',
    description: 'Simple methods to save water and improve crop yield.',
    image: '/assets/Irr.png',
    path: '/farming-tools',
  },
  {
    id: 3,
    title: 'Crop Diseases',
    description: 'Identify common tomato and vegetable crop issues early.',
    image: '/assets/Dls.png',
    path: '/diseases-pests',
  },
  {
    id: 4,
    title: 'Market Trends',
    description: 'Check latest commodity price trends in Karnataka markets.',
    image: '/assets/Market.png',
    path: '/market-prices',
  },
];

const RecommendedSection = () => {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-[#14532D]">
          Recommendations
        </h2>
        <p className="text-sm text-[#64748B] mt-0.5">
          Helpful guides and farming tips for your farm.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-[#15803D] transition-colors flex flex-col justify-between"
          >
            {/* Image Container */}
            <div className="h-40 w-full overflow-hidden bg-slate-100">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>

            {/* Card Content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#15803D] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-[#64748B] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#15803D]">
                <span>Read guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default RecommendedSection;
