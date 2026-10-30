import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  CloudSun,
  Droplets,
  CloudRain,
  Sun,
  ArrowRight,
} from 'lucide-react';

const forecast = [
  { day: 'Today', temp: '26°C', condition: 'Partly Cloudy', icon: CloudSun },
  { day: 'Tue', temp: '27°C', condition: 'Sunny', icon: Sun },
  { day: 'Wed', temp: '25°C', condition: 'Cloudy', icon: CloudSun },
  { day: 'Thu', temp: '24°C', condition: 'Light Rain', icon: CloudRain },
  { day: 'Fri', temp: '26°C', condition: 'Clear', icon: Sun },
];

const WeatherPanel = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-[#14532D]">Weather Overview</h2>
          <p className="text-xs text-[#64748B] mt-0.5">Belagavi, Karnataka</p>
        </div>
        <NavLink
          to="/weather"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D] hover:underline"
        >
          Full Forecast
          <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Current Weather Card */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-[#F8FAF6] border border-slate-100">
          <div className="w-14 h-14 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0">
            <CloudSun className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-bold text-[#1F2937]">26°C</div>
            <p className="text-sm font-medium text-[#64748B]">Partly Cloudy</p>
          </div>
        </div>

        {/* Humidity and Rainfall */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-lg bg-[#F8FAF6] border border-slate-100 text-center">
            <Droplets className="w-5 h-5 text-sky-600 mx-auto mb-1" />
            <p className="text-xs text-[#64748B]">Humidity</p>
            <p className="text-lg font-bold text-[#1F2937] mt-0.5">78%</p>
          </div>
          <div className="p-4 rounded-lg bg-[#F8FAF6] border border-slate-100 text-center">
            <CloudRain className="w-5 h-5 text-[#15803D] mx-auto mb-1" />
            <p className="text-xs text-[#64748B]">Rainfall</p>
            <p className="text-lg font-bold text-[#1F2937] mt-0.5">0 mm</p>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="grid grid-cols-5 gap-1.5 text-center">
          {forecast.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.day}
                className="p-2 rounded-lg bg-[#F8FAF6] border border-slate-100 flex flex-col items-center justify-between"
              >
                <span className="text-[11px] font-semibold text-[#64748B]">{item.day}</span>
                <Icon className="w-5 h-5 my-1.5 text-[#15803D]" />
                <span className="text-xs font-bold text-[#1F2937]">{item.temp}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherPanel;
