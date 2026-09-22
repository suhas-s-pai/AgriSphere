import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout.jsx';
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import CropsPage from './pages/crops/CropsPage.jsx';
import WeatherPage from './pages/weather/WeatherPage.jsx';
import MarketPage from './pages/market/MarketPage.jsx';
import ToolsPage from './pages/tools/ToolsPage.jsx';
import DiseasesPage from './pages/diseases/DiseasesPage.jsx';
import SoilPage from './pages/soil/SoilPage.jsx';
import SchemesPage from './pages/schemes/SchemesPage.jsx';
import MarketplacePage from './pages/marketplace/MarketplacePage.jsx';
import MapsPage from './pages/maps/MapsPage.jsx';
import KnowledgePage from './pages/knowledge/KnowledgePage.jsx';
import FarmPage from './pages/farm/FarmPage.jsx';
import NotificationsPage from './pages/notifications/NotificationsPage.jsx';
import HelpPage from './pages/help/HelpPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="crops" element={<CropsPage />} />
          <Route path="weather" element={<WeatherPage />} />
          <Route path="market-prices" element={<MarketPage />} />
          <Route path="farming-tools" element={<ToolsPage />} />
          <Route path="diseases-pests" element={<DiseasesPage />} />
          <Route path="soil-fertilizers" element={<SoilPage />} />
          <Route path="government-schemes" element={<SchemesPage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="maps-nearby" element={<MapsPage />} />
          <Route path="knowledge-hub" element={<KnowledgePage />} />
          <Route path="my-farm" element={<FarmPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="help-support" element={<HelpPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

