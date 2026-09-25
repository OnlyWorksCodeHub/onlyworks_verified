'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Loader2, Plus, Search, Briefcase, Building2 } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/components/AuthProvider'
import { NEXT_PUBLIC_BACKEND_URL, HIRING_TOOLKIT_ENABLED } from '@/lib/config'
import { formatPlanLabel, isPaidHiringPlan } from '@/lib/hiring'

type HiringMe = {
  id?: string
  company?: string | null
  job_title?: string | null
  subscription_status?: string | null
  contact_email?: string | null
}

type JobPost = {
  id: string
  title: string
  status?: string | null
  required_skills?: string[] | null
  created_at?: string | null
}

type MatchRow = {
  jobId: string
  jobTitle: string
  owId?: string
  name?: string
  score?: number
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
            Hiring dashboard is coming soon
          </h1>
          <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto">
            Search is open today. The paid hiring dashboard ships with job posts and plan status next.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/hiring#register"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm rounded-full font-medium text-white hover:opacity-90"
              style={{ background: '#8b5cf6' }}
            >
              Join the waitlist
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm rounded-full font-medium border border-foreground/20 hover:bg-foreground/5"
            >
              Search candidates
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function HiringDashboardClient() {
  const router = useRouter()
  const { user, backendToken, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [me, setMe] = useState<HiringMe | null>(null)
  const [jobs, setJobs] = useState<JobPost[]>([])
  const [matches, setMatches] = useState<MatchRow[]>([])
  const [notRegistered, setNotRegistered] = useState(false)

  useEffect(() => {
    if (!HIRING_TOOLKIT_ENABLED) return
    if (authLoading) return
    if (!user) {
      router.replace('/login?next=/hiring/dashboard')
      return
    }
    if (!backendToken) return

    async function load() {
      setLoading(true)
      try {
        const meRes = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/hiring/me`, {
          headers: { Authorization: `Bearer ${backendToken}` },
        })
        const mePayload = await meRes.json().catch(() => ({}))

        if (meRes.status === 404) {
          setNotRegistered(true)
          setMe(null)
          setJobs([])
          setMatches([])
          return
        }
        if (!meRes.ok) {
          throw new Error(mePayload?.message || 'Failed to load hiring profile')
        }

        setNotRegistered(false)
        setMe(mePayload.data || null)

        const jobsRes = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/hiring/jobs`, {
          headers: { Authorization: `Bearer ${backendToken}` },
        })
        const jobsPayload = await jobsRes.json().catch(() => ({}))
        const jobRows: JobPost[] =
          jobsRes.ok && Array.isArray(jobsPayload?.data) ? jobsPayload.data : []
        setJobs(jobRows)

        // Pull a few matches for the dashboard "recent matches" strip.
        const recent = jobRows.slice(0, 3)
        const matchBatches = await Promise.all(
          recent.map(async (job) => {
            try {
              const res = await fetch(
                `${NEXT_PUBLIC_BACKEND_URL}/api/hiring/jobs/${job.id}/matches`,
                { headers: { Authorization: `Bearer ${backendToken}` } }
              )
              if (!res.ok) return [] as MatchRow[]
              const payload = await res.json().catch(() => ({}))
              const data = payload?.data
              const rows = Array.isArray(data)
                ? data
                : Array.isArray(data?.matches)
                  ? data.matches
                  : []
              return rows.slice(0, 2).map((row: any) => ({
                jobId: job.id,
                jobTitle: job.title,
                owId: row?.profiles?.ow_id || row?.ow_id,
                name: row?.profiles?.full_name || row?.full_name,
                score: typeof row?.score === 'number' ? row.score : undefined,
              })) as MatchRow[]
            } catch {
              return [] as MatchRow[]
            }
          })
        )
        setMatches(matchBatches.flat().slice(0, 6))
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [authLoading, user, backendToken, router])

  if (!HIRING_TOOLKIT_ENABLED) return <ComingSoon />

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  const planStatus = me?.subscription_status
  const paid = isPaidHiringPlan(planStatus)
  const helloName = me?.company || user?.email?.split('@')[0] || 'there'

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              <span className="w-8 h-px" style={{ background: 'var(--border)' }} />
              Hiring dashboard
            </span>
            <h1 className="mt-3 font-display text-3xl lg:text-4xl tracking-tight">
              Good to see you, <em>{helloName}.</em>
            </h1>
            <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
              {paid
                ? 'Your plan is live. Publish roles and review matched candidates.'
                : 'Search is free. Upgrade to an active plan to publish jobs and auto-match.'}
            </p>
          </div>
          <span
            className="inline-flex self-start items-center px-3 py-1.5 rounded-full text-[0.6875rem] font-mono uppercase tracking-wider font-semibold border"
            style={{
              borderColor: paid ? 'rgba(139,92,246,0.35)' : 'var(--border)',
              color: paid ? '#6d28d9' : 'var(--text-muted)',
              background: paid ? 'rgba(139,92,246,0.1)' : 'var(--bg-alt)',
            }}
          >
            {formatPlanLabel(planStatus)}
          </span>
        </div>

        {notRegistered ? (
          <div className="border p-6 sm:p-8 text-center" style={{ borderColor: 'var(--border)', background: 'var(--bg-alt)' }}>
            <h2 className="font-display text-2xl tracking-tight mb-2">Register as a hiring manager</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Create your company profile first, then return here for plan status and job posts.
            </p>
            <Link
              href="/hiring/profile"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-full font-medium text-white hover:opacity-90"
              style={{ background: '#8b5cf6' }}
            >
              <Building2 className="w-4 h-4" />
              Set up company profile
            </Link>
          </div>
        ) : (
          <>
            <div className="profile-stats-grid">
              <div className="profile-stat-card">
                <div className="profile-stat-value" style={{ color: 'var(--accent)' }}>{jobs.length}</div>
                <div className="profile-stat-label">Active jobs</div>
              </div>
              <div className="profile-stat-card">
                <div className="profile-stat-value" style={{ color: 'var(--accent)' }}>
                  {paid ? 'On' : 'Off'}
                </div>
                <div className="profile-stat-label">Publish gate</div>
              </div>
              <div className="profile-stat-card">
                <div className="profile-stat-value" style={{ color: 'var(--accent)', fontSize: '1.25rem' }}>
                  {formatPlanLabel(planStatus).split('·')[0].trim()}
                </div>
                <div className="profile-stat-label">Plan</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8">
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-full font-medium border border-foreground/20 hover:bg-foreground/5"
              >
                <Search className="w-4 h-4" />
                Search candidates
              </Link>
              <Link
                href="/hiring/jobs"
                className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-full font-medium border border-foreground/20 hover:bg-foreground/5"
              >
                <Briefcase className="w-4 h-4" />
                Manage jobs
              </Link>
              {paid ? (
                <Link
                  href="/hiring/jobs/new"
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-full font-medium text-white hover:opacity-90"
                  style={{ background: '#8b5cf6' }}
                >
                  <Plus className="w-4 h-4" />
                  New job post
                </Link>
              ) : (
                <Link
                  href="/hiring#register"
                  className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-full font-medium text-white hover:opacity-90"
                  style={{ background: '#8b5cf6' }}
                >
                  Upgrade to publish
                </Link>
              )}
            </div>

            <section>
              <div className="pp-section-head mb-4">
                <span className="pp-section-num">01</span>
                <h2 className="font-display text-xl tracking-tight">Recent matches</h2>
                <span className="pp-section-note">{matches.length} shown</span>
              </div>

              {matches.length === 0 ? (
                <div className="border p-6 text-sm mb-8" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                  {paid
                    ? 'No matches yet — publish a job with required skills to start matching.'
                    : 'Matches appear here once your plan can publish jobs.'}
                </div>
              ) : (
                <ul className="space-y-3 mb-8">
                  {matches.map((match, index) => (
                    <li
                      key={`${match.jobId}-${match.owId || index}`}
                      className="border p-4"
                      style={{ borderColor: 'var(--border)', background: '#fff' }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                            {match.name || match.owId || 'Candidate'}
                          </div>
                          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                            For <strong>{match.jobTitle}</strong>
                            {match.owId ? ` · ${match.owId}` : ''}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          {typeof match.score === 'number' && (
                            <div className="text-sm font-mono" style={{ color: 'var(--accent)' }}>
                              {Math.round(match.score)}
                            </div>
                          )}
                          {match.owId && (
                            <Link href={`/p/${match.owId}`} className="text-xs mt-1 inline-block" style={{ color: 'var(--accent)' }}>
                              View →
                            </Link>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <div className="pp-section-head mb-4">
                <span className="pp-section-num">02</span>
                <h2 className="font-display text-xl tracking-tight">Recent job posts</h2>
                <span className="pp-section-note">{jobs.length} total</span>
              </div>

              {!paid && (
                <div className="border p-4 mb-4 text-sm" style={{ borderColor: 'var(--border)', background: 'var(--bg-alt)', color: 'var(--text-secondary)' }}>
                  Publish is gated on <code className="font-mono text-xs">subscription_status=active</code>.
                  Your current plan: <strong>{formatPlanLabel(planStatus)}</strong>.
                </div>
              )}

              {jobs.length === 0 ? (
                <div className="border p-6 text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                  {paid
                    ? 'No job posts yet — create one to start matching verified candidates.'
                    : 'No job posts yet. Upgrade to an active plan to publish.'}
                </div>
              ) : (
                <ul className="space-y-3">
                  {jobs.slice(0, 5).map((job) => (
                    <li key={job.id} className="border p-4" style={{ borderColor: 'var(--border)', background: '#fff' }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{job.title}</div>
                          <div className="text-xs mt-1 font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                            {job.status || 'published'}
                            {Array.isArray(job.required_skills) && job.required_skills.length > 0
                              ? ` · ${job.required_skills.slice(0, 3).join(', ')}`
                              : ''}
                          </div>
                        </div>
                        <Link href={`/hiring/jobs/${job.id}`} className="text-sm shrink-0" style={{ color: 'var(--accent)' }}>
                          View →
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
