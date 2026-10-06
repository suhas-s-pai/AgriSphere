import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, CloudRain, TrendingUp, Sprout } from 'lucide-react';

const sampleAlerts = [
  { id: 1, message: 'Light rain expected tomorrow in Belagavi.', time: '2 hours ago', icon: CloudRain, iconBg: 'bg-sky-50 text-sky-600' },
  { id: 2, message: 'Tomato prices increased by 12% in nearby markets.', time: '5 hours ago', icon: TrendingUp, iconBg: 'bg-rose-50 text-rose-600' },
  { id: 3, message: 'New subsidy scheme for drip irrigation is now open.', time: '1 day ago', icon: Sprout, iconBg: 'bg-emerald-50 text-emerald-600' },
];

const RecentAlertsPanel = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_25px_rgba(15,23,42,0.04)]">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-agri-600">Stay informed</p>
        <h3 className="mt-1 text-lg font-black text-slate-950">Recent Alerts</h3>
      </div>
      <NavLink to="/notifications" className="inline-flex items-center gap-1 text-xs font-extrabold text-agri-600">
        View all <ArrowRight className="h-3.5 w-3.5" />
      </NavLink>
    </div>

    <div className="mt-6 space-y-3">
      {sampleAlerts.map((alert) => {
        const Icon = alert.icon;
        return (
          <div key={alert.id} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${alert.iconBg}`}><Icon className="h-4 w-4" /></div>
            <div>
              <p className="text-sm font-bold leading-5 text-slate-800">{alert.message}</p>
              <span className="mt-1 block text-[10px] font-semibold text-slate-400">{alert.time}</span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default RecentAlertsPanel;
