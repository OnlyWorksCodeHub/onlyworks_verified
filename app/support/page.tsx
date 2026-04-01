'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Mail, Shield, Monitor, Zap, BarChart3, ChevronDown, AlertTriangle, Download, ArrowRight, HelpCircle } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { FloatingParticles, GridBackground, GeometricPattern, PulsingRings } from '@/components/ui/grid-background'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { BinaryRain, WatermarkText, ConnectionLines, ASCIIBlock, ScanLines } from '@/components/ui/decorative-fills'

interface FAQItem {
  question: string
  answer: string | React.ReactNode
}

function FAQSection({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  return (
    <div>
      {items.map((item, index) => (
        <div key={index} className="border-t border-foreground/10">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full py-6 flex items-center justify-between text-left cursor-pointer transition-colors group"
            aria-expanded={openIndex === index}
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono text-muted-foreground shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">{item.question}</span>
            </div>
            <ChevronDown className={`w-4 h-4 shrink-0 ml-4 text-muted-foreground transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`} />
          </button>
          {openIndex === index && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pb-6 pl-10 text-sm leading-relaxed text-muted-foreground"
            >
              {item.answer}
            </motion.div>
          )}
        </div>
      ))}
    </div>
  )
}

function GridLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {[12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100].map((t) => (
        <div key={`h-${t}`} className="absolute h-px bg-foreground/10" style={{ top: `${t}%`, left: 0, right: 0 }} />
      ))}
      {[8.33, 16.66, 24.99, 33.32, 41.65, 49.98, 58.31, 66.64, 74.97, 83.3, 91.63, 99.96].map((l) => (
        <div key={`v-${l}`} className="absolute w-px bg-foreground/10" style={{ left: `${l}%`, top: 0, bottom: 0 }} />
      ))}
    </div>
  )
}

