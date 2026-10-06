import React from 'react';
import PlaceholderPage from '../../components/common/PlaceholderPage.jsx';
import { Warehouse } from 'lucide-react';

const FarmPage = () => {
  return (
    <PlaceholderPage
      title="My Farm Management"
      subtitle="Personalized farmer dashboard to track crop plots, expense logs, task reminders, and harvest yields."
      icon={Warehouse}
      owner="Shravya (User Farm Schema) & Suhas S Pai (Farm CRUD Endpoints)"
      features={[
        { name: 'Plot & Field Directory', desc: 'Register multiple land plots with acreage, soil type, and current planted crops.' },
        { name: 'Crop Task & Schedule Tracker', desc: 'Reminders for irrigation days, fertilizer applications, and weeding schedule.' },
        { name: 'Farm Expense & Income Log', desc: 'Track spending on seeds, labor, diesel, and sales revenue.' },
        { name: 'Yield History Analytics', desc: 'Compare year-on-year crop productivity per acre.' },
      ]}
    />
  );
};

export default FarmPage;

