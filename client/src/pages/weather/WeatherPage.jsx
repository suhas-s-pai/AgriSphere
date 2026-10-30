import React, { useState } from 'react';
import {
  CloudSun,
  MapPin,
  Droplets,
  Wind,
  Gauge,
  Sun,
  CloudRain,
  SunMedium,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap.jsx';

const regionalStations = [
  {
    id: 'belagavi',
    name: 'Belagavi Central',
    position: [15.8497, 74.4977],
    temp: '26°C',
    condition: 'Partly Cloudy',
    humidity: '78%',
    wind: '12 km/h',
    rain: '0 mm',
    color: '#15803D',
    description: 'Central Belagavi Agro-station. Favorable field working conditions.',
  },
  {
    id: 'gokak',
    name: 'Gokak Taluk',
    position: [16.1667, 74.8333],
    temp: '28°C',
    condition: 'Sunny & Clear',
    humidity: '65%',
    wind: '10 km/h',
    rain: '0 mm',
    color: '#D97706',
    description: 'Gokak Ghataprabha basin station. Dry and sunny.',
  },
  {
    id: 'chikodi',
    name: 'Chikodi Taluk',
    position: [16.4333, 74.6000],
    temp: '27°C',
    condition: 'Mostly Sunny',
    humidity: '70%',
    wind: '14 km/h',
    rain: '0 mm',
    color: '#2563EB',
    description: 'Krishna river belt agro-station. Moderate wind.',
  },
  {
    id: 'bailhongal',
    name: 'Bailhongal Taluk',
    position: [15.8167, 74.8667],
    temp: '26°C',
    condition: 'Partly Cloudy',
    humidity: '75%',
    wind: '11 km/h',
    rain: '0 mm',
    color: '#15803D',
    description: 'Malaprabha basin weather center. Good soil moisture.',
  },
  {
    id: 'khanapur',
    name: 'Khanapur Forest Zone',
    position: [15.6333, 74.5167],
    temp: '24°C',
    condition: 'Passing Showers',
    humidity: '84%',
    wind: '8 km/h',
    rain: '2.5 mm',
    color: '#0284C7',
    description: 'Western Ghats fringe station. High humidity.',
  },
];

const sevenDayForecast = [
  { day: 'Today', date: 'Oct 30', high: '28°', low: '18°', condition: 'Partly Cloudy', icon: CloudSun, rain: '10%', spray: 'Good Window' },
  { day: 'Tomorrow', date: 'Oct 31', high: '29°', low: '19°', condition: 'Sunny & Clear', icon: Sun, rain: '5%', spray: 'Ideal Window' },
  { day: 'Friday', date: 'Nov 01', high: '27°', low: '18°', condition: 'Partly Cloudy', icon: CloudSun, rain: '15%', spray: 'Good Window' },
  { day: 'Saturday', date: 'Nov 02', high: '25°', low: '17°', condition: 'Light Showers', icon: CloudRain, rain: '65%', spray: 'Avoid Spraying' },
  { day: 'Sunday', date: 'Nov 03', high: '26°', low: '18°', condition: 'Scattered Clouds', icon: SunMedium, rain: '20%', spray: 'Moderate' },
  { day: 'Monday', date: 'Nov 04', high: '28°', low: '19°', condition: 'Mostly Sunny', icon: Sun, rain: '10%', spray: 'Good Window' },
  { day: 'Tuesday', date: 'Nov 05', high: '28°', low: '18°', condition: 'Clear Sky', icon: Sun, rain: '5%', spray: 'Ideal Window' },
];

const WeatherPage = () => {
  const [selectedStationId, setSelectedStationId] = useState('belagavi');

  const currentStation =
    regionalStations.find((s) => s.id === selectedStationId) || regionalStations[0];

  const mapMarkers = regionalStations.map((station) => ({
    id: station.id,
    title: `${station.name} (${station.temp})`,
    type: station.condition,
    position: station.position,
    color: station.color,
    description: `${station.description} Humidity: ${station.humidity}, Wind: ${station.wind}`,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <SunMedium className="w-3.5 h-3.5" />
            <span>Agrometeorology & Weather Guidance</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Weather</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Real-time conditions, 7-day agronomic forecast, and field spray windows across Belagavi district.
          </p>
        </div>

        {/* Location Station Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#64748B]">Station:</span>
          <select
            value={selectedStationId}
            onChange={(e) => setSelectedStationId(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#1F2937] outline-none focus:border-[#15803D]"
          >
            {regionalStations.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name} ({st.temp})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Current Weather Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0">
              <CloudSun className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-[#1F2937]">
                  {currentStation.temp}
                </span>
                <span className="text-sm font-semibold text-[#15803D]">
                  {currentStation.condition}
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Location: {currentStation.name}, Belagavi District • Elevation: ~760m
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-100 text-center min-w-[90px]">
              <Droplets className="w-4 h-4 text-sky-600 mx-auto" />
              <p className="text-[10px] text-[#64748B] mt-1">Humidity</p>
              <p className="text-sm font-bold text-[#1F2937]">{currentStation.humidity}</p>
            </div>
            <div className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-100 text-center min-w-[90px]">
              <Wind className="w-4 h-4 text-slate-600 mx-auto" />
              <p className="text-[10px] text-[#64748B] mt-1">Wind Speed</p>
              <p className="text-sm font-bold text-[#1F2937]">{currentStation.wind}</p>
            </div>
            <div className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-100 text-center min-w-[90px]">
              <Gauge className="w-4 h-4 text-[#15803D] mx-auto" />
              <p className="text-[10px] text-[#64748B] mt-1">Rainfall</p>
              <p className="text-sm font-bold text-[#1F2937]">{currentStation.rain}</p>
            </div>
          </div>
        </div>

        {/* Agronomic Spray & Irrigation Advisory */}
        <div className="mt-5 p-4 rounded-lg bg-[#DCFCE7]/70 border border-emerald-200 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-[#14532D]">
            <span className="font-bold">Field Advisory for {currentStation.name}: </span>
            Optimal conditions for crop spraying, weeding, and fertilizer top-dressing. Wind speed is light ({currentStation.wind}) and no rain is forecasted for the next 48 hours. Best spraying window: 7:30 AM to 10:30 AM.
          </div>
        </div>
      </div>

      {/* 7-Day Forecast & Regional Weather Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 7-Day Forecast Table */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h2 className="text-lg font-bold text-[#14532D]">7-Day Forecast</h2>
            <span className="text-xs text-[#64748B]">Updated daily at 06:00 AM</span>
          </div>

          <div className="divide-y divide-slate-100">
            {sevenDayForecast.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.day}
                  className={`py-3 flex items-center justify-between text-xs ${
                    idx === 0 ? 'bg-[#F8FAF6] px-2 rounded-lg' : ''
                  }`}
                >
                  <div className="w-24">
                    <span className="font-bold text-[#1F2937]">{item.day}</span>
                    <span className="text-[10px] text-[#64748B] ml-1.5">{item.date}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-1 justify-center">
                    <Icon className="w-4 h-4 text-[#15803D]" />
                    <span className="text-slate-700 hidden sm:inline">{item.condition}</span>
                  </div>

                  <div className="w-20 text-center font-bold text-[#1F2937]">
                    {item.high} / <span className="text-[#64748B] font-normal">{item.low}</span>
                  </div>

                  <div className="w-16 text-center text-sky-600 font-semibold">
                    {item.rain}
                  </div>

                  <div className="w-24 text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.spray === 'Ideal Window'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.spray === 'Good Window'
                          ? 'bg-emerald-50 text-emerald-700'
                          : item.spray === 'Moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.spray}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Regional Stations Location Map */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-[#14532D]">Weather Stations Map</h2>
            <span className="text-xs text-[#64748B]">{regionalStations.length} Stations</span>
          </div>

          <p className="text-xs text-[#64748B]">
            Click any regional station marker to inspect conditions across Belagavi district.
          </p>

          <LeafletMap
            center={currentStation.position}
            zoom={10}
            markers={mapMarkers}
            selectedId={selectedStationId}
            onSelectMarker={(marker) => setSelectedStationId(marker.id)}
            height="340px"
          />

          <div className="pt-2 text-[11px] text-[#64748B] flex items-center justify-between">
            <span>Location: Belagavi District (Karnataka)</span>
            <span className="text-[#15803D] font-semibold">IMD & KSNDMC Reference</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
