'use client'

import { Navigation } from '@/components/Navigation'
import { useState } from 'react'
import { Search, MapPin, Phone, Clock, Star } from 'lucide-react'
import Link from 'next/link'

interface Service {
  id: number
  name: string
  type: 'hospital' | 'police' | 'fire' | 'pharmacy' | 'shelter'
  address: string
  phone: string
  hours: string
  rating: number
  distance: number
  image?: string
}

export default function DirectoryPage() {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance')

  const services: Service[] = [
    {
      id: 1,
      name: 'Central Hospital',
      type: 'hospital',
      address: '123 Health Ave, Downtown',
      phone: '(555) 123-4567',
      hours: '24/7',
      rating: 4.8,
      distance: 0.8,
    },
    {
      id: 2,
      name: 'City General Hospital',
      type: 'hospital',
      address: '456 Medical Blvd',
      phone: '(555) 234-5678',
      hours: '24/7',
      rating: 4.6,
      distance: 2.3,
    },
    {
      id: 3,
      name: 'Main Police Station',
      type: 'police',
      address: '789 Law Street',
      phone: '911 or (555) 345-6789',
      hours: '24/7',
      rating: 4.4,
      distance: 1.2,
    },
    {
      id: 4,
      name: 'Downtown Fire Department',
      type: 'fire',
      address: '321 Safety Boulevard',
      phone: '911 or (555) 456-7890',
      hours: '24/7',
      rating: 4.7,
      distance: 1.5,
    },
    {
      id: 5,
      name: '24/7 Pharmacy Plus',
      type: 'pharmacy',
      address: '111 Drug Street',
      phone: '(555) 567-8901',
      hours: '24/7',
      rating: 4.5,
      distance: 0.3,
    },
    {
      id: 6,
      name: 'Community Emergency Shelter',
      type: 'shelter',
      address: '222 Safe Way',
      phone: '(555) 678-9012',
      hours: '6:00 PM - 8:00 AM',
      rating: 4.2,
      distance: 2.1,
    },
    {
      id: 7,
      name: 'Westside Pharmacy',
      type: 'pharmacy',
      address: '555 Pharmacy Lane',
      phone: '(555) 789-0123',
      hours: '8:00 AM - 10:00 PM',
      rating: 4.3,
      distance: 1.8,
    },
    {
      id: 8,
      name: 'North Police Station',
      type: 'police',
      address: '888 North Law Blvd',
      phone: '911 or (555) 890-1234',
      hours: '24/7',
      rating: 4.5,
      distance: 3.2,
    },
  ]

  const typeColors: Record<string, string> = {
    hospital: 'bg-red-100 text-red-700 border-red-300',
    police: 'bg-blue-100 text-blue-700 border-blue-300',
    fire: 'bg-orange-100 text-orange-700 border-orange-300',
    pharmacy: 'bg-green-100 text-green-700 border-green-300',
    shelter: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  }

  let filtered = services
  if (selectedType !== 'all') {
    filtered = filtered.filter(s => s.type === selectedType)
  }
  if (searchQuery) {
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  if (sortBy === 'distance') {
    filtered.sort((a, b) => a.distance - b.distance)
  } else {
    filtered.sort((a, b) => b.rating - a.rating)
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Directory</h1>
          <p className="text-lg text-gray-600">Find hospitals, police stations, pharmacies, and shelters near you</p>
        </section>

        {/* Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-lg shadow-lg mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Service Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Services</option>
                <option value="hospital">Hospitals</option>
                <option value="police">Police</option>
                <option value="fire">Fire Department</option>
                <option value="pharmacy">Pharmacies</option>
                <option value="shelter">Shelters</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="distance">Closest First</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-4">Found {filtered.length} service(s)</p>
        </section>

        {/* Services Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition border border-gray-200 overflow-hidden hover:border-gray-300 group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 flex-1 group-hover:text-red-600 transition">
                      {service.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${typeColors[service.type]}`}>
                      {service.type.charAt(0).toUpperCase() + service.type.slice(1)}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="flex gap-2 text-sm text-gray-600 mb-3 group-hover:text-gray-900 transition">
                    <MapPin className="w-4 h-4 flex-shrink-0 text-red-500" />
                    <p>{service.address}</p>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-2 text-sm text-gray-600 mb-3 group-hover:text-gray-900 transition">
                    <Phone className="w-4 h-4 flex-shrink-0 text-blue-500" />
                    <p>{service.phone}</p>
                  </div>

                  {/* Hours */}
                  <div className="flex gap-2 text-sm text-gray-600 mb-4 group-hover:text-gray-900 transition">
                    <Clock className="w-4 h-4 flex-shrink-0 text-green-500" />
                    <p>{service.hours}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(service.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{service.rating}</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                      {service.distance} km
                    </span>
                  </div>

                  <button className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold">
                    Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No services found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedType('all')
                }}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <p>&copy; 2024 ResQMap. Founded by Pawan Singh.</p>
              <div className="flex gap-6 text-sm">
                <Link href="/" className="hover:text-white transition">Home</Link>
                <Link href="/about" className="hover:text-white transition">About</Link>
                <Link href="#" className="hover:text-white transition">Privacy</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
