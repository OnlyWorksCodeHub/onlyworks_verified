'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowLeft, CreditCard, Download, ExternalLink, Loader2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/components/AuthProvider'

interface SubscriptionInfo {
  status?: string
  trialDaysRemaining?: number | null
}

function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    active: { label: 'Active', color: '#16a34a', bg: 'rgba(22, 163, 74, 0.1)' },
    trialing: { label: 'Trial', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    past_due: { label: 'Past Due', color: '#ea580c', bg: 'rgba(234, 88, 12, 0.1)' },
    canceled: { label: 'Canceled', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' },
    expired: { label: 'Expired', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)' },
  }
  const info = map[status || ''] || { label: 'None', color: 'var(--text-muted)', bg: 'var(--bg-alt)' }

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: info.color,
        background: info.bg,
      }}
    >
      {info.label}
    </span>
  )
}

export default function AccountPage() {
  const { user, session, loading: authLoading } = useAuth()
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    if (!user?.email) return

    setLoading(true)
    fetch('/api/subscriptions/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setSubscriptionInfo({
            status: data.status,
            trialDaysRemaining: data.trialDaysRemaining,
          })
        } else {
          setSubscriptionInfo({ status: undefined })
        }
      })
      .catch(() => {
        toast.error('Failed to load subscription info.')
      })
      .finally(() => setLoading(false))
  }, [user?.email])

  const handleManageSubscription = async () => {
    if (!user?.email) return
    setPortalLoading(true)

    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      })

      const data = await res.json()

      if (data.url) {
        window.open(data.url, '_blank')
      } else {
        toast.error(data.error || 'Failed to open billing portal.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setPortalLoading(false)
    }
  }

  // Auth still loading
  if (authLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-32 pb-20 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--text-muted)' }} />
        </div>
        <Footer />
      </div>
    )
  }

  // Not logged in
  if (!session) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <Toaster position="top-center" />
        <section className="pt-32 pb-20">
          <div className="container flex justify-center">
            <div
              className="card p-8 text-center"
              style={{ maxWidth: '420px', width: '100%' }}
            >
              <CreditCard className="w-10 h-10 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <h1 className="text-2xl font-semibold mb-2">Account</h1>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                Sign in to manage your subscription.
              </p>
              <Link href="/login" className="btn btn-primary w-full justify-center">
                Sign In
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1 mt-4 text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                <ArrowLeft className="w-3 h-3" />
                Back to home
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  // Logged in
  const hasActiveSub = subscriptionInfo?.status === 'active' || subscriptionInfo?.status === 'trialing'

  return (
    <div className="min-h-screen">
      <Navigation />
      <Toaster position="top-center" />

      <section className="pt-32 pb-20">
        <div className="container flex justify-center">
          <div style={{ maxWidth: '600px', width: '100%' }}>
            <h1 className="text-2xl font-semibold mb-8">Account</h1>

            {/* Subscription Card */}
            <div className="card p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Subscription</h2>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--text-muted)' }} />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Email</span>
                    <span className="text-sm font-medium">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Status</span>
                    <StatusBadge status={subscriptionInfo?.status} />
                  </div>
                  {subscriptionInfo?.trialDaysRemaining != null && subscriptionInfo.trialDaysRemaining > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Trial remaining</span>
                      <span className="text-sm font-medium">
                        {subscriptionInfo.trialDaysRemaining} day{subscriptionInfo.trialDaysRemaining !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}

                  {hasActiveSub && (
                    <button
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                      className="btn btn-primary w-full justify-center mt-2"
                    >
                      {portalLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ExternalLink className="w-4 h-4" />
                      )}
                      Manage Subscription
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Links */}
            <div className="space-y-3">
              {!hasActiveSub && !loading && (
                <Link
                  href="/pricing"
                  className="card p-4 flex items-center justify-between hover:border-[#8b5cf6] transition-colors"
                  style={{ display: 'flex' }}
                >
                  <span className="text-sm font-medium">Don&apos;t have a subscription?</span>
                  <span className="text-sm" style={{ color: '#8b5cf6' }}>View plans</span>
                </Link>
              )}

              <Link
                href="/downloads"
                className="card p-4 flex items-center justify-between hover:border-[#8b5cf6] transition-colors"
                style={{ display: 'flex' }}
              >
                <span className="text-sm font-medium">
                  <Download className="w-4 h-4 inline mr-2" style={{ color: 'var(--text-muted)' }} />
                  Download the app
                </span>
                <span className="text-sm" style={{ color: '#8b5cf6' }}>Downloads</span>
              </Link>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                <ArrowLeft className="w-3 h-3" />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
