'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { GeometricPattern } from '@/components/ui/grid-background'
import { BinaryRain, CodeDecoration, WatermarkText, ScanLines } from '@/components/ui/decorative-fills'

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

const creed = [
  { title: 'Proof beats prose.', desc: 'A claim is worth nothing. The work is worth everything. We only build profiles from what you actually did.' },
  { title: 'You can’t fake having done it.', desc: 'Every skill on your profile is corroborated against your real captured work. No corroboration, no badge.' },
  { title: 'The best worker, not the best writer.', desc: 'The resume rewards whoever sounds most impressive. We surface whoever shipped the most. Those are not the same person.' },
  { title: 'You run it. Not the other way around.', desc: 'Capture only happens during sessions you start and stop. You decide what lands on your profile and who gets the link.' },
  { title: 'Free for the people doing the work.', desc: 'Job seekers pay nothing. The report, the profile, the shareable link — all free. We charge the hiring side, not you.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* ═══ HERO · MANIFESTO OPEN ═══ */}
      <section className="relative pt-24 lg:pt-28 pb-12 lg:pb-16 overflow-hidden">
        <GridLines />
        <GeometricPattern className="right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-40" />
        <BinaryRain />
        <CodeDecoration side="right" />
        <ScanLines />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-5"
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
              <span className="w-8 h-px bg-foreground/30" />
              A manifesto · why we&apos;re killing the resume
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2.5rem,5.5vw,5rem)] font-display leading-[0.95] tracking-tight mb-6"
          >
            <span className="block">The resume</span>
            <span className="block text-muted-foreground">is a lie.</span>
          </motion.h1>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-16 items-end">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-lg lg:text-xl leading-snug max-w-2xl"
            >
              Anyone can write anything on a resume. Exaggerate it, embellish it, fake it outright — and the best storyteller gets the job while the person who actually did the work gets skipped. We built OnlyWorks to end that. <span className="text-muted-foreground">It&apos;s the new resume: proof from your real work, not a list of claims you hope nobody checks.</span>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="flex flex-col sm:flex-row lg:flex-col items-start gap-3 lg:items-stretch"
            >
              <Link
                href="/downloads"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium text-white transition-all hover:opacity-90 group"
                style={{ background: '#8b5cf6' }}
              >
                Download free
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/talent"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium transition-all hover:bg-[#8b5cf6]/10 group"
                style={{ border: '1.5px solid #8b5cf6', color: '#8b5cf6' }}
              >
                Join Talent Community
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ THE ARGUMENT · WHY THE RESUME FAILS ═══ */}
      <section className="relative py-10 lg:py-14 overflow-hidden">
        <WatermarkText text="BROKEN" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
                <span className="w-8 h-px bg-foreground/30" />
                The argument
              </span>
              <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-6 leading-[0.95]">
                Hiring is broken.<br /><span className="text-muted-foreground">We know why.</span>
              </h2>
              <div className="space-y-4 text-lg lg:text-xl leading-snug max-w-xl">
                <p>A resume is a list of claims nobody checks. Whoever writes the best bullet points wins — not whoever did the best work.</p>
                <p>So people exaggerate. They embellish. They invent. And now AI generates polished fake experience by the thousand, faster than anyone can read it.</p>
                <p className="text-muted-foreground">The honest builder gets buried under fiction. We think that&apos;s backwards. So we replaced the document with the evidence.</p>
              </div>
            </motion.div>

            {/* resume vs proof — the contrast, not a stat grid */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="grid sm:grid-cols-2 gap-px bg-foreground/10 border border-foreground/10"
            >
              <div className="bg-background p-6 lg:p-8">
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-5">The resume</div>
                <ul className="space-y-4 text-base leading-relaxed">
                  {[
                    'Anyone can write anything.',
                    'Rewards the best storyteller.',
                    'Unverifiable by design.',
                    'AI fills it with fake bullets.',
                  ].map((t, i) => (
                    <li key={i} className="flex gap-3 text-muted-foreground">
                      <span className="font-mono text-foreground/30">✕</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-background p-6 lg:p-8" style={{ boxShadow: 'inset 3px 0 0 #8b5cf6' }}>
                <div className="font-mono text-xs uppercase tracking-widest mb-5" style={{ color: '#8b5cf6' }}>OnlyWorks</div>
                <ul className="space-y-4 text-base leading-relaxed">
                  {[
                    'Built only from work you did.',
                    'Rewards the best worker.',
                    'Every skill AI-corroborated.',
                    'Can’t be faked into existence.',
                  ].map((t, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-mono" style={{ color: '#8b5cf6' }}>◆</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ DOCS · HOW IT WORKS ═══ */}
      <section id="how-it-works" className="relative py-10 lg:py-14 overflow-hidden" style={{ scrollMarginTop: 96 }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]" aria-hidden="true" style={{ backgroundImage: `repeating-linear-gradient(135deg, transparent, transparent 30px, #080503 30px, #080503 31px)` }} />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
              <span className="w-8 h-px bg-foreground/30" />
              How it works
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-display tracking-tight mb-6"
            >
              Three steps,<br /><span className="text-muted-foreground">no friction.</span>
            </motion.h2>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              OnlyWorks turns what you actually did into a report you can share — built from the work you capture during sessions you start.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-px bg-foreground/10">
            {[
              {
                n: '01',
                title: 'Install',
                lede: 'Download the OnlyWorks desktop app. Sign in once.',
                detail: 'macOS (Apple Silicon + Intel) and Windows. Free to install for job seekers. Sign in with Google, LinkedIn, or email.',
                cta: { label: 'Download free', href: '/downloads' },
              },
              {
                n: '02',
                title: 'Capture',
                lede: 'Start a session and work normally.',
                detail: 'As you write code, run tests, ship features, build hardware, write docs — OnlyWorks captures your work during the session you started. Stop it whenever you want.',
                cta: { label: 'See what a report looks like', href: '#sample' },
              },
              {
                n: '03',
                title: 'Share',
                lede: 'Generate an AI-written report. Send the link.',
                detail: 'Each report lives on your OnlyWorks Profile as one shareable link. Recruiters, clients, judges — anyone with the link can read it. Links expire by default after about 30 days.',
                cta: { label: 'View a sample report', href: '#sample' },
              },
            ].map(step => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.05 * Number(step.n) }}
                className="bg-background p-8 lg:p-10"
              >
                <div className="flex items-baseline justify-between mb-6">
                  <div className="font-display text-7xl lg:text-8xl tracking-tight" style={{ color: '#8b5cf6' }}>
                    {step.n}
                  </div>
                  <div className="text-sm font-mono text-muted-foreground">step</div>
                </div>
                <h3 className="font-display text-3xl lg:text-4xl tracking-tight mb-3">{step.title}</h3>
                <p className="text-lg leading-relaxed mb-4">{step.lede}</p>
                <p className="text-base text-muted-foreground leading-relaxed mb-6">{step.detail}</p>
                <Link
                  href={step.cta.href}
                  className="inline-flex items-center gap-2 text-sm font-medium group"
                  style={{ color: '#8b5cf6' }}
                >
                  {step.cta.label}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DOCS · SAMPLE REPORT ═══ */}
      <section id="sample" className="relative py-10 lg:py-14 overflow-hidden" style={{ scrollMarginTop: 96 }}>
        <WatermarkText text="REPORT" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
                <span className="w-8 h-px bg-foreground/30" />
                What a report looks like
              </span>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="text-4xl lg:text-6xl font-display tracking-tight mb-6"
              >
                One link.<br /><span className="text-muted-foreground">Whole story.</span>
              </motion.h2>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-6">
                A report is a public-by-link page on your OnlyWorks Profile. Summary, key accomplishments, skills, strengths, next steps — everything someone needs to know what you actually did is on one URL.
              </p>
              <ul className="space-y-3 text-base">
                {[
                  ['◆', 'Verified xN. Each skill is corroborated against your real captured work.'],
                  ['◇', 'Shareable by link — anyone with it can read the report.'],
                  ['◌', 'Yours to control. Choose what goes on your profile and who gets the link.'],
                  ['○', 'Time-boxed. Share links expire by default after about 30 days.'],
                ].map(([g, t], i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-mono" style={{ color: '#8b5cf6' }}>{g}</span>
                    <span className="text-muted-foreground leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/downloads"
                  className="inline-flex items-center gap-2 h-12 px-6 text-sm rounded-full font-medium text-white transition-all hover:opacity-90 group"
                  style={{ background: '#8b5cf6' }}
                >
                  Download free
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* mock report card */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-7"
            >
              <div className="border border-foreground/10 bg-white">
                {/* browser-style header */}
                <div className="px-5 py-3 border-b border-foreground/10 flex items-center justify-between bg-foreground/[0.02]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
                    <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">only-works.com/r/3kf9zq</div>
                  <div className="text-xs font-mono" style={{ color: '#16a34a' }}>● verified</div>
                </div>

                <div className="p-6 lg:p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="font-mono text-xs text-muted-foreground mb-1">Report · sample</div>
                      <h3 className="font-display text-3xl tracking-tight">Sample report</h3>
                      <div className="text-sm text-muted-foreground">Anonymized example · what a report looks like</div>
                    </div>
                    <div
                      className="px-3 py-1.5 text-xs font-mono"
                      style={{ background: '#ede9fe', color: '#6d28d9' }}
                    >
                      ◆ Verified
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="font-mono text-xs text-muted-foreground mb-3">Overview</div>
                    <div className="grid grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
                      {[
                        ['Skills verified', '8'],
                        ['Sessions',        '6'],
                        ['Accomplishments', '5'],
                      ].map(([k, v]) => (
                        <div key={k} className="bg-white p-4">
                          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{k}</div>
                          <div className="font-display text-xl tracking-tight">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="font-mono text-xs text-muted-foreground mb-3">Skills used</div>
                    <ul className="space-y-2 text-sm">
                      {[
                        ['◆', 'Backend development · Verified x4'],
                        ['◆', 'Debugging & testing · Verified x3'],
                        ['◆', 'Technical writing · Verified x2'],
                        ['◆', 'Project planning · Verified x2'],
                      ].map(([g, t], i) => (
                        <li key={i} className="flex gap-3">
                          <span style={{ color: '#8b5cf6' }}>{g}</span>
                          <span className="text-muted-foreground">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-foreground/10 flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>only-works.com/r/3kf9zq</span>
                    <span>AI-verified report</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ DOCS · FOR ONLYWEIRD BUILDERS ═══ */}
      <section id="hackathon" className="relative py-10 lg:py-14 overflow-hidden" style={{ scrollMarginTop: 96, background: '#f5f5f4' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" aria-hidden="true" style={{ backgroundImage: `radial-gradient(circle, #080503 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
                <span className="w-8 h-px bg-foreground/30" />
                For ONLYWEIRD &apos;26 builders
              </span>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="text-4xl lg:text-6xl font-display tracking-tight"
              >
                Verify your<br /><span className="text-muted-foreground">weird build.</span>
              </motion.h2>
            </div>
            <Link
              href="/hackathon"
              className="inline-flex items-center gap-2 h-12 px-6 text-sm rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all group"
            >
              ↩ Back to ONLYWEIRD
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mb-12">
            Register, install the desktop app, and run a session while you build. It&apos;s fully online. Here&apos;s the path, start to finish.
          </p>

          <ol className="grid lg:grid-cols-2 gap-4">
            {[
              {
                n: '01',
                title: 'Register for ONLYWEIRD',
                body: 'Fill out the registration card to lock in your spot. The event is fully online.',
                href: '/hackathon/register',
                cta: 'Register card →',
              },
              {
                n: '02',
                title: 'Install OnlyWorks',
                body: 'Free desktop app for macOS and Windows. Sign in with Google, LinkedIn, or email. Takes ~60 seconds.',
                href: '/downloads',
                cta: 'Download →',
              },
              {
                n: '03',
                title: 'Start a session',
                body: 'Open the app and start a session whenever you sit down to build. It captures your work until you stop it.',
                href: '#how-it-works',
                cta: 'See how it works →',
              },
              {
                n: '04',
                title: 'Build during the window',
                body: 'Thu 18 Jun 17:00 ET → Sat 20 Jun 17:00 ET — a 48-hour window. Build whatever weird thing you want, fully online.',
                href: '/hackathon/schedule',
                cta: 'See schedule →',
              },
              {
                n: '05',
                title: 'Submit your build',
                body: 'From the dashboard. Add your demo, README, and repo URL before the window closes.',
                href: '/hackathon/rules#submissions',
                cta: 'Submission rules →',
              },
              {
                n: '06',
                title: 'Generate your report',
                body: 'OnlyWorks turns your sessions into an AI-written report on your profile. Share the link with judges and recruiters. Finals are live-streamed.',
                href: '/hackathon/certificate',
                cta: 'See a sample →',
              },
            ].map(step => (
              <motion.li
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.04 * Number(step.n) }}
                className="bg-white border border-foreground/10 p-6 lg:p-8 group hover:border-foreground/30 transition-colors"
              >
                <div className="flex items-start gap-5">
                  <div className="font-display text-5xl tracking-tight flex-shrink-0" style={{ color: '#8b5cf6' }}>
                    {step.n}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl tracking-tight mb-2">{step.title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed mb-4">{step.body}</p>
                    <Link
                      href={step.href}
                      className="inline-flex items-center gap-2 text-sm font-medium"
                      style={{ color: '#8b5cf6' }}
                    >
                      {step.cta}
                    </Link>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>

          <div className="mt-12 p-6 lg:p-8 border border-foreground/20 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <div className="font-mono text-xs text-muted-foreground mb-2">When something goes sideways</div>
                <div className="font-display text-2xl tracking-tight mb-1">We answer questions in &lt; 24h.</div>
                <p className="text-base text-muted-foreground">
                  Email <a href="mailto:weird@only-works.com" className="underline" style={{ color: '#8b5cf6' }}>weird@only-works.com</a> · or drop into Discord (link in your registration confirmation).
                </p>
              </div>
              <Link
                href="/hackathon/register"
                className="inline-flex items-center gap-2 h-12 px-6 text-sm rounded-full font-medium text-white transition-all hover:opacity-90 group"
                style={{ background: '#8b5cf6' }}
              >
                Register for ONLYWEIRD &apos;26
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MANIFESTO CREED — DARK SECTION ═══ */}
      <section className="relative py-10 lg:py-14" style={{ background: '#1c1b18', color: '#fafaf9' }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 40px, currentColor 40px, currentColor 41px)` }} />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <span className="inline-flex items-center gap-3 text-sm font-mono mb-4" style={{ color: 'rgba(250,250,249,0.5)' }}>
              <span className="w-8 h-px" style={{ background: 'rgba(250,250,249,0.3)' }} />
              The creed
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-display tracking-tight"
              style={{ color: '#fafaf9' }}
            >
              What we<br /><span style={{ color: 'rgba(250,250,249,0.4)' }}>stand on.</span>
            </motion.h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-0">
              {creed.map((v, i) => (
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
                      {['I', 'II', 'III', 'IV', 'V', 'VI'][i]}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-2xl lg:text-3xl font-display mb-2 group-hover:translate-x-2 transition-transform duration-300" style={{ color: '#fafaf9' }}>{v.title}</h3>
                      <p className="leading-relaxed" style={{ color: 'rgba(250,250,249,0.6)' }}>{v.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:sticky lg:top-32 self-start">
              <div className="border overflow-hidden" style={{ borderColor: 'rgba(250,250,249,0.1)' }}>
                <div className="px-6 py-3 border-b flex items-center justify-between" style={{ borderColor: 'rgba(250,250,249,0.1)' }}>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(250,250,249,0.2)' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(250,250,249,0.2)' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(250,250,249,0.2)' }} />
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'rgba(250,250,249,0.4)' }}>manifest.json</span>
                </div>
                <div className="p-6 font-mono text-sm" style={{ color: 'rgba(250,250,249,0.7)' }}>
                  <div className="leading-loose">{'{'}</div>
                  <div className="leading-loose pl-4">&quot;mission&quot;: &quot;make work visible&quot;,</div>
                  <div className="leading-loose pl-4">&quot;capture&quot;: &quot;session-based&quot;,</div>
                  <div className="leading-loose pl-4">&quot;verification&quot;: &quot;AI-corroborated&quot;,</div>
                  <div className="leading-loose pl-4">&quot;output&quot;: &quot;one shareable link&quot;,</div>
                  <div className="leading-loose pl-4">&quot;platforms&quot;: [&quot;macOS&quot;, &quot;Windows&quot;],</div>
                  <div className="leading-loose pl-4">&quot;freeForJobSeekers&quot;: true</div>
                  <div className="leading-loose">{'}'}</div>
                </div>
                <div className="px-6 py-3 border-t flex items-center gap-3" style={{ borderColor: 'rgba(250,250,249,0.1)' }}>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-mono" style={{ color: 'rgba(250,250,249,0.4)' }}>Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-10 lg:py-14 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]" aria-hidden="true" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 30px, #080503 30px, #080503 31px)` }} />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative border border-foreground"
          >
            <div className="relative z-10 px-8 lg:px-16 py-10 lg:py-12">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-6 leading-[0.95]">
                    Stop describing<br />the work. Prove it.
                  </h2>
                  <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                    The resume is the old way. Build your profile from what you actually did — and let the work speak for itself.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Link
                      href="/downloads"
                      className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base rounded-full font-medium text-white transition-all hover:opacity-90 group"
                      style={{ background: '#8b5cf6' }}
                    >
                      Download free
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center h-14 px-8 text-base rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
                    >
                      Contact us
                    </Link>
                  </div>
                  <p className="text-sm text-muted-foreground mt-6 font-mono">No credit card required</p>
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
