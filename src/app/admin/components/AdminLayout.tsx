'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Topbar */}
      <Topbar sidebarCollapsed={sidebarCollapsed} />

      {/* Main Content */}
      <main
        className={`pt-16 min-h-screen transition-all duration-300
          ${sidebarCollapsed ? 'pl-16' : 'pl-64'}
        `}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}