'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Check } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="flex items-center">
            <Image src="/images/onlyworks-logo.png" alt="OnlyWorks" width={120} height={30} className="h-6 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/pricing" className="nav-link">Pricing</Link>
            <Link href="/careers" className="nav-link">Careers</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </div>
          <Link href="/downloads" className="btn btn-primary">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-16">
        <div className="container">
          <div className="max-w-lg">
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
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
            {/* Free */}
            <div className="card">
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-muted)' }}>Free</p>
              <div className="mb-6">
                <span className="text-4xl font-medium">$0</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['5 reports/month', 'Basic detection', '7-day history'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/downloads" className="btn btn-secondary w-full">
                Get started
              </Link>
            </div>

            {/* Pro */}
            <div className="card" style={{ borderColor: 'var(--text)' }}>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-muted)' }}>Pro</p>
              <div className="mb-6">
                <span className="text-4xl font-medium">$19</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/mo</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Unlimited reports', 'Advanced AI', 'Unlimited history', 'Priority support'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
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
                    <Check className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
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
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <h2 className="mb-12">Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes. Cancel from settings. Keep access until billing period ends.' },
              { q: 'Is there a free trial?', a: 'Yes. 14 days free on all paid plans. No card required.' },
              { q: 'What payment methods?', a: 'All major cards via Stripe. Enterprise can pay by invoice.' },
              { q: 'What happens to my data?', a: 'Export anytime. Deleted 30 days after cancellation.' }
            ].map((faq, i) => (
              <div key={i}>
                <h3 className="mb-2">{faq.q}</h3>
                <p className="text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <Image src="/images/onlyworks-logo.png" alt="OnlyWorks" width={100} height={25} className="h-5 w-auto" />
            <div className="flex flex-wrap gap-6">
              <Link href="/about" className="footer-link">About</Link>
              <Link href="/pricing" className="footer-link">Pricing</Link>
              <Link href="/privacy" className="footer-link">Privacy</Link>
              <Link href="/terms" className="footer-link">Terms</Link>
              <Link href="/security" className="footer-link">Security</Link>
              <Link href="/support" className="footer-link">Support</Link>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>© 2025 OnlyWorks</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
