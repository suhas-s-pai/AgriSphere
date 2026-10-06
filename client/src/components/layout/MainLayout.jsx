import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#f7f8f5] text-slate-800 overflow-x-hidden">
      <Header />
      <main className="w-full">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-extrabold text-slate-900">
                Agri<span className="text-agri-600">Sphere</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Better information. Brighter harvests.
              </p>
            </div>
            <p className="text-xs text-slate-400">
              Agriculture information, tools and resources in one place.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
