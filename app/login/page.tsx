'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { PulsingRings, FloatingParticles } from '@/components/ui/grid-background'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'

// Friendly messages for errors propagated here either by the callback route
// (query string) or by Supabase's implicit-flow error response (hash fragment).
const FRIENDLY_ERROR: Record<string, string> = {
  signup_failed: "We couldn't complete your sign-in right now. This is usually temporary — please try again in a moment.",
  access_denied: 'Sign-in was cancelled. You can try again below.',
  auth_failed: "We couldn't complete your sign-in right now. Please try again.",
  server_error: "We couldn't complete your sign-in right now. Please try again.",
}

function GridLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {[12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100].map((t) => (
        <div key={`h-${t}`} className="absolute h-px bg-foreground/10" style={{ top: `${t}%`, left: 0, right: 0 }} />
      ))}
      {[8.33, 16.66, 24.99, 33.32, 41.65, 49.98, 58.31, 66.64, 74.97, 83.3, 91.63, 99.96].map((l) => (
        <div key={`v-${l}`} className="absolute w-px bg-foreground/10" style={{ left: `${l}%`, top: 0, bottom: 0 }} />
      ))}
    </div>
  )
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const queryError = new URLSearchParams(window.location.search).get('error')
    const hash = window.location.hash.slice(1)
    const hashParams = new URLSearchParams(hash)
    const hashError = hashParams.get('error') || hashParams.get('error_code')
    const hashDescription = hashParams.get('error_description')

    const errorKey = queryError || hashError
    if (!errorKey) return

    if (hashError) {
      // The hash fragment leaks raw Supabase error details into the visible
      // URL. Strip it so the user doesn't see "Database error saving new user"
      // in their address bar, but log it first so we can diagnose from the
      // browser console if someone screenshots this page during triage.
      // eslint-disable-next-line no-console
      console.warn('[Login] OAuth error from Supabase hash:', { error: hashError, description: hashDescription })
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }

    setError(FRIENDLY_ERROR[errorKey] || "We couldn't complete your sign-in right now. Please try again.")
  }, [])

  const handleGoogleLogin = async () => {
    setError(null)
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/auth/callback' },
      })
      if (authError) { setError(authError.message); setLoading(false) }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-hidden">
      {/* Grid line overlay as background decoration */}
      <GridLines />
      <PulsingRings className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]" />
      <FloatingParticles count={6} />

      {/* Minimal header */}
      <header className="relative z-10 max-w-[1400px] w-full mx-auto px-6 lg:px-12 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </header>

      {/* Centered card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Card with v0-style border */}
          <div className="relative border border-foreground/10">
            {/* Corner decorations */}
            <div className="absolute -top-px -left-px w-8 h-8 border-t-2 border-l-2 border-foreground/20" />
            <div className="absolute -top-px -right-px w-8 h-8 border-t-2 border-r-2 border-foreground/20" />
            <div className="absolute -bottom-px -left-px w-8 h-8 border-b-2 border-l-2 border-foreground/20" />
            <div className="absolute -bottom-px -right-px w-8 h-8 border-b-2 border-r-2 border-foreground/20" />

            <div className="p-10 lg:p-12">
              {/* Logo and heading */}
              <div className="text-center mb-10">
                <Link href="/" className="inline-block mb-8">
                  <Image src="/images/logo.png" alt="OnlyWorks" width={44} height={44} />
                </Link>
                <AnimatedGradientText className="text-3xl lg:text-4xl font-display tracking-tight mb-3 !max-w-none !bg-transparent !shadow-none !px-0 !py-0">
                  Welcome back
                </AnimatedGradientText>
                <p className="text-sm text-muted-foreground font-mono">Sign in to continue to OnlyWorks</p>
              </div>

              {/* Error state */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-3 mb-6 text-sm text-center border border-foreground/10 bg-foreground/[0.02]"
                >
                  {error}
                </motion.div>
              )}

              {/* Google sign in button */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 h-14 px-6 text-sm font-medium border border-foreground/10 bg-background hover:bg-foreground/[0.02] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                {loading ? 'Signing in...' : 'Continue with Google'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-foreground/10" />
                <span className="text-xs font-mono text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-foreground/10" />
              </div>

              {/* Download CTA */}
              <Link
                href="/downloads"
                className="w-full flex items-center justify-center gap-2 h-14 px-6 text-sm font-medium text-white rounded-full transition-all hover:opacity-90"
                style={{ background: '#8b5cf6' }}
              >
                Download the desktop app
              </Link>

              {/* Terms */}
              <p className="text-center mt-8 text-xs text-muted-foreground">
                By signing in, you agree to our{' '}
                <Link href="/terms" className="hover:underline underline-offset-4 text-foreground">Terms</Link> and{' '}
                <Link href="/privacy" className="hover:underline underline-offset-4 text-foreground">Privacy Policy</Link>
              </p>
            </div>
          </div>

          {/* Bottom branding */}
          <div className="mt-8 text-center">
            <p className="text-xs font-mono text-muted-foreground">
              OnlyWorks &mdash; Proof, not promises
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
