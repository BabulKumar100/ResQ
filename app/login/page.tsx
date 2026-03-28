'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { AlertCircle, Lock, Mail, Github, LogIn } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginWithEmail, loginWithGoogle, signOut } from '@/lib/auth-utils'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuthStore()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const user = await loginWithEmail(email, password)
      if (user) {
        toast.success(`Welcome back, ${user.displayName || email}!`)
        router.push('/dashboard')
      }
    } catch (e: any) {
      setError(e.message || 'Failed to login. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const user = await loginWithGoogle()
      if (user) {
        toast.success(`Welcome back, ${user.displayName}!`)
        router.push('/dashboard')
      }
    } catch (e: any) {
      setError(e.message || 'Failed to login with Google.')
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
        <Navigation />
        <Card className="w-full max-w-md bg-gray-900 border-gray-800 text-white">
          <CardHeader>
            <CardTitle>You are already logged in</CardTitle>
            <CardDescription className="text-gray-400">Signed in as {user.email}</CardDescription>
          </CardHeader>
          <CardFooter className="flex gap-4">
            <Button variant="outline" onClick={() => router.push('/dashboard')} className="flex-1">
              Go to Dashboard
            </Button>
            <Button variant="destructive" onClick={() => signOut()} className="flex-1">
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <Navigation />
      
      <div className="mb-8 text-center animate-fade-in">
        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-900/20">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">ResQMap Official Access</h1>
        <p className="text-gray-400">Login to your specialized portal</p>
      </div>

      <Card className="w-full max-w-md bg-gray-900 border-gray-800 text-white shadow-2xl">
        <CardHeader>
          <CardTitle>Welcome Rescuer</CardTitle>
          <CardDescription className="text-gray-400">India Government Emergency Portal Login</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <Input
                  id="email"
                  placeholder="name@agency.gov.in"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 pl-10 text-white"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 pl-10 text-white"
                  required
                />
              </div>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm animate-pulse">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 h-10 font-bold transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </div>
              )}
            </Button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full border-gray-700 bg-gray-800 hover:bg-gray-700 hover:text-white transition-all gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.94 3.28-1.78 4.12-1.04 1.04-2.48 1.84-4.8 1.84-4.12 0-7.34-3.32-7.34-7.44s3.22-7.44 7.34-7.44c2.24 0 3.88.88 5.12 2.04l2.28-2.28c-1.88-1.8-4.32-2.92-7.4-2.92-5.96 0-10.84 4.88-10.84 10.84s4.88 10.84 10.84 10.84c3.24 0 5.68-1.04 7.56-3.04 1.96-1.92 2.56-4.64 2.56-6.88 0-.52-.04-.88-.12-1.32z"
              />
            </svg>
            Google OAuth
          </Button>
        </CardContent>
        <CardFooter className="justify-center border-t border-gray-800 p-6">
          <p className="text-sm text-gray-500">
            Internal Authorized Government Portal — Access is Monitored
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
