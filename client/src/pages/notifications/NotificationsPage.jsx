import React, { useState, useMemo, useEffect } from 'react';
import {
  Bell,
  CloudRain,
  TrendingUp,
  Landmark,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Check,
  Navigation,
  Globe,
  MapPin,
  Wind,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLocationContext } from '../../context/LocationContext.jsx';
import { getCommodityPrices } from '../../services/marketService.js';

const NotificationsPage = () => {
  const {
    weather,
    city,
    district,
    state,
    formattedName,
    isGps,
    isGlobal,
  } = useLocationContext();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [readIds, setReadIds] = useState(new Set());

  // Dynamically generate real-time alerts based on actual location, live Open-Meteo weather, and farm state
  const notifications = useMemo(() => {
    const list = [];
    const locName = formattedName || 'Your Region';

    // 1. Live Weather Alert from Open-Meteo
    if (weather) {
      const hasRain = weather.precipitationSum > 0 || weather.weatherCode >= 51;
      const highWind = weather.windSpeed > 18;

      if (hasRain) {
        list.push({
          id: 1,
          title: `Precipitation Advisory for ${locName}`,
          description: `Live weather reports ${weather.conditionText} (${weather.precipitationSum || '0.5'} mm rainfall). Postpone open field fertilizer broadcasts and ensure proper drainage channels in low-lying plots.`,
          time: 'Live Weather Update',
          category: 'Weather',
          icon: CloudRain,
          link: '/weather',
          actionText: 'Check Hourly Forecast',
        });
      } else if (highWind) {
        list.push({
          id: 1,
          title: `High Wind Spray Warning for ${locName}`,
          description: `Current wind velocity is ${weather.windSpeed} km/h at ${weather.temperature}°C. Spray drift risk is high. Delay pesticide/foliar applications until wind drops below 15 km/h.`,
          time: 'Live Weather Update',
          category: 'Weather',
          icon: Wind,
          link: '/weather',
          actionText: 'View Spray Window',
        });
      } else {
        list.push({
          id: 1,
          title: `Favorable Weather Window in ${locName}`,
          description: `Current conditions: ${weather.temperature}°C, ${weather.conditionText}, Wind ${weather.windSpeed} km/h. Optimum conditions for farm operations, intercultural weeding, and drip fertigation.`,
          time: 'Live Weather Update',
          category: 'Weather',
          icon: CloudRain,
          link: '/weather',
          actionText: 'View Weather Forecast',
        });
      }
    }

    // 2. Real APMC Market Price Alert
    const marketRates = getCommodityPrices({ state, district });
    if (marketRates && marketRates.length > 0) {
      const topCrop = marketRates[0];
      list.push({
        id: 2,
        title: `${topCrop.crop} Price Discovery (${topCrop.marketName})`,
        description: `Modal rate recorded at ${topCrop.modalPrice} (${topCrop.perKg}). Range: ${topCrop.minMax}. Reported arrivals: ${topCrop.arrivals} with ${topCrop.change} weekly change.`,
        time: `Reported ${topCrop.date}`,
        category: 'Market',
        icon: TrendingUp,
        link: '/market-prices',
        actionText: 'View APMC Mandi Rates',
      });
    }

    // 3. Registered Farm Notification
    let farmInfo = null;
    try {
      const savedFarm = localStorage.getItem('agrisphere_registered_farm_v1');
      if (savedFarm) farmInfo = JSON.parse(savedFarm);
    } catch (e) {
      // ignore
    }

    if (farmInfo && farmInfo.plots && farmInfo.plots.length > 0) {
      const p1 = farmInfo.plots[0];
      list.push({
        id: 3,
        title: `Crop Management for ${p1.name} (${p1.crop})`,
        description: `Plot ${p1.name} (${p1.area} Acres in ${farmInfo.village || locName}) is scheduled for soil moisture monitoring and stage-specific nutrient inspection.`,
        time: 'Farm Schedule',
        category: 'Farm Tasks',
        icon: Calendar,
        link: '/my-farm',
        actionText: 'Open My Farm',
      });
    } else {
      list.push({
        id: 3,
        title: 'Register Your Farm Property',
        description: `Set your verified survey number, acreage, and crop plots in ${locName} to activate tailored irrigation schedules and plot-level tracking.`,
        time: 'Setup Recommendation',
        category: 'Farm Tasks',
        icon: Calendar,
        link: '/my-farm',
        actionText: 'Configure Farm',
      });
    }

    // 4. Government Scheme Alert for State
    list.push({
      id: 4,
      title: `Central & ${state || 'State'} Agricultural Schemes Active`,
      description: `PM-KISAN installment verification and PMKSY Micro-Irrigation drip subsidies (up to 90%) are active for registered landholders in ${state || 'your state'}.`,
      time: 'Official Portal Notice',
      category: 'Government Schemes',
      icon: Landmark,
      link: '/government-schemes',
      actionText: 'Check Eligibility & Apply',
    });

    // 5. Preventive Pathology Advisory
    list.push({
      id: 5,
      title: 'Preventive Pathology Scout: Early Blight & FAW',
      description: 'Morning relative humidity creates conditions for Alternaria leaf spot on solanaceous crops and Fall Armyworm on maize shoots. Inspect lower leaves for concentric rings.',
      time: 'Agronomic Advisory',
      category: 'Farm Tasks',
      icon: AlertTriangle,
      link: '/diseases-pests',
      actionText: 'View Treatment Protocols',
    });

    return list;
  }, [weather, formattedName, state]);

  const categories = ['All', 'Weather', 'Market', 'Government Schemes', 'Farm Tasks'];

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      return selectedCategory === 'All' || item.category === selectedCategory;
    });
  }, [notifications, selectedCategory]);

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const markAllAsRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const toggleReadStatus = (id) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Real-Time Agronomic & Advisory Alerts</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Notifications</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Dynamic alerts triggered by live weather thresholds, active APMC market rates, and your farm properties in{' '}
            <span className="font-semibold text-slate-800">{formattedName}</span>.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shrink-0 self-start sm:self-auto"
          >
            <Check className="w-3.5 h-3.5 text-[#15803D]" />
            <span>Mark all as read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#15803D] text-white shadow-2xs'
                : 'bg-white text-[#64748B] hover:text-[#1F2937] border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((item) => {
          const isRead = readIds.has(item.id);
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`rounded-xl border p-5 transition-all flex flex-col sm:flex-row items-start justify-between gap-4 ${
                isRead
                  ? 'bg-white border-slate-200 opacity-80'
                  : 'bg-white border-slate-200 shadow-2xs hover:border-[#15803D]'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    item.category === 'Weather'
                      ? 'bg-blue-50 text-blue-600'
                      : item.category === 'Market'
                      ? 'bg-emerald-50 text-emerald-600'
                      : item.category === 'Government Schemes'
                      ? 'bg-purple-50 text-purple-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400">• {item.time}</span>
                    {!isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Unread" />
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-[#1F2937]">{item.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed max-w-2xl">
                    {item.description}
                  </p>

                  <div className="pt-2 flex items-center gap-4">
                    <NavLink
                      to={item.link}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#15803D] hover:underline"
                    >
                      <span>{item.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </NavLink>

                    <button
                      onClick={() => toggleReadStatus(item.id)}
                      className="text-[11px] text-slate-400 hover:text-slate-700"
                    >
                      {isRead ? 'Mark as unread' : 'Mark as read'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredNotifications.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-[#64748B]">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#1F2937]">All caught up!</p>
            <p className="text-xs text-slate-400 mt-1">No alerts under {selectedCategory} category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
