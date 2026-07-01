'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Loader2, Paperclip, ChevronDown, Mail, Clock, RefreshCw, AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useAuth } from '@/components/AuthProvider'
import {
  TICKET_STATUSES, TICKET_STATUS_LABELS, TICKET_PRIORITIES, ticketCategoryLabel,
  type SupportTicketWithSignedUrls, type TicketStatus,
} from '@/lib/support/tickets'

type Filter = 'all' | TicketStatus

const STATUS_DOT: Record<string, string> = {
  open: '#e0a106',
  in_progress: '#8b5cf6',
  resolved: '#1f9d55',
}

interface Draft { status: string; priority: string; admin_notes: string }

export default function AdminTicketsPage() {
  const { user, loading: authLoading } = useAuth()
  // Any signed-in account may triage tickets (not just ADMIN_EMAILS).
  const signedIn = !!user?.email

  const [tickets, setTickets] = useState<SupportTicketWithSignedUrls[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('open')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [savingId, setSavingId] = useState<string | null>(null)

  const fetchTickets = useCallback(async () => {
    setLoading(true)
    try {
      const url = filter === 'all' ? '/api/admin/tickets' : `/api/admin/tickets?status=${filter}`
      const res = await fetch(url)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load tickets')
      const list: SupportTicketWithSignedUrls[] = data.tickets || []
      setTickets(list)
      setDrafts((prev) => {
        // Only seed a draft when we don't already have one, so an unsaved edit
        // isn't clobbered by a refresh or filter switch.
        const next = { ...prev }
        for (const t of list) {
          if (!next[t.id]) next[t.id] = { status: t.status, priority: t.priority, admin_notes: t.admin_notes || '' }
        }
        return next
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    if (signedIn) fetchTickets()
  }, [signedIn, fetchTickets])

  const setDraft = (id: string, patch: Partial<Draft>) =>
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))

  async function save(id: string) {
    const draft = drafts[id]
    if (!draft) return
    setSavingId(id)
    try {
      const res = await fetch(`/api/admin/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update')
      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...data.ticket } : t)))
      toast.success('Ticket updated')
      // If it no longer matches the active filter, drop it from view.
      if (filter !== 'all' && data.ticket.status !== filter) {
        setTickets((prev) => prev.filter((t) => t.id !== id))
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setSavingId(null)
    }
  }

  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  const dirty = (t: SupportTicketWithSignedUrls) => {
    const d = drafts[t.id]
    return !!d && (d.status !== t.status || d.priority !== t.priority || (d.admin_notes || '') !== (t.admin_notes || ''))
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation />

      <section className="flex-1 pt-24 lg:pt-28 pb-16">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-3">
                <span className="w-8 h-px bg-foreground/30" />
                Admin
              </span>
              <h1 className="text-4xl lg:text-5xl font-display tracking-tight">Support tickets</h1>
            </div>
            {signedIn && (
              <button
                onClick={fetchTickets}
                className="inline-flex items-center gap-2 h-10 px-4 text-sm rounded-full border border-foreground/15 hover:bg-foreground/5 transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            )}
          </div>

          {authLoading ? (
            <div className="flex items-center gap-3 text-muted-foreground py-16">
              <Loader2 className="w-5 h-5 animate-spin" /> Checking access…
            </div>
          ) : !signedIn ? (
            <div className="border border-foreground/10 p-10 text-center">
              <AlertCircle className="w-7 h-7 mx-auto mb-3 text-muted-foreground" />
              <h2 className="text-xl font-display mb-2">Sign in to continue</h2>
              <p className="text-muted-foreground text-sm mb-5">Sign in with any OnlyWorks account to view and respond to support tickets.</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 h-10 px-5 text-sm rounded-full font-medium text-white hover:opacity-90 transition-all"
                style={{ background: '#8b5cf6' }}
              >
                Sign in
              </Link>
            </div>
          ) : (
            <>
              {/* Filter tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(['open', 'in_progress', 'resolved', 'all'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 text-sm font-medium border transition-all ${
                      filter === f ? 'bg-foreground text-background border-foreground' : 'border-foreground/15 hover:bg-foreground/5'
                    }`}
                  >
                    {f === 'all' ? 'All' : TICKET_STATUS_LABELS[f]}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex items-center gap-3 text-muted-foreground py-16">
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading tickets…
                </div>
              ) : tickets.length === 0 ? (
                <div className="border border-foreground/10 p-12 text-center text-muted-foreground">
                  No {filter !== 'all' ? TICKET_STATUS_LABELS[filter as TicketStatus]?.toLowerCase() : ''} tickets.
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map((t) => {
                    const isOpen = expanded === t.id
                    const draft = drafts[t.id] || { status: t.status, priority: t.priority, admin_notes: t.admin_notes || '' }
                    return (
                      <div key={t.id} className="border border-foreground/10">
                        {/* Summary row */}
                        <button
                          onClick={() => setExpanded(isOpen ? null : t.id)}
                          className="w-full flex items-center gap-4 px-4 sm:px-5 py-4 text-left hover:bg-foreground/[0.02] transition-colors"
                          aria-expanded={isOpen}
                        >
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: STATUS_DOT[t.status] || '#a3a19b' }} title={t.status} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium truncate">{t.subject}</p>
                              {t.priority === 'high' && <span className="text-[10px] font-mono uppercase tracking-wide text-[#e40014] border border-[#e40014]/30 px-1.5 py-0.5">High</span>}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {t.ref} · {ticketCategoryLabel(t.category)} · {t.email}
                            </p>
                          </div>
                          {t.attachments.length > 0 && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                              <Paperclip className="w-3.5 h-3.5" /> {t.attachments.length}
                            </span>
                          )}
                          <span className="hidden md:inline-flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                            <Clock className="w-3.5 h-3.5" /> {formatDate(t.created_at)}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Detail */}
                        {isOpen && (
                          <div className="px-4 sm:px-5 pb-6 pt-2 border-t border-foreground/10 space-y-6">
                            {/* Meta */}
                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-mono text-muted-foreground pt-4">
                              <span>{t.name || 'Anonymous'}</span>
                              <a href={`mailto:${t.email}`} className="inline-flex items-center gap-1 hover:text-foreground"><Mail className="w-3 h-3" /> {t.email}</a>
                              {t.ow_id && <span>OW: {t.ow_id}</span>}
                              {t.app_version && <span>v{t.app_version}</span>}
                              <span>{formatDate(t.created_at)}</span>
                            </div>

                            {/* Message */}
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{t.message}</p>

                            {/* Attachments */}
                            {t.attachments.length > 0 && (
                              <div className="grid sm:grid-cols-2 gap-3">
                                {t.attachments.map((a, i) => (
                                  <div key={i} className="border border-foreground/10 overflow-hidden">
                                    {a.signedUrl ? (
                                      a.type.startsWith('image/') ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <a href={a.signedUrl} target="_blank" rel="noreferrer"><img src={a.signedUrl} alt={a.name} className="w-full max-h-72 object-contain bg-foreground/[0.02]" /></a>
                                      ) : a.type.startsWith('video/') ? (
                                        <video src={a.signedUrl} controls className="w-full max-h-72 bg-black" />
                                      ) : (
                                        <a href={a.signedUrl} target="_blank" rel="noreferrer" className="block p-3 text-sm underline">{a.name}</a>
                                      )
                                    ) : (
                                      <div className="p-3 text-xs text-muted-foreground">Attachment unavailable</div>
                                    )}
                                    <p className="px-3 py-2 text-xs font-mono text-muted-foreground truncate border-t border-foreground/10">{a.name}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Controls */}
                            <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-foreground/10">
                              <div>
                                <label className="block text-xs font-mono text-muted-foreground mb-1.5 mt-4">Status</label>
                                <select
                                  value={draft.status}
                                  onChange={(e) => setDraft(t.id, { status: e.target.value })}
                                  className="w-full px-3 py-2 text-sm border border-foreground/10 bg-background outline-none focus:border-foreground/30"
                                >
                                  {TICKET_STATUSES.map((s) => <option key={s} value={s}>{TICKET_STATUS_LABELS[s]}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-mono text-muted-foreground mb-1.5 sm:mt-4">Priority</label>
                                <select
                                  value={draft.priority}
                                  onChange={(e) => setDraft(t.id, { priority: e.target.value })}
                                  className="w-full px-3 py-2 text-sm border border-foreground/10 bg-background outline-none focus:border-foreground/30"
                                >
                                  {TICKET_PRIORITIES.map((p) => <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</option>)}
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-mono text-muted-foreground mb-1.5">Internal notes</label>
                              <textarea
                                value={draft.admin_notes}
                                onChange={(e) => setDraft(t.id, { admin_notes: e.target.value })}
                                rows={3}
                                placeholder="Notes for the team (not shown to the user)…"
                                className="w-full px-3 py-2 text-sm border border-foreground/10 bg-background outline-none focus:border-foreground/30 resize-y"
                              />
                            </div>
                            <div className="flex justify-end">
                              <button
                                onClick={() => save(t.id)}
                                disabled={savingId === t.id || !dirty(t)}
                                className="inline-flex items-center gap-2 h-10 px-5 text-sm rounded-full font-medium text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ background: '#8b5cf6' }}
                              >
                                {savingId === t.id && <Loader2 className="w-4 h-4 animate-spin" />}
                                {savingId === t.id ? 'Saving…' : 'Save changes'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
