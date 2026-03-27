import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || null

  const resources = [
    {
      id: 'res-001',
      type: 'medical',
      name: 'First Aid Kits',
      quantity: 150,
      unit: 'units',
      location: 'Central Distribution Hub',
      latitude: 40.7200,
      longitude: -74.0100,
      status: 'available',
    },
    {
      id: 'res-002',
      type: 'water',
      name: 'Bottled Water',
      quantity: 2000,
      unit: 'bottles',
      location: 'North Warehouse',
      latitude: 40.7300,
      longitude: -74.0000,
      status: 'available',
    },
    {
      id: 'res-003',
      type: 'food',
      name: 'Emergency Rations',
      quantity: 45,
      unit: 'boxes',
      location: 'South Storage',
      latitude: 40.7050,
      longitude: -74.0150,
      status: 'depleted',
    },
  ]

  const filtered = category
    ? resources.filter(r => r.type === category)
    : resources

  return NextResponse.json(filtered, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const resource = {
      id: `res-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    }
    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json({ ...body, updated: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 })
  }
}

