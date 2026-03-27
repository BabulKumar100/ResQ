import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendOTP } from '@/lib/auth-neon'

const sendOtpSchema = z.object({
  email: z.string().email('Invalid email'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = sendOtpSchema.parse(body)

    // Send OTP via Neon
    const result = await sendOTP(email)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'OTP sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('OTP send error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
