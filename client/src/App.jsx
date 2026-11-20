import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LocationProvider } from './context/LocationContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import AuthModal from './components/marketplace/AuthModal.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
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
import ChatbotPage from './pages/chatbot/ChatbotPage.jsx';

function App() {
  return (
    <ErrorBoundary title="AgriSphere System Error">
      <LocationProvider>
        <AuthProvider>
          <CartProvider>
            <AuthModal />
            <Router>
          <Routes>
            <Route
              path="/"
              element={
                <ErrorBoundary title="AgriSphere Layout Error">
                  <MainLayout />
                </ErrorBoundary>
              }
            >
              <Route index element={<ErrorBoundary title="Dashboard Error"><DashboardPage /></ErrorBoundary>} />
              <Route path="dashboard" element={<ErrorBoundary title="Dashboard Error"><DashboardPage /></ErrorBoundary>} />
              <Route path="crops" element={<ErrorBoundary title="Crop Guide Error"><CropsPage /></ErrorBoundary>} />
              <Route path="weather" element={<ErrorBoundary title="Weather Forecast Error"><WeatherPage /></ErrorBoundary>} />
              <Route path="market-prices" element={<ErrorBoundary title="Market Prices Error"><MarketPage /></ErrorBoundary>} />
              <Route path="farming-tools" element={<ErrorBoundary title="Farming Tools Error"><ToolsPage /></ErrorBoundary>} />
              <Route path="tools-maps" element={<ErrorBoundary title="Farming Tools Error"><ToolsPage /></ErrorBoundary>} />
              <Route path="diseases-pests" element={<ErrorBoundary title="Diseases & Pests Error"><DiseasesPage /></ErrorBoundary>} />
              <Route path="soil-fertilizers" element={<ErrorBoundary title="Soil Health Error"><SoilPage /></ErrorBoundary>} />
              <Route path="government-schemes" element={<ErrorBoundary title="Schemes Error"><SchemesPage /></ErrorBoundary>} />
              <Route path="marketplace" element={<ErrorBoundary title="Marketplace Error"><MarketplacePage /></ErrorBoundary>} />
              <Route path="maps-nearby" element={<ErrorBoundary title="Maps & Services Error"><MapsPage /></ErrorBoundary>} />
              <Route path="maps" element={<ErrorBoundary title="Maps & Services Error"><MapsPage /></ErrorBoundary>} />
              <Route path="knowledge-hub" element={<ErrorBoundary title="Knowledge Hub Error"><KnowledgePage /></ErrorBoundary>} />
              <Route path="my-farm" element={<ErrorBoundary title="Farm Records Error"><FarmPage /></ErrorBoundary>} />
              <Route path="farm" element={<ErrorBoundary title="Farm Records Error"><FarmPage /></ErrorBoundary>} />
              <Route path="ai-chatbot" element={<ErrorBoundary title="AI Assistant Error"><ChatbotPage /></ErrorBoundary>} />
              <Route path="notifications" element={<ErrorBoundary title="Notifications Error"><NotificationsPage /></ErrorBoundary>} />
              <Route path="help-support" element={<ErrorBoundary title="Helpdesk Error"><HelpPage /></ErrorBoundary>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
          </CartProvider>
      </AuthProvider>
    </LocationProvider>
  </ErrorBoundary>
  );
}

export default App;
