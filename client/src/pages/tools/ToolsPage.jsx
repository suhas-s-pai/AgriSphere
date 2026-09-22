import React from 'react';
import PlaceholderPage from '../../components/common/PlaceholderPage.jsx';
import { Calculator } from 'lucide-react';

const ToolsPage = () => {
  return (
    <PlaceholderPage
      title="Farming Tools & Calculators"
      subtitle="Smart agricultural utilities for seed quantity estimation, fertilizer dosage, and irrigation needs."
      icon={Calculator}
      owner="Sharayu (Frontend Calculators)"
      features={[
        { name: 'Fertilizer N-P-K Calculator', desc: 'Compute exact NPK fertilizer bags needed based on plot size and crop type.' },
        { name: 'Seed Quantity Estimator', desc: 'Calculate precise kilogram of seeds required for your acreage and planting distance.' },
        { name: 'Drip Irrigation Water Requirement', desc: 'Estimate daily liters of water needed per plant based on temperature and evapotranspiration.' },
        { name: 'Farm Revenue & Profit Estimator', desc: 'Project yield income against expenditure for inputs, labor, and transport.' },
      ]}
    />
  );
};

export default ToolsPage;

