'use client'

import { useState } from 'react'
import { Zap, TrendingUp, Award, Star, ChevronDown } from 'lucide-react'
import type { OWProfileData } from '@/lib/types/profile'
import { formatCategoryLabel, groupSkillsByCategory } from '@/lib/skills'

interface Props {
  owProfile: OWProfileData
}

export default function OWProfileView({ owProfile }: Props) {
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set())

  const toggleSkill = (id: string) => {
    setExpandedSkills((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const strongestCategoryLabel = formatCategoryLabel(owProfile.summary.strongest_category)

  return (
    <>
      {/* Summary Stats */}
      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <div className="profile-stat-value" style={{ color: 'var(--accent)' }}>{owProfile.summary.total_skills}</div>
          <div className="profile-stat-label">Skills</div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-value" style={{ color: 'var(--accent)' }}>{owProfile.summary.top_proficiency_count}</div>
          <div className="profile-stat-label">Advanced</div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-value" style={{ color: 'var(--accent)' }}>{owProfile.summary.total_reports}</div>
          <div className="profile-stat-label">Reports</div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-value" style={{ color: 'var(--accent)', fontSize: strongestCategoryLabel.length > 12 ? '1rem' : undefined }}>{strongestCategoryLabel}</div>
          <div className="profile-stat-label">Top Category</div>
        </div>
      </div>

      {/* Verified Skills — collapsible rows with evidence */}
      {owProfile.skills.length > 0 && (
        <div className="profile-card p-4 sm:p-6" style={{ marginBottom: '1rem' }}>
          <div className="pp-section-head mb-4">
            <span className="pp-section-num">01</span>
            <h3 className="font-display text-xl tracking-tight flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Zap className="w-4 h-4" style={{ color: 'var(--accent)' }} /> Verified skills
            </h3>
            <span className="pp-section-note">{owProfile.summary.total_skills} · technical, soft, domain</span>
          </div>
          {groupSkillsByCategory(owProfile.skills).map(({ key, label, skills: catSkills }) => (
            <div key={key} className="mb-6 last:mb-0">
              <div className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>{label}</div>
              <div className="border-t" style={{ borderColor: 'var(--border)' }}>
                {catSkills.map((s, idx) => {
                  const skillId = `${key}-${idx}`
                  const isExpanded = expandedSkills.has(skillId)
                  const hasEvidence = Array.isArray(s.evidence) && s.evidence.length > 0
                  const profColor =
                    s.proficiency === 'advanced'
                      ? '#22c55e'
                      : s.proficiency === 'intermediate'
                      ? 'var(--text-muted)'
                      : '#f59e0b'

                  const evidenceMeta = (
                    <div className="pp-evidence-line">
                      <span>{s.report_count} session{s.report_count === 1 ? '' : 's'}</span>
                      {s.last_seen && (
                        <>
                          <span className="pp-evidence-sep">·</span>
                          <span>last seen {s.last_seen}</span>
                        </>
                      )}
                    </div>
                  )

                  if (!hasEvidence) {
                    return (
                      <div
                        key={skillId}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 py-3 px-1 border-b last:border-b-0"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{s.skill}</div>
                          {evidenceMeta}
                        </div>
                        <span
                          className="text-[0.625rem] px-2 py-0.5 border uppercase tracking-wider font-bold self-start sm:self-auto"
                          style={{ borderColor: profColor, color: profColor }}
                        >
                          {s.proficiency}
                        </span>
                      </div>
                    )
                  }

                  return (
                    <div key={skillId} className="border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
                      <button
                        type="button"
                        onClick={() => toggleSkill(skillId)}
                        aria-expanded={isExpanded}
                        className="w-full flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 py-3 px-1 text-left transition-colors"
                        style={{ background: 'transparent' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(8,5,3,0.03)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{s.skill}</div>
                          {evidenceMeta}
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span
                          className="text-[0.625rem] px-2 py-0.5 border uppercase tracking-wider font-bold"
                          style={{ borderColor: profColor, color: profColor }}
                        >
                          {s.proficiency}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          style={{ color: isExpanded ? 'var(--accent)' : 'var(--text-muted)' }}
                        />
                        </div>
                      </button>
                      {isExpanded && (
                        <div
                          className="px-4 pb-4 pt-2 ml-1 border-l-[3px]"
                          style={{ borderColor: 'var(--accent)', background: 'rgba(139,92,246,0.03)' }}
                        >
                          <div className="text-[0.625rem] uppercase tracking-widest font-bold mb-3" style={{ color: 'var(--accent)' }}>Evidence</div>
                          <ol className="space-y-3">
                            {s.evidence!.map((e, i) => (
                              <li key={i} className="grid grid-cols-[26px_1fr] gap-3 items-baseline">
                                <span
                                  className="text-[0.6875rem] font-mono font-medium"
                                  style={{ color: 'var(--text-muted)', letterSpacing: '0.04em' }}
                                >
                                  {String(i + 1).padStart(2, '0')}
                                </span>
                                <span className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{e}</span>
                              </li>
                            ))}
                          </ol>
                          {s.report_count > 1 && (
                            <div
                              className="mt-4 inline-flex items-center gap-1.5 text-[0.625rem] px-2 py-1 border font-bold uppercase tracking-wider"
                              style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                            >
                              <span>✓</span>
                              <span>Verified</span>
                              <span className="font-mono">×{s.report_count}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Top Strengths */}
      {owProfile.top_strengths.length > 0 && (
        <div className="profile-card p-4 sm:p-6" style={{ marginBottom: '1rem' }}>
          <div className="pp-section-head mb-3">
            <span className="pp-section-num">02</span>
            <h3 className="font-display text-xl tracking-tight flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Star className="w-4 h-4 text-green-500" /> Top strengths
            </h3>
          </div>
          <div className="space-y-2">
            {owProfile.top_strengths.map((s, i) => (
              <div key={i} className="p-3 border-l-[3px] border-green-500" style={{ background: 'rgba(34,197,94,0.05)' }}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>{s.strength}</span>
                  <span className="text-xs px-2 py-0.5" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>{s.occurrences}x</span>
                </div>
                {s.latest_evidence && <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.latest_evidence}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Highlights */}
      {owProfile.highlights.length > 0 && (
        <div className="profile-card p-4 sm:p-6" style={{ marginBottom: '1rem' }}>
          <div className="pp-section-head mb-3">
            <span className="pp-section-num">03</span>
            <h3 className="font-display text-xl tracking-tight flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Award className="w-4 h-4 text-amber-500" /> Highlights
            </h3>
          </div>
          <ul className="space-y-2">
            {owProfile.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className={`w-2 h-2 mt-1.5 flex-shrink-0 ${
                  h.impact === 'high' ? 'bg-green-500' : h.impact === 'medium' ? 'bg-blue-500' : 'bg-gray-400'
                }`} />
                <span className="text-sm" style={{ color: 'var(--text)' }}>{h.accomplishment}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Growth Journey */}
      {owProfile.growth_journey.length > 0 && (
        <div className="profile-card p-4 sm:p-6" style={{ marginBottom: '1rem' }}>
          <div className="pp-section-head mb-3">
            <span className="pp-section-num">04</span>
            <h3 className="font-display text-xl tracking-tight flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <TrendingUp className="w-4 h-4 text-amber-500" /> Growth journey
            </h3>
          </div>
          <div className="space-y-2">
            {owProfile.growth_journey.map((g, i) => (
              <div key={i} className="p-3 border-l-[3px] border-amber-400" style={{ background: 'rgba(251,191,36,0.05)' }}>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>{g.area}</span>
                  <span className={`text-xs px-2 py-0.5 ${
                    g.trend === 'improving' ? 'bg-green-500/10 text-green-600' :
                    g.trend === 'new' ? 'bg-blue-500/10 text-blue-600' :
                    'bg-amber-500/10 text-amber-600'
                  }`}>{g.trend}</span>
                </div>
                {g.latest_status && <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{g.latest_status}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
