import React from 'react';
import PlaceholderPage from '../../components/common/PlaceholderPage.jsx';
import { TrendingUp } from 'lucide-react';

const MarketPage = () => {
  return (
    <PlaceholderPage
      title="Market Prices & Trends"
      subtitle="APMC Mandi rates, daily price trends, market arrival volumes, and price predictions."
      icon={TrendingUp}
      owner="Suhas S Pai (APMC Data API) & Shravya (Database)"
      features={[
        { name: 'APMC Belagavi Mandi Rates', desc: 'Real-time minimum, maximum, and modal price updates for local markets.' },
        { name: 'Multi-Market Price Comparison', desc: 'Compare crop prices across neighboring districts (Belagavi, Dharwad, Kolhapur).' },
        { name: 'Price Trend Analytics', desc: 'Historical price charts powered by Recharts showing 30-day price trajectories.' },
        { name: 'Direct Buyer Connect', desc: 'Contact details of verified traders and wholesale buyers.' },
      ]}
    />
  );
};

export default MarketPage;

