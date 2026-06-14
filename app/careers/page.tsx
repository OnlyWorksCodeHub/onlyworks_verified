'use client'

import Link from 'next/link'
import { Mail, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation />

      <main className="flex-1 flex items-center justify-center px-6 lg:px-12 pt-24 pb-20">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Careers
            </span>

            <h1 className="text-5xl lg:text-7xl font-display tracking-tight leading-[1.0] mb-8">
              No open roles<br />
              <span className="text-muted-foreground">right now.</span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-4 max-w-xl">
              We're a small, focused team and not actively hiring at the moment. Thanks for your interest in OnlyWorks.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-xl">
              If you think you'd be a great fit and want to be considered when we open roles, send a short note explaining what you'd want to work on.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:team@only-works.com?subject=Careers%20%E2%80%94%20interested%20in%20OnlyWorks"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium text-white transition-all hover:opacity-90 group"
                style={{ background: '#8b5cf6' }}
              >
                <Mail className="w-4 h-4" />
                Email team@only-works.com
              </a>
              <Link
                href="/talent"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium transition-all hover:bg-[#8b5cf6]/10 group"
                style={{ border: '1.5px solid #8b5cf6', color: '#8b5cf6' }}
              >
                Or join the Talent Community
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <p className="text-sm font-mono text-muted-foreground mt-12">
              Last updated · {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
