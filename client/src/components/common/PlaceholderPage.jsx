import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Clock, Layout, CheckCircle2 } from 'lucide-react';

const PlaceholderPage = ({
  title,
  subtitle,
  icon: IconComponent,
  category = 'Module Under Active Development',
  owner = 'Sharayu (Frontend) & Suhas (Backend)',
  features = [],
}) => (
  <div className="min-h-[70vh] pb-16">
    <section className="bg-agri-800 text-white">
      <div className="website-section py-14 sm:py-16 lg:py-20">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            {IconComponent && (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                <IconComponent className="h-6 w-6" />
              </div>
            )}
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-agri-100">
              {category}
            </span>
          </div>
          <h1 className="mt-7 text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-agri-100 sm:text-base sm:leading-7">{subtitle}</p>
        </div>
      </div>
    </section>

    <section className="website-section py-12 sm:py-14 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-agri-600">What this module covers</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Planned features</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {features.map((feat, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_25px_rgba(15,23,42,0.04)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-agri-50 text-sm font-black text-agri-700">{idx + 1}</div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{feat.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{feat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_25px_rgba(15,23,42,0.04)] lg:sticky lg:top-28">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">Module details</p>
          <div className="mt-5 space-y-5">
            <div className="flex gap-3">
              <Layout className="mt-0.5 h-5 w-5 text-agri-600" />
              <div><p className="text-xs font-bold text-slate-400">Team</p><p className="mt-1 text-sm font-extrabold text-slate-800">{owner}</p></div>
            </div>
            <div className="flex gap-3">
              <Clock className="mt-0.5 h-5 w-5 text-amber-500" />
              <div><p className="text-xs font-bold text-slate-400">Status</p><p className="mt-1 text-sm font-extrabold text-slate-800">Phase 2 Delivery Target</p></div>
            </div>
            <div className="rounded-xl bg-agri-50 p-4">
              <div className="flex gap-2 text-sm font-bold text-agri-800"><CheckCircle2 className="h-4 w-4 shrink-0" /> APIs and database structure are prepared for integration.</div>
            </div>
          </div>
          <NavLink to="/" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-agri-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-agri-700">
            Back to AgriSphere <ArrowRight className="h-4 w-4" />
          </NavLink>
        </aside>
      </div>
    </section>
  </div>
);

export default PlaceholderPage;
