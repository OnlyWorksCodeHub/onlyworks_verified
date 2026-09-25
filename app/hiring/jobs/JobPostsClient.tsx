'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Loader2, Plus } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/components/AuthProvider'
import { NEXT_PUBLIC_BACKEND_URL, HIRING_TOOLKIT_ENABLED } from '@/lib/config'
import { formatPlanLabel, isPaidHiringPlan } from '@/lib/hiring'
import { interpretHiringJobsAccess } from '@/lib/job-post'

type JobPost = {
  id: string
  title: string
  description?: string | null
  status?: string | null
  experience_level?: string | null
  field_of_work?: string | null
  required_skills?: string[] | null
  created_at?: string | null
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
            Job posts are coming soon
          </h1>
          <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto">
            Searching proven candidates is open today. The paid job-post toolkit ships next.
          </p>
          <Link
            href="/hiring#register"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm rounded-full font-medium text-white hover:opacity-90 transition-all"
            style={{ background: '#8b5cf6' }}
          >
            Join the waitlist
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function JobPostsClient() {
  const router = useRouter()
  const { user, backendToken, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<JobPost[]>([])
  const [gateMessage, setGateMessage] = useState<string | null>(null)
  const [planStatus, setPlanStatus] = useState<string | null>(null)

  useEffect(() => {
    if (!HIRING_TOOLKIT_ENABLED) return
    if (authLoading) return

    if (!user) {
      router.replace('/login?next=/hiring/jobs')
      return
    }
    if (!backendToken) return

    async function loadJobs() {
      setLoading(true)
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
          setJobs([])
          return
        }
        if (access.kind === 'error') {
          throw new Error(access.message)
        }

        setGateMessage(null)
        setJobs(Array.isArray(payload?.data) ? payload.data : [])
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load job posts')
      } finally {
        setLoading(false)
      }
    }

    loadJobs()
  }, [authLoading, user, backendToken, router])

  if (!HIRING_TOOLKIT_ENABLED) return <ComingSoon />

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--text)' }}>
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              <span className="w-8 h-px" style={{ background: 'var(--border)' }} />
              Hiring · Jobs
            </span>
            <h1 className="mt-3 font-display text-3xl lg:text-4xl tracking-tight">Your job posts</h1>
            <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
              Published roles and match status for your hiring plan.
            </p>
            <p className="mt-2 text-xs font-mono uppercase tracking-wider" style={{ color: isPaidHiringPlan(planStatus) ? '#6d28d9' : 'var(--text-muted)' }}>
              Plan · {formatPlanLabel(planStatus)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/hiring/dashboard"
              className="inline-flex items-center justify-center h-11 px-4 text-sm rounded-full font-medium border border-foreground/20 hover:bg-foreground/5"
            >
              Dashboard
            </Link>
            {!gateMessage && (
              <Link
                href="/hiring/jobs/new"
                className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-full font-medium text-white hover:opacity-90"
                style={{ background: '#8b5cf6' }}
              >
                <Plus className="w-4 h-4" />
                New job
              </Link>
            )}
          </div>
        </div>

        {gateMessage ? (
          <div className="border p-6 sm:p-8 text-center" style={{ borderColor: 'var(--border)', background: 'var(--bg-alt)' }}>
            <h2 className="font-display text-2xl tracking-tight mb-2">Paid plan required</h2>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              {gateMessage}
            </p>
            <Link
              href="/hiring#register"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-full font-medium text-white hover:opacity-90"
              style={{ background: '#8b5cf6' }}
            >
              Join the hiring waitlist
            </Link>
          </div>
        ) : jobs.length === 0 ? (
          <div className="border p-8 text-center" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-display text-2xl tracking-tight mb-2">No job posts yet</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Create your first role to start matching verified candidates.
            </p>
            <Link
              href="/hiring/jobs/new"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-full font-medium text-white hover:opacity-90"
              style={{ background: '#8b5cf6' }}
            >
              <Plus className="w-4 h-4" />
              Create a job post
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {jobs.map((job) => (
              <li key={job.id} className="border p-4 sm:p-5" style={{ borderColor: 'var(--border)', background: '#fff' }}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-medium" style={{ color: 'var(--text)' }}>{job.title}</h2>
                    <p className="text-xs mt-1 font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      {[job.field_of_work?.replace(/-/g, ' '), job.experience_level, job.status || 'published']
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                    {job.description && (
                      <p className="text-sm mt-2 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                        {job.description}
                      </p>
                    )}
                    {Array.isArray(job.required_skills) && job.required_skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.required_skills.slice(0, 6).map((skill) => (
                          <span key={skill} className="job-skill-chip">◆ {skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/hiring/jobs/${job.id}`}
                    className="text-sm font-medium shrink-0 hover:opacity-80"
                    style={{ color: 'var(--accent)' }}
                  >
                    View matches →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  )
}
