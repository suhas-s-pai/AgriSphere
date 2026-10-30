import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

const WelcomeSection = () => {
  const handleScrollToFeatures = () => {
    const el = document.getElementById('explore-features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 overflow-hidden">
      {/* Left Area: Welcome Text & Primary Action */}
      <div className="flex-1 max-w-xl text-left w-full">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>Belagavi, Karnataka</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#14532D] tracking-tight">
          Welcome to AgriSphere
        </h1>

        <p className="mt-2 text-sm sm:text-base text-[#64748B] leading-relaxed">
          Your farming information, resources and tools in one place.
        </p>

        <div className="mt-5">
          <button
            onClick={handleScrollToFeatures}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#15803D] text-white text-sm font-semibold hover:bg-[#14532D] transition-colors cursor-pointer shadow-xs"
          >
            Explore Features
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Area: Complete Uncropped Image Container */}
      <div className="w-full md:w-[400px] lg:w-[460px] xl:w-[510px] aspect-[3/1] shrink-0 rounded-xl overflow-hidden border border-slate-200/80 bg-[#F8FAF6] shadow-xs flex items-center justify-center">
        <img
          src="/assets/Farmer.png"
          alt="Farmer looking over agricultural field"
          style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
          className="w-full h-full object-contain object-center rounded-xl"
        />
      </div>
    </div>
  );
};

export default WelcomeSection;
