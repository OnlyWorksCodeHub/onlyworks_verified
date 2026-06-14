import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Clock,
  Calendar,
  Target,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  ArrowRight,
  Zap,
  TrendingUp,
  ListChecks,
} from 'lucide-react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { BACKEND_URL } from '@/lib/config'

interface ReportData {
  id: string
  report_name?: string
  title?: string
  executive_summary?: string
  accomplishments?: Array<{ title: string; description?: string }> | string
  blockers?: Array<{ title: string; description?: string }> | string
  next_steps?: Array<{ title: string; description?: string }> | string
  goals_summary?: { total?: number; completed?: number; in_progress?: number }
  productivity_metrics?: {
    productivity_score?: number
    /** @deprecated focus_score was removed app-wide in v3.11.0; ignored when rendering. */
    focus_score?: number
    total_duration_minutes?: number
  }
  time_distribution?: Record<string, number>
  // app_usage may arrive as either { "Chrome": 5, ... } (legacy) or
  // [{ name: "Chrome", time_minutes: 5 }, ...] (current pipeline).
  app_usage?: Record<string, number> | Array<{ name?: string; app?: string; application?: string; time_minutes?: number; minutes?: number }>
  total_sessions?: number
  total_duration_seconds?: number
  date_from?: string
  date_to?: string
  created_at?: string
  include_private_data?: boolean
  skills_used?: Array<{ skill: string; category: string; proficiency_signal: string; evidence: string[] }>
  strengths_demonstrated?: Array<{ strength: string; evidence: string; pattern: string }>
  growth_areas?: Array<{ area: string; observation: string; suggestion: string; priority: string }>
  tasks_completed?: Array<{ task: string; status: string; evidence: string[] }>
  tasks_remaining?: Array<{ task: string; priority: string; context: string }>
}

