import React from 'react';
import PlaceholderPage from '../../components/common/PlaceholderPage.jsx';
import { ShoppingCart } from 'lucide-react';

const MarketplacePage = () => {
  return (
    <PlaceholderPage
      title="Agri Marketplace"
      subtitle="Buy seeds, organic fertilizers, and tools or list harvested produce directly to buyers."
      icon={ShoppingCart}
      owner="Suhas S Pai (Marketplace Endpoints) & Shravya (Product Schema)"
      features={[
        { name: 'Farmer-to-Farmer Seeds & Implements', desc: 'List unused machinery or organic seeds for sale or rent locally.' },
        { name: 'Direct Harvest Listing', desc: 'Post harvested produce quantities for buyers to offer competitive bids.' },
        { name: 'Certified Input Store', desc: 'Browse verified seed, fertilizer, and bio-pesticide products with price quotes.' },
        { name: 'Order Status & History', desc: 'Track ongoing inquiries, deliveries, and payment transactions.' },
      ]}
    />
  );
};

export default MarketplacePage;

