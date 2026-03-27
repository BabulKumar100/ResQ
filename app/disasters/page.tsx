'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, MapPin, Users, Clock, TrendingUp } from 'lucide-react';
import { useDisasterStore } from '@/lib/store';
import Navigation from '@/components/Navigation';

export default function DisastersPage() {
  const [isClient, setIsClient] = useState(false);
  const { isConnected, incidents, connect } = useDisasterStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isConnected) {
      connect('user_456', 'Sarah Admin', 'rescuer', [40.7128, -74.006]);
    }
  }, [isClient, isConnected, connect]);

  if (!isClient) return null;

  const severityColors = {
    critical: 'bg-red-100 text-red-800 border-red-300',
    high: 'bg-orange-100 text-orange-800 border-orange-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  const severityBadgeColors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Disaster Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Real-time disaster tracking and safe zone information</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <span className="text-xs sm:text-sm font-semibold text-gray-600">{isConnected ? 'Live' : 'Offline'}</span>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600">Active Incidents</h3>
                <TrendingUp className="w-5 h-5 text-red-500 flex-shrink-0" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{incidents.length}</p>
              <p className="text-xs text-gray-500 mt-1 sm:mt-2">Requiring immediate attention</p>
            </div>

            <div className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600">Critical Cases</h3>
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {incidents.filter((i) => i.severity === 'critical').length}
              </p>
              <p className="text-xs text-gray-500 mt-1 sm:mt-2">Highest priority incidents</p>
            </div>

            <div className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-600">Affected Areas</h3>
                <MapPin className="w-5 h-5 text-green-500 flex-shrink-0" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {new Set(incidents.flatMap((i) => i.affectedAreas?.map((a) => a.name))).size}
              </p>
              <p className="text-xs text-gray-500 mt-1 sm:mt-2">Distinct zones impacted</p>
            </div>
          </div>
        </section>

        {/* Active Incidents */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Incidents</h2>
          {incidents.length === 0 ? (
            <div className="p-8 bg-white rounded-lg border border-gray-200 text-center">
              <p className="text-gray-500">No active incidents at this time</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  className={`p-6 rounded-lg border transition-all hover:shadow-lg ${
                    severityColors[incident.severity as keyof typeof severityColors]
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-3 h-3 rounded-full mt-1 ${
                          severityBadgeColors[incident.severity as keyof typeof severityBadgeColors]
                        }`}
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{incident.title}</h3>
                        <p className="text-sm mt-1 opacity-75">{incident.description}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-white bg-opacity-50 rounded-full text-xs font-semibold whitespace-nowrap ml-4">
                      {incident.severity.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>Location: {incident.location[0].toFixed(2)}, {incident.location[1].toFixed(2)}</span>
                    </div>
                    {incident.affectedAreas && incident.affectedAreas.length > 0 && (
                      <div className="flex items-start gap-2 text-sm">
                        <Users className="w-4 h-4 mt-0.5" />
                        <div>
                          <p className="font-semibold">Affected Areas:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {incident.affectedAreas.map((area, idx) => (
                              <span key={idx} className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs">
                                {area.name} ({area.radius} m radius)
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(incident.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button className="mt-4 w-full px-4 py-2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-lg font-semibold transition">
                    View Details & Resources
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Safe Zones */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Safe Zones</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: 'Central Park North',
                distance: 1.2,
                capacity: 5000,
                facilities: ['Medical', 'Shelter', 'Water'],
              },
              {
                name: 'Madison Square Garden Area',
                distance: 2.3,
                capacity: 8000,
                facilities: ['Medical', 'Shelter', 'Food'],
              },
              {
                name: 'Riverside Park',
                distance: 3.1,
                capacity: 3000,
                facilities: ['Shelter', 'Water'],
              },
              {
                name: 'Tompkins Square Park',
                distance: 1.8,
                capacity: 2000,
                facilities: ['Medical', 'Water'],
              },
            ].map((zone, idx) => (
              <div key={idx} className="p-6 bg-white rounded-lg border border-green-200 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{zone.name}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>Distance: {zone.distance} km</p>
                  <p>Capacity: {zone.capacity.toLocaleString()} people</p>
                  <div className="flex flex-wrap gap-2">
                    {zone.facilities.map((facility) => (
                      <span key={facility} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold">
                  Navigate to Safe Zone
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
