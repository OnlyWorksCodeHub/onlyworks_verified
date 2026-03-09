import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, Calendar, Target, CheckCircle, AlertTriangle, Lightbulb, BarChart3, ArrowRight, Zap, TrendingUp, ListChecks } from 'lucide-react'
import { BACKEND_URL } from '@/lib/config'

interface ReportData {
  id: string
  report_name?: string
  title?: string
  executive_summary?: string
  accomplishments?: Array<{ title: string; description?: string }> | string
  blockers?: Array<{ title: string; description?: string }> | string
  next_steps?: Array<{ title: string; description?: string }> | string
  goals_summary?: {
    total?: number
    completed?: number
    in_progress?: number
  }
  productivity_metrics?: {
    productivity_score?: number
    focus_score?: number
    total_duration_minutes?: number
  }
  time_distribution?: Record<string, number>
  app_usage?: Record<string, number>
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
    const res = await fetch(`${BACKEND_URL}/api/reports/shared/${token}`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('Failed to fetch shared report:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const report = await getSharedReport(params.id)

  if (!report) {
    return {
      title: 'Report Not Found | OnlyWorks',
    }
  }

  return {
    title: `${report.report_name || report.title || 'Productivity Report'} | OnlyWorks`,
    description: report.executive_summary?.substring(0, 160) || 'View this productivity report shared via OnlyWorks.',
    openGraph: {
      title: `${report.report_name || report.title || 'Productivity Report'} | OnlyWorks`,
      description: report.executive_summary?.substring(0, 160) || 'View this productivity report shared via OnlyWorks.',
      type: 'article',
    },
  }
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function parseListItems(items: Array<{ title: string; description?: string }> | string | undefined): Array<{ title: string; description?: string }> {
  if (!items) return []
  if (typeof items === 'string') {
    // Try parsing as JSON first
    try {
      return JSON.parse(items)
    } catch {
      // Split by newlines or return as single item
      return items.split('\n').filter(Boolean).map(item => ({ title: item.trim() }))
    }
  }
  return items
}

export default async function SharedReportPage({ params }: { params: { id: string } }) {
  const report = await getSharedReport(params.id)

  if (!report) {
    notFound()
  }

  const accomplishments = parseListItems(report.accomplishments)
  const blockers = parseListItems(report.blockers)
  const nextSteps = parseListItems(report.next_steps)

  const productivityScore = report.productivity_metrics?.productivity_score ?? 0
  const focusScore = report.productivity_metrics?.focus_score ?? 0

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="OnlyWorks" className="h-8 w-8" />
            <span className="font-semibold" style={{ color: 'var(--text)' }}>OnlyWorks</span>
          </Link>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <span>Shared Report</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Report Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
            {report.report_name || report.title || 'Productivity Report'}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            {report.date_from && report.date_to && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(report.date_from)} - {formatDate(report.date_to)}</span>
              </div>
            )}
            {report.total_duration_seconds && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(report.total_duration_seconds)} tracked</span>
              </div>
            )}
            {report.total_sessions && (
              <div className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                <span>{report.total_sessions} session{report.total_sessions !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* Score Cards */}
        {(productivityScore > 0 || focusScore > 0) && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {productivityScore > 0 && (
              <div className="card p-4 text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--accent)' }}>
                  {productivityScore}%
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Productivity Score
                </div>
              </div>
            )}
            {focusScore > 0 && (
              <div className="card p-4 text-center">
                <div className="text-3xl font-bold mb-1" style={{ color: 'var(--accent)' }}>
                  {focusScore}%
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Focus Score
                </div>
              </div>
            )}
          </div>
        )}

        {/* Executive Summary */}
        {report.executive_summary && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Target className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              Summary
            </h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {report.executive_summary}
            </p>
          </div>
        )}

        {/* Tasks */}
        {((report.tasks_completed && report.tasks_completed.length > 0) || (report.tasks_remaining && report.tasks_remaining.length > 0)) && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <ListChecks className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              Tasks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.tasks_completed && report.tasks_completed.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Completed</div>
                  <ul className="space-y-2">
                    {report.tasks_completed.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 mt-2 flex-shrink-0" />
                        <span style={{ color: 'var(--text)' }}>{item.task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {report.tasks_remaining && report.tasks_remaining.length > 0 && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Remaining</div>
                  <ul className="space-y-2">
                    {report.tasks_remaining.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-2 h-2 border-2 mt-2 flex-shrink-0" style={{ borderColor: 'var(--text-muted)' }} />
                        <div className="flex items-center gap-2">
                          <span style={{ color: 'var(--text)' }}>{item.task}</span>
                          {item.priority && (
                            <span className={`text-xs font-semibold uppercase px-1.5 py-0.5 ${
                              item.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                              item.priority === 'medium' ? 'bg-blue-500/10 text-blue-500' :
                              'bg-gray-500/10 text-gray-500'
                            }`}>{item.priority}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Accomplishments */}
        {accomplishments.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
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
          </div>
        )}

        {/* Skills Used */}
        {report.skills_used && report.skills_used.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Zap className="w-5 h-5 text-purple-500" />
              Skills Used
            </h2>
            <div className="flex flex-wrap gap-2">
              {report.skills_used.map((item, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium ${
                    item.category === 'technical' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                    item.category === 'soft' ? 'bg-purple-50 text-purple-600 border border-purple-200' :
                    'bg-green-50 text-green-600 border border-green-200'
                  } ${item.proficiency_signal === 'emerging' ? 'border-dashed' : ''}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    item.proficiency_signal === 'advanced' ? 'bg-green-500' :
                    item.proficiency_signal === 'intermediate' ? 'bg-blue-500' :
                    'bg-amber-500'
                  }`} />
                  {item.skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Blockers */}
        {blockers.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
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
          </div>
        )}

        {/* Strengths Demonstrated */}
        {report.strengths_demonstrated && report.strengths_demonstrated.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Zap className="w-5 h-5 text-green-500" />
              Strengths Demonstrated
            </h2>
            <div className="space-y-3">
              {report.strengths_demonstrated.map((item, i) => (
                <div key={i} className="p-3 border-l-[3px] border-green-500" style={{ background: 'rgba(34,197,94,0.05)' }}>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{item.strength}</div>
                  <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{item.evidence}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Growth Areas */}
        {report.growth_areas && report.growth_areas.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Growth Areas
            </h2>
            <div className="space-y-3">
              {report.growth_areas.map((item, i) => (
                <div key={i} className="p-3 border-l-[3px] border-amber-400" style={{ background: 'rgba(251,191,36,0.05)' }}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{item.area}</span>
                    {item.priority && (
                      <span className={`text-xs font-semibold uppercase px-1.5 py-0.5 ${
                        item.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                        item.priority === 'medium' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-gray-500/10 text-gray-500'
                      }`}>{item.priority}</span>
                    )}
                  </div>
                  <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{item.observation}</div>
                  {item.suggestion && (
                    <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      <strong>Suggestion:</strong> {item.suggestion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        {nextSteps.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
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
          </div>
        )}

        {/* App Usage */}
        {report.app_usage && Object.keys(report.app_usage).length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <BarChart3 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              App Usage
            </h2>
            <div className="space-y-3">
              {Object.entries(report.app_usage)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 10)
                .map(([app, minutes]) => {
                  const total = Object.values(report.app_usage!).reduce((a, b) => a + b, 0) as number
                  const percentage = total > 0 ? ((minutes as number) / total) * 100 : 0

                  return (
                    <div key={app}>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: 'var(--text)' }}>{app}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{formatDuration((minutes as number) * 60)}</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: 'var(--border)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${percentage}%`,
                            background: 'var(--accent)',
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-8 pb-4">
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            This report was generated with OnlyWorks
          </p>
          <Link href="/downloads" className="btn btn-primary">
            Try OnlyWorks Free
          </Link>
        </div>
      </main>
    </div>
  )
}
