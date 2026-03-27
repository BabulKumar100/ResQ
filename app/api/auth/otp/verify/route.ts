import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyOTP } from '@/lib/auth-neon'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email'),
  otp: z.string(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, otp } = verifyOtpSchema.parse(body)

    // Verify OTP with Neon
    const result = await verifyOTP(email, otp)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Create session token
    const sessionToken = crypto.randomUUID()
    
    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return NextResponse.json(
      {
        success: true,
        user: result.user,
        session: { access_token: sessionToken },
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('OTP verify error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}
