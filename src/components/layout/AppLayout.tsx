'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  setIsCollapsed: () => {},
  toggleSidebar: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Automatically collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  // If on login page, don't show admin sidebar/header
  if (pathname === '/login') {
    return <div className="min-h-screen bg-slate-900">{children}</div>;
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, toggleSidebar }}>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex w-full overflow-x-hidden">
        {/* Collapsible Sidebar */}
        <Sidebar />

        {/* Main Application Area (expands 100% full width with no side gaps) */}
        <div className="flex-1 flex flex-col min-h-screen min-w-0 w-full transition-all duration-300">
          <Header />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full min-w-0">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
