'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'
import { GeometricPattern, PulsingRings, GridBackground, FloatingParticles } from '@/components/ui/grid-background'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { BinaryRain, CodeDecoration, WatermarkText, ConnectionLines, ASCIIBlock, ScanLines } from '@/components/ui/decorative-fills'

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

const values = [
  { title: 'Privacy first', desc: 'End-to-end encrypted. You control what gets verified and who sees it.' },
  { title: 'AI that serves you', desc: 'AI builds your proof — on your terms. You own every report.' },
  { title: 'Full transparency', desc: 'See everything captured. Delete anything, anytime.' },
  { title: 'Trust through proof', desc: 'Not through promises. Verified work builds real credibility.' },
  { title: 'Precision matters', desc: 'AI-verified with human review. Your skills deserve correct representation.' },
  { title: 'Speed', desc: 'Reports in seconds. Your time is too valuable to waste.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* ═══ HERO ═══ */}
      <section className="relative py-28 lg:py-36 overflow-hidden">
        <GridLines />
        <GeometricPattern className="right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-50" />
        <BinaryRain />
        <CodeDecoration side="right" />
        <ScanLines />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
              <span className="w-8 h-px bg-foreground/30" />
              About
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(3.5rem,8vw,7rem)] font-display leading-[0.9] tracking-tight mb-8"
          >
            <span className="block">Proof, not</span>
            <span className="block text-muted-foreground">promises</span>
          </motion.h1>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-end">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl"
            >
              In a world of remote work and AI automation, proving real work happened matters more than ever.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-3 lg:justify-end"
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

      {/* ═══ MISSION IMAGE ═══ */}
      <section className="py-6 lg:py-8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="border border-foreground/10 overflow-hidden"
          >
            <Image src="/images/AboutUs.png" alt="About OnlyWorks" width={1920} height={800} className="w-full h-auto" />
          </motion.div>
        </div>
      </section>

      {/* ═══ WHY WE EXIST ═══ */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <FloatingParticles count={8} />
        <WatermarkText text="MISSION" />
        <ConnectionLines className="opacity-40" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
                <span className="w-8 h-px bg-foreground/30" />
                Our mission
              </span>
              <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-6">
                Why we<br />exist.
              </h2>
              <div className="mb-8">
                <TextGenerateEffect
                  words="Most applications fail for reasons you never see. You've done the work — projects, coding, assignments, side hustles — but it goes unnoticed. OnlyWorks changes that. We turn your real experience into verifiable proof."
                  className="text-xl !font-normal leading-relaxed [&_div]:!text-xl [&_span]:!text-muted-foreground"
                  duration={0.3}
                />
              </div>
              <div className="grid grid-cols-3 gap-8">
                {[
                  { value: 'AI', label: 'Verified' },
                  { value: '<5s', label: 'Report gen' },
                  { value: 'E2E', label: 'Encrypted' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-4xl lg:text-5xl font-display mb-2">{s.value}</div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="border border-foreground/10">
                <div className="px-6 py-3 border-b border-foreground/10 flex items-center justify-between">
                  <span className="text-sm font-mono text-muted-foreground">Key Numbers</span>
                  <span className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    Overview
                  </span>
                </div>
                <div>
                  {[
                    { label: 'Verification method', value: 'AI + review' },
                    { label: 'Skills verified', value: '20+' },
                    { label: 'Report generation', value: '<5 seconds' },
                    { label: 'Data encryption', value: 'End-to-end' },
                    { label: 'Privacy model', value: 'User-controlled' },
                    { label: 'Cost to start', value: 'Free' },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className={`px-6 py-4 border-b border-foreground/5 last:border-b-0 flex items-center justify-between transition-all duration-300 ${i === 0 ? 'bg-foreground/[0.02]' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${i === 0 ? 'bg-foreground' : 'bg-foreground/20'}`} />
                        <div className="font-medium">{row.label}</div>
                      </div>
                      <span className="font-mono text-sm text-muted-foreground">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ DOCS · HOW IT WORKS ═══ */}
      <section id="how-it-works" className="relative py-16 lg:py-24 overflow-hidden" style={{ scrollMarginTop: 96 }}>
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
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              OnlyWorks turns your real work into a credential anyone can verify — without uploading your code, your screen, or your secrets to anyone else.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-px bg-foreground/10">
            {[
              {
                n: '01',
                title: 'Install',
                lede: 'Download the OnlyWorks desktop app. Sign in once.',
                detail: 'macOS, Windows (Intel + Apple Silicon), and Linux. Free forever to install. The app runs locally and only captures what you ask it to.',
                cta: { label: 'Download free', href: '/downloads' },
              },
              {
                n: '02',
                title: 'Verify',
                lede: 'Work normally. OnlyWorks quietly proves it was you.',
                detail: 'As you write code, run tests, ship features, build hardware, write docs — OW captures verifiable evidence of activity. End-to-end encrypted. You decide what counts.',
                cta: { label: 'See what gets captured', href: '#sample' },
              },
              {
                n: '03',
                title: 'Share',
                lede: 'Generate a tamper-evident report. Send the link.',
                detail: 'Reports are signed by OnlyWorks and verifiable at onlyworks.com/verify/<hash>. Recruiters, clients, judges — anyone can confirm it without an account.',
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
      <section id="sample" className="relative py-16 lg:py-24 overflow-hidden" style={{ scrollMarginTop: 96 }}>
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
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                A verified report is a signed, public-by-link page on OnlyWorks. Skills, evidence, timeline, hash, signature — everything someone needs to know what you actually did is on one URL.
              </p>
              <ul className="space-y-3 text-base">
                {[
                  ['◆', 'Tamper-evident. Hash changes if the report is altered.'],
                  ['◇', 'Verifiable by anyone — no OW account required to read.'],
                  ['◌', 'Revocable. You can pull a report from circulation any time.'],
                  ['○', 'Modular. Share a subset (skills only, timeline only) per audience.'],
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
                  <div className="font-mono text-xs text-muted-foreground">onlyworks.com/verify/2f8a91c4</div>
                  <div className="text-xs font-mono" style={{ color: '#16a34a' }}>● verified</div>
                </div>

                <div className="p-6 lg:p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="font-mono text-xs text-muted-foreground mb-1">Report · 23 Jun 2026</div>
                      <h3 className="font-display text-3xl tracking-tight">Ren M. Ortega</h3>
                      <div className="text-sm text-muted-foreground">@cordelia · ONLYWEIRD &apos;26 finalist</div>
                    </div>
                    <div
                      className="px-3 py-1.5 text-xs font-mono"
                      style={{ background: '#ede9fe', color: '#6d28d9' }}
                    >
                      ◆ Verified Weird
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="font-mono text-xs text-muted-foreground mb-3">Project · kettle.sh</div>
                    <div className="grid grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
                      {[
                        ['Skills detected', '8'],
                        ['Languages',       'Bash · Shell'],
                        ['Build window',    '7 days'],
                      ].map(([k, v]) => (
                        <div key={k} className="bg-white p-4">
                          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{k}</div>
                          <div className="font-display text-xl tracking-tight">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="font-mono text-xs text-muted-foreground mb-3">Verified evidence</div>
                    <ul className="space-y-2 text-sm">
                      {[
                        ['◆', '47 commits in build window · all signed'],
                        ['◆', 'CI run 14× · 12 pass · 2 fail · last green 22 Jun 22:08 PT'],
                        ['◆', 'Hand-written README · 312 words · no LLM signature'],
                        ['◆', '1 Loom demo · 02:48 · stranger-witnessed at SF finals'],
                      ].map(([g, t], i) => (
                        <li key={i} className="flex gap-3">
                          <span style={{ color: '#8b5cf6' }}>{g}</span>
                          <span className="text-muted-foreground">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-foreground/10 flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>hash · 2f8a91c4d3e7b56a · ed25519</span>
                    <span>signed by OnlyWorks</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ DOCS · FOR ONLYWEIRD BUILDERS ═══ */}
      <section id="hackathon" className="relative py-16 lg:py-24 overflow-hidden" style={{ scrollMarginTop: 96, background: '#f5f5f4' }}>
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

          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mb-12">
            Registering for the hackathon creates your OnlyWorks account automatically — you just need to install the desktop app and drop one hook into your repo. Here&apos;s the path, end to end.
          </p>

          <ol className="grid lg:grid-cols-2 gap-4">
            {[
              {
                n: '01',
                title: 'Register for ONLYWEIRD',
                body: 'Fills out the registration card. OnlyWorks account created in the background — no separate signup. You get an OW-WEIRD-XXXX serial.',
                href: '/hackathon/register',
                cta: 'Register card →',
              },
              {
                n: '02',
                title: 'Install OnlyWorks',
                body: 'Free desktop app. Sign in with the same email you registered with. Takes ~60 seconds.',
                href: '/downloads',
                cta: 'Download →',
              },
              {
                n: '03',
                title: 'Drop the hook into your repo',
                body: 'One-line install from your dashboard. The hook records commit metadata + CI signals in the build window only.',
                href: '#how-it-works',
                cta: 'See how it works →',
              },
              {
                n: '04',
                title: 'Build during the window',
                body: '16 Jun 09:00 PT → 22 Jun 23:59 PT. Build whatever weird thing you want. OW signs activity automatically as you go.',
                href: '/hackathon/schedule',
                cta: 'See schedule →',
              },
              {
                n: '05',
                title: 'Submit your build',
                body: 'From the dashboard. Adds your Loom + README + repo URL. Submission is hashed and bound to your serial.',
                href: '/hackathon/rules#submissions',
                cta: 'Submission rules →',
              },
              {
                n: '06',
                title: 'Earn your verified certificate',
                body: 'Every finalist gets a digital certificate, signed by OnlyWorks. QR resolves to your live verify URL — share anywhere.',
                href: '/hackathon/certificate',
                cta: 'See a sample cert →',
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

      {/* ═══ METRICS — 2x2 grid ═══ */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <PulsingRings className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]" />
        <GridBackground className="opacity-50" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
              <span className="w-8 h-px bg-foreground/30" />
              By the numbers
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-display tracking-tight"
            >
              Impact you<br /><span className="text-muted-foreground">can measure.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10">
            {[
              { value: 'E2E', label: 'Encrypted end-to-end' },
              { value: '20+', label: 'Skills verified' },
              { value: '<5s', label: 'Average report generation' },
              { value: 'Free', label: 'To get started' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-background p-8 lg:p-10"
              >
                <div className="text-6xl lg:text-8xl font-display tracking-tight">{stat.value}</div>
                <div className="mt-3 text-lg text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VALUES — DARK SECTION ═══ */}
      <section className="relative py-16 lg:py-24" style={{ background: '#1c1b18', color: '#fafaf9' }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 40px, currentColor 40px, currentColor 41px)` }} />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <span className="inline-flex items-center gap-3 text-sm font-mono mb-4" style={{ color: 'rgba(250,250,249,0.5)' }}>
              <span className="w-8 h-px" style={{ background: 'rgba(250,250,249,0.3)' }} />
              Our values
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-display tracking-tight"
              style={{ color: '#fafaf9' }}
            >
              What we<br /><span style={{ color: 'rgba(250,250,249,0.4)' }}>believe.</span>
            </motion.h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-0">
              {values.map((v, i) => (
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
                  <div className="leading-loose pl-4">&quot;privacy&quot;: &quot;user-controlled&quot;,</div>
                  <div className="leading-loose pl-4">&quot;encryption&quot;: &quot;end-to-end&quot;,</div>
                  <div className="leading-loose pl-4">&quot;verification&quot;: &quot;AI + review&quot;,</div>
                  <div className="leading-loose pl-4">&quot;cost&quot;: &quot;free to start&quot;,</div>
                  <div className="leading-loose pl-4">&quot;respectsPrivacy&quot;: true</div>
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

      {/* ═══ TEAM ═══ */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <GeometricPattern className="left-0 top-0 w-[400px] h-[400px] opacity-30" />
        <GeometricPattern className="right-0 bottom-0 w-[300px] h-[300px] opacity-20" />
        <ASCIIBlock variant="logo" className="absolute right-12 top-16" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-10">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
              <span className="w-8 h-px bg-foreground/30" />
              Our team
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-4xl lg:text-6xl font-display tracking-tight mb-4"
            >
              Built by people<br /><span className="text-muted-foreground">who care.</span>
            </motion.h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              A small team passionate about making work visible and verifiable.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]" aria-hidden="true" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 30px, #080503 30px, #080503 31px)` }} />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative border border-foreground"
          >
            <div className="relative z-10 px-8 lg:px-16 py-12 lg:py-16">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <h2 className="text-4xl lg:text-7xl font-display tracking-tight mb-6 leading-[0.95]">
                    Ready to<br />start?
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
                    Your work deserves to be seen. Start proving it today.
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
