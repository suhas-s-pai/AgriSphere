import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const initialNotifications = [
  {
    id: 1,
    title: 'Pre-Monsoon Rain Shower Forecast for Belagavi District',
    description: 'Light to moderate rainfall (15-25 mm) forecasted across Chikodi and Gokak taluks on Thursday. Complete field drying of harvested grains immediately.',
    time: '2 hours ago',
    category: 'Weather',
    icon: CloudRain,
    isUnread: true,
    link: '/weather',
    actionText: 'View Weather Details',
  },
  {
    id: 2,
    title: 'Tomato APMC Belagavi Price Surge (+12.5%)',
    description: 'Tomato modal price reached ₹2,500/quintal (₹25/kg) due to strong outbound demand from Goa and Maharashtra markets.',
    time: '5 hours ago',
    category: 'Market',
    icon: TrendingUp,
    isUnread: true,
    link: '/market-prices',
    actionText: 'Check APMC Rates',
  },
  {
    id: 3,
    title: 'PMKSY Micro-Irrigation Drip Subsidy Portal Open',
    description: 'Karnataka Dept. of Agriculture opened the 2026-27 application window. Small and marginal farmers eligible for up to 90% subsidy on drip units.',
    time: '1 day ago',
    category: 'Government Schemes',
    icon: Landmark,
    isUnread: true,
    link: '/government-schemes',
    actionText: 'Read Scheme Guidelines',
  },
  {
    id: 4,
    title: 'Preventive Spray Advisory for Early Blight in Tomato',
    description: 'Humid morning conditions favor Alternaria solani spread. Inspect lower foliage for concentric brown rings. Apply recommended Mancozeb spray.',
    time: '2 days ago',
    category: 'Farm Tasks',
    icon: AlertTriangle,
    isUnread: false,
    link: '/diseases-pests',
    actionText: 'View Treatment Guide',
  },
  {
    id: 5,
    title: 'Scheduled Irrigation for North Field Plot A (Maize)',
    description: 'Plot A is entering day 48 (vegetative knee-high growth stage). Ensure 3-hour drip cycle to prevent moisture stress.',
    time: '3 days ago',
    category: 'Farm Tasks',
    icon: Calendar,
    isUnread: false,
    link: '/my-farm',
    actionText: 'Open My Farm',
  },
];

const categories = ['All', 'Weather', 'Market', 'Government Schemes', 'Farm Tasks'];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      return selectedCategory === 'All' || item.category === selectedCategory;
    });
  }, [notifications, selectedCategory]);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isUnread: false })));
  };

  const toggleReadStatus = (id) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, isUnread: !n.isUnread } : n
      )
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-[#DCFCE7] px-2.5 py-1 rounded-md mb-2">
            <Bell className="w-3.5 h-3.5" />
            <span>Advisories & Alerts Inbox</span>
          </div>
          <h1 className="text-2xl font-bold text-[#14532D]">Notifications</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Real-time agricultural updates, severe weather advisories, mandi price shifts, and government scheme reminders.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-[#F8FAF6] hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors self-start sm:self-auto"
          >
            <Check className="w-3.5 h-3.5 text-[#15803D]" />
            <span>Mark All as Read ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#15803D] text-white'
                : 'bg-[#F8FAF6] text-[#64748B] hover:text-[#1F2937] border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`rounded-xl border p-4.5 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                item.isUnread
                  ? 'bg-white border-[#15803D]/40 shadow-xs'
                  : 'bg-white/70 border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="text-xs text-[#64748B]">{item.time}</span>
                    {item.isUnread && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-[#1F2937]">{item.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed max-w-xl">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                <button
                  onClick={() => toggleReadStatus(item.id)}
                  className="text-[11px] text-slate-400 hover:text-slate-700"
                >
                  {item.isUnread ? 'Mark read' : 'Mark unread'}
                </button>

                <NavLink
                  to={item.link}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F8FAF6] hover:bg-[#DCFCE7] text-[#15803D] text-xs font-semibold border border-slate-200 transition-colors"
                >
                  <span>{item.actionText}</span>
                  <ArrowRight className="w-3 h-3" />
                </NavLink>
              </div>
            </div>
          );
        })}

        {filteredNotifications.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-[#64748B]">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#1F2937]">No notifications in this category</p>
            <p className="text-xs text-slate-400 mt-1">You are up to date with all farming advisories.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
