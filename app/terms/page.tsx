import Link from 'next/link'
import Image from 'next/image'

export default function TermsPage() {
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
          <h1 className="mb-4">Terms of Service</h1>
          <p className="text-sm mb-16" style={{ color: 'var(--text-muted)' }}>Last updated: January 2025</p>

          <div className="space-y-12">
            {[
              { title: 'Acceptance', content: 'By using OnlyWorks, you agree to these terms. If you disagree, don\'t use the service.' },
              { title: 'The Service', content: 'OnlyWorks provides productivity tracking and verification through screenshot capture, AI analysis, and report generation.' },
              { title: 'Your Account', content: 'Must be 18+. Keep your credentials secure. You\'re responsible for all activity on your account.' },
              { title: 'Prohibited Use', content: 'Don\'t use it illegally. Don\'t circumvent tracking. Don\'t upload malware. Don\'t fake productivity.' },
              { title: 'Payments', content: 'Processed via Stripe. Auto-renews unless cancelled. 14-day refund window.' },
              { title: 'Liability', content: 'Service provided "as is". We\'re not liable for indirect damages. Delaware law governs.' },
              { title: 'Contact', content: 'legal@only-works.com' }
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
