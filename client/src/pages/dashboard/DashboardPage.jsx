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
    <div className="pb-16">
      <section className="website-section pt-8 sm:pt-10 lg:pt-12">
        <HeroBanner />
      </section>

      <section className="website-section py-12 sm:py-14 lg:py-16">
        <ExploreFeatures />
      </section>

      <section className="bg-white py-12 sm:py-14 lg:py-16">
        <div className="website-section">
          <RecommendedSection />
        </div>
      </section>

      <section className="website-section py-12 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <WeatherPanel />
          <MarketPricesPanel />
          <RecentAlertsPanel />
        </div>
      </section>

      <section className="website-section pb-4">
        <CallToActionBanner />
      </section>
    </div>
  );
};

export default DashboardPage;
