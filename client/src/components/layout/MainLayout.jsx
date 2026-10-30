import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

const MainLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAF6] text-[#1F2937] antialiased">
      {/* Fixed Left Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#F8FAF6]">
          <Outlet />

          {/* Simple Clean Footer */}
          <footer className="border-t border-slate-200 bg-white py-6 px-4 sm:px-6 lg:px-8 mt-12">
            <div className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#64748B] max-w-7xl">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#14532D]">AgriSphere</span>
                <span>•</span>
                <span>Smart Agriculture Platform</span>
              </div>
              <p className="text-[#64748B]">
                Belagavi, Karnataka
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
