'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TacticalLayoutProps {
  children: React.ReactNode;
}

export const TacticalLayout: React.FC<TacticalLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const navItems = [
    { icon: 'public', label: 'Map', path: '/map' },
    { icon: 'grid_view', label: 'Dashboard', path: '/resqmap' },
    { icon: 'groups', label: 'Survivors', path: '/survivors' },
    { icon: 'flight', label: 'Drones', path: '/drones' },
    { icon: 'analytics', label: 'Predictions', path: '/predictions' },
    { icon: 'inventory_2', label: 'Inventory', path: '/inventory' },
    { icon: 'sos', label: 'SOS', path: '/sos' },
  ];

  return (
    <div className="min-h-screen bg-surface-dim font-body text-on-surface overflow-hidden">
      {/* Top Navigation */}
      <nav className="fixed w-full top-0 z-50 flex items-center justify-between h-16 px-6 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_0_12px_2px_rgba(92,242,214,0.1)] border-b border-on-tertiary-container/20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary-container/50 pulse-teal">
              <span className="material-symbols-outlined text-primary-container">location_on</span>
            </div>
            <div>
              <h1 className="text-xl font-headline font-bold text-primary-tactical tracking-wider">ResQMap</h1>
              <div className="text-[10px] text-primary-fixed-dim uppercase tracking-widest font-mono">Command Center</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8 hidden md:flex">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-error-container/20 border border-error-container/50 text-error-tactical">
            <span className="material-symbols-outlined text-sm pulse-red">error</span>
            <span className="text-xs font-bold font-mono">3 ACTIVE CRITICALS</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-tertiary-container/20 border border-tertiary-container/50 text-tertiary">
            <span className="material-symbols-outlined text-sm">wifi</span>
            <span className="text-xs font-bold font-mono">SYSTEM NOMINAL</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative group hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-sm">search</span>
            <input 
              type="text" 
              placeholder="Search assets, units..." 
              className="bg-surface-container-high/50 border border-outline-variant/30 rounded-full px-10 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container/50 w-64 transition-all"
            />
          </div>
          <button className="relative p-2 text-outline hover:text-primary-tactical transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error-tactical animate-pulse"></span>
          </button>
          <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center border-2 border-primary-tactical/30">
            <span className="material-symbols-outlined text-surface-dim">shield_person</span>
          </div>
        </div>
      </nav>

      {/* Side Navigation */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-20 bg-surface-container-lowest/90 backdrop-blur-md flex flex-col items-center py-6 gap-8 border-r border-on-tertiary/30 z-40 hidden sm:flex">
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(`${item.path}/`);
          return (
            <Link key={item.path} href={item.path} title={item.label} className="group relative list-none">
              <div className={`p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary-container/20 text-primary-tactical border border-primary-container/30 glow-blue' : 'text-outline hover:text-primary-tactical hover:bg-surface-container-high'}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              {isActive && (
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-tactical rounded-l-full"></div>
              )}
              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1 bg-surface-container-high text-on-surface text-xs whitespace-nowrap rounded font-mono opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-outline-variant z-50">
                {item.label}
              </div>
            </Link>
          );
        })}
      </aside>

      {/* Main Content Area */}
      {/* Subtracting nav height (64px) and footer height (32px) */}
      <main className="ml-0 sm:ml-20 mt-16 h-[calc(100vh-64px-32px)] overflow-y-auto overflow-x-hidden relative scroll-smooth no-scrollbar">
        {children}
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-0 w-full h-8 bg-surface-container-lowest border-t border-on-tertiary/50 flex flex-wrap justify-between items-center px-4 md:px-6 text-[10px] text-outline z-50 font-mono tracking-wider">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-error-tactical animate-pulse"></span>
            <span className="text-error-tactical font-bold">OFFLINE ACTIVE</span>
          </div>
          <span className="hidden sm:inline">DATA SYNC: PENDING</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span>LAT: 34.0522° N | LNG: 118.2437° W</span>
          <span>GRID: ALPHA-7</span>
        </div>
        <div className="flex items-center gap-4">
          <span>ENCRYPTION: AES-256</span>
          <span className="text-primary-fixed-dim">V 2.1.0</span>
        </div>
      </footer>
    </div>
  );
};
