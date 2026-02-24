'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Mail, ArrowLeft, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/auth/callback',
        },
      })

      if (authError) {
        setError(authError.message)
      } else {
        setSent(true)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg)',
    }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/images/logo.png" alt="OnlyWorks" style={{ height: '32px', width: '32px', filter: 'grayscale(100%) brightness(0)' }} />
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>OnlyWorks</span>
          </Link>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.875rem',
              color: 'var(--text-muted)',
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Back
          </Link>
        </div>
      </header>

      {/* Main */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {!sent ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'var(--accent-light)',
                  marginBottom: '1.5rem',
                }}>
                  <Mail style={{ width: '28px', height: '28px', color: 'var(--accent)' }} />
                </div>
                <h1 style={{
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.02em',
                }}>
                  Sign in to OnlyWorks
                </h1>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9375rem',
                }}>
                  Enter your email and we&apos;ll send you a magic link
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <input
                    type="email"
                    className="input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    style={{ fontSize: '1rem' }}
                  />
                </div>

                {error && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: '#fef2f2',
                    color: '#dc2626',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                  }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !email}
                  style={{
                    width: '100%',
                    height: '48px',
                    fontSize: '0.9375rem',
                    opacity: loading || !email ? 0.6 : 1,
                    cursor: loading || !email ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                      Sending...
                    </>
                  ) : (
                    'Send Magic Link'
                  )}
                </button>
              </form>

              <p style={{
                textAlign: 'center',
                marginTop: '1.5rem',
                fontSize: '0.8125rem',
                color: 'var(--text-muted)',
              }}>
                No password needed. We&apos;ll email you a secure link.
              </p>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#dcfce7',
                marginBottom: '1.5rem',
              }}>
                <Mail style={{ width: '32px', height: '32px', color: '#16a34a' }} />
              </div>
              <h1 style={{
                fontSize: '1.75rem',
                fontWeight: 600,
                color: 'var(--text)',
                marginBottom: '0.75rem',
                letterSpacing: '-0.02em',
              }}>
                Check your email
              </h1>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9375rem',
                marginBottom: '0.5rem',
              }}>
                We sent a magic link to
              </p>
              <p style={{
                color: 'var(--text)',
                fontWeight: 600,
                fontSize: '1rem',
                marginBottom: '1.5rem',
              }}>
                {email}
              </p>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.8125rem',
                marginBottom: '2rem',
              }}>
                Click the link in your email to sign in. The link expires in 1 hour.
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="btn btn-secondary"
                style={{ fontSize: '0.875rem' }}
              >
                Use a different email
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
