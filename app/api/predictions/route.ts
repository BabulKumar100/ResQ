import { NextResponse } from 'next/server'

export async function GET() {
  const predictions = [
    {
      id: 'pred-001',
      incidentType: 'Traffic Accident',
      probability: 78,
      location: 'Interstate 95 - Mile 42',
      latitude: 40.7250,
      longitude: -74.0050,
      timeWindow: 'Next 2 hours',
      severity: 'high',
      factors: ['Heavy traffic', 'Poor visibility', 'Wet roads'],
    },
  ]

  return NextResponse.json(predictions, {
    headers: {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
    },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const prediction = {
      id: `pred-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    }
    return NextResponse.json(prediction, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create prediction' }, { status: 500 })
  }
}
