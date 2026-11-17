import React from 'react';
import { MapPin, Navigation, Globe, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext.jsx';

const WelcomeSection = () => {
  const {
    formattedName,
    isGps,
    isManual,
    isGlobal,
    permissionStatus,
    loadingStatus,
  } = useLocationContext();

  const handleScrollToFeatures = () => {
    const el = document.getElementById('explore-features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-[320px] sm:h-[360px] lg:h-[400px] rounded-xl overflow-hidden border border-slate-200 shadow-xs flex items-center">
      {/* Full-Bleed Background Image */}
      <img
        src="/assets/Farmer.png"
        alt="Farmer looking over agricultural field"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          objectFit: 'cover',
          objectPosition: 'center',
          borderRadius: 'inherit',
        }}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Subtle Dark Gradient Overlay for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

      {/* Welcome Content Overlay */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 text-left max-w-2xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-200 bg-emerald-950/60 backdrop-blur-sm border border-emerald-500/30 px-2.5 py-1 rounded-md mb-3">
          {loadingStatus ? (
            <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          ) : permissionStatus === 'denied' ? (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          ) : isGps ? (
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
          ) : isGlobal ? (
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span>
            {loadingStatus
              ? 'Detecting Location...'
              : permissionStatus === 'denied'
              ? 'Location Permission Denied'
              : formattedName}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
          Welcome to AgriSphere
        </h1>

        <p className="mt-2 text-sm sm:text-base text-slate-100 leading-relaxed max-w-xl">
          Your farming information, resources and tools in one place.
        </p>

        <div className="mt-5 sm:mt-6">
          <button
            onClick={handleScrollToFeatures}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#15803D] text-white text-sm font-semibold hover:bg-[#14532D] transition-colors cursor-pointer shadow-md"
          >
            Explore Features
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
