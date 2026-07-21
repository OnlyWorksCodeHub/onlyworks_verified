'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowLeft, CreditCard, Download, ExternalLink, Loader2, LogOut, Search, User } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/components/AuthProvider'
import { PRO_ENABLED } from '@/lib/config'

interface SubscriptionInfo {
  status?: string
  trialDaysRemaining?: number | null
}

function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, { label: string; className: string }> = {
    active: { label: 'Active', className: 'text-green-600 bg-green-50' },
    trialing: { label: 'Trial', className: 'text-[#8b5cf6] bg-[#8b5cf6]/10' },
    past_due: { label: 'Past Due', className: 'text-orange-600 bg-orange-50' },
    canceled: { label: 'Canceled', className: 'text-red-600 bg-red-50' },
    expired: { label: 'Expired', className: 'text-red-600 bg-red-50' },
  }
  const info = map[status || ''] || { label: 'None', className: 'text-muted-foreground bg-foreground/5' }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${info.className}`}>
      {info.label}
    </span>
  )
}

export default function AccountPage() {
  const { user, session, loading: authLoading, signOut } = useAuth()
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    // Pro plan deferred — don't fetch/show subscription state.
    if (!PRO_ENABLED || !user?.email) return

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

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

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
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
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
        <section className="pt-28 lg:pt-32 pb-20">
          <div className="max-w-[600px] mx-auto px-6 flex justify-center">
            <div className="border border-foreground/10 bg-background p-6 lg:p-8 text-center max-w-[420px] w-full">
              <CreditCard className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
              <h1 className="font-display text-3xl lg:text-4xl tracking-tight mb-2">Account</h1>
              <p className="mb-6 text-sm text-muted-foreground">
                {PRO_ENABLED ? 'Sign in to manage your subscription.' : 'Sign in to your account.'}
              </p>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 h-12 px-6 text-sm rounded-full font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: '#8b5cf6' }}
              >
                Sign In
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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

      <section className="pt-28 lg:pt-32 pb-20">
        <div className="max-w-[600px] mx-auto px-6">
          <h1 className="font-display text-3xl lg:text-4xl tracking-tight mb-8">Account</h1>

          {/* Subscription Card — Pro plan deferred (hidden behind PRO_ENABLED). */}
          {PRO_ENABLED && (
          <div className="border border-foreground/10 bg-background p-6 lg:p-8 mb-6">
            <h2 className="text-base font-medium text-foreground mb-4">Subscription</h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium text-foreground">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <StatusBadge status={subscriptionInfo?.status} />
                </div>
                {subscriptionInfo?.trialDaysRemaining != null && subscriptionInfo.trialDaysRemaining > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Trial remaining</span>
                    <span className="text-sm font-medium text-foreground">
                      {subscriptionInfo.trialDaysRemaining} day{subscriptionInfo.trialDaysRemaining !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                {hasActiveSub && (
                  <button
                    onClick={handleManageSubscription}
                    disabled={portalLoading}
                    className="inline-flex w-full items-center justify-center gap-2 h-12 px-6 mt-2 text-sm rounded-full font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: '#8b5cf6' }}
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
          )}

          {/* Account details — always shown so the page is useful with Pro off */}
          <div className="border border-foreground/10 bg-background p-6 lg:p-8 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Signed in as</span>
              <span className="text-sm font-medium text-foreground">{user?.email}</span>
            </div>
          </div>

          {/* Links available to any signed-in visitor */}
          <div className="space-y-3">
            <Link
              href="/p/edit"
              className="border border-foreground/10 bg-background p-4 flex items-center justify-between hover:border-foreground/30 transition-colors"
            >
              <span className="text-sm font-medium text-foreground">
                <User className="w-4 h-4 inline mr-2 text-muted-foreground" />
                Edit profile
              </span>
              <span className="text-sm text-[#8b5cf6]">Profile</span>
            </Link>

            <Link
              href="/search"
              className="border border-foreground/10 bg-background p-4 flex items-center justify-between hover:border-foreground/30 transition-colors"
            >
              <span className="text-sm font-medium text-foreground">
                <Search className="w-4 h-4 inline mr-2 text-muted-foreground" />
                Browse candidates
              </span>
              <span className="text-sm text-[#8b5cf6]">Search</span>
            </Link>

            <Link
              href="/downloads"
              className="border border-foreground/10 bg-background p-4 flex items-center justify-between hover:border-foreground/30 transition-colors"
            >
              <span className="text-sm font-medium text-foreground">
                <Download className="w-4 h-4 inline mr-2 text-muted-foreground" />
                Download the app
              </span>
              <span className="text-sm text-[#8b5cf6]">Downloads</span>
            </Link>
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 h-12 px-6 text-sm rounded-full font-medium border border-foreground/20 text-[#e40014] hover:bg-[#e40014]/[0.04] transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
