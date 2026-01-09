'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Check } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/">
            <Image src="/images/logo.png" alt="OnlyWorks" width={32} height={32} className="logo-icon" />
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/pricing" className="nav-link">Pricing</Link>
            <Link href="/careers" className="nav-link">Careers</Link>
          </div>
          <Link href="/downloads" className="btn btn-primary">
            Access
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6">Simple pricing</h1>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              Start free. Upgrade when you need more.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free */}
            <div className="card">
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-muted)' }}>Free</p>
              <div className="mb-6">
                <span className="text-4xl font-medium">$0</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['5 reports/month', 'Basic detection', '7-day history'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/downloads" className="btn btn-secondary w-full">
                Get started
              </Link>
            </div>

            {/* Pro */}
            <div className="card relative" style={{ borderColor: '#8b5cf6', borderWidth: '2px' }}>
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium rounded-full" style={{ background: '#8b5cf6', color: '#fff' }}>
                Most Popular
              </span>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-muted)' }}>Pro</p>
              <div className="mb-6">
                <span className="text-4xl font-medium">$19</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Unlimited reports', 'Advanced AI', 'Unlimited history', 'Priority support'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="btn btn-primary w-full">
                Start trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="card">
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-muted)' }}>Enterprise</p>
              <div className="mb-6">
                <span className="text-4xl font-medium">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Everything in Pro', 'Team management', 'SSO & audit logs', 'Dedicated support'].map((item) => (
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
      <section className="flex-1 py-16 flex flex-col" style={{ background: 'var(--bg-alt)' }}>
        <div className="container flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto w-full">
            <h2>Questions</h2>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Scroll for more</span>
          </div>
          <div className="max-w-4xl mx-auto w-full flex-1 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 400px)', minHeight: '300px' }}>
            <div className="grid md:grid-cols-2 gap-4 pb-4">
              {[
                { q: 'Can I cancel anytime?', a: 'Yes. Cancel from settings. Keep access until billing period ends.' },
                { q: 'Is there a free trial?', a: 'Yes. 14 days free on all paid plans. No card required.' },
                { q: 'What payment methods?', a: 'All major cards via Stripe. Enterprise can pay by invoice.' },
                { q: 'What happens to my data?', a: 'Export anytime. Deleted 30 days after cancellation.' },
                { q: 'How does detection work?', a: 'AI analyzes work patterns, mouse movements, and screen activity to verify authenticity.' },
                { q: 'Is my screen recorded?', a: 'No video recording. We capture periodic screenshots that you control.' },
                { q: 'Can I use it on multiple devices?', a: 'Yes. Pro and Enterprise plans support unlimited devices per account.' },
                { q: 'What about privacy?', a: 'End-to-end encryption. We never sell your data. You own your reports.' },
                { q: 'Do you offer refunds?', a: 'Yes. Full refund within 14 days if you\'re not satisfied.' },
                { q: 'Is there an API?', a: 'Yes. Enterprise plans include full API access for integrations.' },
                { q: 'How accurate is fraud detection?', a: '98% accuracy rate with continuous improvements via machine learning.' },
                { q: 'Can I white-label reports?', a: 'Yes. Enterprise plans include custom branding options.' },
                { q: 'What integrations are available?', a: 'Slack, Teams, Notion, and more. Custom integrations on Enterprise.' },
                { q: 'Is there a desktop app?', a: 'Yes. Available for macOS and Windows. Required for tracking.' },
                { q: 'How do I get support?', a: 'Email support for all plans. Priority support and dedicated rep for Pro and Enterprise.' },
                { q: 'Can I pause my subscription?', a: 'Yes. Pause for up to 3 months and resume anytime.' }
              ].map((faq, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl transition-all hover:shadow-md"
                  style={{ background: '#fff', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
                      style={{ background: '#ede9fe', color: '#8b5cf6' }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="mb-2">{faq.q}</h3>
                      <p className="text-sm">{faq.a}</p>
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
    </div>
  )
}
