import { NextResponse } from 'next/server'

export async function GET() {
  const alerts = [
    {
      id: 'alert-001',
      title: 'Severe Weather Warning',
      message: 'Tornado warning active',
      severity: 'critical',
      channels: ['sms', 'push', 'radio', 'sirens'],
      area: 'Downtown District',
      radius: 5,
      latitude: 40.7200,
      longitude: -74.0100,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      recipientsReached: 12500,
    },
  ]

  return NextResponse.json(alerts, {
    headers: {
      'Cache-Control': 'public, max-age=10, stale-while-revalidate=30',
    },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const alert = {
      id: `alert-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      recipientsReached: Math.floor(Math.random() * 50000) + 10000,
    }
    return NextResponse.json(alert, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 })
  }
}
