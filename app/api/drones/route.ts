import { NextResponse } from 'next/server'

export async function GET() {
  const drones = [
    {
      id: 'drone-001',
      name: 'Alpha-1 Aerial',
      latitude: 40.7128,
      longitude: -74.0060,
      altitude: 150,
      battery: 85,
      signal: 95,
      status: 'active',
    },
    {
      id: 'drone-002',
      name: 'Bravo-2 Scout',
      latitude: 40.7200,
      longitude: -74.0100,
      altitude: 120,
      battery: 42,
      signal: 78,
      status: 'active',
    },
  ]

  return NextResponse.json(drones, {
    headers: {
      'Cache-Control': 'public, max-age=5, stale-while-revalidate=10',
    },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newDrone = {
      id: `drone-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    }
    return NextResponse.json(newDrone, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create drone record' }, { status: 500 })
  }
}
