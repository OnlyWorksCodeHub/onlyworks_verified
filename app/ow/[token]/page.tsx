import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import ProfileViewToggle from '@/components/profile/ProfileViewToggle'
import { BACKEND_URL } from '@/lib/config'
import { displayOwId } from '@/lib/skills'
import type { UnifiedProfileData } from '@/lib/types/profile'

async function getSharedProfile(token: string): Promise<UnifiedProfileData | null> {
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
  const profile = await getSharedProfile(params.token)
  if (!profile) {
    return { title: 'OW Profile Not Found | OnlyWorks' }
  }
  const owp = profile.ow_profile
  const pi = profile.profile_info
  const name = pi?.full_name || 'Professional'
  return {
    title: `${name} | OW Profile | OnlyWorks`,
    description: `Skill portfolio with ${owp?.summary?.total_skills || 0} skills across ${owp?.summary?.total_reports || 0} reports.`,
    openGraph: {
      title: `${name} | OW Profile | OnlyWorks`,
      description: `${owp?.summary?.total_skills || 0} skills, ${owp?.summary?.top_proficiency_count || 0} at advanced level.`,
      type: 'profile',
    },
  }
}

export default async function SharedOWProfilePage({ params }: { params: { token: string } }) {
  const profile = await getSharedProfile(params.token)
  if (!profile) notFound()

  const pi = profile.profile_info || {}
  const name = pi.full_name || 'Professional'
  const owp = profile.ow_profile

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
        {/* Profile Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)', marginBottom: '0.25rem' }}>{name}</h1>
          {pi.ow_id && (
            <div className="text-xs font-mono" style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{displayOwId(pi.ow_id)}</div>
          )}
          {pi.job_title && (
            <div className="text-sm" style={{ color: 'var(--accent, #8b5cf6)', fontWeight: 500 }}>
              {pi.job_title}{pi.company ? ` at ${pi.company}` : ''}
            </div>
          )}
        </div>

        {/* Toggle + Views */}
        {owp && owp.summary.total_reports > 0 && (
          <Suspense fallback={null}>
            <ProfileViewToggle
              owProfile={profile.ow_profile}
              resume={profile.resume}
            />
          </Suspense>
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
