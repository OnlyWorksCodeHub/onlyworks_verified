'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
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

      {/* Hero - Centered, large type, generous space */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <h1 className="mb-8">
            Work verification,<br />reimagined.
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Prove productivity. Detect automation. Build trust.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Get in touch
          </Link>
        </div>
      </main>

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
