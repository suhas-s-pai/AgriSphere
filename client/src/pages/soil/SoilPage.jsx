import React from 'react';
import PlaceholderPage from '../../components/common/PlaceholderPage.jsx';
import { Layers } from 'lucide-react';

const SoilPage = () => {
  return (
    <PlaceholderPage
      title="Soil & Fertilizer Guidance"
      subtitle="Understand soil health, pH balance, micronutrient deficiencies, and organic soil enrichment."
      icon={Layers}
      owner="Shravya (Database Records) & Sharayu (Frontend UI)"
      features={[
        { name: 'Soil Health Card Logger', desc: 'Store official Soil Health Card NPK, pH, and organic carbon values in your profile.' },
        { name: 'Micronutrient Deficiency Guide', desc: 'Visual charts identifying Zinc, Iron, Magnesium, and Calcium deficiency signs.' },
        { name: 'Compost & Bio-Fertilizer Guide', desc: 'Step-by-step instructions for vermicomposting and Panchagavya preparation.' },
        { name: 'Nearby Soil Testing Labs', desc: 'Locate certified government and university soil testing centers in Belagavi.' },
      ]}
    />
  );
};

export default SoilPage;

