'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  backendToken: string | null
  owId: string | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  backendToken: null,
  owId: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [backendToken, setBackendToken] = useState<string | null>(null)
  const [owId, setOwId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const exchangeForBackendToken = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/backend-token', { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setBackendToken(data.token)
        if (data.user?.owId) {
          setOwId(data.user.owId)
        }
      }
    } catch (err) {
      console.error('[AuthProvider] Backend token exchange failed:', err instanceof Error ? err.message : err)
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()

    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)

      if (currentSession) {
        exchangeForBackendToken()
      }

      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)

        if (newSession) {
          exchangeForBackendToken()
        } else {
          setBackendToken(null)
          setOwId(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [exchangeForBackendToken])

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setBackendToken(null)
    setOwId(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, backendToken, owId, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
