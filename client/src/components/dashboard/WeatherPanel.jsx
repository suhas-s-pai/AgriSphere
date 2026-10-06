import React from 'react';
import { NavLink } from 'react-router-dom';
import { CloudSun, ArrowRight, Sprout, Droplets, Wind } from 'lucide-react';

const WeatherPanel = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_25px_rgba(15,23,42,0.04)]">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-agri-600">Today</p>
        <h3 className="mt-1 text-lg font-black text-slate-950">Weather in Belagavi</h3>
      </div>
      <NavLink to="/weather" className="inline-flex items-center gap-1 text-xs font-extrabold text-agri-600 hover:text-agri-700">
        Forecast <ArrowRight className="h-3.5 w-3.5" />
      </NavLink>
    </div>

    <div className="mt-7 flex items-center gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
        <CloudSun className="h-9 w-9" />
      </div>
      <div>
        <div className="text-4xl font-black tracking-tight text-slate-950">26°</div>
        <p className="mt-1 text-sm font-semibold text-slate-500">Partly cloudy</p>
      </div>
    </div>

    <div className="mt-7 grid grid-cols-3 divide-x divide-slate-200 rounded-xl bg-slate-50 py-4">
      <div className="text-center"><Droplets className="mx-auto h-4 w-4 text-sky-500" /><p className="mt-2 text-xs text-slate-400">Humidity</p><p className="mt-1 text-sm font-extrabold">78%</p></div>
      <div className="text-center"><Sprout className="mx-auto h-4 w-4 text-agri-600" /><p className="mt-2 text-xs text-slate-400">Rainfall</p><p className="mt-1 text-sm font-extrabold">0 mm</p></div>
      <div className="text-center"><Wind className="mx-auto h-4 w-4 text-slate-500" /><p className="mt-2 text-xs text-slate-400">Wind</p><p className="mt-1 text-sm font-extrabold">12 km/h</p></div>
    </div>

    <div className="mt-5 rounded-xl border border-agri-100 bg-agri-50 p-4 text-sm leading-5 text-slate-600">
      <span className="font-extrabold text-agri-700">Field advisory:</span> No rain expected today. Good conditions for field work.
    </div>
  </div>
);

export default WeatherPanel;
