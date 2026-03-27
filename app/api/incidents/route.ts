import { NextResponse } from 'next/server'

/**
 * GET /api/incidents - Fetch all incidents
 * POST /api/incidents - Create new incident
 */
export async function GET() {
  try {
    const mockIncidents = [
      {
        id: '1',
        type: 'medical-emergency',
        severity: 'critical',
        status: 'active',
        description: 'Heart attack victim on Main St',
        location: [-74.0060, 40.7128],
        created_at: new Date(Date.now() - 10 * 60000).toISOString(),
        rescuers: ['unit-001', 'unit-003'],
      },
      {
        id: '2',
        type: 'traffic-accident',
        severity: 'high',
        status: 'active',
        description: 'Multi-vehicle collision on Highway 9',
        location: [-74.0150, 40.7200],
        created_at: new Date(Date.now() - 5 * 60000).toISOString(),
        rescuers: ['unit-002'],
      },
    ]

    return NextResponse.json(mockIncidents, {
      headers: {
        'Cache-Control': 'public, max-age=5, stale-while-revalidate=30',
      },
    })
  } catch (error) {
    console.error('[v0] GET /api/incidents error:', error)
    return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const incident = {
      id: `incident-${Date.now()}`,
      ...body,
      status: 'active',
      created_at: new Date().toISOString(),
      rescuers: [],
    }

    // In production: Save to PostgreSQL + PostGIS
    console.log('[v0] Created incident:', incident)

    return NextResponse.json(incident, { status: 201 })
  } catch (error) {
    console.error('[v0] POST /api/incidents error:', error)
    return NextResponse.json({ error: 'Failed to create incident' }, { status: 500 })
  }
}
