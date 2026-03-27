import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const radius = searchParams.get('radius') || '5000'
  const type = searchParams.get('type')

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Latitude and longitude required' },
      { status: 400 }
    )
  }

  try {
    const latitude = parseFloat(lat)
    const longitude = parseFloat(lng)

    // Mock emergency services data
    const mockServices = [
      {
        id: '1',
        name: 'Central Hospital',
        service_type: 'hospital',
        address: '123 Health Ave, Downtown',
        phone: '555-0100',
        is_24_hours: true,
        latitude: latitude + 0.01,
        longitude: longitude + 0.01,
      },
      {
        id: '2',
        name: 'Main Police Station',
        service_type: 'police',
        address: '456 Security St, Downtown',
        phone: '555-0101',
        is_24_hours: true,
        latitude: latitude - 0.01,
        longitude: longitude + 0.01,
      },
      {
        id: '3',
        name: 'Central Fire Station',
        service_type: 'fire',
        address: '789 Emergency Ln, Downtown',
        phone: '555-0102',
        is_24_hours: true,
        latitude: latitude + 0.01,
        longitude: longitude - 0.01,
      },
      {
        id: '4',
        name: 'St. Mary Hospital',
        service_type: 'hospital',
        address: '321 Medical Blvd, Midtown',
        phone: '555-0103',
        is_24_hours: true,
        latitude: latitude - 0.005,
        longitude: longitude - 0.005,
      },
      {
        id: '5',
        name: 'North Police Precinct',
        service_type: 'police',
        address: '654 Law Ct, North District',
        phone: '555-0104',
        is_24_hours: true,
        latitude: latitude + 0.015,
        longitude: longitude - 0.01,
      },
    ]

    // Filter by type if specified
    const filtered = type && type !== 'all'
      ? mockServices.filter(s => s.service_type === type)
      : mockServices

    // Filter by radius
    const radiusKm = parseFloat(radius) / 1000
    const nearby = filtered.filter(service => {
      const distance = getDistance(latitude, longitude, service.latitude, service.longitude)
      return distance <= radiusKm
    })

    return NextResponse.json(nearby, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
      },
    })
  } catch (error) {
    console.error('Error fetching emergency services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emergency services' },
      { status: 500 }
    )
  }
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
