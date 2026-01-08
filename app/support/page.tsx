'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Mail, FileText } from 'lucide-react'

export default function SupportPage() {
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
            <h1 className="mb-6">Support</h1>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              We're here to help you get the most out of OnlyWorks.
            </p>
          </div>
        </div>
      </section>

      {/* Options */}
      <section className="pb-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
            <div className="card">
              <div className="icon-wrap mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="mb-2">Email Support</h3>
              <p className="text-sm mb-4">Get help within 24 hours. Priority for Pro users.</p>
              <a href="mailto:support@only-works.com" className="text-sm underline">
                support@only-works.com
              </a>
            </div>

            <div className="card">
              <div className="icon-wrap mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="mb-2">Documentation</h3>
              <p className="text-sm mb-4">Guides, tutorials, and FAQs.</p>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Coming soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="max-w-md">
            <h2 className="mb-4">Have a question?</h2>
            <p className="mb-6">Our team is ready to help.</p>
            <Link href="/contact" className="btn btn-primary">
              Contact us
              <ArrowRight className="w-4 h-4" />
            </Link>
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
