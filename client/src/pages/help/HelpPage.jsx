import React from 'react';
import PlaceholderPage from '../../components/common/PlaceholderPage.jsx';
import { Headphones } from 'lucide-react';

const HelpPage = () => {
  return (
    <PlaceholderPage
      title="Help & Farmer Support"
      subtitle="Kisan Call Centre toll-free numbers, platform user guides, and direct support ticket submission."
      icon={Headphones}
      owner="Sharayu (Frontend Help Desk)"
      features={[
        { name: 'Kisan Call Centre Direct Dial', desc: 'Toll-free 1800-180-1551 one-click call for government agriculture helpline.' },
        { name: 'AgriSphere Platform User Manual', desc: 'Step-by-step visual tutorial on navigating tools, market prices, and weather.' },
        { name: 'Submit a Technical Ticket', desc: 'Report website issues or request new feature additions directly to the team.' },
        { name: 'Frequently Asked Questions (FAQ)', desc: 'Answers to common questions about crop advice, market data, and account settings.' },
      ]}
    />
  );
};

export default HelpPage;

