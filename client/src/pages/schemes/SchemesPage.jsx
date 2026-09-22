import React from 'react';
import PlaceholderPage from '../../components/common/PlaceholderPage.jsx';
import { Landmark } from 'lucide-react';

const SchemesPage = () => {
  return (
    <PlaceholderPage
      title="Government Schemes & Subsidies"
      subtitle="Central and Karnataka state agriculture schemes, eligibility criteria, and application links."
      icon={Landmark}
      owner="Sharayu (Frontend) & Suhas (API Integration)"
      features={[
        { name: 'PM-KISAN & State Subsidy Tracker', desc: 'Check eligibility criteria, installment statuses, and required documents.' },
        { name: 'Drip & Sprinkler Irrigation Subsidies', desc: 'Up to 90% subsidy guidelines for micro-irrigation equipment in Karnataka.' },
        { name: 'Fasal Bima Yojana (Crop Insurance)', desc: 'Claim submission guidelines and helpline numbers for weather risk insurance.' },
        { name: 'Krishi Yantra Dhare (Custom Hiring)', desc: 'Rent tractors and harvesters at subsidized government rates.' },
      ]}
    />
  );
};

export default SchemesPage;

