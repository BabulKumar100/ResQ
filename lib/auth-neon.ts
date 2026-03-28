import { sql } from './neon-db'
import crypto from 'crypto'

// Hash password using Node's crypto
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// Generate OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function registerUser(email: string, password: string, fullName: string) {
  try {
    const userId = crypto.randomUUID()
    const passwordHash = hashPassword(password)

    const result = await sql`
      INSERT INTO users (id, email, password_hash, full_name, verified)
      VALUES (${userId}, ${email}, ${passwordHash}, ${fullName}, false)
      RETURNING id, email, full_name
    `

    return { success: true, user: result[0] }
  } catch (error) {
    console.error('Error registering user:', error)
    return { error: error instanceof Error ? error.message : 'Registration failed' }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export function verifyPassword(password: string, passwordHash: string): boolean {
  const hash = hashPassword(password)
  return hash === passwordHash
}

export async function sendOTP(email: string) {
  try {
    const user = await getUserByEmail(email)
    if (!user) {
      return { error: 'User not found' }
    }

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await sql`
      INSERT INTO otp_tokens (id, user_email, otp_code, expires_at)
      VALUES (${crypto.randomUUID()}, ${email}, ${otp}, ${expiresAt.toISOString()})
    `

    // Here you would send the OTP via email
    console.log(`OTP for ${email}: ${otp}`)
    
    return { success: true, otp } // For testing only
  } catch (error) {
    console.error('Error sending OTP:', error)
    return { error: error instanceof Error ? error.message : 'Failed to send OTP' }
  }
}

export async function verifyOTP(email: string, otpCode: string) {
  try {
    const result = await sql`
      SELECT * FROM otp_tokens 
      WHERE user_email = ${email} AND otp_code = ${otpCode}
      AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (result.length === 0) {
      return { error: 'Invalid or expired OTP' }
    }

    // Mark user as verified
    await sql`
      UPDATE users SET verified = true WHERE email = ${email}
    `

    // Delete used OTP
    await sql`
      DELETE FROM otp_tokens WHERE user_email = ${email}
    `

    const user = await getUserByEmail(email)
    return { success: true, user }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return { error: error instanceof Error ? error.message : 'Failed to verify OTP' }
  }
}

export async function getCurrentUser(userId: string) {
  try {
    const result = await sql`
      SELECT id, email, full_name, phone, role, verified FROM users WHERE id = ${userId}
    `
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}
