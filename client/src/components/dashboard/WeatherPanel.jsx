import React from 'react';
import { NavLink } from 'react-router-dom';
import { CloudSun, ArrowRight, Sprout } from 'lucide-react';

const WeatherPanel = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-2.5 shadow-2xs space-y-2 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[11.5px] font-extrabold text-slate-900">Weather in Belagavi</h3>
        <NavLink
          to="/weather"
          className="text-[9.5px] font-bold text-agri-600 hover:text-agri-700 flex items-center gap-0.5 transition-colors"
        >
          View Forecast <ArrowRight className="w-2.5 h-2.5" />
        </NavLink>
      </div>

      {/* Main Temp */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <CloudSun className="w-5.5 h-5.5" />
          </div>
          <div>
            <div className="flex items-baseline leading-none">
              <span className="text-xl font-black text-slate-900 tracking-tight">26</span>
              <span className="text-sm font-bold text-slate-800">°C</span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 mt-0.5 leading-none">Partly Cloudy</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-0.5 bg-slate-50/80 p-1.5 rounded-lg border border-slate-100 text-center">
        <div>
          <p className="text-[8.5px] text-slate-400 font-medium">Humidity</p>
          <p className="text-[10.5px] font-bold text-slate-800 mt-0.5">78%</p>
        </div>
        <div className="border-x border-slate-200/70">
          <p className="text-[8.5px] text-slate-400 font-medium">Rainfall</p>
          <p className="text-[10.5px] font-bold text-slate-800 mt-0.5">0 mm</p>
        </div>
        <div>
          <p className="text-[8.5px] text-slate-400 font-medium">Wind</p>
          <p className="text-[10.5px] font-bold text-slate-800 mt-0.5">12 km/h</p>
        </div>
      </div>

      {/* Advisory Box */}
      <div className="flex items-start gap-1.5 p-1.5 rounded-lg bg-agri-50/80 border border-agri-100 text-slate-700 text-xs">
        <Sprout className="w-3.5 h-3.5 text-agri-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-[9.5px] font-medium leading-tight text-slate-700">
            No rain expected today. Good conditions for field work.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherPanel;
