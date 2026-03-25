'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from '@/components/Navigation'
import { FAQ } from '@/components/FAQ'
import { Footer } from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero — two-column, conversational */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--accent)' }}>
                Work verification for real people
              </p>
              <h1 className="mb-6">
                Your work is real.{' '}
                <span style={{ color: 'var(--accent)' }}>Now prove it.</span>
              </h1>
              <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                OnlyWorks watches what you actually do and turns it into verified proof —
                skills, accomplishments, and impact that employers can trust.
                No fluff. Just what you&apos;ve built.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/downloads" className="btn btn-primary">
                  Try it free
                </Link>
                <Link href="#how-it-works" className="btn btn-secondary">
                  How it works
                </Link>
              </div>
            </div>
            <div className="img-bordered overflow-hidden">
              <Image
                src="/images/overview.png"
                alt="OnlyWorks dashboard showing verified work overview"
                width={1920}
                height={1080}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social proof — honest, static */}
      <section className="py-8 md:py-10 px-4 md:px-6" style={{ background: 'var(--bg-alt)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Used by students, freelancers, and professionals building verified portfolios.
          </p>
        </div>
      </section>

      {/* How it works — narrative storytelling sections */}
      <section id="how-it-works" className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--accent)' }}>
              How it works
            </p>
            <h2>Three steps to verified proof</h2>
          </div>

          <div className="space-y-20 md:space-y-28">
            {/* Step 1: Capture */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--accent)' }}>
                  Step 1
                </p>
                <h2 className="mb-4">Work like you normally do</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  OnlyWorks runs quietly in the background. It watches what
                  you&apos;re working on — the apps, the focus time, the real effort —
                  without getting in your way. You stay in control of what gets captured.
                </p>
              </div>
              <div className="img-bordered overflow-hidden">
                <Image
                  src="/images/sessions.png"
                  alt="Work sessions being tracked in OnlyWorks"
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Step 2: Verify (reversed) */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="order-2 md:order-1 img-bordered overflow-hidden">
                <Image
                  src="/images/reports.png"
                  alt="AI-generated verified work report"
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                />
              </div>
              <div className="order-1 md:order-2">
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--accent)' }}>
                  Step 2
                </p>
                <h2 className="mb-4">Get a verified report</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  AI analyzes your work and generates a report showing
                  your skills, strengths, and what you accomplished. It&apos;s your
                  work, verified and ready to share with anyone.
                </p>
              </div>
            </div>

            {/* Step 3: Share */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--accent)' }}>
                  Step 3
                </p>
                <h2 className="mb-4">Share proof that speaks for itself</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Send your OW Profile or individual reports to employers,
                  clients, or anyone who needs to see what you can do.
                  No more guessing — just verified work.
                </p>
              </div>
              <div className="img-bordered overflow-hidden">
                <Image
                  src="/images/shared-reports.png"
                  alt="Sharing a verified work report"
                  width={1920}
                  height={1080}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* Hiring managers */}
      <section className="py-16 md:py-24 px-4 md:px-6" style={{ background: 'var(--bg-alt)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-medium mb-3" style={{ color: 'var(--accent)' }}>
            For teams
          </p>
          <h2 className="mb-4">Hiring? See how candidates actually work.</h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            Verified reports show real skills, real projects, and real effort.
            No more guessing from a resume. We&apos;re opening early access for hiring teams.
          </p>
          <Link href="/hiring" className="btn btn-primary">
            Get early access
          </Link>
        </div>
      </section>

      {/* Final CTA — warm card, not full-purple bleed */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="card text-center" style={{
            padding: '48px 32px',
            background: 'linear-gradient(135deg, var(--accent-light) 0%, var(--bg) 100%)',
            border: '1px solid var(--accent)',
          }}>
            <h2 className="mb-4">Your work deserves to be seen.</h2>
            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
              Start building your verified portfolio. It takes two minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/downloads" className="btn btn-primary">
                Get started free
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
