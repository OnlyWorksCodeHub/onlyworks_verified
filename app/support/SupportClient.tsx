'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Mail, Shield, Monitor, Zap, BarChart3, ChevronDown, AlertTriangle, Download, ArrowRight, HelpCircle, LifeBuoy } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { FloatingParticles, GeometricPattern, PulsingRings } from '@/components/ui/grid-background'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { WatermarkText, ConnectionLines, ASCIIBlock, ScanLines } from '@/components/ui/decorative-fills'

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
          <div
            className={`grid transition-all duration-200 ${openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
          >
            <div className="overflow-hidden">
              <div className="pb-6 pl-10 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </div>
            </div>
          </div>
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
          <div className="flex items-center gap-4">
            <a href="https://github.com/Namkha-yolo/ONLYWORKS_UNINSTALLER/releases/download/v1/UninstallOnlyWorks.dmg"
              className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline underline-offset-4 text-foreground">
              <Download className="w-3.5 h-3.5" /> Mac
            </a>
            <a href="https://github.com/Namkha-yolo/ONLYWORKS_UNINSTALLER_WINDOWS/releases/download/v1/UninstallOnlyWorks-Windows.zip"
              className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline underline-offset-4 text-foreground">
              <Download className="w-3.5 h-3.5" /> Windows
            </a>
          </div>
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
        <p>Capture only runs during the sessions you start and stop &mdash; nothing happens when there is no session. You can delete your account and data anytime. For the full picture of what is collected and where it goes, see our <Link href="/privacy" className="font-medium hover:underline underline-offset-4 text-foreground">Privacy</Link> and <Link href="/security" className="font-medium hover:underline underline-offset-4 text-foreground">Security</Link> pages.</p>
      ),
    },
    { question: 'What macOS version do I need?', answer: 'macOS 10.15 (Catalina) or later. Both Apple Silicon (M1, M2, M3, M4) and Intel Macs are supported.' },
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
    { icon: Zap, title: 'AI-Powered Analysis', desc: 'Turns the work you capture in a session into a report.' },
    { icon: BarChart3, title: 'Productivity Insights', desc: 'Sessions, time, focus — see where your time goes.' },
    { icon: Monitor, title: 'Work Sessions', desc: 'You start and stop each session; capture runs only while it\'s on.' },
    { icon: Mail, title: 'Verified Reports', desc: 'AI-generated proof of your skills and accomplishments.' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* ═══ HERO — compact help-desk masthead, narrative-led, jump-links inline (zero void) ═══ */}
      <section className="relative pt-24 lg:pt-28 pb-0 overflow-hidden border-b border-foreground/10">
        <GridLines />
        <ScanLines />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pb-8 lg:pb-10"
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-3">
              <span className="w-8 h-px bg-foreground/30" />
              Help center
            </span>
            <h1 className="text-[clamp(2.5rem,5.5vw,5rem)] font-display leading-[0.95] tracking-tight mb-3 max-w-3xl">
              The resume is broken. The app that replaces it shouldn&apos;t be.
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
              Anyone can type anything onto a resume. The best storyteller gets hired; the person who did the work gets skipped. OnlyWorks throws out the resume and builds proof from your real work instead. This is the help center that keeps your proof running. Pick a topic, get the fix, get back to work.
            </p>
          </motion.div>

          {/* jump-link bar — full-width, flush against the section border, no gap */}
          <motion.nav
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-foreground/10 divide-y sm:divide-y-0 divide-foreground/10"
            aria-label="Help topics"
          >
            {[
              { icon: Download, label: 'Install', href: '#installation', desc: 'Download, set up, sign in' },
              { icon: Shield, label: 'Permissions', href: '#permissions', desc: 'macOS screen + accessibility' },
              { icon: Zap, label: 'What it does', href: '#features', desc: 'Sessions, reports, profile' },
              { icon: HelpCircle, label: 'FAQ', href: '#faq', desc: 'Uninstall, billing, fixes' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-5 py-4 hover:bg-foreground/[0.03] transition-colors group sm:border-l sm:first:border-l-0 lg:border-l border-foreground/10"
              >
                <item.icon className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
                <span className="min-w-0">
                  <span className="block text-sm font-medium group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                  <span className="block text-xs text-muted-foreground truncate">{item.desc}</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </motion.nav>
        </div>
      </section>

      {/* ═══ INSTALLATION — v0 Process section (dark, numbered steps with roman numerals) ═══ */}
      <section id="installation" className="relative py-12 lg:py-16 text-white" style={{ background: '#1c1b18' }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 40px, currentColor 40px, currentColor 41px)`,
            }}
          />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10 lg:mb-12 max-w-2xl">
            <span className="inline-flex items-center gap-3 text-sm font-mono mb-4" style={{ color: 'rgba(250,250,249,0.5)' }}>
              <span className="w-8 h-px" style={{ background: 'rgba(250,250,249,0.3)' }} />
              Install &middot; macOS + Windows
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-display tracking-tight"
            >
              Five steps to your first proof.
            </motion.h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="space-y-0">
              {installSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="py-5 border-b transition-all duration-500 group"
                  style={{ borderColor: 'rgba(250,250,249,0.1)' }}
                >
                  <div className="flex items-start gap-5">
                    <span className="font-display text-2xl shrink-0" style={{ color: 'rgba(250,250,249,0.3)' }}>
                      {['I', 'II', 'III', 'IV', 'V'][i]}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg lg:text-xl font-display mb-1.5 group-hover:translate-x-1 transition-transform duration-300">{step.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(250,250,249,0.6)' }}>{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:sticky lg:top-28 self-start">
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
      <section id="permissions" className="relative py-12 lg:py-16 overflow-hidden">
        <GeometricPattern className="right-0 top-0 w-[350px] h-[350px] opacity-25" />
        <FloatingParticles count={6} />
        <WatermarkText text="SETUP" />
        <ASCIIBlock variant="verify" className="absolute left-12 bottom-16" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
                <span className="w-8 h-px bg-foreground/30" />
                Setup &middot; macOS
              </span>
              <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-4">
                Two permissions, then it works.
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-md">
                The app reads your real work so the proof is real. It needs two macOS permissions to do that, and it prompts you for both on first launch.
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

      {/* ═══ FEATURES — DARK SECTION (v0 Process pattern) ═══ */}
      <section id="features" className="relative py-12 lg:py-16 text-white" style={{ background: '#1c1b18' }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 40px, currentColor 40px, currentColor 41px)`,
            }}
          />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10 lg:mb-12 max-w-2xl">
            <span className="inline-flex items-center gap-3 text-sm font-mono mb-4" style={{ color: 'rgba(250,250,249,0.5)' }}>
              <span className="w-8 h-px" style={{ background: 'rgba(250,250,249,0.3)' }} />
              What it does
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl lg:text-6xl font-display tracking-tight"
            >
              It turns work you did into proof you can send.
            </motion.h2>
          </div>

          <div className="space-y-0">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="py-6 border-b transition-all duration-500 group"
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
      <section id="faq" className="relative py-12 lg:py-16 overflow-hidden">
        <PulsingRings className="left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-20" />
        <ConnectionLines className="opacity-30" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="lg:sticky lg:top-28 self-start">
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
                <span className="w-8 h-px bg-foreground/30" />
                Common questions
              </span>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl lg:text-6xl font-display tracking-tight mb-4"
              >
                FAQ
              </motion.h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
                Install, billing, uninstall, fixes. If the answer isn&apos;t here, <Link href="/support/tickets" className="font-medium hover:underline underline-offset-4 text-foreground">open a support ticket</Link> or email <a href="mailto:support@only-works.com" className="font-medium hover:underline underline-offset-4 text-foreground">support@only-works.com</a>.
              </p>
            </div>

            <div>
              <FAQSection items={faqItems} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA — v0 CTA pattern ═══ */}
      <section className="relative py-12 lg:py-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative border border-foreground"
          >
            <div className="relative z-10 px-8 lg:px-16 py-10 lg:py-12">
              <div className="flex-1">
                <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-4 leading-[0.95]">
                  Still stuck?
                </h2>
                <p className="text-base text-muted-foreground mb-6 leading-relaxed max-w-xl">
                  A real person reads every ticket, usually within 24&ndash;48 hours. Open one with a screenshot or screen recording and we&apos;ll get your proof running again.
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <ShimmerButton
                    shimmerColor="#a78bfa"
                    background="rgba(139, 92, 246, 1)"
                    borderRadius="1.75rem"
                    className="h-14 px-8 text-base font-medium"
                    onClick={() => { window.location.href = '/support/tickets' }}
                  >
                    <LifeBuoy className="w-4 h-4 mr-2" />
                    Open a support ticket
                  </ShimmerButton>
                  <a
                    href="mailto:support@only-works.com"
                    className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    Email support
                  </a>
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
