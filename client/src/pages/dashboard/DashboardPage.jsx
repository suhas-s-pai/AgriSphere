import React from 'react';
import HeroBanner from '../../components/dashboard/HeroBanner.jsx';
import ExploreFeatures from '../../components/dashboard/ExploreFeatures.jsx';
import RecommendedSection from '../../components/dashboard/RecommendedSection.jsx';
import CallToActionBanner from '../../components/dashboard/CallToActionBanner.jsx';
import WeatherPanel from '../../components/dashboard/WeatherPanel.jsx';
import MarketPricesPanel from '../../components/dashboard/MarketPricesPanel.jsx';
import RecentAlertsPanel from '../../components/dashboard/RecentAlertsPanel.jsx';

const DashboardPage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
      
      {/* Main Content Column (Left 8-9 cols on desktop) */}
      <div className="lg:col-span-8 xl:col-span-9 space-y-2.5">
        {/* 1. Hero Banner with Farmer.png */}
        <HeroBanner />

        {/* 2. Explore 12 Feature Cards */}
        <ExploreFeatures />

        {/* 3. Recommended Cards */}
        <RecommendedSection />

        {/* 4. Bottom CTA Banner */}
        <CallToActionBanner />
      </div>

      {/* Right Column Panels (Weather, Market Prices, Alerts) */}
      <div className="lg:col-span-4 xl:col-span-3 space-y-2.5">
        <WeatherPanel />
        <MarketPricesPanel />
        <RecentAlertsPanel />
      </div>

    </div>
  );
};

export default DashboardPage;
