import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Zap, TrendingUp, Award, Star } from 'lucide-react'
import { BACKEND_URL } from '@/lib/config'
import type { OWProfileData } from '@/lib/types/profile'

async function getSharedOWProfile(token: string): Promise<OWProfileData | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/profiles/ow-profile/shared/${token}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('Failed to fetch shared OW profile:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { token: string } }): Promise<Metadata> {
  const profile = await getSharedOWProfile(params.token)
  if (!profile) {
    return { title: 'OW Profile Not Found | OnlyWorks' }
  }
  return {
    title: `OW Profile | ${profile.summary.total_skills} Skills | OnlyWorks`,
    description: `Skill portfolio with ${profile.summary.total_skills} skills across ${profile.summary.total_reports} reports.`,
    openGraph: {
      title: `OW Profile | OnlyWorks`,
      description: `${profile.summary.total_skills} skills, ${profile.summary.top_proficiency_count} at advanced level.`,
      type: 'profile',
    },
  }
}

export default async function SharedOWProfilePage({ params }: { params: { token: string } }) {
  const profile = await getSharedOWProfile(params.token)
  if (!profile) notFound()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="OnlyWorks" className="h-8 w-8" />
            <span className="font-semibold" style={{ color: 'var(--text)' }}>OnlyWorks</span>
          </Link>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>OW Profile</div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{profile.summary.total_skills}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Skills</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{profile.summary.top_proficiency_count}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Advanced</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{profile.summary.total_reports}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Reports</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold capitalize" style={{ color: 'var(--accent)' }}>{profile.summary.strongest_category}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Top Category</div>
          </div>
        </div>

        {/* Skills */}
        {profile.skills.length > 0 && (
          <div className="card p-5 mb-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Zap className="w-4 h-4 text-purple-500" /> Skills
            </h3>
            {['technical', 'soft', 'domain'].map(cat => {
              const catSkills = profile.skills.filter(s => s.category === cat)
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
                          s.proficiency === 'advanced' ? 'bg-green-500' : s.proficiency === 'intermediate' ? 'bg-blue-500' : 'bg-amber-500'
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
        {profile.top_strengths.length > 0 && (
          <div className="card p-5 mb-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Star className="w-4 h-4 text-green-500" /> Top Strengths
            </h3>
            <div className="space-y-2">
              {profile.top_strengths.map((s, i) => (
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
        {profile.highlights.length > 0 && (
          <div className="card p-5 mb-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Award className="w-4 h-4 text-amber-500" /> Highlights
            </h3>
            <ul className="space-y-2">
              {profile.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className={`w-2 h-2 mt-1.5 flex-shrink-0 ${h.impact === 'high' ? 'bg-green-500' : h.impact === 'medium' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                  <span className="text-sm" style={{ color: 'var(--text)' }}>{h.accomplishment}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Growth Journey */}
        {profile.growth_journey.length > 0 && (
          <div className="card p-5 mb-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <TrendingUp className="w-4 h-4 text-amber-500" /> Growth Journey
            </h3>
            <div className="space-y-2">
              {profile.growth_journey.map((g, i) => (
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

        {/* Footer */}
        <div className="text-center pt-6 pb-4">
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>OW Profile powered by OnlyWorks</p>
          <Link href="/downloads" className="btn btn-primary">Get OnlyWorks</Link>
        </div>
      </main>
    </div>
  )
}
