import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  CloudSun,
  TrendingUp,
  Sprout,
  Bell,
  ChevronRight,
  Sun,
  CloudRain,
  Cloud,
} from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext.jsx';

const getWeatherIcon = (type) => {
  switch (type) {
    case 'sun':
      return Sun;
    case 'rain':
      return CloudRain;
    case 'cloud':
      return Cloud;
    case 'cloud-sun':
    default:
      return CloudSun;
  }
};

const QuickOverviewCards = () => {
  const { weatherData, status, displayName, city, district, isGlobal } = useLocationContext();

  // Load user's registered farm crops from localStorage
  const registeredCropsCount = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('agrisphere_registered_farm_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.plots)) {
          return `${parsed.plots.length} Crops`;
        }
      }
    } catch {}
    return '3 Crops';
  }, []);

  const marketLoc = isGlobal ? 'Regional' : (city || district || 'Local');

  const weatherCard = {
    title: 'Weather',
    value: status === 'denied' ? 'Unavailable' : weatherData?.temp || '26°C',
    detail:
      status === 'denied'
        ? 'Permission denied'
        : weatherData?.condition
        ? `${weatherData.condition} (${displayName.split(',')[0].trim()})`
        : 'Partly Cloudy',
    icon: getWeatherIcon(weatherData?.iconType),
    link: '/weather',
  };

  const cards = [
    weatherCard,
    {
      title: 'Market Prices',
      value: '₹25 / kg',
      detail: `Tomato (${marketLoc} APMC)`,
      icon: TrendingUp,
      link: '/market-prices',
    },
    {
      title: 'My Crops',
      value: registeredCropsCount,
      detail: 'Registered on farm',
      icon: Sprout,
      link: '/my-farm',
    },
    {
      title: 'Farming Alerts',
      value: '2 Alerts',
      detail: 'Require your attention',
      icon: Bell,
      link: '/notifications',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <NavLink
            key={card.title}
            to={card.link}
            className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-[#15803D] transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                {card.title}
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="my-3">
              <div className="text-2xl font-bold text-[#1F2937] group-hover:text-[#15803D] transition-colors">
                {card.value}
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">{card.detail}</p>
            </div>

            <div className="flex items-center text-xs font-medium text-[#15803D] group-hover:translate-x-0.5 transition-transform">
              <span>View details</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
          </NavLink>
        );
      })}
    </div>
  );
};

export default QuickOverviewCards;
