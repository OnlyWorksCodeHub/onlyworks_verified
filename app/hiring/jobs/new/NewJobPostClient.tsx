'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Loader2, Plus, X } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/components/AuthProvider'
import { NEXT_PUBLIC_BACKEND_URL, HIRING_TOOLKIT_ENABLED } from '@/lib/config'
import { formatPlanLabel } from '@/lib/hiring'
import {
  buildCreateJobPayload,
  canAdvanceJobStep,
  canSubmitJobPost,
  interpretHiringJobsAccess,
  mergeSkills,
  parseSkillInput,
  resolveJobCreateFollowUp,
  type JobFormState,
  type JobPostStep,
} from '@/lib/job-post'

const STEPS = [
  { id: 1, label: '01 · Basics' },
  { id: 2, label: '02 · Skills' },
  { id: 3, label: '03 · Field & level' },
  { id: 4, label: '04 · Review' },
] as const

const FIELDS = [
  { value: 'software-development', label: 'Software Development' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'product-management', label: 'Product Management' },
  { value: 'content-writing', label: 'Content Writing' },
  { value: 'finance', label: 'Finance' },
]

const LEVELS = [
  { value: 'entry', label: 'Entry / Internship' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'executive', label: 'Executive' },
]

type JobForm = JobFormState

const EMPTY_FORM: JobForm = {
  title: '',
  description: '',
  required_skills: [],
  nice_to_have_skills: [],
  experience_level: 'mid',
  field_of_work: 'software-development',
}

