import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import ProfileCard from '@/components/profile/ProfileCard'
import ProfileViewToggle from '@/components/profile/ProfileViewToggle'
import PublicProfileCta from '@/components/profile/PublicProfileCta'
import PublicProfileEmptyState from '@/components/profile/PublicProfileEmptyState'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { APP_URL, BACKEND_URL } from '@/lib/config'
import { buildProfileMetadata, isUsableOwId } from '@/lib/profile-seo'
import { displayOwId } from '@/lib/skills'
import type { UnifiedProfileData, ProfileData, BadgeStatus } from '@/lib/types/profile'

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
    return { title: 'OW Profile Not Found | OnlyWorks', robots: { index: false, follow: true } }
  }
  const owp = profile.ow_profile
  const pi = profile.profile_info
  const owId = pi?.ow_id ? displayOwId(pi.ow_id) : 'OW Profile'
  const skillFallback =
    `Skill portfolio with ${owp?.summary?.total_skills || 0} skills across ${owp?.summary?.total_reports || 0} reports.`

  const meta = buildProfileMetadata({
    owId,
    isPublic: true,
    fullName: pi?.full_name || 'Professional',
    jobTitle: pi?.job_title,
    bio: pi?.bio?.trim() || skillFallback,
    appUrl: APP_URL,
    pathPrefix: '/ow',
    pathId: params.token,
  })

  return {
    title: meta.title,
    description: meta.description,
    robots: meta.robots,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'profile',
      url: meta.openGraphUrl,
    },
  }
}

export default async function SharedOWProfilePage({ params }: { params: { token: string } }) {
  const profile = await getSharedProfile(params.token)
  if (!profile) notFound()

  const pi = profile.profile_info || ({} as Partial<UnifiedProfileData['profile_info']>)
  const owp = profile.ow_profile

  // Build a ProfileData-shaped object so we can reuse the same ProfileCard
  // rendered on /p/[owId] — keeps the two pages visually identical.
  const resolvedOwId = pi.ow_id ? displayOwId(pi.ow_id).replace(/^OW-/, 'OW-') : 'OW-?????'
  const profileData: ProfileData = {
    ow_id: resolvedOwId,
    full_name: pi.full_name,
    job_title: pi.job_title,
    company: pi.company,
    avatar_url: pi.avatar_url,
    bio: pi.bio,
    member_since: pi.member_since,
    is_profile_public: true,
    badge: 'none',
  }

  const badgeStatus: BadgeStatus =
    owp && owp.summary && owp.summary.total_reports > 0 ? 'verified' : 'none'

  const hasProfileData = owp && owp.summary && owp.summary.total_reports > 0
  const displayName = pi.full_name || 'this candidate'
  const shareUrl = `${APP_URL}/ow/${params.token}`
  const canExpressInterest = isUsableOwId(resolvedOwId)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="profile-page">
        <ProfileCard
          profile={profileData}
          badgeStatus={badgeStatus}
          shareUrl={shareUrl}
          showExpressInterest={canExpressInterest}
        />

        {hasProfileData ? (
          <Suspense fallback={null}>
            <ProfileViewToggle owProfile={profile.ow_profile} resume={profile.resume} />
          </Suspense>
        ) : (
          <PublicProfileEmptyState />
        )}

        <PublicProfileCta displayName={displayName} />

        <div className="pp-footer-meta">
          <span>{profileData.ow_id} · verified by OnlyWorks</span>
          <span>Captured via OnlyWorks Desktop</span>
        </div>

        <div className="text-center py-8">
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
