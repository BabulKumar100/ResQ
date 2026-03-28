'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSystemStore } from '@/store/systemStore';
import { formatDistanceToNow } from 'date-fns';

interface TacticalLayoutProps {
  children: React.ReactNode;
}

export const TacticalLayout: React.FC<TacticalLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { connectionStatus, uptime, notifications, unreadCount, markAllRead } = useSystemStore();
  const [criticals, setCriticals] = useState(3);
  const [showNotifs, setShowNotifs] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [mousePos, setMousePos] = useState({ lat: 34.0522, lng: -118.2437 });
  const notifRef = useRef<HTMLDivElement>(null);

  // Live critical count from local DB
  useEffect(() => {
    const fetchCriticals = async () => {
      try {
        const res = await fetch('/api/db/incidents?t=' + Date.now());
        if (res.ok) {
          const data = await res.json();
          const count = data.filter((i: any) => i.severity === 'critical' && i.status !== 'resolved').length;
          setCriticals(count);
        }
      } catch { }
    };
    fetchCriticals();
    const int = setInterval(fetchCriticals, 5000);
    return () => clearInterval(int);
  }, []);

  // Global search
  useEffect(() => {
    if (!search || search.length < 2) { setSearchResults([]); return; }
    const doSearch = async () => {
      try {
        const [inc, surv, drones] = await Promise.all([
          fetch('/api/db/incidents').then(r => r.json()).catch(() => []),
          fetch('/api/db/survivors').then(r => r.json()).catch(() => []),
          fetch('/api/db/rescuers').then(r => r.json()).catch(() => []),
        ]);
        const q = search.toLowerCase();
        const results: any[] = [
          ...inc.filter((i: any) => i.type?.toLowerCase().includes(q) || i.address?.toLowerCase().includes(q)).slice(0, 3).map((i: any) => ({ ...i, _cat: 'INCIDENT', _url: '/resqmap' })),
          ...surv.filter((s: any) => s.name?.toLowerCase().includes(q) || s.qrCode?.toLowerCase().includes(q)).slice(0, 3).map((s: any) => ({ ...s, _cat: 'SURVIVOR', _url: '/survivors' })),
          ...drones.filter((d: any) => d.name?.toLowerCase().includes(q)).slice(0, 2).map((d: any) => ({ ...d, _cat: 'UNIT', _url: '/drones' })),
        ];
        setSearchResults(results);
      } catch { }
    };
    const t = setTimeout(doSearch, 300);
    return () => clearTimeout(t);
  }, [search]);

  // Close notifs on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItems = [
    { icon: 'public', label: 'Map', path: '/map' },
    { icon: 'grid_view', label: 'Dashboard', path: '/resqmap' },
    { icon: 'groups', label: 'Survivors', path: '/survivors' },
    { icon: 'flight', label: 'Drones', path: '/drones' },
    { icon: 'analytics', label: 'Predictions', path: '/predictions' },
    { icon: 'inventory_2', label: 'Inventory', path: '/inventory' },
    { icon: 'sos', label: 'SOS', path: '/sos' },
  ];

  const statusConfig = {
    online: { color: 'text-[#41ddc2]', bg: 'bg-[#41ddc2]/10 border-[#41ddc2]/30', text: 'SYSTEM NOMINAL', icon: 'wifi' },
    degraded: { color: 'text-orange-400', bg: 'bg-orange-900/20 border-orange-500/30', text: 'SYSTEM DEGRADED', icon: 'wifi_off' },
    offline: { color: 'text-red-400', bg: 'bg-red-900/20 border-red-500/30', text: 'SYSTEM CRITICAL', icon: 'signal_wifi_off' },
  };
  const status = statusConfig[connectionStatus];

  return (
    <div className="min-h-screen bg-[#080a0e] text-white overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top Navigation */}
      <nav className="fixed w-full top-0 z-50 flex items-center justify-between h-16 px-4 md:px-6 bg-[#0c0e13]/90 backdrop-blur-xl border-b border-[#41ddc2]/10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#41ddc2]/10 flex items-center justify-center border border-[#41ddc2]/30">
            <span className="material-symbols-outlined text-[#41ddc2] text-lg">location_on</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#41ddc2] tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>ResQMap</h1>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Command Center</div>
          </div>
        </div>

        {/* Center Badges */}
        <div className="hidden md:flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold font-mono ${criticals > 0 ? 'bg-red-900/20 border-red-500/40 text-red-400 animate-pulse' : 'bg-gray-900/20 border-gray-700 text-gray-500'}`}>
            <span className="material-symbols-outlined text-sm">error</span>
            {criticals} ACTIVE CRITICALS
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${status.bg} ${status.color} text-xs font-bold font-mono`}>
            <span className="material-symbols-outlined text-sm">{status.icon}</span>
            {status.text}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search assets, units..."
              className="bg-[#111318] border border-white/10 rounded-full px-9 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#41ddc2]/40 w-56 transition"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-[#111318] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                {searchResults.map((r, i) => (
                  <button key={i} onClick={() => { router.push(r._url); setSearch(''); setSearchResults([]); }} className="w-full text-left px-4 py-2.5 hover:bg-[#41ddc2]/10 flex items-center gap-3 border-b border-white/5 last:border-0">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${r._cat === 'INCIDENT' ? 'bg-red-900/30 text-red-400' : r._cat === 'SURVIVOR' ? 'bg-[#41ddc2]/10 text-[#41ddc2]' : 'bg-orange-900/30 text-orange-400'}`}>{r._cat}</span>
                    <span className="text-sm text-white truncate">{r.name || r.type || r.qrCode}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 text-gray-400 hover:text-[#41ddc2] transition">
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">{unreadCount}</span>
              )}
            </button>
            {showNotifs && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-[#111318] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                <div className="flex justify-between items-center p-3 border-b border-white/5">
                  <span className="text-xs font-bold font-mono text-white">NOTIFICATIONS</span>
                  <button onClick={markAllRead} className="text-[10px] text-[#41ddc2] hover:underline font-mono">MARK ALL READ</button>
                </div>
                {notifications.map(n => (
                  <div key={n.id} className={`p-3 border-b border-white/5 flex gap-3 ${!n.read ? 'bg-[#41ddc2]/5' : ''}`}>
                    <span className={`material-symbols-outlined text-[18px] mt-0.5 ${n.type === 'incident' ? 'text-red-400' : n.type === 'drone' ? 'text-orange-400' : 'text-[#41ddc2]'}`}>
                      {n.type === 'incident' ? 'warning' : n.type === 'drone' ? 'flight' : 'inventory'}
                    </span>
                    <div>
                      <p className="text-xs text-white">{n.message}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{formatDistanceToNow(n.timestamp, { addSuffix: true })}</p>
                    </div>
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-[#41ddc2] mt-1 shrink-0" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="w-9 h-9 rounded-full bg-[#41ddc2]/10 border border-[#41ddc2]/30 flex items-center justify-center cursor-pointer hover:bg-[#41ddc2]/20 transition" title="Operator Profile">
            <span className="material-symbols-outlined text-[#41ddc2] text-lg">shield_person</span>
          </div>
        </div>
      </nav>

      {/* Side Navigation */}
      <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-16 md:w-20 bg-[#0c0e13]/90 backdrop-blur flex flex-col items-center py-6 gap-6 border-r border-white/5 z-40">
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(`${item.path}/`);
          return (
            <Link key={item.path} href={item.path} title={item.label} className="group relative">
              <div className={`p-3 rounded-xl transition-all ${isActive ? 'bg-[#41ddc2]/15 text-[#41ddc2] border border-[#41ddc2]/30' : 'text-gray-500 hover:text-[#41ddc2] hover:bg-[#41ddc2]/5'}`}>
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
              </div>
              {isActive && <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#41ddc2] rounded-l-full" />}
              <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#111318] border border-white/10 text-white text-xs whitespace-nowrap rounded font-mono opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                {item.label}
              </div>
            </Link>
          );
        })}
      </aside>

      {/* Main Content */}
      <main className="ml-16 md:ml-20 mt-16 h-[calc(100vh-96px)] overflow-y-auto overflow-x-hidden relative no-scrollbar">
        {children}
      </main>

      {/* Footer Status Bar */}
      <footer className="fixed bottom-0 left-0 w-full h-8 bg-[#0c0e13]/95 border-t border-white/5 flex items-center justify-between px-4 md:px-6 text-[10px] text-gray-500 z-50 font-mono tracking-wider">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1 ${connectionStatus === 'online' ? 'text-[#41ddc2]' : connectionStatus === 'degraded' ? 'text-orange-400' : 'text-red-400'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            <span className="font-bold">{connectionStatus === 'online' ? 'DATA SYNC: LIVE' : connectionStatus === 'degraded' ? 'DATA SYNC: PENDING' : 'DATA SYNC: OFFLINE'}</span>
          </div>
          <span className="hidden sm:inline">UPTIME: {uptime || '0h 0m'}</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span>LAT: {mousePos.lat.toFixed(4)}° N | LNG: {mousePos.lng.toFixed(4)}° W</span>
          <span>GRID: ALPHA-7</span>
        </div>
        <div className="flex items-center gap-4">
          <span>ENCRYPTION: AES-256</span>
          <span className="text-[#41ddc2]">v2.1.0</span>
        </div>
      </footer>
    </div>
  );
};
