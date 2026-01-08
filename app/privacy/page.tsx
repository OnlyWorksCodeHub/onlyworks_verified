'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function PrivacyPage() {
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

      {/* Content */}
      <section className="pt-40 pb-24">
        <div className="container max-w-2xl">
          <h1 className="mb-4">Privacy Policy</h1>
          <p className="text-sm mb-16" style={{ color: 'var(--text-muted)' }}>Last updated: January 2025</p>

          <div className="space-y-12">
            {[
              { title: 'Information We Collect', content: 'Account info, work session data, usage analytics, and payment information processed through Stripe.' },
              { title: 'How We Use It', content: 'To provide productivity tracking, generate reports, detect fraud, and improve our services.' },
              { title: 'Data Security', content: 'All data encrypted in transit and at rest. Industry-standard security with regular audits.' },
              { title: 'Data Retention', content: 'Free: 7 days. Pro: 90 days. Enterprise: Unlimited. Delete anytime from settings.' },
              { title: 'Your Rights', content: 'Access, correct, delete, or export your data. Opt-out of marketing anytime.' },
              { title: 'Contact', content: 'privacy@only-works.com' }
            ].map((section, i) => (
              <div key={i}>
                <h3 className="mb-3">{section.title}</h3>
                <p className="text-sm">{section.content}</p>
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
