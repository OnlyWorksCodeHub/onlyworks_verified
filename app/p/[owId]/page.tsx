import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import ProfileCard from '@/components/profile/ProfileCard'
import PublicReportsList from '@/components/profile/PublicReportsList'
import ProfileViewToggle from '@/components/profile/ProfileViewToggle'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { Lock } from 'lucide-react'
import { BACKEND_URL } from '@/lib/config'
import type { ProfileData, ReportData, UnifiedProfileData } from '@/lib/types/profile'

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
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center px-6 pt-28 pb-20">
          <div className="text-center max-w-[400px]">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-foreground/10 mb-6">
              <Lock className="w-7 h-7 text-muted-foreground" />
            </div>
            <h1 className="font-display text-3xl lg:text-4xl tracking-tight text-foreground mb-3">
              This profile is private
            </h1>
            <p className="text-base text-muted-foreground mb-6">
              The owner of this profile has chosen to keep it private.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm rounded-full font-medium text-white transition-all hover:opacity-90"
              style={{ background: '#8b5cf6' }}
            >
              Go to Homepage
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const [unifiedProfile, reports] = await Promise.all([
    getUnifiedProfile(params.owId),
    getReports(params.owId),
  ])

  const badgeStatus = profile.badge || (profile as any).verification_status || 'none'
  const hasProfileData = unifiedProfile?.ow_profile && unifiedProfile.ow_profile.summary.total_reports > 0

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="profile-page">
        <ProfileCard profile={profile} badgeStatus={badgeStatus} />

        {/* Profile Toggle + Views */}
        {hasProfileData && unifiedProfile && (
          <Suspense fallback={null}>
            <ProfileViewToggle
              owProfile={unifiedProfile.ow_profile}
              resume={unifiedProfile.resume}
            />
          </Suspense>
        )}

        {/* Public Reports */}
        {reports && reports.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <PublicReportsList reports={reports} />
          </div>
        )}

        {/* Attribution */}
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground mb-4">
            Profile powered by OnlyWorks
          </p>
          <Link
            href="/downloads"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 text-sm rounded-full font-medium border border-foreground/20 hover:bg-foreground/5 transition-all"
          >
            Get OnlyWorks
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
