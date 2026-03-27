import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock accessibility routes data
    const mockRoutes = [
      {
        id: '1',
        name: 'Accessible Downtown Path',
        description: 'Smooth paved path through downtown with ramps',
        accessibility_features: ['wheelchair_accessible', 'paved', 'ramps', 'handrails'],
        accessibility_type: 'wheelchair',
        difficulty_level: 'easy',
        start_latitude: 40.7128,
        start_longitude: -74.0060,
        end_latitude: 40.7150,
        end_longitude: -74.0080,
      },
      {
        id: '2',
        name: 'River Walk Accessible Trail',
        description: 'Scenic river walk with accessible facilities',
        accessibility_features: ['wheelchair_accessible', 'benches', 'restrooms', 'shade'],
        accessibility_type: 'wheelchair',
        difficulty_level: 'easy',
        start_latitude: 40.7200,
        start_longitude: -74.0100,
        end_latitude: 40.7250,
        end_longitude: -74.0150,
      },
      {
        id: '3',
        name: 'Park Loop Accessible Route',
        description: 'Loop route through central park with full accessibility',
        accessibility_features: ['wheelchair_accessible', 'paved', 'parking', 'wheelchair_rentals'],
        accessibility_type: 'wheelchair',
        difficulty_level: 'moderate',
        start_latitude: 40.7829,
        start_longitude: -73.9654,
        end_latitude: 40.7829,
        end_longitude: -73.9654,
      },
      {
        id: '4',
        name: 'Visual Impairment Friendly Route',
        description: 'Route with audio cues and tactile guidance',
        accessibility_features: ['audio_cues', 'tactile_guidance', 'braille_signs', 'low_traffic'],
        accessibility_type: 'visual_impairment',
        difficulty_level: 'easy',
        start_latitude: 40.7100,
        start_longitude: -73.9950,
        end_latitude: 40.7120,
        end_longitude: -73.9970,
      },
      {
        id: '5',
        name: 'Hearing Impairment Aware Path',
        description: 'Bright, well-lit route with visual alerts',
        accessibility_features: ['well_lit', 'visual_alerts', 'wide_path', 'crossing_lights'],
        accessibility_type: 'hearing_impairment',
        difficulty_level: 'easy',
        start_latitude: 40.7050,
        start_longitude: -74.0000,
        end_latitude: 40.7070,
        end_longitude: -74.0020,
      },
    ]

    return NextResponse.json(mockRoutes, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
      },
    })
  } catch (error) {
    console.error('Error fetching accessibility routes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch routes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name || !body.start_latitude || !body.start_longitude) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newRoute = {
      id: Math.random().toString(36).substr(2, 9),
      name: body.name,
      description: body.description || '',
      accessibility_features: body.accessibility_features || [],
      accessibility_type: body.accessibility_type || 'wheelchair',
      difficulty_level: body.difficulty_level || 'moderate',
      start_latitude: body.start_latitude,
      start_longitude: body.start_longitude,
      end_latitude: body.end_latitude || body.start_latitude,
      end_longitude: body.end_longitude || body.start_longitude,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(newRoute, {
      status: 201,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Error creating accessibility route:', error)
    return NextResponse.json(
      { error: 'Failed to create route' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: 'Route ID required' },
        { status: 400 }
      )
    }

    const updatedRoute = {
      id: body.id,
      ...body,
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(updatedRoute)
  } catch (error) {
    console.error('Error updating accessibility route:', error)
    return NextResponse.json(
      { error: 'Failed to update route' },
      { status: 500 }
    )
  }
}
