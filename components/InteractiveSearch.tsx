'use client'

import { useState } from 'react'
import { Search, MapPin, Zap } from 'lucide-react'

interface SearchResult {
  id: string
  name: string
  type: 'hospital' | 'police' | 'pharmacy' | 'shelter'
  distance: number
}

export function InteractiveSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const mockData: SearchResult[] = [
    { id: '1', name: 'Central Hospital', type: 'hospital', distance: 0.8 },
    { id: '2', name: 'Main Police Station', type: 'police', distance: 1.2 },
    { id: '3', name: '24/7 Pharmacy Plus', type: 'pharmacy', distance: 0.3 },
    { id: '4', name: 'Emergency Shelter', type: 'shelter', distance: 2.1 },
    { id: '5', name: 'City Medical Center', type: 'hospital', distance: 1.5 },
  ]

  const handleSearch = (value: string) => {
    setQuery(value)
    setIsSearching(true)
    
    setTimeout(() => {
      if (value.trim()) {
        const filtered = mockData.filter(item =>
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.type.toLowerCase().includes(value.toLowerCase())
        )
        setResults(filtered)
      } else {
        setResults([])
      }
      setIsSearching(false)
    }, 300)
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      hospital: 'bg-red-100 text-red-700',
      police: 'bg-blue-100 text-blue-700',
      pharmacy: 'bg-green-100 text-green-700',
      shelter: 'bg-yellow-100 text-yellow-700',
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="w-full">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search hospitals, police, pharmacies..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
            }}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {isSearching && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
          Searching...
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10 absolute w-full">
          {results.map((result) => (
            <div
              key={result.id}
              className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 flex-1">
                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{result.name}</p>
                  <p className="text-xs text-gray-500">{result.distance} km away</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeColor(result.type)} flex-shrink-0`}>
                {result.type}
              </span>
              <Zap className="w-4 h-4 text-gray-300 group-hover:text-yellow-500 transition flex-shrink-0 ml-2" />
            </div>
          ))}
        </div>
      )}

      {query && results.length === 0 && !isSearching && (
        <div className="mt-2 p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm border border-yellow-200">
          No results found. Try searching with different keywords.
        </div>
      )}
    </div>
  )
}
