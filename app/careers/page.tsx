import Link from 'next/link'
import { MapPin, Clock, Briefcase, ArrowRight } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { jobs } from '@/lib/data/jobs'

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-40 pb-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <span className="badge mb-6">We're Hiring</span>
            <h1 className="mb-6">Join our team</h1>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              Help us build the future of work verification. We're looking for talented people who want to make a real impact.
            </p>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-8 text-center">Open positions</h2>

            <div className="space-y-4">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/careers/apply/${job.id}`}
                  className="card block cursor-pointer hover:border-[var(--text)] transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 hidden md:block" style={{ color: 'var(--text-muted)' }} />
                  </div>
                </Link>
              ))}
            </div>

            {jobs.length === 0 && (
              <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
                No open positions at the moment. Check back soon!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="mb-4">Don't see a perfect fit?</h2>
            <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
              We're always looking for exceptional talent. Send us your resume and we'll reach out when the right opportunity opens up.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
