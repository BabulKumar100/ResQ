import { NextResponse } from 'next/server'

/**
 * GET /api/danger-zones - Fetch all danger zones
 * POST /api/danger-zones - Create danger zone
 */
export async function GET() {
  try {
    const mockZones = [
      {
        id: '1',
        name: 'Downtown Flood Zone',
        severity: 'CRITICAL',
        type: 'flood',
        area: [
          [-74.0060, 40.7128],
          [-74.0050, 40.7128],
          [-74.0050, 40.7138],
          [-74.0060, 40.7138],
        ],
        createdAt: Date.now() - 3600000,
        updatedAt: Date.now(),
        affectedCount: 150,
      },
      {
        id: '2',
        name: 'Highway 9 Fire Perimeter',
        severity: 'WARNING',
        type: 'fire',
        area: [
          [-74.0150, 40.7200],
          [-74.0140, 40.7200],
          [-74.0140, 40.7210],
          [-74.0150, 40.7210],
        ],
        createdAt: Date.now() - 1800000,
        updatedAt: Date.now(),
        affectedCount: 85,
      },
    ]

    return NextResponse.json(mockZones, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('[v0] GET /api/danger-zones error:', error)
    return NextResponse.json({ error: 'Failed to fetch danger zones' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const zone = {
      id: `zone-${Date.now()}`,
      ...body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    console.log('[v0] Created danger zone:', zone)

    return NextResponse.json(zone, { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/danger-zones error:', error)
    return NextResponse.json({ error: 'Failed to create danger zone' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const zone = { ...body, updatedAt: Date.now() }

    console.log('[v0] Updated danger zone:', zone)

    return NextResponse.json(zone)
  } catch (error) {
    console.error('[v0] PUT /api/danger-zones error:', error)
    return NextResponse.json({ error: 'Failed to update danger zone' }, { status: 500 })
  }
}
