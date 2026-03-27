'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { setCookie } from '@/lib/cookies'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { motion } from 'framer-motion'
import { GeometricPattern, FloatingParticles } from '@/components/ui/grid-background'

export default function VerifySkillsPage() {
  const searchParams = useSearchParams()
  const [futureOptIn, setFutureOptIn] = useState(false)

  useEffect(() => {
    const source = searchParams.get('src')
    if (source) {
      sessionStorage.setItem('source_partner', source)
      setCookie('ow_src', source, 30)
    }
  }, [searchParams])

  const handleVerifyClick = () => {
    sessionStorage.setItem('first_opt_in', 'true')
    sessionStorage.setItem('future_opt_in', futureOptIn.toString())
    window.location.href = '/pricing'
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#fafaf9' }}>
      <Navigation />

      {/* Hero */}
      <section className="relative py-32 lg:py-40 px-6 md:px-12 lg:px-20 overflow-hidden">
        <GeometricPattern className="right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-50" />
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
            style={{ color: '#a3a19b', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem', letterSpacing: '0.02em' }}
          >
            <span className="w-10 h-px" style={{ background: '#a3a19b' }} />
            Verify your skills
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display tracking-tight text-[clamp(3.5rem,8vw,7rem)]"
            style={{ lineHeight: 0.9, color: '#080503' }}
          >
            This role wasn&apos;t a fit,<br />
            <span style={{ color: '#a3a19b' }}>but your experience still counts.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 max-w-lg text-xl lg:text-2xl leading-relaxed"
            style={{ color: '#57554f' }}
          >
            Verify your projects, skills, and decisions so employers can see what you&apos;ve actually done. Build credible proof that stands out.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10"
          >
            <ShimmerButton
              onClick={handleVerifyClick}
              className="text-sm px-8 py-4"
            >
              Verify My Experience
            </ShimmerButton>
          </motion.div>
        </div>
      </section>

      {/* Future Opt-in */}
      <section className="relative px-6 md:px-12 lg:px-20 py-24 lg:py-32 overflow-hidden" style={{ background: '#f5f5f4' }}>
        <FloatingParticles count={6} />
        <GeometricPattern className="left-0 bottom-0 w-[300px] h-[300px] opacity-20" />
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="relative rounded-2xl p-12 md:p-16 overflow-hidden" style={{ background: '#fafaf9', border: '1px solid #dad7d0' }}>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight" style={{ color: '#080503' }}>
              Want us to help if you<br /><span style={{ color: '#a3a19b' }}>get ghosted again?</span>
            </h2>
            <label className="mt-8 flex items-start gap-3 cursor-pointer text-left max-w-lg">
              <input
                type="checkbox"
                checked={futureOptIn}
                onChange={(e) => setFutureOptIn(e.target.checked)}
                className="mt-1.5"
              />
              <span className="text-base leading-relaxed" style={{ color: '#57554f' }}>
                Notify me and help me build + verify skills if I&apos;m ghosted in the future
              </span>
            </label>
            <p className="mt-4 text-sm" style={{ color: '#a3a19b' }}>
              Optional. We&apos;ll only reach out if you opt in. You control everything.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
