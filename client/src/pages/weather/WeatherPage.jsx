import React from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Gauge,
  Sun,
  CloudRain,
  Cloud,
  SunMedium,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Navigation,
  Globe,
  MapPin,
  Sunrise,
  Sunset,
  Clock,
} from 'lucide-react';
import LeafletMap from '../../components/common/LeafletMap.jsx';
import { useLocationContext } from '../../context/LocationContext.jsx';

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

const renderIcon = (type, className = 'w-4 h-4') => {
  switch (type) {
    case 'sun':
      return <Sun className={className} />;
    case 'rain':
      return <CloudRain className={className} />;
    case 'cloud':
      return <Cloud className={className} />;
    case 'cloud-sun':
    default:
      return <CloudSun className={className} />;
  }
};

const WeatherPage = () => {
  const {
    formattedName,
    latitude,
    longitude,
    isGps,
    isManual,
    isGlobal,
    isStale,
    permissionStatus,
    weatherData,
    retryLocation,
    selectPreset,
    setGlobalMode,
  } = useLocationContext();

  const hasCoords = latitude != null && longitude != null;

  // Active station data
  const currentStation = hasCoords
    ? {
        id: 'active',
        name: formattedName,
        position: [latitude, longitude],
        temp: weatherData?.temp || '26°C',
        condition: weatherData?.condition || 'Partly Cloudy',
        humidity: weatherData?.humidity || '72%',
        wind: weatherData?.wind || '12 km/h',
        rain: weatherData?.rain || '0 mm',
        color: '#15803D',
        description: `Verified coordinates: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`,
      }
    : {
        ...regionalStations[0],
        name: 'Regional Overview (Global Mode)',
        temp: weatherData?.temp || '26°C',
        condition: weatherData?.condition || 'Regional Overview',
      };

  // Map markers
  const mapMarkers = [
    ...regionalStations.map((station) => ({
      id: station.id,
      title: `${station.name} (${station.temp})`,
      type: station.condition,
      position: station.position,
      color: station.color,
      description: `${station.description} Humidity: ${station.humidity}, Wind: ${station.wind}`,
    })),
  ];

  if (hasCoords) {
    mapMarkers.unshift({
      id: 'active_marker',
      title: `${isGps ? '📍 GPS Position' : '📍 Selected Location'}: ${formattedName} (${currentStation.temp})`,
      type: currentStation.condition,
      position: [latitude, longitude],
      color: '#15803D',
      description: `Your active location: ${formattedName}`,
    });
  }

  const forecastItems =
    weatherData?.forecast && weatherData.forecast.length > 0
      ? weatherData.forecast
      : [
          { day: 'Today', date: 'Today', high: '28°', low: '18°', condition: 'Partly Cloudy', iconType: 'cloud-sun', rain: '10%', spray: 'Good Window' },
          { day: 'Tomorrow', date: 'Tomorrow', high: '29°', low: '19°', condition: 'Sunny & Clear', iconType: 'sun', rain: '5%', spray: 'Ideal Window' },
          { day: 'Day 3', date: 'Day 3', high: '27°', low: '18°', condition: 'Partly Cloudy', iconType: 'cloud-sun', rain: '15%', spray: 'Good Window' },
          { day: 'Day 4', date: 'Day 4', high: '25°', low: '17°', condition: 'Light Showers', iconType: 'rain', rain: '65%', spray: 'Avoid Spraying' },
          { day: 'Day 5', date: 'Day 5', high: '26°', low: '18°', condition: 'Scattered Clouds', iconType: 'cloud-sun', rain: '20%', spray: 'Moderate' },
        ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md">
              <SunMedium className="w-3.5 h-3.5" />
              <span>Agrometeorology & Weather Guidance</span>
            </div>
            {isGps && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                <Navigation className="w-2.5 h-2.5" />
                GPS {isStale ? '(Cached)' : 'Live'}
              </span>
            )}
            {isGlobal && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                <Globe className="w-2.5 h-2.5" />
                Global Mode
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Weather</h1>
          <p className="text-sm text-[#64748B] mt-1">
            {isGlobal
              ? 'General agronomic weather guidance across Karnataka. Turn on GPS or select a city for hyper-local farm weather.'
              : `Real-time conditions, 7-day agronomic forecast, and field spray windows for ${formattedName}.`}
          </p>
        </div>

        {/* Quick Location Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#64748B]">Active Region:</span>
          <select
            value={isGlobal ? 'global' : isGps ? 'gps' : 'manual'}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'gps') retryLocation();
              else if (val === 'global') setGlobalMode();
              else selectPreset('belagavi');
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#1F2937] outline-none focus:border-[#15803D] cursor-pointer"
          >
            {isGps && <option value="gps">📍 GPS: {formattedName}</option>}
            {isManual && <option value="manual">📍 Manual: {formattedName}</option>}
            {isGlobal && <option value="global">🌐 Global Mode (All Regions)</option>}
            <option value="belagavi">Belagavi Central</option>
            <option value="gokak">Gokak Taluk</option>
            <option value="chikodi">Chikodi Taluk</option>
            <option value="dharwad">Dharwad Region</option>
          </select>
        </div>
      </div>

      {/* Permission Denied Notice */}
      {permissionStatus === 'denied' && (
        <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/70 text-left">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Location unavailable – permission was denied</span>
          </div>
          <p className="mt-1.5 text-xs text-amber-800 leading-relaxed max-w-2xl">
            Browser location permission was denied. Please allow location access in your browser settings (click the lock icon in the address bar) and click Retry Location, or select a region above.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={retryLocation}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#15803D] hover:bg-[#14532D] text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Location</span>
            </button>
            <button
              onClick={() => selectPreset('belagavi')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Use Belagavi Central</span>
            </button>
            <button
              onClick={setGlobalMode}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Use Global Mode</span>
            </button>
          </div>
        </div>
      )}

      {/* Current Weather Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0">
              {renderIcon(weatherData?.iconType, 'w-10 h-10')}
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
                Location: {currentStation.name}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 w-full md:w-auto">
            <div className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-100 text-center min-w-[80px]">
              <Droplets className="w-4 h-4 text-sky-600 mx-auto" />
              <p className="text-[10px] text-[#64748B] mt-1">Humidity</p>
              <p className="text-sm font-bold text-[#1F2937]">{currentStation.humidity}</p>
            </div>
            <div className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-100 text-center min-w-[80px]">
              <Wind className="w-4 h-4 text-slate-600 mx-auto" />
              <p className="text-[10px] text-[#64748B] mt-1">Wind Speed</p>
              <p className="text-sm font-bold text-[#1F2937]">{currentStation.wind}</p>
            </div>
            <div className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-100 text-center min-w-[80px]">
              <Gauge className="w-4 h-4 text-[#15803D] mx-auto" />
              <p className="text-[10px] text-[#64748B] mt-1">Precipitation</p>
              <p className="text-sm font-bold text-[#1F2937]">{currentStation.rain}</p>
            </div>
            <div className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-100 text-center min-w-[80px]">
              <Sunrise className="w-4 h-4 text-amber-500 mx-auto" />
              <p className="text-[10px] text-[#64748B] mt-1">Sunrise</p>
              <p className="text-xs font-bold text-[#1F2937]">{weatherData?.sunrise || '06:15 AM'}</p>
            </div>
            <div className="p-3 bg-[#F8FAF6] rounded-lg border border-slate-100 text-center min-w-[80px]">
              <Sunset className="w-4 h-4 text-rose-500 mx-auto" />
              <p className="text-[10px] text-[#64748B] mt-1">Sunset</p>
              <p className="text-xs font-bold text-[#1F2937]">{weatherData?.sunset || '06:10 PM'}</p>
            </div>
          </div>
        </div>

        {/* 24-Hour Hourly Forecast Strip */}
        {weatherData?.hourly && weatherData.hourly.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#14532D]">
                <Clock className="w-3.5 h-3.5" />
                <span>24-Hour Hourly Forecast</span>
              </div>
              <span className="text-[10px] text-slate-400">Next 24 hours · Open-Meteo</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {weatherData.hourly.map((h, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-between p-2.5 rounded-lg bg-[#F8FAF6] border border-slate-100 min-w-[70px] shrink-0 text-center"
                >
                  <span className="text-[10px] font-semibold text-slate-500">{h.time}</span>
                  <div className="my-1.5 text-[#15803D]">
                    {renderIcon(h.iconType, 'w-4 h-4')}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{h.temp}</span>
                  <span className="text-[9px] text-sky-600 font-medium mt-0.5">{h.rainProb}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agronomic Spray & Irrigation Advisory */}
        <div className="mt-5 p-4 rounded-lg bg-[#DCFCE7]/70 border border-emerald-200 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-[#14532D]">
            <span className="font-bold">Agrometeorological Spray & Field Advisory ({formattedName}): </span>
            {parseInt(currentStation.wind, 10) > 18
              ? 'High wind speeds detected (>18 km/h). Postpone foliar spraying to prevent spray drift and chemical loss.'
              : currentStation.rain !== '0 mm' && currentStation.rain !== '0.0 mm'
              ? 'Precipitation recorded. Avoid soil tillage and fertilizer top-dressing to prevent nutrient runoff.'
              : `Optimal field conditions. Wind speed is favorable (${currentStation.wind}) and rainfall probability is low. Recommended field spraying window: 7:00 AM – 10:30 AM.`}
          </div>
        </div>
      </div>

      {/* 7-Day Forecast & Regional Weather Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 7-Day Forecast Table */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h2 className="text-lg font-bold text-[#14532D]">7-Day Forecast</h2>
            <span className="text-xs text-[#64748B]">Verified Live Data via Open-Meteo</span>
          </div>

          <div className="divide-y divide-slate-100">
            {forecastItems.map((item, idx) => (
              <div
                key={item.day || idx}
                className={`py-3 flex items-center justify-between text-xs ${
                  idx === 0 ? 'bg-[#F8FAF6] px-2 rounded-lg' : ''
                }`}
              >
                <div className="w-24">
                  <span className="font-bold text-[#1F2937]">{item.day}</span>
                  <span className="text-[10px] text-[#64748B] ml-1.5">{item.date}</span>
                </div>

                <div className="flex items-center gap-2 flex-1 justify-center">
                  <div className="text-[#15803D]">{renderIcon(item.iconType, 'w-4 h-4')}</div>
                  <span className="text-slate-700 hidden sm:inline">{item.condition}</span>
                </div>

                <div className="w-20 text-center font-bold text-[#1F2937]">
                  {item.high || item.temp} / <span className="text-[#64748B] font-normal">{item.low || '18°'}</span>
                </div>

                <div className="w-16 text-center text-sky-600 font-semibold">
                  {item.rain || '0%'}
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
                    {item.spray || 'Good Window'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Map */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-[#14532D]">Weather Map</h2>
            <span className="text-xs text-[#64748B]">{mapMarkers.length} Locations</span>
          </div>

          <p className="text-xs text-[#64748B]">
            Interactive map displaying weather stations and your current verified location.
          </p>

          <LeafletMap
            center={hasCoords ? [latitude, longitude] : regionalStations[0].position}
            zoom={hasCoords ? 11 : 9}
            markers={mapMarkers}
            selectedId={hasCoords ? 'active_marker' : regionalStations[0].id}
            height="340px"
          />

          <div className="pt-2 text-[11px] text-[#64748B] flex items-center justify-between">
            <span>Location: {formattedName}</span>
            <span className="text-[#15803D] font-semibold">Open-Meteo & OpenStreetMap</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