async function getSharedReport(token: string): Promise<ReportData | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/reports/shared/${token}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('Failed to fetch shared report:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const report = await getSharedReport(params.id)
  if (!report) return { title: 'Report Not Found | OnlyWorks' }
  const title = report.report_name || report.title || 'Work Report'
  const desc = isTemplatedSummary(report.executive_summary)
    ? 'A verified work report from OnlyWorks.'
    : (report.executive_summary?.substring(0, 160) || 'A verified work report from OnlyWorks.')
  return {
    title: `${title} | OnlyWorks`,
    description: desc,
    openGraph: { title: `${title} | OnlyWorks`, description: desc, type: 'article' },
  }
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '—'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function parseListItems(
  items: Array<{ title: string; description?: string }> | string | undefined,
): Array<{ title: string; description?: string }> {
  if (!items) return []
  if (typeof items === 'string') {
    try {
      const parsed = JSON.parse(items)
      return Array.isArray(parsed) ? parsed : [{ title: items }]
    } catch {
      return items.split('\n').filter(Boolean).map((s) => ({ title: s.trim() }))
    }
  }
  return items
}

// ── Templated/fallback content detection ─────────────────────────────
// When the AI summary fails (short session, missing OCR, etc) the backend
// emits placeholder strings. Showing them as if they're real content makes
// reports look like junk. We detect the known patterns and hide them.

function isTemplatedSummary(text: string | undefined): boolean {
  if (!text) return true
  const t = text.trim()
  // "Work session focused on software development. Used Google Chrome, Code,
  //  OnlyWorks Desktop. 0 focus periods detected."
  return /^Work session focused on \w+\.( Used [^.]+\.)?( \d+ focus periods? detected\.?)?$/i.test(t)
}

function isTemplatedAccomplishment(text: string): boolean {
  // "Completed 62 minutes of software development using Google Chrome, Code, OnlyWorks Desktop"
  return /^Completed \d+ minutes of .+ using .+$/i.test(text.trim())
}

function isTemplatedNextStep(text: string): boolean {
  return /^Continue with planned tasks\.?$/i.test(text.trim())
}

// ── App Usage normalization ──────────────────────────────────────────
// Handles both legacy { Chrome: 5, ... } and current
// [{ name: "Chrome", time_minutes: 5 }, ...] shapes. Filters out entries
// whose names are numeric (array-index leak), zero-minute entries, and
// anything where minutes can't be coerced to a positive finite number.

function normalizeAppUsage(usage: ReportData['app_usage']): Array<{ name: string; minutes: number }> {
  if (!usage) return []
  const entries: Array<{ name: string; minutes: number }> = []

  if (Array.isArray(usage)) {
    for (const u of usage) {
      const name = u?.name || u?.app || u?.application || ''
      const minutes = Number(u?.time_minutes ?? u?.minutes ?? 0)
      if (name && Number.isFinite(minutes) && minutes > 0 && !/^\d+$/.test(name)) {
        entries.push({ name, minutes })
      }
    }
  } else {
    for (const [name, raw] of Object.entries(usage)) {
      const minutes = Number(raw)
      // Skip numeric keys (these come from arrays accidentally treated as objects)
      if (/^\d+$/.test(name)) continue
      if (!name || !Number.isFinite(minutes) || minutes <= 0) continue
      entries.push({ name, minutes })
    }
  }

  return entries.sort((a, b) => b.minutes - a.minutes).slice(0, 10)
}

export default async function SharedReportPage({ params }: { params: { id: string } }) {
  const report = await getSharedReport(params.id)
  if (!report) notFound()

  const title = report.report_name || report.title || 'Work Report'

  // Parse + filter content
  const accomplishments = parseListItems(report.accomplishments).filter(
    (a) => !isTemplatedAccomplishment(a.title || ''),
  )
  const blockers = parseListItems(report.blockers)
  const nextSteps = parseListItems(report.next_steps).filter(
    (s) => !isTemplatedNextStep(s.title || ''),
  )

  const summaryIsReal = !isTemplatedSummary(report.executive_summary)
  const productivityScore = report.productivity_metrics?.productivity_score ?? 0
  // focus_score intentionally not destructured — deprecated as of v3.11.0.

  const appUsage = normalizeAppUsage(report.app_usage)
  const totalAppMinutes = appUsage.reduce((sum, a) => sum + a.minutes, 0)

  const skills = (report.skills_used || []).filter((s) => s.skill)
  const strengths = (report.strengths_demonstrated || []).filter((s) => s.strength)
  const growth = (report.growth_areas || []).filter((g) => g.area)
  const tasksDone = (report.tasks_completed || []).filter((t) => t.task)
  const tasksRemaining = (report.tasks_remaining || []).filter((t) => t.task)

  // Determine if this is a "thin" report — lots of fallback content stripped,
  // little real signal left. Affects how we lay things out.
  const realContentSections = [
    summaryIsReal,
    accomplishments.length > 0,
    blockers.length > 0,
    nextSteps.length > 0,
    skills.length > 0,
    strengths.length > 0,
    growth.length > 0,
    tasksDone.length > 0,
    tasksRemaining.length > 0,
  ].filter(Boolean).length
  const isThinReport = realContentSections <= 1

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navigation />

      {/* Hero — title + meta + productivity score */}
      <section className="border-b pt-24 lg:pt-28" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-4">
            <span className="w-8 h-px bg-foreground/30" />
            Verified Work Report
          </span>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-10 items-end">
            <div>
              <h1 className="font-display tracking-tight leading-[0.95] mb-6 text-4xl lg:text-6xl" style={{ color: 'var(--text)' }}>
                {title}
              </h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                {report.date_from && report.date_to && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(report.date_from)}
                      {report.date_from !== report.date_to ? ` – ${formatDate(report.date_to)}` : ''}
                    </span>
                  </div>
                )}
                {!!report.total_duration_seconds && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(report.total_duration_seconds)} logged</span>
                  </div>
                )}
                {!!report.total_sessions && (
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4" />
                    <span>
                      {report.total_sessions} session{report.total_sessions !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Productivity score — only the one metric, prominent */}
            {productivityScore > 0 && (
              <div className="lg:justify-self-end">
                <div className="flex flex-col items-start lg:items-end">
                  <div className="font-display leading-none text-7xl lg:text-8xl" style={{ color: 'var(--accent)' }}>
                    {productivityScore}%
                  </div>
                  <div className="text-sm mt-2 uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    Productivity Score
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Thin-report banner */}
          {isThinReport && (
            <div className="mt-10 p-4 border" style={{ borderColor: 'var(--border)', background: 'var(--bg-alt)' }}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <strong>Light report.</strong> This session was short or had limited captured activity, so detailed accomplishments aren't included.
                {appUsage.length > 0 && ' App usage breakdown is below.'}
              </p>
            </div>
          )}
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        {/* Executive Summary — only render if non-templated */}
        {summaryIsReal && (
          <section className="border border-foreground/10 bg-background p-6 lg:p-8">
            <h2 className="font-display text-xl tracking-tight mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Target className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              Summary
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {report.executive_summary}
            </p>
          </section>
        )}

        {/* Skills used — chips with proficiency dot */}
        {skills.length > 0 && (
          <section className="border border-foreground/10 bg-background p-6 lg:p-8">
            <h2 className="font-display text-xl tracking-tight mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Zap className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              Skills Used
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => {
                const dotColor =
                  s.proficiency_signal === 'advanced' ? '#22c55e'
                  : s.proficiency_signal === 'intermediate' ? 'var(--text-muted)'
                  : '#f59e0b'
                return (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium border"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
                    {s.skill}
                  </span>
                )
              })}
            </div>
          </section>
        )}

        {/* Tasks split */}
        {(tasksDone.length > 0 || tasksRemaining.length > 0) && (
          <section className="border border-foreground/10 bg-background p-6 lg:p-8">
            <h2 className="font-display text-xl tracking-tight mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <ListChecks className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              Tasks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasksDone.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                    Completed
                  </div>
                  <ul className="space-y-2">
                    {tasksDone.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 mt-2 flex-shrink-0" />
                        <span style={{ color: 'var(--text)' }}>{item.task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tasksRemaining.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                    Remaining
                  </div>
                  <ul className="space-y-2">
                    {tasksRemaining.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-2 h-2 border-2 mt-2 flex-shrink-0" style={{ borderColor: 'var(--text-muted)' }} />
                        <div className="flex items-center gap-2">
                          <span style={{ color: 'var(--text)' }}>{item.task}</span>
                          {item.priority && (
                            <span
                              className="text-xs font-semibold uppercase px-1.5 py-0.5"
                              style={{
                                background:
                                  item.priority === 'high' ? 'rgba(239,68,68,0.1)'
                                  : item.priority === 'medium' ? 'rgba(59,130,246,0.1)'
                                  : 'rgba(107,114,128,0.1)',
                                color:
                                  item.priority === 'high' ? '#ef4444'
                                  : item.priority === 'medium' ? '#3b82f6'
                                  : '#6b7280',
                              }}
                            >
                              {item.priority}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Accomplishments */}
        {accomplishments.length > 0 && (
          <section className="border border-foreground/10 bg-background p-6 lg:p-8">
            <h2 className="font-display text-xl tracking-tight mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <CheckCircle className="w-5 h-5 text-green-500" />
              Accomplishments
            </h2>
            <ul className="space-y-3">
              {accomplishments.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <div>
                    <div style={{ color: 'var(--text)' }}>{item.title}</div>
                    {item.description && (
                      <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                        {item.description}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Blockers */}
        {blockers.length > 0 && (
          <section className="border border-foreground/10 bg-background p-6 lg:p-8">
            <h2 className="font-display text-xl tracking-tight mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Challenges
            </h2>
            <ul className="space-y-3">
              {blockers.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <div>
                    <div style={{ color: 'var(--text)' }}>{item.title}</div>
                    {item.description && (
                      <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                        {item.description}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Strengths Demonstrated */}
        {strengths.length > 0 && (
          <section className="border border-foreground/10 bg-background p-6 lg:p-8">
            <h2 className="font-display text-xl tracking-tight mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Zap className="w-5 h-5 text-green-500" />
              Strengths Demonstrated
            </h2>
            <div className="space-y-3">
              {strengths.map((item, i) => (
                <div
                  key={i}
                  className="p-3 border-l-[3px] border-green-500"
                  style={{ background: 'rgba(34,197,94,0.12)' }}
                >
                  <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                    {item.strength}
                  </div>
                  {item.evidence && (
                    <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {item.evidence}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Growth Areas */}
        {growth.length > 0 && (
          <section className="border border-foreground/10 bg-background p-6 lg:p-8">
            <h2 className="font-display text-xl tracking-tight mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Growth Areas
            </h2>
            <div className="space-y-3">
              {growth.map((item, i) => (
                <div
                  key={i}
                  className="p-3 border-l-[3px] border-amber-400"
                  style={{ background: 'rgba(251,191,36,0.12)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                      {item.area}
                    </span>
                  </div>
                  {item.observation && (
                    <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                      {item.observation}
                    </div>
                  )}
                  {item.suggestion && (
                    <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      <strong>Suggestion:</strong> {item.suggestion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Next Steps */}
        {nextSteps.length > 0 && (
          <section className="border border-foreground/10 bg-background p-6 lg:p-8">
            <h2 className="font-display text-xl tracking-tight mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Lightbulb className="w-5 h-5 text-blue-500" />
              Next Steps
            </h2>
            <ul className="space-y-3">
              {nextSteps.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div style={{ color: 'var(--text)' }}>{item.title}</div>
                    {item.description && (
                      <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                        {item.description}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* App Usage — only render if normalized data has real entries */}
        {appUsage.length > 0 && (
          <section className="border border-foreground/10 bg-background p-6 lg:p-8">
            <h2 className="font-display text-xl tracking-tight mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <BarChart3 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              App Usage
            </h2>
            <div className="space-y-3">
              {appUsage.map(({ name, minutes }) => {
                const percentage = totalAppMinutes > 0 ? (minutes / totalAppMinutes) * 100 : 0
                return (
                  <div key={name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="truncate pr-3" style={{ color: 'var(--text)' }}>
                        {name}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>{formatDuration(minutes * 60)}</span>
                    </div>
                    <div className="h-2" style={{ background: 'var(--border)' }}>
                      <div
                        className="h-full"
                        style={{ width: `${percentage}%`, background: 'var(--accent)' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Footer CTA */}
        <div className="text-center pt-8 pb-4">
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            This report was generated with OnlyWorks
          </p>
          <Link
            href="/downloads"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm rounded-full font-medium text-white transition-all hover:opacity-90"
            style={{ background: '#8b5cf6' }}
          >
            Try OnlyWorks Free
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
