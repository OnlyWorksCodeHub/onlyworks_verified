import Link from 'next/link'
import Image from 'next/image'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
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
