import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'admin' | 'dispatcher' | 'rescuer' | 'viewer'

interface UserProfile {
  uid: string
  email: string | null
  name: string | null
  role: UserRole
  photoURL: string | null
  agency?: string
  phone?: string
}

interface AuthState {
  user: UserProfile | null
  loading: boolean
  initialized: boolean
  setUser: (user: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      initialized: false,
      setUser: (user) => set({ user, loading: false }),
      setLoading: (loading) => set({ loading }),
      setInitialized: (initialized) => set({ initialized }),
      logout: () => set({ user: null, loading: false }),
    }),
    {
      name: 'resqmap-auth',
    }
  )
)
