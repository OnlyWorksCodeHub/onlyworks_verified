'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight, Play, Shield, Eye, FileCheck, BarChart3, Lock, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { LogoCarousel } from '@/components/ui/logo-carousel'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('You\'re on the list!')
      setEmail('')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

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
      <section className="pt-36 pb-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="badge mb-6">Early Access</span>
            <h1 className="mb-6">
              Work verification,<br />reimagined.
            </h1>
            <p className="text-xl mb-10" style={{ color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto' }}>
              AI-powered verification that proves productivity, detects automation, and builds trust.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/downloads" className="btn btn-primary">
                Start free trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                Book a demo
              </Link>
            </div>
          </div>

          {/* Hero Product Screenshot */}
          <div className="max-w-5xl mx-auto">
            <div className="demo-frame">
              <div className="demo-bar">
                <div className="demo-dot" />
                <div className="demo-dot" />
                <div className="demo-dot" />
              </div>
              <div className="relative aspect-[16/9]" style={{ background: 'var(--bg-alt)' }}>
                <Image
                  src="/Screenshot 2026-01-07 at 10.47.53 PM.png"
                  alt="OnlyWorks Dashboard"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-12" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <p className="text-center text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Trusted by teams at</p>
        </div>
        <LogoCarousel />
      </section>

      {/* Demo Video Section */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="mb-4">See it in action</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Watch how OnlyWorks captures, analyzes, and verifies your work in real-time.
            </p>
          </div>

          {/* Large Demo Video */}
          <div className="max-w-4xl mx-auto">
            <div className="demo-frame">
              <div className="demo-bar">
                <div className="demo-dot" />
                <div className="demo-dot" />
                <div className="demo-dot" />
                <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>2:30 demo</span>
              </div>
              <div className="relative aspect-video" style={{ background: 'linear-gradient(135deg, var(--bg-alt) 0%, #e5e5e5 100%)' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 rounded-full flex items-center justify-center transition-transform hover:scale-110" style={{ background: 'var(--text)' }}>
                    <Play className="w-8 h-8 text-white ml-1" />
                  </button>
                </div>
                {/* Replace with actual video thumbnail */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - With Images */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="mb-4">How it works</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Three steps to verified productivity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Record your work',
                desc: 'Start a session and work normally. OnlyWorks captures screenshots and activity in the background.',
              },
              {
                num: '02',
                title: 'AI analyzes patterns',
                desc: 'Our AI detects automation tools, analyzes work patterns, and verifies authenticity in real-time.',
              },
              {
                num: '03',
                title: 'Share verified reports',
                desc: 'Generate tamper-proof reports with unique links that anyone can verify instantly.',
              },
            ].map((step, i) => (
              <div key={i}>
                {/* Step Image Placeholder */}
                <div className="relative aspect-[4/3] rounded-xl mb-6 overflow-hidden" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <div className="absolute top-4 left-4">
                    <span className="badge">{step.num}</span>
                  </div>
                  {/* Replace with actual step screenshot */}
                  <Image
                    src="/images/og-image.png"
                    alt={step.title}
                    fill
                    className="object-cover opacity-60"
                  />
                </div>
                <h3 className="mb-2">{step.title}</h3>
                <p className="text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features with Images */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="mb-4">Everything you need</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              A complete platform for tracking, analyzing, and proving genuine productivity.
            </p>
          </div>

          {/* Feature Grid - Bento Style */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large Feature Card */}
            <div className="card lg:col-span-2">
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <div className="icon-wrap mb-4">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="mb-2">AI Fraud Detection</h3>
                  <p className="text-sm">Detects 20+ automation tools, screen recorders, and suspicious patterns in real-time.</p>
                </div>
                {/* Feature Screenshot */}
                <div className="relative flex-1 min-h-[200px] rounded-lg overflow-hidden mt-auto" style={{ background: 'var(--bg-alt)' }}>
                  <Image
                    src="/Screenshot 2026-01-07 at 10.47.53 PM.png"
                    alt="AI Fraud Detection"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Small Feature Cards */}
            <div className="card">
              <div className="icon-wrap mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="mb-2">Smart Capture</h3>
              <p className="text-sm">Intelligent screenshots capture your workflow without interruption.</p>
            </div>

            <div className="card">
              <div className="icon-wrap mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="mb-2">Verified Reports</h3>
              <p className="text-sm">Tamper-proof reports with unique verification links.</p>
            </div>

            {/* Large Feature Card */}
            <div className="card lg:col-span-2">
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <div className="icon-wrap mb-4">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h3 className="mb-2">Analytics Dashboard</h3>
                  <p className="text-sm">Deep insights into productivity patterns and authenticity scores.</p>
                </div>
                {/* Feature Screenshot */}
                <div className="relative flex-1 min-h-[200px] rounded-lg overflow-hidden mt-auto" style={{ background: 'var(--bg-alt)' }}>
                  <Image
                    src="/Screenshot 2026-01-07 at 10.48.07 PM.png"
                    alt="Analytics Dashboard"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="icon-wrap mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="mb-2">End-to-End Encryption</h3>
              <p className="text-sm">Your data encrypted at rest and in transit. Zero-knowledge architecture.</p>
            </div>

            <div className="card">
              <div className="icon-wrap mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="mb-2">AI Analysis</h3>
              <p className="text-sm">Advanced ML models analyze work patterns and detect anomalies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-6 overflow-hidden" style={{ background: 'var(--border)' }}>
              {/* Customer photo placeholder */}
              <Image
                src="/images/founder-team.png"
                alt="Customer"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <blockquote className="text-2xl font-medium mb-6" style={{ lineHeight: 1.4 }}>
              "OnlyWorks completely transformed how we verify contractor work. The AI detection caught issues we didn't know existed."
            </blockquote>
            <p className="font-medium">Sarah Johnson</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>VP of Operations, TechCorp</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '98%', label: 'Detection accuracy' },
              { value: '20+', label: 'Tools detected' },
              { value: '5 sec', label: 'Report generation' },
              { value: 'E2E', label: 'Encrypted' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="stat-value">{stat.value}</div>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mb-4">Ready to get started?</h2>
            <p className="mb-10" style={{ color: 'var(--text-secondary)' }}>
              Join thousands of professionals who trust OnlyWorks to verify their productivity.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isLoading}
                className="input flex-1"
              />
              <button type="submit" disabled={isLoading} className="btn btn-primary whitespace-nowrap">
                {isLoading ? 'Joining...' : 'Get started free'}
              </button>
            </form>

            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Free 14-day trial · No credit card required
            </p>
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
