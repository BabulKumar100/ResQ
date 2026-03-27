'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/Navigation'
import { MapPin, Phone, Clock, Users, Search } from 'lucide-react'

interface LocalResource {
  id: number
  type: string
  name: string
  address: string
  phone: string
  distance: number
  hours: string
  beds: number | null
  lat: number
  lng: number
}

// Mock resources data
const mockResources: LocalResource[] = [
  {
    id: 1,
    type: 'Hospital',
    name: 'City General Hospital',
    address: '123 Main St, New York, NY',
    phone: '(555) 123-4567',
    distance: 0.8,
    hours: '24/7',
    beds: 250,
    lat: 40.7128,
    lng: -74.006,
  },
  {
    id: 2,
    type: 'Pharmacy',
    name: 'Community Pharmacy',
    address: '456 Oak Ave, New York, NY',
    phone: '(555) 234-5678',
    distance: 1.2,
    hours: '8am - 10pm',
    beds: null,
    lat: 40.7180,
    lng: -74.0020,
  },
  {
    id: 3,
    type: 'Shelter',
    name: 'Emergency Shelter',
    address: '789 Park Rd, New York, NY',
    phone: '(555) 345-6789',
    distance: 2.1,
    hours: '24/7',
    beds: 150,
    lat: 40.7200,
    lng: -74.0100,
  },
  {
    id: 4,
    type: 'Food Bank',
    name: 'Community Food Bank',
    address: '321 Elm St, New York, NY',
    phone: '(555) 456-7890',
    distance: 1.5,
    hours: '9am - 6pm',
    beds: null,
    lat: 40.7090,
    lng: -74.0150,
  },
  {
    id: 5,
    type: 'Fire Station',
    name: 'Fire Station 42',
    address: '654 Maple Dr, New York, NY',
    phone: '911',
    distance: 0.5,
    hours: '24/7',
    beds: null,
    lat: 40.7050,
    lng: -73.9950,
  },
  {
    id: 6,
    type: 'Police Station',
    name: 'Police Precinct 10',
    address: '987 Cedar Ln, New York, NY',
    phone: '911',
    distance: 1.1,
    hours: '24/7',
    beds: null,
    lat: 40.7160,
    lng: -74.0050,
  },
]

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [resources, setResources] = useState<LocalResource[]>(mockResources)

  const resourceTypes = ['Hospital', 'Pharmacy', 'Shelter', 'Food Bank', 'Fire Station', 'Police Station']

  const categories = [
    'Pharmacy',
    'Shelter',
    'Food',
    'Water',
    'Medical',
    'Supply',
    'Communication',
    'Transport',
  ]

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = !selectedType || resource.type === selectedType
    return matchesSearch && matchesType
  })

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Local Resources</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Find pharmacies, shelters, food banks, and emergency services near you</p>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 min-w-0 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
            >
              <option value="">All Types</option>
              {resourceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-8 sm:pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow flex flex-col">
                <div className="mb-4">
                  <span className="inline-block px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-2">
                    {resource.type}
                  </span>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">{resource.name}</h3>
                </div>

                <div className="space-y-2 sm:space-y-3 mb-4 flex-1">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{resource.address}</p>
                      <p className="text-xs text-gray-500 mt-1">{resource.distance} km away</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0" />
                    <a href={`tel:${resource.phone}`} className="text-xs sm:text-sm text-blue-600 hover:underline truncate">
                      {resource.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-orange-500 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-gray-600">{resource.hours}</p>
                  </div>

                  {resource.beds && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Users className="w-4 sm:w-5 h-4 sm:h-5 text-purple-500 flex-shrink-0" />
                      <p className="text-xs sm:text-sm text-gray-600">{resource.beds} beds</p>
                    </div>
                  )}
                </div>

                <button className="w-full px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transition font-semibold text-sm sm:text-base">
                  Get Directions
                </button>
              </div>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-sm sm:text-base text-gray-500">No resources found matching your criteria</p>
            </div>
          )}
        </section>
      </main>
    </>
  )
}
