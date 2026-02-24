import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProfileCard from '@/components/profile/ProfileCard'
import ProfileStats from '@/components/profile/ProfileStats'
import AppBreakdown from '@/components/profile/AppBreakdown'
import StreakDisplay from '@/components/profile/StreakDisplay'
import PublicReportsList from '@/components/profile/PublicReportsList'
import UpgradePrompt from '@/components/profile/UpgradePrompt'
import { Lock } from 'lucide-react'
import { BACKEND_URL } from '@/lib/config'
import type { ProfileData, StatsData, ReportData } from '@/lib/types/profile'

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

async function getStats(owId: string): Promise<StatsData | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/profiles/${owId}/stats`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.success ? data.data : null
  } catch (err) {
    console.error(`[ProfilePage] Failed to fetch stats for ${owId}:`, err)
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

export async function generateMetadata({ params }: { params: { owId: string } }): Promise<Metadata> {
  const profile = await getProfile(params.owId)
  if (!profile) {
    return { title: 'Profile Not Found | OnlyWorks' }
  }
  return {
    title: `${profile.full_name || profile.name} | ${profile.ow_id} | OnlyWorks`,
    description: `Verified ${profile.job_title || 'professional'} profile on OnlyWorks`,
    openGraph: {
      title: `${profile.full_name || profile.name} | ${profile.ow_id} | OnlyWorks`,
      description: `Verified ${profile.job_title || 'professional'} profile on OnlyWorks`,
      type: 'profile',
    },
  }
}

export default async function ProfilePage({ params }: { params: { owId: string } }) {
  const profile = await getProfile(params.owId)
  if (!profile) notFound()

  // Private profile
  if (!profile.is_profile_public) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg)',
      }}>
        <header style={{ borderBottom: '1px solid var(--border)' }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/images/logo.png" alt="OnlyWorks" style={{ height: '32px', width: '32px', filter: 'grayscale(100%) brightness(0)' }} />
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>OnlyWorks</span>
            </Link>
          </div>
        </header>
        <main style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 65px)',
          padding: '2rem 1rem',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--bg-alt)',
              marginBottom: '1.5rem',
            }}>
              <Lock style={{ width: '28px', height: '28px', color: 'var(--text-muted)' }} />
            </div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: 'var(--text)',
              marginBottom: '0.75rem',
            }}>
              This profile is private
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: '1.5rem',
            }}>
              The owner of this profile has chosen to keep it private.
            </p>
            <Link href="/" className="btn btn-primary">
              Go to Homepage
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const [stats, reports] = await Promise.all([
    getStats(params.owId),
    getReports(params.owId),
  ])

  const badgeStatus = profile.badge || (profile as any).verification_status || 'none'
  const isVerified = badgeStatus === 'verified'
  const isPreviouslyVerified = badgeStatus === 'previously_verified'

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
    }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border)' }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/images/logo.png" alt="OnlyWorks" style={{ height: '32px', width: '32px', filter: 'grayscale(100%) brightness(0)' }} />
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>OnlyWorks</span>
          </Link>
          <div style={{
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
          }}>
            Verified Profile
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="profile-page">
        <ProfileCard profile={profile} badgeStatus={badgeStatus} />

        {/* Stats or Upgrade */}
        {isVerified && stats ? (
          <>
            <ProfileStats stats={stats} />

            {stats.current_streak != null && stats.longest_streak != null && (
              <div style={{ marginBottom: '1rem' }}>
                <StreakDisplay current={stats.current_streak} longest={stats.longest_streak} />
              </div>
            )}

            {stats.top_apps && stats.top_apps.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <AppBreakdown apps={stats.top_apps} limited={stats.limited} />
              </div>
            )}
          </>
        ) : (
          <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
            <UpgradePrompt previouslyVerified={isPreviouslyVerified} />
          </div>
        )}

        {/* Public Reports */}
        {reports && reports.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <PublicReportsList reports={reports} />
          </div>
        )}

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: '2rem 0 1rem',
        }}>
          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
            marginBottom: '1rem',
          }}>
            Profile powered by OnlyWorks
          </p>
          <Link href="/downloads" className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>
            Get OnlyWorks
          </Link>
        </div>
      </main>
    </div>
  )
}
