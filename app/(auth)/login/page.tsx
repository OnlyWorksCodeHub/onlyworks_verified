'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/ui/logo'
import { ArrowLeft, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useTheme } from '@/lib/contexts/theme-context'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      
      // Use environment variable for production, fallback to current origin
      const redirectTo = process.env.NEXT_PUBLIC_APP_URL 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`
        : `${window.location.origin}/api/auth/callback`
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      })
      
      if (error) throw error
    } catch (error) {
      toast.error('Failed to sign in')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center px-4 transition-colors">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-sm bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600" />
        )}
      </button>

      <div className="max-w-md w-full">
        <Link 
          href="/"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>
        
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-sm p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo size={48} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tighter text-primary dark:text-primary-light mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to continue tracking your productivity
            </p>
          </div>
          
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 py-3 px-4 rounded-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary dark:hover:border-primary-light transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              By signing in, you agree to our{' '}
              <a href="#" className="text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
        
        <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
          Don't have an account?{' '}
          <button onClick={handleGoogleLogin} className="text-primary dark:text-primary-light font-semibold hover:text-primary-dark dark:hover:text-primary transition-colors">
            Sign up free
          </button>
        </p>
      </div>
    </div>
  )
}
