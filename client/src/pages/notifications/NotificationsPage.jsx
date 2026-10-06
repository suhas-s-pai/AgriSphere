import React from 'react';
import PlaceholderPage from '../../components/common/PlaceholderPage.jsx';
import { Bell } from 'lucide-react';

const NotificationsPage = () => {
  return (
    <PlaceholderPage
      title="Notifications & Advisory Alerts"
      subtitle="Centralized inbox for weather advisories, market price movements, and government scheme updates."
      icon={Bell}
      owner="Suhas S Pai (Notification Microservice)"
      features={[
        { name: 'Weather Emergency Alerts', desc: 'Real-time rain, storm, and frost warnings.' },
        { name: 'Market Price Fluctuations', desc: 'Alerts when targeted crop prices rise or fall in Belagavi APMC.' },
        { name: 'Scheme Application Deadlines', desc: 'Reminders for last dates of government subsidy applications.' },
        { name: 'Personalized Task Alerts', desc: 'Daily push notifications for field activities.' },
      ]}
    />
  );
};

export default NotificationsPage;

