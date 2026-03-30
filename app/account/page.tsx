'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowLeft, CreditCard, Download, ExternalLink, Loader2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/components/AuthProvider'
import { ShimmerButton } from '@/components/ui/shimmer-button'

interface SubscriptionInfo {
  status?: string
  trialDaysRemaining?: number | null
}

function StatusBadge({ status }: { status?: string }) {
  const map: Record<string, { label: string; className: string }> = {
    active: { label: 'Active', className: 'text-green-600 bg-green-50' },
    trialing: { label: 'Trial', className: 'text-violet-600 bg-violet-50' },
    past_due: { label: 'Past Due', className: 'text-orange-600 bg-orange-50' },
    canceled: { label: 'Canceled', className: 'text-red-600 bg-red-50' },
    expired: { label: 'Expired', className: 'text-red-600 bg-red-50' },
  }
  const info = map[status || ''] || { label: 'None', className: 'text-neutral-400 bg-neutral-50' }

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${info.className}`}>
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
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
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
            <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center max-w-[420px] w-full">
              <CreditCard className="w-10 h-10 mx-auto mb-4 text-neutral-400" />
              <h1 className="text-2xl font-semibold mb-2 text-neutral-900">Account</h1>
              <p className="mb-6 text-neutral-500">
                Sign in to manage your subscription.
              </p>
              <Link href="/login">
                <ShimmerButton className="w-full justify-center">
                  Sign In
                </ShimmerButton>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1 mt-4 text-sm text-neutral-400"
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
          <div className="max-w-[600px] w-full">
            <h1 className="text-2xl font-semibold mb-8 text-neutral-900">Account</h1>

            {/* Subscription Card */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 mb-6">
              <h2 className="text-lg font-medium mb-4 text-neutral-900">Subscription</h2>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">Email</span>
                    <span className="text-sm font-medium text-neutral-900">{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">Status</span>
                    <StatusBadge status={subscriptionInfo?.status} />
                  </div>
                  {subscriptionInfo?.trialDaysRemaining != null && subscriptionInfo.trialDaysRemaining > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-500">Trial remaining</span>
                      <span className="text-sm font-medium text-neutral-900">
                        {subscriptionInfo.trialDaysRemaining} day{subscriptionInfo.trialDaysRemaining !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}

                  {hasActiveSub && (
                    <ShimmerButton
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                      className="w-full justify-center mt-2"
                    >
                      {portalLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ExternalLink className="w-4 h-4" />
                      )}
                      Manage Subscription
                    </ShimmerButton>
                  )}
                </div>
              )}
            </div>

            {/* Links */}
            <div className="space-y-3">
              {!hasActiveSub && !loading && (
                <Link
                  href="/downloads"
                  className="rounded-xl border border-neutral-200 bg-white p-4 flex items-center justify-between hover:border-violet-400 transition-colors"
                >
                  <span className="text-sm font-medium text-neutral-900">Get started with OnlyWorks</span>
                  <span className="text-sm text-violet-600">Download free</span>
                </Link>
              )}

              <Link
                href="/downloads"
                className="rounded-xl border border-neutral-200 bg-white p-4 flex items-center justify-between hover:border-violet-400 transition-colors"
              >
                <span className="text-sm font-medium text-neutral-900">
                  <Download className="w-4 h-4 inline mr-2 text-neutral-400" />
                  Download the app
                </span>
                <span className="text-sm text-violet-600">Downloads</span>
              </Link>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm text-neutral-400"
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
