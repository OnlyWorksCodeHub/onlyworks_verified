import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import ProfileCard from '@/components/profile/ProfileCard'
import SparseCommunityProfile from '@/components/profile/SparseCommunityProfile'
import PublicReportsList from '@/components/profile/PublicReportsList'
import ProfileViewToggle from '@/components/profile/ProfileViewToggle'
import VerificationPill from '@/components/ui/VerificationPill'
import { Navigation } from '@/components/Navigation'
import { Lock } from 'lucide-react'
import { BACKEND_URL } from '@/lib/config'
import type { BadgeStatus, ProfileData, ReportData, UnifiedProfileData } from '@/lib/types/profile'

async function getProfile(owId: string): Promise<ProfileData | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/profiles/${owId}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.success ? data.data : null
  } catch (err) {
    console.error(`[ProfilePage] Failed to fetch profile for ${owId}:`, err)
    return null
  }
}

async function getUnifiedProfile(owId: string): Promise<UnifiedProfileData | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/profiles/${owId}/ow-profile`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.success ? data.data : null
  } catch (err) {
    console.error(`[ProfilePage] Failed to fetch unified profile for ${owId}:`, err)
    return null
  }
}

async function getReports(owId: string): Promise<ReportData[] | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/profiles/${owId}/reports`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.success ? data.data : null
  } catch (err) {
    console.error(`[ProfilePage] Failed to fetch reports for ${owId}:`, err)
    return null
  }
}

const pageShell = { minHeight: '100vh', background: 'var(--bg)' }

export async function generateMetadata({ params }: { params: { owId: string } }): Promise<Metadata> {
  const profile = await getProfile(params.owId)
  if (!profile) return { title: 'Profile Not Found | OnlyWorks' }

  const name = profile.full_name || profile.name || 'Professional'
  const description = profile.talent_community_member
    ? `${name} on the OnlyWorks Talent Community`
    : `Verified ${profile.job_title || 'professional'} profile on OnlyWorks`

  return {
    title: `${name} | ${profile.ow_id} | OnlyWorks`,
    description,
    openGraph: { title: `${name} | ${profile.ow_id} | OnlyWorks`, description, type: 'profile' },
  }
}

export default async function ProfilePage({ params }: { params: { owId: string } }) {
  const profile = await getProfile(params.owId)
  if (!profile) notFound()

  if (!profile.is_profile_public) {
    return (
      <div style={pageShell}>
        <Navigation />
        <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 65px)', padding: '2rem 1rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-alt)', marginBottom: '1.5rem' }}>
              <Lock style={{ width: 28, height: 28, color: 'var(--text-muted)' }} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem' }}>This profile is private</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>The owner of this profile has chosen to keep it private.</p>
            <Link href="/" className="btn btn-primary">Go to Homepage</Link>
          </div>
        </main>
      </div>
    )
  }

  const unifiedProfile = await getUnifiedProfile(params.owId)
  const hasVerifiedWork = (unifiedProfile?.ow_profile?.summary?.total_reports ?? 0) > 0
  const isCommunity = profile.talent_community_member === true
  const isCommunityOnly = isCommunity && !hasVerifiedWork
  const reports = isCommunityOnly ? null : await getReports(params.owId)
  const badgeStatus: BadgeStatus = profile.badge || (profile as any).verification_status || 'none'

  return (
    <div style={pageShell}>
      <Navigation />
      <main className="profile-page">
        {isCommunityOnly ? (
          <SparseCommunityProfile profile={profile} />
        ) : (
          <>
            {isCommunity && hasVerifiedWork && (
              <div style={{ marginBottom: '1rem' }}>
                <VerificationPill status="community" />
              </div>
            )}
            <ProfileCard profile={profile} badgeStatus={badgeStatus} />
            {hasVerifiedWork && unifiedProfile && (
              <Suspense fallback={null}>
                <ProfileViewToggle owProfile={unifiedProfile.ow_profile} resume={unifiedProfile.resume} />
              </Suspense>
            )}
            {reports && reports.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <PublicReportsList reports={reports} />
              </div>
            )}
          </>
        )}
        <div style={{ textAlign: 'center', padding: '2rem 0 1rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Profile powered by OnlyWorks</p>
          <Link href="/downloads" className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>Get OnlyWorks</Link>
        </div>
      </main>
    </div>
  )
}
