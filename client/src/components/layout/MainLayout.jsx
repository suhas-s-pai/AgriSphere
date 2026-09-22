import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

const MainLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f8] overflow-x-hidden">
      <Header
        onToggleMobileSidebar={toggleMobileSidebar}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />
      <div className="flex-1 flex overflow-hidden max-w-[1440px] w-full mx-auto">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={closeMobileSidebar}
        />
        <main className="flex-1 overflow-y-auto lg:overflow-y-auto p-2.5 sm:p-3 lg:p-3.5 space-y-3 lg:max-h-[calc(100vh-48px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
