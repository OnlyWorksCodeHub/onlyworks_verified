'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { setCookie } from '@/lib/cookies'

export default function VerifySkillsPage() {
  const searchParams = useSearchParams()
  const [futureOptIn, setFutureOptIn] = useState(false)

  useEffect(() => {
    // Capture source parameter from URL
    const source = searchParams.get('src')

    if (source) {
      // Store in sessionStorage (immediate)
      sessionStorage.setItem('source_partner', source)

      // Set 30-day cookie (backup persistence)
      setCookie('ow_src', source, 30)

      // Log for debugging (remove in production)
      console.log('✅ Attribution captured:', source)
    }
  }, [searchParams])

  const handleVerifyClick = () => {
    // Store first opt-in flag
    sessionStorage.setItem('first_opt_in', 'true')

    // Store future opt-in if checked
    sessionStorage.setItem('future_opt_in', futureOptIn.toString())

    // Redirect to pricing page (where they can sign up)
    window.location.href = '/pricing'
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section - Immediate Verify */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24 px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="mb-6">
            This role wasn't a fit, but your experience still counts
          </h1>
          <p className="text-lg md:text-xl mb-8 md:mb-12" style={{ color: 'var(--text-secondary)' }}>
            Verify your projects, skills, and decisions so employers can see
            what you've actually done. Build credible proof that stands out.
          </p>
          <button
            onClick={handleVerifyClick}
            className="btn btn-primary text-lg px-8 py-4"
          >
            Verify My Experience
          </button>
        </div>
      </section>

      {/* Future Opt-in Section */}
      <section className="pb-16 md:pb-24 px-4 md:px-6" style={{ background: 'var(--bg-alt)' }}>
        <div className="max-w-xl mx-auto text-center card">
          <h3 className="text-xl font-semibold mb-4">
            Want us to help if you get ghosted again?
          </h3>
          <label className="flex items-start gap-3 cursor-pointer text-left">
            <input
              type="checkbox"
              checked={futureOptIn}
              onChange={(e) => setFutureOptIn(e.target.checked)}
              className="mt-1"
            />
            <span style={{ color: 'var(--text-secondary)' }}>
              Notify me and help me build + verify skills if I'm ghosted in the future
            </span>
          </label>
          <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
            Optional. We'll only reach out if you opt in. You control everything.
          </p>
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
