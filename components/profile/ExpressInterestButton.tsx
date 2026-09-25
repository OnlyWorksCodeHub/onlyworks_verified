'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { HIRING_TOOLKIT_ENABLED, NEXT_PUBLIC_BACKEND_URL } from '@/lib/config'
import { isPaidHiringPlan } from '@/lib/hiring'
import { isUsableOwId } from '@/lib/profile-seo'

type JobOption = { id: string; title: string }

interface Props {
  owId: string
  displayName: string
}

export default function ExpressInterestButton({ owId, displayName }: Props) {
  const { user, backendToken, loading } = useAuth()
  const [open, setOpen] = useState(false)
  const [jobs, setJobs] = useState<JobOption[]>([])
  const [jobId, setJobId] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    if (!open || !backendToken || !HIRING_TOOLKIT_ENABLED) return

    async function load() {
      try {
        const meRes = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/hiring/me`, {
          headers: { Authorization: `Bearer ${backendToken}` },
        })
        if (meRes.ok) {
          const me = await meRes.json().catch(() => ({}))
          setPaid(isPaidHiringPlan(me?.data?.subscription_status))
        }

        const jobsRes = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/hiring/jobs`, {
          headers: { Authorization: `Bearer ${backendToken}` },
        })
        if (jobsRes.ok) {
          const payload = await jobsRes.json().catch(() => ({}))
          const rows: JobOption[] = Array.isArray(payload?.data)
            ? payload.data.map((j: { id: string; title: string }) => ({ id: j.id, title: j.title }))
            : []
          setJobs(rows)
          if (rows[0]) setJobId(rows[0].id)
        }
      } catch {
        // keep UI usable; submit will surface errors
      }
    }

    load()
  }, [open, backendToken])

  const handleSubmit = async () => {
    if (!backendToken || !jobId) return
    setBusy(true)
    try {
      const res = await fetch(
        `${NEXT_PUBLIC_BACKEND_URL}/api/hiring/jobs/${jobId}/express-interest/${encodeURIComponent(owId)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${backendToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: message.trim() || undefined }),
        }
      )
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(payload?.message || 'Could not express interest')
      }
      toast.success(`Interest sent to ${displayName}`)
      setOpen(false)
      setMessage('')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not express interest')
    } finally {
      setBusy(false)
    }
  }

  // Placeholder / missing OW ids must never hit express-interest APIs.
  if (!isUsableOwId(owId)) return null

  if (!HIRING_TOOLKIT_ENABLED) {
    return (
      <Link
        href="/hiring#register"
        className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-full font-medium text-white hover:opacity-90"
        style={{ background: '#8b5cf6' }}
      >
        Express interest →
      </Link>
    )
  }

  if (loading) return null

  if (!user) {
    return (
      <Link
        href={`/login?next=/p/${encodeURIComponent(owId)}`}
        className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-full font-medium text-white hover:opacity-90"
        style={{ background: '#8b5cf6' }}
      >
        Express interest →
      </Link>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-full font-medium text-white hover:opacity-90"
        style={{ background: '#8b5cf6' }}
      >
        Express interest →
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(8,5,3,0.35)' }}>
          <div className="w-full max-w-md border bg-white p-5 sm:p-6" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-display text-2xl tracking-tight mb-2">Express interest</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              Reach out to {displayName} about an open role. Paid hiring plan required.
            </p>

            {!paid ? (
              <div className="space-y-4">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Your plan cannot send Express Interest yet.
                </p>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setOpen(false)} className="h-10 px-4 text-sm border rounded-full" style={{ borderColor: 'var(--border)' }}>
                    Close
                  </button>
                  <Link href="/hiring/dashboard" className="h-10 px-4 text-sm rounded-full text-white inline-flex items-center" style={{ background: '#8b5cf6' }}>
                    View plan
                  </Link>
                </div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="space-y-4">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Publish a job post first, then come back to express interest.
                </p>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setOpen(false)} className="h-10 px-4 text-sm border rounded-full" style={{ borderColor: 'var(--border)' }}>
                    Close
                  </button>
                  <Link href="/hiring/jobs/new" className="h-10 px-4 text-sm rounded-full text-white inline-flex items-center" style={{ background: '#8b5cf6' }}>
                    New job
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Job</label>
                  <select
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                    className="w-full h-11 rounded-lg border px-3 text-sm bg-white"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>{job.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Message (optional)</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="Why you're reaching out…"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setOpen(false)} className="h-10 px-4 text-sm border rounded-full" style={{ borderColor: 'var(--border)' }}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={busy || !jobId}
                    onClick={handleSubmit}
                    className="h-10 px-4 text-sm rounded-full text-white inline-flex items-center gap-2 disabled:opacity-50"
                    style={{ background: '#8b5cf6' }}
                  >
                    {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
