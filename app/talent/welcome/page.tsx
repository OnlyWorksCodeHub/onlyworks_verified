'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, Download, ArrowRight, Check } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

function WelcomeInner() {
  const searchParams = useSearchParams()
  const owId = searchParams.get('owId') || ''

  const profileHref = owId ? `/p/${owId}` : '/'

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="pt-32 lg:pt-40 pb-20">
        <div className="max-w-2xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 mb-8 border border-foreground/10"
            style={{ background: 'rgba(139,92,246,0.06)' }}
          >
            <Check className="w-8 h-8" style={{ color: '#8b5cf6' }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-display tracking-tight mb-6 leading-[1.05]"
          >
            You're in.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground leading-relaxed mb-3"
          >
            Hiring managers can now find you when they search for verified skills.
          </motion.p>

          {owId && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm font-mono text-muted-foreground mb-12"
            >
              Your profile: <Link href={profileHref} className="text-foreground hover:underline underline-offset-4">/p/{owId}</Link>
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href={profileHref}
              className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base font-medium rounded-full text-white hover:opacity-90 transition-all"
              style={{ background: '#8b5cf6' }}
            >
              <Eye className="w-4 h-4" />
              View my profile
            </Link>
            <Link
              href="/downloads"
              className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base font-medium rounded-full border border-foreground/20 hover:bg-foreground/5 transition-all"
            >
              <Download className="w-4 h-4" />
              Download desktop app
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-sm text-muted-foreground mt-12 max-w-md mx-auto leading-relaxed"
          >
            Want to stand out more? Connect real work via the desktop app — verified candidates rank higher in hiring-manager searches and show real evidence of skills.
          </motion.p>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <WelcomeInner />
    </Suspense>
  )
}
