import React from 'react';
import PlaceholderPage from '../../components/common/PlaceholderPage.jsx';
import { MapPin } from 'lucide-react';

const MapsPage = () => {
  return (
    <PlaceholderPage
      title="Maps & Nearby Services"
      subtitle="Interactive OpenStreetMap locator for APMC markets, cold storages, fertilizer outlets, and Krishi Vigyan Kendras."
      icon={MapPin}
      owner="Sharayu (Leaflet Map Integration)"
      features={[
        { name: 'APMC Market & Mandi Locator', desc: 'Find distances, navigation routes, and operating hours of local mandis.' },
        { name: 'Cold Storage & Warehouses', desc: 'Locate nearby government and private storage facilities with capacity status.' },
        { name: 'Agri Input Dealers & Nurseries', desc: 'Directory of certified seed stores and plant nurseries in Belagavi.' },
        { name: 'Krishi Vigyan Kendra (KVK) Centers', desc: 'Find agricultural university extension centers for expert consultation.' },
      ]}
    />
  );
};

export default MapsPage;

