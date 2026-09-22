import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, CloudRain, TrendingUp, Sprout } from 'lucide-react';

const sampleAlerts = [
  {
    id: 1,
    message: 'Light rain expected tomorrow in Belagavi.',
    time: '2 hours ago',
    icon: CloudRain,
    iconBg: 'bg-sky-50 text-sky-600',
  },
  {
    id: 2,
    message: 'Tomato prices increased by 12% in nearby markets.',
    time: '5 hours ago',
    icon: TrendingUp,
    iconBg: 'bg-rose-50 text-rose-600',
  },
  {
    id: 3,
    message: 'New subsidy scheme for drip irrigation is now open.',
    time: '1 day ago',
    icon: Sprout,
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
];

const RecentAlertsPanel = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-2.5 shadow-2xs space-y-1.5 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[11.5px] font-extrabold text-slate-900">Recent Alerts</h3>
        <NavLink
          to="/notifications"
          className="text-[9.5px] font-bold text-agri-600 hover:text-agri-700 flex items-center gap-0.5 transition-colors"
        >
          View All <ArrowRight className="w-2.5 h-2.5" />
        </NavLink>
      </div>

      {/* List */}
      <div className="space-y-1.5">
        {sampleAlerts.map((alert) => {
          const AlertIcon = alert.icon;
          return (
            <div
              key={alert.id}
              className="flex items-start gap-2 p-1.5 rounded-lg bg-slate-50/70 border border-slate-100 hover:bg-slate-100/60 transition-colors"
            >
              <div className={`w-6 h-6 rounded-md ${alert.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                <AlertIcon className="w-3 h-3" />
              </div>
              <div className="space-y-0.5 leading-none">
                <p className="text-[10px] font-semibold text-slate-800 leading-snug">
                  {alert.message}
                </p>
                <span className="text-[8.5px] text-slate-400 font-medium block mt-0.5">
                  {alert.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentAlertsPanel;
