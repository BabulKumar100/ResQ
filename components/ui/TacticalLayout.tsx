'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSystemStore, Notification } from '@/store/systemStore';
import { useAuthStore } from '@/store/authStore';
import { formatDistanceToNow } from 'date-fns';
import { DisasterSearch } from '@/components/DisasterSearch';
import { Menu, X, Bell, Shield, LogOut, ChevronRight, Activity, Globe, Map as MapIcon, Layers, Radio, Users2, Plane, BrainCircuit, PackageCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TacticalLayoutProps {
  children: React.ReactNode;
}

export const TacticalLayout: React.FC<TacticalLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { connectionStatus, uptime, notifications, unreadCount, markAllRead } = useSystemStore();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Constants for Dashboard layout (Mobile Responsive Fix 8)
  const navItems = [
    { icon: <MapIcon className="w-5 h-5"/>, label: 'Tactical Map', path: '/map', roles: ['admin', 'dispatcher', 'rescuer', 'viewer'] },
    { icon: <Activity className="w-5 h-5"/>, label: 'Analytics', path: '/resqmap', roles: ['admin', 'dispatcher'] },
    { icon: <Globe className="w-5 h-5"/>, label: 'India Portal', path: '/', roles: ['admin', 'dispatcher', 'rescuer', 'viewer'] },
    { icon: <Layers className="w-5 h-5"/>, label: 'Command Center', path: '/command-center', roles: ['admin', 'dispatcher'] },
    { icon: <Radio className="w-5 h-5"/>, label: 'SOS Hub', path: '/sos', roles: ['admin', 'dispatcher', 'rescuer'] },
    { icon: <Users2 className="w-5 h-5"/>, label: 'Survivors', path: '/survivors', roles: ['admin', 'dispatcher', 'rescuer'] },
    { icon: <Plane className="w-5 h-5"/>, label: 'Drone Ops', path: '/drones', roles: ['admin', 'dispatcher'] },
    { icon: <BrainCircuit className="w-5 h-5"/>, label: 'AI Prediction', path: '/prediction', roles: ['admin', 'dispatcher'] },
    { icon: <PackageCheck className="w-5 h-5"/>, label: 'Resources', path: '/resources', roles: ['admin', 'dispatcher'] },
  ].filter(item => !user || item.roles.includes(user.role));

  const statusConfig = {
    online: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'SYNC ACTIVE', pulse: 'bg-emerald-500' },
    degraded: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', text: 'SYNC DELAYED', pulse: 'bg-amber-500' },
    offline: { color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', text: 'OFFLINE MODE', pulse: 'bg-rose-500' },
  };
  const status = statusConfig[connectionStatus || 'online'];

  return (
    <div className="min-h-screen bg-[#06080c] text-slate-200 selection:bg-rose-500/30">
      
      {/* Upper Command Header */}
      <header className="fixed top-0 w-full h-16 bg-[#0a0c12]/80 backdrop-blur-xl border-b border-white/5 z-[100] px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             className="p-2 hover:bg-white/5 rounded-lg transition-colors md:hidden"
           >
             {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
           </button>
           
           <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-lg shadow-rose-900/20 group-hover:scale-105 transition-transform">
                 <Shield className="w-5 h-5 text-white fill-current" />
              </div>
              <div className="hidden sm:block">
                 <h1 className="text-lg font-black tracking-tighter text-white uppercase italic">ResQMap</h1>
                 <div className="text-[9px] font-bold text-rose-500/70 uppercase tracking-[0.2em] -mt-1 font-mono">Operations Command</div>
              </div>
           </Link>
        </div>

        {/* Tactical Search (Fix 2) */}
        <div className="hidden md:block flex-1 max-w-xl mx-8">
           <DisasterSearch />
        </div>

        <div className="flex items-center gap-3">
           {/* Status Hub */}
           <div className={`hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-full border ${status.bg} ${status.color} text-[10px] font-black font-mono tracking-widest`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.pulse} animate-pulse`} />
              {status.text}
           </div>

           {/* Notification Center */}
           <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifs(!showNotifs)}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors relative"
              >
                 <Bell className="w-5 h-5" />
                 {unreadCount > 0 && (
                   <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                 )}
              </button>

              <AnimatePresence>
                {showNotifs && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-3 w-80 bg-gray-950/95 border border-gray-800 rounded-2xl shadow-3xl overflow-hidden backdrop-blur-2xl z-[150]"
                  >
                     <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-white/5">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Tactical Intel</span>
                        <button onClick={markAllRead} className="text-[10px] font-bold text-rose-500 hover:text-rose-400">CLEAR ALL</button>
                     </div>
                     <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="p-12 text-center text-gray-500 text-xs font-bold uppercase tracking-widest opacity-30">No active intel</div>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.id} className={`p-4 border-b border-gray-900 group hover:bg-white/5 transition-colors ${!n.read ? 'bg-rose-500/5' : ''}`}>
                               <div className="flex justify-between items-start mb-1">
                                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                                    n.urgency === 'critical' ? 'bg-rose-500 text-white' : 'bg-gray-800 text-gray-300'
                                  }`}>
                                    {n.type?.toUpperCase() || 'INFO'}
                                  </span>
                                  <span className="text-[9px] font-medium text-gray-600 font-mono italic">
                                     {formatDistanceToNow(n.timestamp)} ago
                                  </span>
                               </div>
                               <p className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors leading-relaxed">{n.message}</p>
                            </div>
                          ))
                        )}
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           {/* User Control */}
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-white/5 p-0.5 bg-gradient-to-tr from-gray-800 to-gray-700 pointer-events-none">
                 <img src={user?.photoURL || '/avatar.png'} alt="" className="w-full h-full rounded-full object-cover" />
              </div>
           </div>
        </div>
      </header>

      {/* Main Framework */}
      <div className="pt-16 flex h-screen overflow-hidden">
         
         {/* Sidebar Navigation (Fix 8) */}
         <aside className={`fixed md:relative md:flex h-full w-72 bg-[#080a0e] border-r border-white/5 flex-col z-[90] transition-transform duration-300 ease-in-out ${
           isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
         }`}>
            <div className="p-6 flex-1 space-y-8 overflow-y-auto">
               
               <div className="space-y-2">
                  <h4 className="px-3 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Tactical Grid</h4>
                  <nav className="space-y-1">
                     {navItems.map((item) => (
                       <Link 
                         key={item.path}
                         href={item.path}
                         onClick={() => setIsSidebarOpen(false)}
                         className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden group ${
                           pathname === item.path ? 'bg-rose-600 text-white shadow-xl shadow-rose-900/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'
                         }`}
                       >
                          {item.icon}
                          <span>{item.label}</span>
                          {pathname === item.path && (
                            <motion.div layoutId="nav-glow" className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full" />
                          )}
                       </Link>
                     ))}
                  </nav>
               </div>

               {/* Map Caching Control (Fix 6 Interface) */}
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                     <div className="p-1.5 bg-rose-500/20 rounded-lg text-rose-500"><Download className="w-4 h-4"/></div>
                     <span className="text-xs font-black uppercase tracking-widest text-white">Offline Access</span>
                  </div>
                  <button 
                    onClick={() => { (window as any).downloadIndiaRegion?.(); }}
                    className="w-full py-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg text-[9px] font-bold text-gray-400 uppercase tracking-widest transition-all"
                  >
                     Cache India Map Data
                  </button>
                  <p className="text-[8px] text-gray-600 mt-2 text-center uppercase font-bold">~50MB Regional Index</p>
               </div>

            </div>

            {/* Logout Footer */}
            <div className="p-6 border-t border-white/5">
               <button 
                 onClick={logout}
                 className="flex items-center gap-3 px-4 py-3 w-full bg-gray-950 hover:bg-rose-950/20 hover:text-rose-400 border border-white/5 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-gray-500 group"
               >
                  <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Operator Sign-out
               </button>
            </div>
         </aside>

         {/* Content Engine */}
         <main className="flex-1 relative h-full overflow-hidden">
            <AnimatePresence mode="wait">
               <motion.div
                 key={pathname}
                 initial={{ opacity: 0, y: 5 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -5 }}
                 className="h-full w-full"
               >
                  {children}
               </motion.div>
            </AnimatePresence>
         </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 99px; }
      `}</style>
    </div>
  );
};

import { Download } from 'lucide-react';
