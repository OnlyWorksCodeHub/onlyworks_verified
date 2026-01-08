'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Shield, Lock, Server, Key } from 'lucide-react'

export default function SecurityPage() {
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
            <h1 className="mb-6">Security</h1>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              Enterprise-grade security to protect your work and privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="pb-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
            {[
              { icon: Lock, title: 'End-to-End Encryption', desc: 'AES-256 at rest. TLS in transit. Zero-knowledge architecture.' },
              { icon: Shield, title: 'Compliance', desc: 'GDPR, CCPA, SOC 2 Type II compliant. Regular audits.' },
              { icon: Server, title: 'Infrastructure', desc: 'Multi-factor auth. Network isolation. 24/7 monitoring.' },
              { icon: Key, title: 'Your Control', desc: 'Granular privacy settings. Export or delete your data anytime.' }
            ].map((item, i) => (
              <div key={i}>
                <div className="icon-wrap mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="mb-2">{item.title}</h3>
                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="max-w-md">
            <h2 className="mb-4">Report a vulnerability</h2>
            <p className="mb-6">Found a security issue? We take this seriously.</p>
            <a href="mailto:security@only-works.com" className="btn btn-primary">
              security@only-works.com
            </a>
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
