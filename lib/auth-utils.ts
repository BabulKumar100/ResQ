import { getSupabase } from './supabase'

export async function getCurrentUser() {
  const supabase = getSupabase()
  if (!supabase) return null

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function signOut() {
  const supabase = getSupabase()
  if (!supabase) return { error: 'Supabase not configured' }

  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error signing out:', error)
    return { error: error instanceof Error ? error.message : 'Sign out failed' }
  }
}

export async function getUserProfile(userId: string) {
  const supabase = getSupabase()
  if (!supabase) return null

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

export async function updateUserProfile(userId: string, profile: any) {
  const supabase = getSupabase()
  if (!supabase) return { error: 'Supabase not configured' }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(profile)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { error: error instanceof Error ? error.message : 'Update failed' }
  }
}

export async function addFavoriteLocation(userId: string, location: any) {
  const supabase = getSupabase()
  if (!supabase) return { error: 'Supabase not configured' }

  try {
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('favorites')
      .eq('user_id', userId)
      .single()

    if (fetchError) throw fetchError

    const favorites = profile?.favorites || []
    const updatedFavorites = [...favorites, { ...location, id: Date.now() }]

    const { data, error: updateError } = await supabase
      .from('user_profiles')
      .update({ favorites: updatedFavorites })
      .eq('user_id', userId)
      .select()
      .single()

    if (updateError) throw updateError
    return data
  } catch (error) {
    console.error('Error adding favorite:', error)
    return { error: error instanceof Error ? error.message : 'Add favorite failed' }
  }
}

export async function removeFavoriteLocation(userId: string, locationId: number) {
  const supabase = getSupabase()
  if (!supabase) return { error: 'Supabase not configured' }

  try {
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('favorites')
      .eq('user_id', userId)
      .single()

    if (fetchError) throw fetchError

    const favorites = profile?.favorites || []
    const updatedFavorites = favorites.filter((fav: any) => fav.id !== locationId)

    const { data, error: updateError } = await supabase
      .from('user_profiles')
      .update({ favorites: updatedFavorites })
      .eq('user_id', userId)
      .select()
      .single()

    if (updateError) throw updateError
    return data
  } catch (error) {
    console.error('Error removing favorite:', error)
    return { error: error instanceof Error ? error.message : 'Remove favorite failed' }
  }
}

// OTP Authentication Functions
export async function sendOtpEmail(email: string) {
  try {
    const response = await fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to send OTP')
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending OTP:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to send OTP',
    }
  }
}

export async function verifyOtpToken(email: string, otp: string) {
  try {
    const response = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to verify OTP')
    }

    return { success: true, user: data.user, session: data.session }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to verify OTP',
    }
  }
}

export async function getSession() {
  const supabase = getSupabase()
  if (!supabase) return null

  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}
