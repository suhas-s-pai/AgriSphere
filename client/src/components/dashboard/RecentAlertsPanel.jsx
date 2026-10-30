import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, CloudRain, TrendingUp, Landmark, Bell } from 'lucide-react';

const alerts = [
  {
    id: 1,
    title: 'Light rain expected this Thursday in Belagavi',
    description: 'Ensure harvested grains and crops are protected from moisture.',
    time: '2 hours ago',
    icon: CloudRain,
    path: '/weather',
  },
  {
    id: 2,
    title: 'Tomato prices increased by 12% at Belagavi APMC',
    description: 'Demand remains high in nearby markets. Current rate ₹25/kg.',
    time: '5 hours ago',
    icon: TrendingUp,
    path: '/market-prices',
  },
  {
    id: 3,
    title: 'New drip irrigation subsidy open for application',
    description: 'State agriculture portal is accepting applications for subsidy.',
    time: '1 day ago',
    icon: Landmark,
    path: '/government-schemes',
  },
];

const RecentAlertsPanel = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#14532D]">Recent Notifications</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Important agricultural updates and alerts</p>
        </div>
        <NavLink
          to="/notifications"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D] hover:underline"
        >
          View All
          <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>

      {/* Alert List */}
      <div className="mt-4 space-y-3">
        {alerts.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className="flex items-start justify-between gap-4 p-3.5 rounded-lg bg-[#F8FAF6] hover:bg-slate-100 border border-slate-100 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1F2937]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>

              <span className="text-xs text-[#64748B] whitespace-nowrap self-start">
                {item.time}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default RecentAlertsPanel;