function SkillChips({
  skills,
  onRemove,
  readOnly = false,
}: {
  skills: string[]
  onRemove?: (skill: string) => void
  readOnly?: boolean
}) {
  if (skills.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {skills.map((skill) => (
        <span key={skill} className="job-skill-chip">
          ◆ {skill}
          {!readOnly && onRemove && (
            <button type="button" aria-label={`Remove ${skill}`} onClick={() => onRemove(skill)}>
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}
    </div>
  )
}

function ComingSoon() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="border border-foreground/10 p-8 lg:p-10 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground mb-4">
            <span className="w-8 h-px bg-foreground/30" />
            Early access
          </span>
          <h1 className="font-display text-3xl lg:text-4xl tracking-tight mb-3">
            Job posting is coming soon
          </h1>
          <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto">
            Searching proven candidates is open and free today. Job posts and auto-match are
            rolling out next — join the waitlist to be first in line.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/hiring#register"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm rounded-full font-medium text-white hover:opacity-90 transition-all"
              style={{ background: '#8b5cf6' }}
            >
              Join the waitlist
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
            >
              Search candidates now
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function UpgradeGate({ message }: { message: string }) {
  return (
    <div className="border p-6 sm:p-8 text-center" style={{ borderColor: 'var(--border)', background: 'var(--bg-alt)' }}>
      <span className="inline-flex items-center gap-2 text-xs font-mono mb-3" style={{ color: 'var(--text-muted)' }}>
        <span className="w-8 h-px" style={{ background: 'var(--border)' }} />
        Paid tier
      </span>
      <h2 className="font-display text-2xl tracking-tight mb-2">Active subscription required</h2>
      <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
        {message}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/hiring#register"
          className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-full font-medium text-white hover:opacity-90"
          style={{ background: '#8b5cf6' }}
        >
          Get notified when hiring opens
        </Link>
        <Link
          href="/hiring/dashboard"
          className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-full font-medium border border-foreground/20 hover:bg-foreground/5"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}

export default function NewJobPostClient() {
  const router = useRouter()
  const { user, backendToken, loading: authLoading } = useAuth()

  const [step, setStep] = useState<JobPostStep>(1)
  const [form, setForm] = useState<JobForm>(EMPTY_FORM)
  const [requiredDraft, setRequiredDraft] = useState('')
  const [niceDraft, setNiceDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [gateMessage, setGateMessage] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [planStatus, setPlanStatus] = useState<string | null>(null)

  const canContinue = useMemo(() => canAdvanceJobStep(step, form), [step, form])
  const canSubmit = useMemo(() => canSubmitJobPost(form), [form])

  useEffect(() => {
    if (!HIRING_TOOLKIT_ENABLED) return
    if (authLoading) return

    if (!user) {
      router.replace('/login?next=/hiring/jobs/new')
      return
    }
    if (!backendToken) return

    async function probeAccess() {
      try {
        const meRes = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/hiring/me`, {
          headers: { Authorization: `Bearer ${backendToken}` },
        })
        if (meRes.ok) {
          const mePayload = await meRes.json().catch(() => ({}))
          setPlanStatus(mePayload?.data?.subscription_status ?? null)
        }

        const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/hiring/jobs`, {
          headers: { Authorization: `Bearer ${backendToken}` },
        })
        const payload = await res.json().catch(() => ({}))
        const access = interpretHiringJobsAccess(
          res.status,
          typeof payload?.message === 'string' ? payload.message : undefined
        )
        if (access.kind === 'forbidden' || access.kind === 'not_registered') {
          setGateMessage(access.message)
        } else if (access.kind === 'error') {
          toast.error(access.message)
        }
      } catch {
        toast.error('Could not reach the hiring API')
      } finally {
        setReady(true)
      }
    }

    probeAccess()
  }, [authLoading, user, backendToken, router])

  if (!HIRING_TOOLKIT_ENABLED) return <ComingSoon />

  if (authLoading || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--text)' }}>
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  const addSkills = (kind: 'required_skills' | 'nice_to_have_skills', draft: string, clear: () => void) => {
    const next = parseSkillInput(draft)
    if (next.length === 0) return
    setForm((prev) => ({
      ...prev,
      [kind]: mergeSkills(prev[kind], next),
    }))
    clear()
  }

  const createJob = async (asDraft: boolean) => {
    if (!backendToken || !canSubmit) return
    setSaving(true)
    try {
      const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/hiring/jobs`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${backendToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildCreateJobPayload(form)),
      })
      const payload = await res.json().catch(() => ({}))

      const access = interpretHiringJobsAccess(
        res.status,
        typeof payload?.message === 'string' ? payload.message : undefined
      )
      if (access.kind === 'forbidden' || access.kind === 'not_registered') {
        setGateMessage(access.message)
        return
      }
      if (access.kind === 'error' && !res.ok) {
        throw new Error(access.message)
      }
      if (!res.ok) {
        throw new Error(payload?.message || 'Failed to create job post')
      }

      const jobId = payload?.data?.id as string | undefined
      if (asDraft && jobId) {
        const draftRes = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/hiring/jobs/${jobId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${backendToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'draft' }),
        })
        if (!draftRes.ok) {
          toast.error('Created, but failed to mark as draft')
        }
      }

      const followUp = resolveJobCreateFollowUp(asDraft, jobId)
      if (followUp.toast === 'draft') toast.success('Draft saved')
      else if (followUp.toast === 'published') toast.success('Job post published — matches are computing')
      else toast.error('Created without an id — check Jobs list')

      router.push(followUp.href)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create job post')
    } finally {
      setSaving(false)
    }
  }

  const fieldLabel = FIELDS.find((f) => f.value === form.field_of_work)?.label || form.field_of_work
  const levelLabel = LEVELS.find((l) => l.value === form.experience_level)?.label || form.experience_level

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            <span className="w-8 h-px" style={{ background: 'var(--border)' }} />
            Hiring · Jobs
          </span>
          <h1 className="mt-3 font-display text-3xl lg:text-4xl tracking-tight">
            New <em>job</em> post
          </h1>
          <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
            Save as draft anytime. Matches are auto-computed when you publish.
          </p>
          <p className="mt-2 text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Plan · {formatPlanLabel(planStatus)}
          </p>
        </div>

        {gateMessage ? (
          <UpgradeGate message={gateMessage} />
        ) : (
          <div className="job-form-card space-y-6">
            <div className="job-step-progress" aria-label="Job post steps">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className={`job-step ${step === s.id ? 'active' : ''} ${step > s.id ? 'done' : ''}`}
                >
                  {step > s.id ? `${s.label} ✓` : s.label}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Job title *</label>
                  <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    e.g. &quot;Frontend Engineer — Intern&quot; or &quot;Senior Backend Engineer&quot;
                  </p>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full h-11 rounded-lg border px-3 text-sm outline-none focus:ring-2"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 resize-y"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="What they'll ship, stack, and how the team works…"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Required skills <span style={{ color: 'var(--accent)' }}>·</span> verified-by-capture
                  </label>
                  <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    These determine match scores. Candidates must have evidence in captured work.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={requiredDraft}
                      onChange={(e) => setRequiredDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSkills('required_skills', requiredDraft, () => setRequiredDraft(''))
                        }
                      }}
                      className="flex-1 h-11 rounded-lg border px-3 text-sm outline-none focus:ring-2"
                      style={{ borderColor: 'var(--border)' }}
                      placeholder="React, TypeScript…"
                    />
                    <button
                      type="button"
                      onClick={() => addSkills('required_skills', requiredDraft, () => setRequiredDraft(''))}
                      className="h-11 px-4 text-sm rounded-lg border font-medium hover:bg-foreground/5"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      Add
                    </button>
                  </div>
                  <SkillChips
                    skills={form.required_skills}
                    onRemove={(skill) =>
                      setForm((prev) => ({
                        ...prev,
                        required_skills: prev.required_skills.filter((s) => s !== skill),
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Nice-to-have skills</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={niceDraft}
                      onChange={(e) => setNiceDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addSkills('nice_to_have_skills', niceDraft, () => setNiceDraft(''))
                        }
                      }}
                      className="flex-1 h-11 rounded-lg border px-3 text-sm outline-none focus:ring-2"
                      style={{ borderColor: 'var(--border)' }}
                      placeholder="Next.js, Figma…"
                    />
                    <button
                      type="button"
                      onClick={() => addSkills('nice_to_have_skills', niceDraft, () => setNiceDraft(''))}
                      className="h-11 px-4 text-sm rounded-lg border font-medium hover:bg-foreground/5"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      Add
                    </button>
                  </div>
                  <SkillChips
                    skills={form.nice_to_have_skills}
                    onRemove={(skill) =>
                      setForm((prev) => ({
                        ...prev,
                        nice_to_have_skills: prev.nice_to_have_skills.filter((s) => s !== skill),
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Experience level</label>
                  <select
                    value={form.experience_level}
                    onChange={(e) => setForm((prev) => ({ ...prev, experience_level: e.target.value }))}
                    className="w-full h-11 rounded-lg border px-3 text-sm outline-none focus:ring-2 bg-white"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Field</label>
                  <select
                    value={form.field_of_work}
                    onChange={(e) => setForm((prev) => ({ ...prev, field_of_work: e.target.value }))}
                    className="w-full h-11 rounded-lg border px-3 text-sm outline-none focus:ring-2 bg-white"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {FIELDS.map((field) => (
                      <option key={field.value} value={field.value}>{field.label}</option>
                    ))}
                  </select>
                </div>
                <p className="sm:col-span-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  Comp / location fields land when the hiring backend exposes them — field + level drive matching today.
                </p>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <div className="border p-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-alt)' }}>
                  <div className="font-medium text-base" style={{ color: 'var(--text)' }}>{form.title || 'Untitled role'}</div>
                  <div className="text-xs font-mono uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>
                    {fieldLabel} · {levelLabel}
                  </div>
                  {form.description && <p className="mt-3 whitespace-pre-wrap">{form.description}</p>}
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Required</div>
                  {form.required_skills.length === 0 ? (
                    <p>No required skills yet — matches will be weaker.</p>
                  ) : (
                    <SkillChips skills={form.required_skills} readOnly />
                  )}
                </div>
                {form.nice_to_have_skills.length > 0 && (
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Nice to have</div>
                    <SkillChips skills={form.nice_to_have_skills} readOnly />
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex flex-wrap gap-2">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s <= 1 ? 1 : ((s - 1) as JobPostStep)))}
                    className="inline-flex items-center justify-center h-11 px-4 text-sm rounded-lg border font-medium hover:bg-foreground/5"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    ← Back
                  </button>
                ) : (
                  <Link
                    href="/hiring/jobs"
                    className="inline-flex items-center justify-center h-11 px-4 text-sm rounded-lg border font-medium hover:bg-foreground/5"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    ← Cancel
                  </Link>
                )}
                <button
                  type="button"
                  disabled={!canSubmit || saving}
                  onClick={() => createJob(true)}
                  className="inline-flex items-center justify-center h-11 px-4 text-sm font-medium hover:opacity-80 disabled:opacity-50"
                  style={{ color: 'var(--text-muted)' }}
                >
                  ▸ Save draft
                </button>
              </div>

              {step < 4 ? (
                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={() => setStep((s) => (s >= 4 ? 4 : ((s + 1) as JobPostStep)))}
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 text-sm rounded-full font-medium text-white hover:opacity-90 disabled:opacity-50"
                  style={{ background: '#8b5cf6' }}
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!canSubmit || saving}
                  onClick={() => createJob(false)}
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 text-sm rounded-full font-medium text-white hover:opacity-90 disabled:opacity-50"
                  style={{ background: '#8b5cf6' }}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {saving ? 'Publishing…' : 'Publish job'}
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
