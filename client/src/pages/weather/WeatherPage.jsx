import React from 'react';
import PlaceholderPage from '../../components/common/PlaceholderPage.jsx';
import { SunMedium } from 'lucide-react';

const WeatherPage = () => {
  return (
    <PlaceholderPage
      title="Real-Time Weather & Forecast"
      subtitle="Hyper-local weather updates, 7-day precipitation outlook, wind speed, and agricultural advisories."
      icon={SunMedium}
      owner="Suhas S Pai (Backend API Integration)"
      features={[
        { name: '7-Day Granular Forecast', desc: 'Hour-by-hour temperature, humidity, rainfall probability, and UV index.' },
        { name: 'Severe Weather Alerts', desc: 'Instant push notifications for heavy rain, hail storms, or unexpected heatwaves.' },
        { name: 'Spray & Harvest Window Calculator', desc: 'Smart indicator advising optimal hours for fertilizer spraying and field work.' },
        { name: 'Historical Weather Data', desc: 'Monsoon trends and rainfall history for Belagavi district over past seasons.' },
      ]}
    />
  );
};

export default WeatherPage;