export default function SupportPage() {
  const faqItems: FAQItem[] = [
    {
      question: 'How do I completely uninstall the app?',
      answer: (
        <div>
          <p className="mb-3">Download our uninstaller to completely remove OnlyWorks and all its data.</p>
          <a href="https://github.com/Namkha-yolo/ONLYWORKS_UNINSTALLER/releases/download/v1/UninstallOnlyWorks.dmg"
            className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline underline-offset-4 text-foreground">
            <Download className="w-3.5 h-3.5" /> Download Uninstaller
          </a>
        </div>
      ),
    },
    {
      question: 'The app is not starting. What should I do?',
      answer: (
        <ol className="list-decimal list-inside space-y-1.5">
          <li>Make sure the app is in your Applications folder</li>
          <li>Right-click the app and select &quot;Open&quot; (bypasses Gatekeeper)</li>
          <li>Check System Settings &rarr; Privacy & Security for blocked app warnings</li>
          <li>Try uninstalling and reinstalling</li>
        </ol>
      ),
    },
    {
      question: 'Permissions are not working. How do I fix this?',
      answer: (
        <div>
          <ol className="list-decimal list-inside space-y-1.5 mb-3">
            <li>System Settings &rarr; Privacy & Security &rarr; Screen Recording</li>
            <li>Toggle OnlyWorks OFF then ON</li>
            <li>Do the same for Accessibility</li>
            <li>Restart the app</li>
          </ol>
          <div className="flex gap-2 p-3 border border-foreground/10 bg-foreground/[0.02]">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
            <p className="text-xs">Add to <strong>&quot;Screen & System Audio Recording&quot;</strong>, NOT &quot;System Audio Recording Only&quot;.</p>
          </div>
        </div>
      ),
    },
    { question: 'How does the app update?', answer: 'OnlyWorks checks for updates automatically on launch. Updates download in the background and prompt you to restart.' },
    {
      question: 'Is my data private and secure?',
      answer: (
        <ul className="list-disc list-inside space-y-1.5">
          <li>Screenshots processed locally when possible</li>
          <li>Data encrypted in transit and at rest</li>
          <li>Never sold to third parties</li>
          <li>Delete your account and data anytime</li>
        </ul>
      ),
    },
    { question: 'What macOS version do I need?', answer: 'macOS 10.15 (Catalina) or later. Runs natively on Apple Silicon and Intel.' },
    {
      question: 'How do I cancel my subscription?',
      answer: (<p>Go to your <Link href="/account" className="font-medium hover:underline underline-offset-4 text-foreground">Account page</Link> or email <a href="mailto:support@only-works.com" className="font-medium hover:underline underline-offset-4 text-foreground">support@only-works.com</a>.</p>),
    },
  ]

  const installSteps = [
    { title: 'Download the app', desc: <>Go to <Link href="/downloads" className="font-medium hover:underline underline-offset-4 text-foreground">Downloads</Link> and pick your platform.</> },
    { title: 'Install', desc: 'Open the DMG, drag OnlyWorks to Applications.' },
    { title: 'Launch', desc: 'Right-click \u2192 Open on first launch to bypass macOS security.' },
    { title: 'Grant permissions', desc: 'Follow the prompts for Screen Recording and Accessibility.' },
    { title: 'Sign in & go', desc: 'Sign in with Google, set up your profile, start working.' },
  ]

  const permissions = [
    { icon: Monitor, title: 'Screen Recording', desc: 'Required to capture screenshots for work analysis.', path: 'System Settings \u2192 Privacy \u2192 Screen Recording', warning: 'Add to "Screen & System Audio Recording", NOT "System Audio Recording Only".' },
    { icon: Shield, title: 'Accessibility', desc: 'Required for keyboard shortcuts and system features.', path: 'System Settings \u2192 Privacy \u2192 Accessibility', warning: null },
  ]

  const features = [
    { icon: Zap, title: 'AI-Powered Analysis', desc: 'Understands what you\'re working on from screen activity.' },
    { icon: BarChart3, title: 'Productivity Insights', desc: 'Sessions, time, focus — see where your time goes.' },
    { icon: Monitor, title: 'Work Sessions', desc: 'Recognizes when you start and stop working.' },
    { icon: Mail, title: 'Verified Reports', desc: 'AI-generated proof of your skills and accomplishments.' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* ═══ HERO — left-aligned, v0 hero pattern ═══ */}
      <section className="relative pt-28 lg:pt-32 pb-12 lg:pb-16 overflow-hidden">
        <GridLines />
        <FloatingParticles count={12} />
        <BinaryRain />
        <ScanLines />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
              <span className="w-8 h-px bg-foreground/30" />
              Help center
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(3.5rem,8vw,7rem)] font-display leading-[0.9] tracking-tight mb-12"
          >
            <span className="block">Help</span>
            <span className="block text-muted-foreground">Center</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl"
          >
            Everything you need to get started with OnlyWorks.
          </motion.p>
        </div>
      </section>

      {/* ═══ QUICK LINKS — v0 Metrics 2x2 grid ═══ */}
      <section className="relative py-12 lg:py-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-foreground/10">
            {[
              { icon: Download, label: 'Installation', href: '#installation', desc: 'Get up and running' },
              { icon: Shield, label: 'Permissions', href: '#permissions', desc: 'macOS setup guide' },
              { icon: Zap, label: 'Features', href: '#features', desc: 'What\'s included' },
              { icon: HelpCircle, label: 'FAQ', href: '#faq', desc: 'Common questions' },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-background flex flex-col items-center gap-4 py-12 lg:py-16 hover:bg-foreground/[0.03] transition-all duration-300 group"
              >
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center border border-foreground/10 group-hover:bg-foreground group-hover:text-background group-hover:scale-110 transition-all duration-300" style={{ background: '#f5f5f4' }}>
                  <item.icon className="w-9 h-9" strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  <span className="block text-sm font-medium mb-1">{item.label}</span>
                  <span className="block text-xs text-muted-foreground">{item.desc}</span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INSTALLATION — v0 Process section (dark, numbered steps with roman numerals) ═══ */}
      <section id="installation" className="relative py-24 lg:py-32 text-white" style={{ background: '#1c1b18' }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 40px, currentColor 40px, currentColor 41px)`,
            }}
          />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-16 lg:mb-24">
            <span className="inline-flex items-center gap-3 text-sm font-mono mb-6" style={{ color: 'rgba(250,250,249,0.5)' }}>
              <span className="w-8 h-px" style={{ background: 'rgba(250,250,249,0.3)' }} />
              Getting started
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-display tracking-tight"
            >
              Five steps.<br /><span style={{ color: 'rgba(250,250,249,0.5)' }}>That&apos;s it.</span>
            </motion.h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div className="space-y-0">
              {installSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="py-8 border-b transition-all duration-500 group"
                  style={{ borderColor: 'rgba(250,250,249,0.1)' }}
                >
                  <div className="flex items-start gap-6">
                    <span className="font-display text-3xl" style={{ color: 'rgba(250,250,249,0.3)' }}>
                      {['I', 'II', 'III', 'IV', 'V'][i]}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-2xl lg:text-3xl font-display mb-3 group-hover:translate-x-2 transition-transform duration-300">{step.title}</h3>
                      <p className="leading-relaxed" style={{ color: 'rgba(250,250,249,0.6)' }}>{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:sticky lg:top-32 self-start">
              <div className="border overflow-hidden" style={{ borderColor: 'rgba(250,250,249,0.1)' }}>
                <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(250,250,249,0.1)' }}>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(250,250,249,0.2)' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(250,250,249,0.2)' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(250,250,249,0.2)' }} />
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'rgba(250,250,249,0.4)' }}>install.sh</span>
                </div>
                <div className="p-8 font-mono text-sm min-h-[280px]" style={{ color: 'rgba(250,250,249,0.7)' }}>
                  <div className="leading-loose"><span style={{ color: 'rgba(250,250,249,0.2)' }}>1 </span># Step 1: Download</div>
                  <div className="leading-loose"><span style={{ color: 'rgba(250,250,249,0.2)' }}>2 </span>curl -O onlyworks.app/dl</div>
                  <div className="leading-loose"><span style={{ color: 'rgba(250,250,249,0.2)' }}>3 </span>&nbsp;</div>
                  <div className="leading-loose"><span style={{ color: 'rgba(250,250,249,0.2)' }}>4 </span># Step 2: Install</div>
                  <div className="leading-loose"><span style={{ color: 'rgba(250,250,249,0.2)' }}>5 </span>open OnlyWorks.dmg</div>
                  <div className="leading-loose"><span style={{ color: 'rgba(250,250,249,0.2)' }}>6 </span>&nbsp;</div>
                  <div className="leading-loose"><span style={{ color: 'rgba(250,250,249,0.2)' }}>7 </span># Step 3: Launch & go</div>
                  <div className="leading-loose"><span style={{ color: 'rgba(250,250,249,0.2)' }}>8 </span>open /Applications/OnlyWorks.app</div>
                </div>
                <div className="px-6 py-4 border-t flex items-center gap-3" style={{ borderColor: 'rgba(250,250,249,0.1)' }}>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-mono" style={{ color: 'rgba(250,250,249,0.4)' }}>Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PERMISSIONS — v0 Security pattern (2-col grid with icon cards) ═══ */}
      <section id="permissions" className="relative py-24 lg:py-32 overflow-hidden">
        <GeometricPattern className="right-0 top-0 w-[350px] h-[350px] opacity-25" />
        <FloatingParticles count={6} />
        <WatermarkText text="SETUP" />
        <ASCIIBlock variant="verify" className="absolute left-12 bottom-16" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
                <span className="w-8 h-px bg-foreground/30" />
                Setup
              </span>
              <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
                Permissions<br /><span className="text-muted-foreground">(macOS).</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-12">
                OnlyWorks needs two permissions. The app will prompt you on first launch.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Screen Recording', 'Accessibility'].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
                    className="px-4 py-2 border border-foreground/10 text-sm font-mono"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-6">
              {permissions.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-6 border border-foreground/10 hover:border-foreground/20 transition-all duration-500 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 flex items-center justify-center border border-foreground/10 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                      <p.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1 group-hover:translate-x-1 transition-transform duration-300">{p.title}</h3>
                      <p className="text-muted-foreground mb-2">{p.desc}</p>
                      <p className="text-xs font-mono text-muted-foreground">{p.path}</p>
                      {p.warning && (
                        <div className="flex gap-2 mt-3 p-3 border border-foreground/10 bg-foreground/[0.02]">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground" />
                          <p className="text-xs">{p.warning}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GRID BACKGROUND DIVIDER ═══ */}
      <section className="relative overflow-hidden py-16">
        <GridBackground />
      </section>

      {/* ═══ FEATURES — DARK SECTION (v0 Process pattern) ═══ */}
      <section id="features" className="relative py-24 lg:py-32 text-white" style={{ background: '#1c1b18' }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 40px, currentColor 40px, currentColor 41px)`,
            }}
          />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-16 lg:mb-24">
            <span className="inline-flex items-center gap-3 text-sm font-mono mb-6" style={{ color: 'rgba(250,250,249,0.5)' }}>
              <span className="w-8 h-px" style={{ background: 'rgba(250,250,249,0.3)' }} />
              Features
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-display tracking-tight"
            >
              What&apos;s<br /><span style={{ color: 'rgba(250,250,249,0.5)' }}>included.</span>
            </motion.h2>
          </div>

          <div className="space-y-0">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="py-8 border-b transition-all duration-500 group"
                style={{ borderColor: 'rgba(250,250,249,0.1)' }}
              >
                <div className="flex items-start gap-6">
                  <span className="font-display text-3xl" style={{ color: 'rgba(250,250,249,0.3)' }}>
                    {['I', 'II', 'III', 'IV'][i]}
                  </span>
                  <div className="flex-1 grid lg:grid-cols-2 gap-4 items-center">
                    <h3 className="text-2xl lg:text-3xl font-display group-hover:translate-x-2 transition-transform duration-300">{f.title}</h3>
                    <p className="leading-relaxed" style={{ color: 'rgba(250,250,249,0.6)' }}>{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ — accordion ═══ */}
      <section id="faq" className="relative py-24 lg:py-32 overflow-hidden">
        <PulsingRings className="left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-20" />
        <ConnectionLines className="opacity-30" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
                <span className="w-8 h-px bg-foreground/30" />
                Common questions
              </span>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="text-4xl lg:text-6xl font-display tracking-tight mb-8"
              >
                FAQ
              </motion.h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Can&apos;t find what you need? Reach out to our support team.
              </p>
            </div>

            <div>
              <FAQSection items={faqItems} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA — v0 CTA pattern ═══ */}
      <section className="relative py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative border border-foreground"
          >
            <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
              <div className="flex-1">
                <h2 className="text-4xl lg:text-7xl font-display tracking-tight mb-8 leading-[0.95]">
                  Still need<br />help?
                </h2>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl">
                  We usually respond within a few hours. Our team is here to help.
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <ShimmerButton
                    shimmerColor="#a78bfa"
                    background="rgba(139, 92, 246, 1)"
                    borderRadius="1.75rem"
                    className="h-14 px-8 text-base font-medium"
                    onClick={() => window.location.href = 'mailto:support@only-works.com'}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email support
                  </ShimmerButton>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
                  >
                    Contact us
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-foreground/10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10" />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
