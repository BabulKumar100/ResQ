import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status') || 'all'

  try {
    // Mock SOS alerts data
    const mockAlerts = [
      {
        id: '1',
        user_id: 'user-123',
        emergency_type: 'medical',
        latitude: 40.7128,
        longitude: -74.0060,
        description: 'Heart attack symptoms',
        severity: 'high',
        status: 'active',
        created_at: new Date(Date.now() - 5 * 60000).toISOString(),
        emergency_contacts: ['555-0100', 'Mom: 555-0101'],
      },
      {
        id: '2',
        user_id: 'user-456',
        emergency_type: 'accident',
        latitude: 40.7550,
        longitude: -73.9865,
        description: 'Car accident on Main St',
        severity: 'high',
        status: 'active',
        created_at: new Date(Date.now() - 2 * 60000).toISOString(),
        emergency_contacts: ['911', 'Brother: 555-0102'],
      },
    ]

    // Filter by status if specified
    const filtered = status && status !== 'all'
      ? mockAlerts.filter(a => a.status === status)
      : mockAlerts

    return NextResponse.json(filtered, {
      headers: {
        'Cache-Control': 'public, max-age=5, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    console.error('Error fetching SOS alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SOS alerts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.latitude || !body.longitude) {
      return NextResponse.json(
        { error: 'Location data required' },
        { status: 400 }
      )
    }

    // Create mock SOS alert
    const newAlert = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: body.user_id || 'anonymous',
      emergency_type: body.emergency_type || 'emergency',
      latitude: body.latitude,
      longitude: body.longitude,
      description: body.description || 'Emergency SOS activated',
      severity: body.severity || 'high',
      status: 'active',
      created_at: new Date().toISOString(),
      emergency_contacts: body.emergency_contacts || [],
    }

    // In a real app, this would save to database and notify emergency services
    console.log('SOS Alert created:', newAlert)

    return NextResponse.json(newAlert, {
      status: 201,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Error creating SOS alert:', error)
    return NextResponse.json(
      { error: 'Failed to create SOS alert' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: 'Alert ID required' },
        { status: 400 }
      )
    }

    // Mock update response
    const updatedAlert = {
      id: body.id,
      status: body.status || 'resolved',
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(updatedAlert)
  } catch (error) {
    console.error('Error updating SOS alert:', error)
    return NextResponse.json(
      { error: 'Failed to update SOS alert' },
      { status: 500 }
    )
  }
}
