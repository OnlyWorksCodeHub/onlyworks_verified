import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, getCurrentUser } from '@/lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    getCurrentUser().then(({ user, error }) => {
      if (error) {
        console.error('Auth error:', error)
      }
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)

        if (session?.user) {
          // Fetch web_users record when auth state changes
          console.log('Fetching web_users for auth_user_id:', session.user.id)
          const { data: webUser, error } = await supabase
            .from('web_users')
            .select('*')
            .eq('auth_user_id', session.user.id)
            .single()

          console.log('web_users query result:', { webUser, error })

          if (error) {
            console.error('ERROR CODE:', error.code)
            console.error('ERROR MESSAGE:', error.message)
            console.error('ERROR DETAILS:', error.details)
            console.error('ERROR HINT:', error.hint)
            console.error('Full error object:', JSON.stringify(error, null, 2))
            setUser(null)
          } else {
            console.log('Successfully loaded web_users record:', webUser)
            setUser({
              ...webUser,
              auth_id: session.user.id,
              email_verified: session.user.email_confirmed_at ? true : false
            })
          }
        } else {
          setUser(null)
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Redirect will be handled by the auth state change listener
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signOut,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Higher-order component for protected routes
export const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth()

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }

    if (!user) {
      // Don't render anything if not authenticated - let individual pages handle redirects
      return null
    }

    return <WrappedComponent {...props} />
  }
}

// Hook for checking if user is authenticated (non-blocking)
export const useRequireAuth = () => {
  const { user, loading } = useAuth()
  return { user, loading, isAuthenticated: !!user }
}