import { Zap, TrendingUp, Award, Star } from 'lucide-react'
import type { OWProfileData } from '@/lib/types/profile'

interface Props {
  owProfile: OWProfileData
}

export default function OWProfileView({ owProfile }: Props) {
  return (
    <>
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ marginBottom: '1rem' }}>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{owProfile.summary.total_skills}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Skills</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{owProfile.summary.top_proficiency_count}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Advanced</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{owProfile.summary.total_reports}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Reports</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold capitalize" style={{ color: 'var(--accent)', fontSize: owProfile.summary.strongest_category.length > 8 ? '1rem' : undefined }}>{owProfile.summary.strongest_category}</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Top Category</div>
        </div>
      </div>

      {/* Skills */}
      {owProfile.skills.length > 0 && (
        <div className="card p-5" style={{ marginBottom: '1rem' }}>
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Zap className="w-4 h-4 text-purple-500" /> Skills
          </h3>
          {['technical', 'soft', 'domain'].map(cat => {
            const catSkills = owProfile.skills.filter(s => s.category === cat)
            if (catSkills.length === 0) return null
            return (
              <div key={cat} style={{ marginBottom: '0.75rem' }}>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>{cat}</div>
                <div className="flex flex-wrap gap-1.5">
                  {catSkills.map((s, i) => (
                    <span key={i} className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium ${
                      cat === 'technical' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                      cat === 'soft' ? 'bg-purple-50 text-purple-600 border border-purple-200' :
                      'bg-green-50 text-green-600 border border-green-200'
                    } ${s.proficiency === 'advanced' ? 'font-semibold' : ''} ${s.proficiency === 'emerging' ? 'border-dashed opacity-80' : ''}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        s.proficiency === 'advanced' ? 'bg-green-500' :
                        s.proficiency === 'intermediate' ? 'bg-blue-500' : 'bg-amber-500'
                      }`} />
                      {s.skill}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Top Strengths */}
      {owProfile.top_strengths.length > 0 && (
        <div className="card p-5" style={{ marginBottom: '1rem' }}>
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Star className="w-4 h-4 text-green-500" /> Top Strengths
          </h3>
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
        <div className="card p-5" style={{ marginBottom: '1rem' }}>
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Award className="w-4 h-4 text-amber-500" /> Highlights
          </h3>
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
        <div className="card p-5" style={{ marginBottom: '1rem' }}>
          <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <TrendingUp className="w-4 h-4 text-amber-500" /> Growth Journey
          </h3>
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
