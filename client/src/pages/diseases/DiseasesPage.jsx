import React from 'react';
import PlaceholderPage from '../../components/common/PlaceholderPage.jsx';
import { Bug } from 'lucide-react';

const DiseasesPage = () => {
  return (
    <PlaceholderPage
      title="Diseases & Pest Management"
      subtitle="Identify crop symptoms, explore organic & chemical remedies, and prevent pest outbreaks."
      icon={Bug}
      owner="Sharayu (UI) & Suhas S Pai (Image Processing API)"
      features={[
        { name: 'Symptom-Based Disease Search', desc: 'Filter diseases by leaf yellowing, spots, wilt, or stem rot.' },
        { name: 'Organic & Chemical Remedies', desc: 'Government-approved treatment dosage and bio-pesticide preparation instructions.' },
        { name: 'Pest Outbreak Radar', desc: 'Community reported pest sightings in nearby villages in Karnataka.' },
        { name: 'AI Image Diagnostic (Future)', desc: 'Upload leaf photos for automated AI pest diagnosis.' },
      ]}
    />
  );
};

export default DiseasesPage;

