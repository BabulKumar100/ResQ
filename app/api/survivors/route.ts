import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || 'all'

  const survivors = [
    {
      id: 'sv-001',
      name: 'John Doe',
      status: 'missing',
      latitude: 40.7128,
      longitude: -74.0060,
      lastLocation: 'Downtown Medical Center',
      contactInfo: '555-0100',
      injuries: 'Minor cuts and bruises',
    },
    {
      id: 'sv-002',
      name: 'Jane Smith',
      status: 'found',
      latitude: 40.7200,
      longitude: -74.0100,
      lastLocation: 'Community Shelter',
      contactInfo: '555-0101',
      injuries: 'Moderate injuries',
    },
  ]

  const filtered = status && status !== 'all'
    ? survivors.filter(s => s.status === status)
    : survivors

  return NextResponse.json(filtered, {
    headers: {
      'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
    },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newSurvivor = {
      id: `sv-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    }
    return NextResponse.json(newSurvivor, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create survivor record' }, { status: 500 })
  }
}
