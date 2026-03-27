import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock admin analytics
    const analytics = {
      total_reports: 342,
      pending_reports: 28,
      resolved_reports: 314,
      total_users: 1245,
      active_sos_alerts: 3,
      avg_response_time: '4.2 minutes',
    }

    const chartData = [
      { date: 'Mon', reports: 45, sos_alerts: 3, users: 120 },
      { date: 'Tue', reports: 52, sos_alerts: 5, users: 135 },
      { date: 'Wed', reports: 38, sos_alerts: 2, users: 118 },
      { date: 'Thu', reports: 61, sos_alerts: 7, users: 156 },
      { date: 'Fri', reports: 55, sos_alerts: 4, users: 142 },
      { date: 'Sat', reports: 48, sos_alerts: 6, users: 138 },
      { date: 'Sun', reports: 43, sos_alerts: 1, users: 128 },
    ]

    return NextResponse.json({
      analytics,
      chartData,
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('Error fetching admin analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, report_id, status } = body

    if (action === 'update_report_status') {
      return NextResponse.json({
        success: true,
        message: 'Report status updated',
        report_id,
        new_status: status,
      })
    }

    if (action === 'assign_admin_role') {
      return NextResponse.json({
        success: true,
        message: 'Admin role assigned',
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error processing admin action:', error)
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    )
  }
}
