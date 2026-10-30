import React from 'react';
import WelcomeSection from '../../components/dashboard/WelcomeSection.jsx';
import QuickOverviewCards from '../../components/dashboard/QuickOverviewCards.jsx';
import ExploreFeatures from '../../components/dashboard/ExploreFeatures.jsx';
import WeatherPanel from '../../components/dashboard/WeatherPanel.jsx';
import MarketPricesPanel from '../../components/dashboard/MarketPricesPanel.jsx';
import RecommendedSection from '../../components/dashboard/RecommendedSection.jsx';
import RecentAlertsPanel from '../../components/dashboard/RecentAlertsPanel.jsx';

const DashboardPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* SECTION 1: WELCOME */}
      <section aria-label="Welcome">
        <WelcomeSection />
      </section>

      {/* SECTION 2: QUICK OVERVIEW */}
      <section aria-label="Quick Overview">
        <QuickOverviewCards />
      </section>

      {/* SECTION 3: EXPLORE FEATURES */}
      <section aria-label="Explore Features">
        <ExploreFeatures />
      </section>

      {/* SECTION 4: WEATHER */}
      <section aria-label="Weather">
        <WeatherPanel />
      </section>

      {/* SECTION 5: MARKET PRICES */}
      <section aria-label="Market Prices">
        <MarketPricesPanel />
      </section>

      {/* SECTION 6: RECOMMENDATIONS */}
      <section aria-label="Recommendations">
        <RecommendedSection />
      </section>

      {/* SECTION 7: RECENT NOTIFICATIONS */}
      <section aria-label="Recent Notifications">
        <RecentAlertsPanel />
      </section>
    </div>
  );
};

export default DashboardPage;
