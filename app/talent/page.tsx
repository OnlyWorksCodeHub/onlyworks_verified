'use client'

import { useState, FormEvent, KeyboardEvent } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check, X, ChevronDown, Search, Eye, Mail, Loader2 } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

const COMMON_ROLES = [
  'Software Engineer',
  'Designer',
  'Product Manager',
  'Data Scientist',
  'Marketing',
  'Sales',
  'Operations',
  'Engineering Manager',
]

const MAX_ROLES = 3

export default function TalentCommunityPage() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [roles, setRoles] = useState<string[]>([])
  const [roleInput, setRoleInput] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [location, setLocation] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addRole = (role: string) => {
    const trimmed = role.trim()
    if (!trimmed || roles.includes(trimmed) || roles.length >= MAX_ROLES) return
    setRoles([...roles, trimmed])
    setRoleInput('')
  }
  const removeRole = (r: string) => setRoles(roles.filter((x) => x !== r))
  const handleRoleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addRole(roleInput)
    }
  }

  const addSkill = (s: string) => {
    const trimmed = s.trim()
    if (!trimmed || skills.includes(trimmed) || skills.length >= 30) return
    setSkills([...skills, trimmed])
    setSkillInput('')
  }
  const removeSkill = (s: string) => setSkills(skills.filter((x) => x !== s))
  const handleSkillKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill(skillInput)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !fullName.trim()) {
      setError('Email and full name are required.')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/talent-community/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          full_name: fullName.trim(),
          target_roles: roles,
          target_locations: location.trim() ? [location.trim()] : [],
          self_reported_skills: skills,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }
      setSubmitted(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* HERO + FORM */}
      <section className="relative pt-28 lg:pt-36 pb-20 lg:pb-32 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left — copy */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
                <span className="w-8 h-px bg-foreground/30" />
                Talent Community
              </span>
              <h1 className="text-5xl lg:text-7xl font-display tracking-tight leading-[1.0] mb-6">
                Get found by<br />hiring managers.
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-10 max-w-md">
                No app required. <span className="text-foreground/70">(yet.)</span>
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-md">
                Join the OnlyWorks Talent Community — hiring teams actively search this pool for verified skills and reach out via email when they match.
              </p>

              {/* How it works — 3 steps */}
              <div className="space-y-5 max-w-md">
                {[
                  { n: 'I', title: 'Hiring managers search', desc: 'They look for candidates with verified skills and proven work.' },
                  { n: 'II', title: 'Your profile appears', desc: 'You show up in their results, ranked by skill match.' },
                  { n: 'III', title: 'They reach out', desc: 'When you match a role, they email you directly.' },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="font-display text-2xl text-muted-foreground/50 shrink-0 w-8">{s.n}</span>
                    <div>
                      <div className="font-medium text-base mb-1">{s.title}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="lg:sticky lg:top-32 self-start"
            >
              {submitted ? (
                <div className="border border-foreground/10 p-10 lg:p-12">
                  <div className="w-14 h-14 flex items-center justify-center border border-foreground/10 mb-6" style={{ background: 'rgba(139,92,246,0.06)' }}>
                    <Mail className="w-7 h-7" style={{ color: '#8b5cf6' }} />
                  </div>
                  <h3 className="text-3xl font-display tracking-tight mb-4">Check your inbox.</h3>
                  <p className="text-base text-muted-foreground leading-relaxed mb-2">
                    We sent a confirmation link to <strong className="text-foreground">{email}</strong>.
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed mb-8">
                    Click it to confirm your spot in the Talent Community. The link expires in 30 minutes.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setEmail('')
                      setFullName('')
                      setRoles([])
                      setSkills([])
                      setLocation('')
                      setShowAdvanced(false)
                    }}
                    className="text-sm font-medium hover:underline underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Use a different email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="border border-foreground/10 p-8 lg:p-10 space-y-6">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background outline-none transition-all focus:border-foreground/30"
                    />
                  </div>

                  {/* Full name */}
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-2">Full name *</label>
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background outline-none transition-all focus:border-foreground/30"
                    />
                  </div>

                  {/* Roles */}
                  <div>
                    <label className="block text-xs font-mono text-muted-foreground mb-2">
                      Roles you're open to {roles.length > 0 && <span>· {roles.length}/{MAX_ROLES}</span>}
                    </label>
                    {roles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {roles.map((r) => (
                          <span key={r} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border border-foreground/15" style={{ background: 'rgba(139,92,246,0.06)' }}>
                            {r}
                            <button type="button" onClick={() => removeRole(r)} className="hover:opacity-70" aria-label={`Remove ${r}`}>
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    {roles.length < MAX_ROLES && (
                      <>
                        <input
                          type="text"
                          value={roleInput}
                          onChange={(e) => setRoleInput(e.target.value)}
                          onKeyDown={handleRoleKey}
                          placeholder="Type a role and press Enter"
                          className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background outline-none transition-all focus:border-foreground/30"
                        />
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {COMMON_ROLES.filter((c) => !roles.includes(c)).slice(0, 5).map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => addRole(c)}
                              className="text-xs px-2 py-1 border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                            >
                              + {c}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Optional fields expander */}
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                    Add skills & location (optional)
                  </button>

                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6 overflow-hidden"
                    >
                      {/* Skills */}
                      <div>
                        <label className="block text-xs font-mono text-muted-foreground mb-2">
                          Skills {skills.length > 0 && <span>· {skills.length}/30</span>}
                        </label>
                        {skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {skills.map((s) => (
                              <span key={s} className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs border border-foreground/10">
                                {s}
                                <button type="button" onClick={() => removeSkill(s)} className="hover:opacity-70" aria-label={`Remove ${s}`}>
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={handleSkillKey}
                          placeholder="React, Python, Figma… (Enter to add)"
                          className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background outline-none transition-all focus:border-foreground/30"
                        />
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-xs font-mono text-muted-foreground mb-2">Location</label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="San Francisco, CA · Remote · etc."
                          className="w-full px-4 py-3 text-sm border border-foreground/10 bg-background outline-none transition-all focus:border-foreground/30"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="px-4 py-3 text-sm border border-destructive/30 text-destructive" style={{ background: 'rgba(228,0,20,0.04)' }}>
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 px-8 text-base font-medium text-white rounded-full transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: '#8b5cf6' }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending confirmation…
                      </>
                    ) : (
                      <>
                        Join Talent Community
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-xs font-mono text-muted-foreground text-center">
                    Free forever. Edit or remove your listing anytime.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* WANT TO STAND OUT — DOWNLOAD UPSELL */}
      <section className="relative py-20 lg:py-28 border-t border-foreground/10" style={{ background: '#1c1b18', color: '#fafaf9' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <span className="inline-flex items-center gap-3 text-sm font-mono mb-6" style={{ color: 'rgba(250,250,249,0.5)' }}>
                <span className="w-8 h-px" style={{ background: 'rgba(250,250,249,0.3)' }} />
                Want to stand out more?
              </span>
              <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-6" style={{ color: '#fafaf9' }}>
                Verified candidates<br /><span style={{ color: 'rgba(250,250,249,0.5)' }}>get 3x more views.</span>
              </h2>
              <p className="text-lg leading-relaxed" style={{ color: 'rgba(250,250,249,0.7)' }}>
                Connect real work via the OnlyWorks desktop app. Hiring managers see your verified skills with evidence — not just self-reported tags.
              </p>
            </div>
            <div className="space-y-5">
              {[
                { icon: Check, label: 'Tamper-proof verified work history' },
                { icon: Eye, label: 'Rank higher in hiring-manager searches' },
                { icon: Search, label: 'Skills with evidence, not just claims' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 pb-4 border-b" style={{ borderColor: 'rgba(250,250,249,0.1)' }}>
                  <div className="w-10 h-10 flex items-center justify-center border" style={{ borderColor: 'rgba(250,250,249,0.2)' }}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="text-base" style={{ color: 'rgba(250,250,249,0.85)' }}>{item.label}</div>
                </div>
              ))}
              <Link
                href="/downloads"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 text-base font-medium rounded-full mt-8 hover:opacity-90 transition-all"
                style={{ background: '#fafaf9', color: '#080503' }}
              >
                Get the desktop app
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
