import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  CloudSun,
  Droplets,
  CloudRain,
  Sun,
  Cloud,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Loader2,
  Navigation,
  Globe,
  MapPin,
} from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext.jsx';

const renderWeatherIcon = (type, className = 'w-5 h-5') => {
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

const WeatherPanel = () => {
  const {
    formattedName,
    isGps,
    isManual,
    isGlobal,
    isStale,
    permissionStatus,
    loadingStatus,
    weatherData,
    isWeatherLoading,
    retryLocation,
    selectPreset,
    setGlobalMode,
  } = useLocationContext();

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#14532D]">Weather Overview</h2>
            {isGps && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                <Navigation className="w-2.5 h-2.5" />
                GPS {isStale ? '(Cached)' : 'Live'}
              </span>
            )}
            {isManual && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                <MapPin className="w-2.5 h-2.5 text-[#15803D]" />
                Selected
              </span>
            )}
            {isGlobal && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                <Globe className="w-2.5 h-2.5" />
                Global Mode
              </span>
            )}
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            {permissionStatus === 'denied'
              ? 'Location Permission Denied'
              : isGlobal
              ? 'General Regional Outlook (Global Mode)'
              : formattedName}
          </p>
        </div>
        <NavLink
          to="/weather"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D] hover:underline"
        >
          Full Forecast
          <ArrowRight className="w-3.5 h-3.5" />
        </NavLink>
      </div>

      {permissionStatus === 'denied' ? (
        <div className="mt-6 p-5 rounded-lg border border-amber-200 bg-amber-50/60 text-left">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Location unavailable – permission was denied</span>
          </div>
          <p className="mt-1.5 text-xs text-amber-800 leading-relaxed max-w-2xl">
            Browser location permission was denied. Please allow location access in your browser settings (click the lock icon in the address bar) and retry, or choose a region from the top navigation.
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
              <span>Select Belagavi Region</span>
            </button>
            <button
              onClick={setGlobalMode}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Use Global Mode</span>
            </button>
          </div>
        </div>
      ) : loadingStatus || isWeatherLoading ? (
        <div className="mt-6 py-12 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-8 h-8 text-[#15803D] animate-spin mb-2" />
          <p className="text-sm font-semibold text-[#14532D]">Loading Weather Data...</p>
          <p className="text-xs text-[#64748B] mt-0.5">Fetching verified forecast for {formattedName}</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Current Weather Card */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-[#F8FAF6] border border-slate-100">
            <div className="w-14 h-14 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0">
              {renderWeatherIcon(weatherData?.iconType, 'w-8 h-8')}
            </div>
            <div>
              <div className="text-3xl font-bold text-[#1F2937]">
                {weatherData?.temp || '26°C'}
              </div>
              <p className="text-sm font-medium text-[#64748B]">
                {weatherData?.condition || 'Partly Cloudy'}
              </p>
            </div>
          </div>

          {/* Humidity and Rainfall */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-lg bg-[#F8FAF6] border border-slate-100 text-center">
              <Droplets className="w-5 h-5 text-sky-600 mx-auto mb-1" />
              <p className="text-xs text-[#64748B]">Humidity</p>
              <p className="text-lg font-bold text-[#1F2937] mt-0.5">
                {weatherData?.humidity || '72%'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[#F8FAF6] border border-slate-100 text-center">
              <CloudRain className="w-5 h-5 text-[#15803D] mx-auto mb-1" />
              <p className="text-xs text-[#64748B]">Rainfall</p>
              <p className="text-lg font-bold text-[#1F2937] mt-0.5">
                {weatherData?.rain || '0 mm'}
              </p>
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div className="grid grid-cols-5 gap-1.5 text-center">
            {(weatherData?.forecast?.slice(0, 5) || []).map((item) => (
              <div
                key={item.day}
                className="p-2 rounded-lg bg-[#F8FAF6] border border-slate-100 flex flex-col items-center justify-between"
              >
                <span className="text-[11px] font-semibold text-[#64748B]">{item.day}</span>
                <div className="my-1.5 text-[#15803D]">
                  {renderWeatherIcon(item.iconType, 'w-5 h-5')}
                </div>
                <span className="text-xs font-bold text-[#1F2937]">{item.temp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPanel;
