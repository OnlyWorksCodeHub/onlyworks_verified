'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/components/AuthProvider'
import { NEXT_PUBLIC_BACKEND_URL, HIRING_TOOLKIT_ENABLED } from '@/lib/config'

type JobPost = {
  id: string
  title: string
  description?: string | null
  status?: string | null
  experience_level?: string | null
  field_of_work?: string | null
  required_skills?: string[] | null
  nice_to_have_skills?: string[] | null
}

type MatchRow = {
  id?: string
  score?: number
  profiles?: {
    ow_id?: string
    full_name?: string | null
    job_title?: string | null
    company?: string | null
  } | null
}

export default function JobDetailClient({ jobId }: { jobId: string }) {
  const router = useRouter()
  const { user, backendToken, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [job, setJob] = useState<JobPost | null>(null)
  const [matches, setMatches] = useState<MatchRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!HIRING_TOOLKIT_ENABLED) return
    if (authLoading) return
    if (!user) {
      router.replace(`/login?next=/hiring/jobs/${jobId}`)
      return
    }
    if (!backendToken) return

    async function load() {
      setLoading(true)
      try {
        const [jobRes, matchesRes] = await Promise.all([
          fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/hiring/jobs/${jobId}`, {
            headers: { Authorization: `Bearer ${backendToken}` },
          }),
          fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/hiring/jobs/${jobId}/matches`, {
            headers: { Authorization: `Bearer ${backendToken}` },
          }),
        ])

        const jobPayload = await jobRes.json().catch(() => ({}))
        const matchesPayload = await matchesRes.json().catch(() => ({}))

        if (!jobRes.ok) {
          setError(
            typeof jobPayload?.message === 'string'
              ? jobPayload.message
              : 'Could not load this job post.'
          )
          return
        }

        setJob(jobPayload.data || null)
        const matchData = matchesPayload?.data
        const rows = Array.isArray(matchData)
          ? matchData
          : Array.isArray(matchData?.matches)
            ? matchData.matches
            : []
        setMatches(rows)
      } catch {
        toast.error('Failed to load job details')
        setError('Failed to load job details')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [authLoading, user, backendToken, router, jobId])

  if (!HIRING_TOOLKIT_ENABLED) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main className="max-w-3xl mx-auto px-4 pt-28 pb-16 text-center">
          <h1 className="font-display text-3xl tracking-tight mb-3">Job posts are coming soon</h1>
          <Link href="/hiring#register" className="text-sm" style={{ color: 'var(--accent)' }}>
            Join the waitlist →
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <Link href="/hiring/jobs" className="text-sm" style={{ color: 'var(--text-muted)' }}>
          ← Back to jobs
        </Link>

        {error || !job ? (
          <div className="mt-6 border p-6 text-center" style={{ borderColor: 'var(--border)' }}>
            <h1 className="font-display text-2xl tracking-tight mb-2">Unavailable</h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {error || 'Job post not found.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 mb-8">
              <span className="inline-flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                <span className="w-8 h-px" style={{ background: 'var(--border)' }} />
                Job post
              </span>
              <h1 className="mt-3 font-display text-3xl lg:text-4xl tracking-tight">{job.title}</h1>
              <p className="mt-2 text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                {[job.field_of_work?.replace(/-/g, ' '), job.experience_level, job.status || 'published']
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              {job.description && (
                <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {job.description}
                </p>
              )}
              {Array.isArray(job.required_skills) && job.required_skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {job.required_skills.map((skill) => (
                    <span key={skill} className="job-skill-chip">◆ {skill}</span>
                  ))}
                </div>
              )}
            </div>

            <section>
              <div className="pp-section-head mb-4">
                <span className="pp-section-num">01</span>
                <h2 className="font-display text-xl tracking-tight">Matches</h2>
                <span className="pp-section-note">{matches.length} candidates</span>
              </div>

              {matches.length === 0 ? (
                <div className="border p-6 text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                  Matches are still computing, or none matched yet. Refresh in a minute.
                </div>
              ) : (
                <ul className="space-y-3">
                  {matches.map((match, index) => {
                    const profile = match.profiles
                    const owId = profile?.ow_id
                    return (
                      <li key={match.id || `${owId}-${index}`} className="border p-4" style={{ borderColor: 'var(--border)', background: '#fff' }}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium text-sm" style={{ color: 'var(--text)' }}>
                              {profile?.full_name || owId || 'Candidate'}
                            </div>
                            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                              {[profile?.job_title, profile?.company, owId].filter(Boolean).join(' · ')}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            {typeof match.score === 'number' && (
                              <div className="text-sm font-mono" style={{ color: 'var(--accent)' }}>
                                {Math.round(match.score)}%
                              </div>
                            )}
                            {owId && (
                              <Link href={`/p/${owId}`} className="text-xs mt-1 inline-block" style={{ color: 'var(--accent)' }}>
                                View profile →
                              </Link>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  })}
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
