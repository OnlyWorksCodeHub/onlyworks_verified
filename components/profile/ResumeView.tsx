import { Briefcase, Clock, Flame, Calendar } from 'lucide-react'
import type { ResumeData, OWProfileSkill } from '@/lib/types/profile'
import { groupSkillsByCategory } from '@/lib/skills'

interface Props {
  resume: ResumeData
  skills: OWProfileSkill[]
  strengths: Array<{ strength: string; occurrences: number; latest_evidence: string }>
}

export default function ResumeView({ resume, skills, strengths }: Props) {
  return (
    <>
      {/* Professional Summary */}
      {resume.professional_summary && (
        <div className="profile-card p-6" style={{ marginBottom: '1rem' }}>
          <h3 className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
            Professional Summary
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {resume.professional_summary}
          </p>
        </div>
      )}

      {/* Skills — compact chips */}
      {skills.length > 0 && (
        <div className="profile-card p-6" style={{ marginBottom: '1rem' }}>
          <h3 className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Skills
          </h3>
          {groupSkillsByCategory(skills).map(({ key, label, skills: catSkills }) => (
            <div key={key} style={{ marginBottom: '0.75rem' }}>
              <div className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>{label}</div>
              <div className="flex flex-wrap gap-1.5">
                {catSkills.map((s, i) => (
                  <span key={i} className="inline-block px-2.5 py-1 text-xs font-medium border" style={{
                    color: 'var(--text)',
                    borderColor: 'var(--border)',
                    borderLeftWidth: '3px',
                    borderLeftColor: s.proficiency === 'advanced' ? '#22c55e' : s.proficiency === 'intermediate' ? '#3b82f6' : '#f59e0b',
                  }}>
                    {s.skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Strengths */}
      {strengths.length > 0 && (
        <div className="profile-card p-6" style={{ marginBottom: '1rem' }}>
          <h3 className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Key Strengths
          </h3>
          <ul className="space-y-2" style={{ listStyle: 'disc', paddingLeft: '1.25rem' }}>
            {strengths.slice(0, 8).map((s, i) => (
              <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--text)' }}>{s.strength}</strong>
                {s.latest_evidence && <span style={{ color: 'var(--text-muted)' }}> — {s.latest_evidence}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Work Activity Timeline */}
      {resume.work_activity.length > 0 && (
        <div className="profile-card p-6" style={{ marginBottom: '1rem' }}>
          <h3 className="font-mono text-xs uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <Briefcase className="w-4 h-4" /> Work Activity
          </h3>
          <div className="space-y-4">
            {resume.work_activity.map((w, i) => (
              <div key={i} className="pb-3 border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>{w.period}</span>
                  {w.title && (
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {w.title}{w.company ? ` at ${w.company}` : ''}
                    </span>
                  )}
                </div>
                {w.accomplishments.length > 0 && (
                  <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem', margin: '0.25rem 0 0' }}>
                    {w.accomplishments.map((a, j) => (
                      <li key={j} className="text-xs" style={{ color: 'var(--text-secondary)', marginBottom: '0.125rem' }}>{a}</li>
                    ))}
                  </ul>
                )}
                {w.skills_applied.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {w.skills_applied.map((s, j) => (
                      <span key={j} className="text-xs px-1.5 py-0.5 border" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accomplishments */}
      {resume.all_accomplishments.length > 0 && (
        <div className="profile-card p-6" style={{ marginBottom: '1rem' }}>
          <h3 className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Accomplishments
          </h3>
          <ul className="space-y-2">
            {resume.all_accomplishments.slice(0, 20).map((a, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-2 h-2 mt-1.5 flex-shrink-0" style={{
                  background: a.impact === 'high' ? 'var(--accent, #8b5cf6)' : a.impact === 'medium' ? '#3b82f6' : '#9ca3af',
                  borderRadius: '50%',
                }} />
                <div>
                  <span className="text-sm" style={{ color: 'var(--text)' }}>{a.accomplishment}</span>
                  {a.date && (
                    <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>
                      {new Date(a.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stats Footer */}
      {(resume.total_verified_hours > 0 || resume.total_sessions > 0) && (
        <div className="profile-stats-grid">
          {resume.total_verified_hours > 0 && (
            <div className="profile-stat-card">
              <Clock className="w-4 h-4 mx-auto mb-1" style={{ color: 'var(--accent)' }} />
              <div className="profile-stat-value">{resume.total_verified_hours}</div>
              <div className="profile-stat-label">Verified Hours</div>
            </div>
          )}
          {resume.total_sessions > 0 && (
            <div className="profile-stat-card">
              <Briefcase className="w-4 h-4 mx-auto mb-1" style={{ color: 'var(--accent)' }} />
              <div className="profile-stat-value">{resume.total_sessions}</div>
              <div className="profile-stat-label">Sessions</div>
            </div>
          )}
          {resume.current_streak > 0 && (
            <div className="profile-stat-card">
              <Flame className="w-4 h-4 mx-auto mb-1" style={{ color: 'var(--accent)' }} />
              <div className="profile-stat-value">{resume.current_streak}</div>
              <div className="profile-stat-label">Day Streak</div>
            </div>
          )}
          {resume.active_since && (
            <div className="profile-stat-card">
              <Calendar className="w-4 h-4 mx-auto mb-1" style={{ color: 'var(--accent)' }} />
              <div className="profile-stat-value">
                {new Date(resume.active_since).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
              <div className="profile-stat-label">Active Since</div>
            </div>
          )}
        </div>
      )}

      {/* Top Tools */}
      {resume.top_tools.length > 0 && (
        <div className="profile-card p-6" style={{ marginBottom: '1rem' }}>
          <h3 className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Top Tools
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {resume.top_tools.map((t, i) => (
              <span key={i} className="inline-block px-2.5 py-1 text-xs font-medium border" style={{ color: 'var(--text)', borderColor: 'var(--border)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
