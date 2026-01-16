'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Check, X, Loader2 } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import toast, { Toaster } from 'react-hot-toast'

export default function PricingPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'essential' | 'exp'>('exp')

  // Handle canceled checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('canceled') === 'true') {
      toast.error('Checkout was canceled')
      window.history.replaceState({}, '', '/pricing')
    }
  }, [])

  const openCheckout = (plan: 'essential' | 'exp') => {
    setSelectedPlan(plan)
    setShowModal(true)
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Please enter your email')
      return
    }

    setLoading(true)
    const priceId = selectedPlan === 'essential'
      ? process.env.NEXT_PUBLIC_STRIPE_ESSENTIAL_PRICE_ID
      : process.env.NEXT_PUBLIC_STRIPE_EXP_PRICE_ID
    console.log('Starting checkout with priceId:', priceId, 'plan:', selectedPlan)

    if (!priceId) {
      toast.error('Configuration error: Price ID not set')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          priceId,
        })
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        const errorMsg = data.details || data.error || 'Failed to create checkout'
        throw new Error(errorMsg)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start checkout'
      toast.error(message)
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-center" />
      <Navigation />

      {/* Hero with Free Trial CTA */}
      <section className="pt-28 md:pt-40 pb-8 md:pb-12 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-4 md:mb-6">Simple pricing</h1>
            <p className="text-lg md:text-xl mb-6 md:mb-10" style={{ color: 'var(--text-secondary)' }}>
              Start free. Upgrade when you need more.
            </p>

            {/* Prominent Free Trial CTA */}
            <div
              className="flex flex-col items-center p-5 md:p-8 rounded-2xl mb-6 md:mb-8 mx-auto max-w-md md:max-w-none md:inline-flex"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)'
              }}
            >
              <p className="text-white/90 text-xs md:text-sm font-medium mb-2">14 DAYS FREE</p>
              <h2 className="text-white text-xl md:text-3xl font-semibold mb-2 md:mb-3">
                Start your free trial today
              </h2>
              <p className="text-white/80 mb-4 md:mb-6 max-w-md text-sm md:text-base">
                Full access to all Pro features. No charge until trial ends.
              </p>
              <button
                onClick={() => openCheckout('exp')}
                className="px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all hover:scale-105 w-full md:w-auto"
                style={{
                  background: 'white',
                  color: '#7c3aed',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                }}
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 md:pb-24 px-4">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {/* Essential */}
            <div className="card">
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-muted)' }}>Essential</p>
              <div className="mb-6">
                <span className="text-4xl font-medium">$20</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Unlimited reports', 'Advanced work verification', 'Unlimited history', 'Email support'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openCheckout('essential')}
                className="btn btn-secondary w-full"
              >
                Get started
              </button>
            </div>

            {/* OW EXP */}
            <div className="card relative" style={{ borderColor: '#8b5cf6', borderWidth: '2px' }}>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium rounded-full" style={{ background: '#8b5cf6', color: '#fff' }}>
                Most Popular
              </span>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-muted)' }}>OW EXP</p>
              <div className="mb-6">
                <span className="text-4xl font-medium">$35</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Essential',
                  'Custom programs for dream job',
                  'Verification of experience',
                  'Work with OW team'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => openCheckout('exp')}
                className="btn btn-primary w-full"
              >
                Start 14-day free trial
              </button>
              <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
                No charge until trial ends
              </p>
            </div>

            {/* Enterprise */}
            <div className="card">
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-muted)' }}>Enterprise</p>
              <div className="mb-6">
                <span className="text-4xl font-medium">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Everything in OW EXP', 'Team management', 'SSO & audit logs', 'Dedicated support'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn btn-secondary w-full">
                Contact sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="flex-1 py-10 md:py-16 flex flex-col px-4" style={{ background: 'var(--bg-alt)' }}>
        <div className="container flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6 md:mb-8 max-w-4xl mx-auto w-full">
            <h2>Questions</h2>
            <span className="text-xs md:text-sm hidden md:block" style={{ color: 'var(--text-muted)' }}>Scroll for more</span>
          </div>
          <div className="max-w-4xl mx-auto w-full flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)', minHeight: '250px' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pb-4">
              {[
                { q: 'Can I cancel anytime?', a: 'Yes. Cancel from settings. Keep access until billing period ends.' },
                { q: 'Is there a free trial?', a: 'Yes. 14 days free on Pro plan. Card required but not charged until trial ends.' },
                { q: 'What payment methods?', a: 'All major cards via Stripe. Enterprise can pay by invoice.' },
                { q: 'What happens to my data?', a: 'Export anytime. Deleted 30 days after cancellation.' },
                { q: 'How does work verification work?', a: 'You control what gets verified. Our AI analyzes the work patterns you choose to record, helping you build authentic proof of your skills and productivity.' },
                { q: 'Is my screen recorded?', a: 'No video recording. We capture periodic screenshots that you control.' },
                { q: 'Can I use it on multiple devices?', a: 'Yes. Pro and Enterprise plans support unlimited devices per account.' },
                { q: 'What about privacy?', a: 'End-to-end encryption. We never sell your data. You own your reports.' },
                { q: 'Do you offer refunds?', a: 'Yes. Full refund within 14 days if you\'re not satisfied.' },
                { q: 'Is there an API?', a: 'Yes. Enterprise plans include full API access for integrations.' },
                { q: 'How accurate is work verification?', a: '98% accuracy in authenticating genuine work. Helps you stand out by proving your skills are real. Continuously improving via machine learning.' },
                { q: 'Can I white-label reports?', a: 'Yes. Enterprise plans include custom branding options.' },
                { q: 'What integrations are available?', a: 'Slack, Teams, Notion, and more. Custom integrations on Enterprise.' },
                { q: 'Is there a desktop app?', a: 'Yes. Available for macOS and Windows. Download it to start building your verified work portfolio.' },
                { q: 'How do I get support?', a: 'Email support for all plans. Priority support and dedicated rep for Pro and Enterprise.' },
                { q: 'Can I pause my subscription?', a: 'Yes. Pause for up to 3 months and resume anytime.' }
              ].map((faq, i) => (
                <div
                  key={i}
                  className="p-4 md:p-5 rounded-xl transition-all hover:shadow-md"
                  style={{ background: '#fff', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <span
                      className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-xs font-medium"
                      style={{ background: '#ede9fe', color: '#8b5cf6' }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="mb-1 md:mb-2 text-sm md:text-base">{faq.q}</h3>
                      <p className="text-xs md:text-sm">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container flex justify-between items-center">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>© 2025 OnlyWorks</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="footer-link">Privacy</Link>
            <Link href="/terms" className="footer-link">Terms</Link>
          </div>
        </div>
      </footer>

      {/* Email Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-5 md:p-8 max-w-md w-full relative"
            style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            </button>

            <div className="text-center mb-5 md:mb-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                {selectedPlan === 'essential' ? 'Essential Plan' : 'OW EXP Plan'}
              </h2>
              <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
                14 days free, then {selectedPlan === 'essential' ? '$20' : '$35'}/month. Cancel anytime.
              </p>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input w-full"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redirecting to checkout...
                  </>
                ) : (
                  'Continue to checkout'
                )}
              </button>
            </form>

            <p className="text-xs text-center mt-4" style={{ color: 'var(--text-muted)' }}>
              By continuing, you agree to our{' '}
              <Link href="/terms" className="underline">Terms</Link> and{' '}
              <Link href="/privacy" className="underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
