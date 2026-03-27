'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Users, MapPin, Heart, Radio } from 'lucide-react';
import { useDisasterStore } from '@/lib/store';
import { Navigation } from '@/components/Navigation';
import { DashboardAlerts } from '@/components/DashboardAlerts';

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const { socket, isConnected, incidents, sosAlerts, activeUsers, connect, disconnect } = useDisasterStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isConnected) {
      connect('user_123', 'John Doe', 'rescuer', [40.7128, -74.006]);
    }

    return () => {
      // Keep connection alive, only disconnect on unmount if needed
    };
  }, [isClient, isConnected, connect]);

  if (!isClient) return null;

  const stats = [
    {
      label: 'Active Incidents',
      value: incidents.length,
      icon: AlertCircle,
      color: 'bg-red-100 text-red-600',
    },
    {
      label: 'SOS Alerts',
      value: sosAlerts.length,
      icon: Heart,
      color: 'bg-pink-100 text-pink-600',
    },
    {
      label: 'Active Users',
      value: activeUsers.length,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Online Rescuers',
      value: activeUsers.filter((u) => u.type === 'rescuer').length,
      icon: Radio,
      color: 'bg-green-100 text-green-600',
    },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Emergency Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Real-time overview of active incidents and responders</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-xs sm:text-sm font-semibold text-gray-600">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg flex items-center justify-center mb-2 sm:mb-4 ${stat.color}`}>
                    <Icon className="w-5 sm:w-6 h-5 sm:h-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Interactive Alerts Panel */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mb-8">
          <DashboardAlerts />
        </section>

        {/* Active Incidents */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Active Incidents</h2>
          {incidents.length === 0 ? (
            <div className="p-6 sm:p-8 bg-white rounded-lg border border-gray-200 text-center">
              <p className="text-sm sm:text-base text-gray-500">No active incidents at this time</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{incident.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{incident.description}</p>
                    </div>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                      incident.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      incident.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {incident.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 overflow-x-auto">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Location: {incident.location[0].toFixed(2)}, {incident.location[1].toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SOS Alerts */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-8 sm:pb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">SOS Alerts</h2>
          {sosAlerts.length === 0 ? (
            <div className="p-6 sm:p-8 bg-white rounded-lg border border-gray-200 text-center">
              <p className="text-sm sm:text-base text-gray-500">No active SOS alerts</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {sosAlerts.map((alert) => (
                <div key={alert.id} className="p-4 sm:p-6 bg-pink-50 rounded-lg border border-pink-200">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-pink-900 flex items-center gap-2 truncate">
                        <Heart className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" /> SOS Alert
                      </h3>
                      <p className="text-xs sm:text-sm text-pink-700 mt-1 line-clamp-2">{alert.details}</p>
                    </div>
                    <span className="px-2 sm:px-3 py-1 bg-pink-200 text-pink-800 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0">
                      {alert.urgency.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-pink-700 overflow-x-auto">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{alert.location[0].toFixed(2)}, {alert.location[1].toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
