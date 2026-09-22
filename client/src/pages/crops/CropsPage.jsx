import React from 'react';
import PlaceholderPage from '../../components/common/PlaceholderPage.jsx';
import { Sprout } from 'lucide-react';

const CropsPage = () => {
  return (
    <PlaceholderPage
      title="Crop Information & Advisory"
      subtitle="Comprehensive guide on crop varieties, sowing seasons, irrigation schedules, and harvest practices."
      icon={Sprout}
      owner="Sharayu (Frontend) & Shravya (Database)"
      features={[
        { name: 'Crop Selection Matrix', desc: 'Filter crops by soil type, season, water availability, and regional climate in Belagavi.' },
        { name: 'Seasonal Growth Timelines', desc: 'Interactive week-by-week cultivation calendar for major local crops (Sugarcane, Tomato, Cotton, Maize).' },
        { name: 'High Yield Varieties (HYV)', desc: 'Detailed catalog of seed varieties certified for optimal yield and pest resistance.' },
        { name: 'Cultivation Best Practices', desc: 'Expert recommendations on spacing, seed rate, land preparation, and crop rotation.' },
      ]}
    />
  );
};

export default CropsPage;

