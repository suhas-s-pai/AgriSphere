import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, Clock, Code, Database, Layout } from 'lucide-react';

const PlaceholderPage = ({
  title,
  subtitle,
  icon: IconComponent,
  category = 'Module Under Active Development',
  owner = 'Sharayu (Frontend) & Suhas (Backend)',
  features = [],
}) => {
  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            {IconComponent && (
              <div className="w-12 h-12 rounded-2xl bg-agri-50 text-agri-600 border border-agri-100 flex items-center justify-center shrink-0">
                <IconComponent className="w-6 h-6 stroke-[2.2]" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {title}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  {category}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>

          <NavLink
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors shrink-0 self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </NavLink>
        </div>

        {/* Development Owner Badge */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 pt-1">
          <div className="flex items-center gap-1.5">
            <Layout className="w-4 h-4 text-agri-600" />
            <span>Assigned Team Lead: <strong className="text-slate-800">{owner}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Status: <strong>Phase 2 Delivery Target</strong></span>
          </div>
        </div>
      </div>

      {/* Planned Module Features Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
          Planned Features for {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {features.length > 0 ? (
            features.map((feat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-agri-100 text-agri-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">{feat.name}</h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic col-span-2">
              Module APIs and database tables defined in database schema. Integration in progress.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;

