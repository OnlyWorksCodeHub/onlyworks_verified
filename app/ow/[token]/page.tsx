import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import ProfileCard from '@/components/profile/ProfileCard'
import ProfileViewToggle from '@/components/profile/ProfileViewToggle'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { BACKEND_URL } from '@/lib/config'
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

  const pi = profile.profile_info || ({} as Partial<UnifiedProfileData['profile_info']>)
  const owp = profile.ow_profile

  // Build a ProfileData-shaped object so we can reuse the same ProfileCard
  // rendered on /p/[owId] — keeps the two pages visually identical.
  const profileData: ProfileData = {
    ow_id: pi.ow_id ? displayOwId(pi.ow_id).replace(/^OW-/, 'OW-') : 'OW-?????',
    full_name: pi.full_name,
    job_title: pi.job_title,
    company: pi.company,
    avatar_url: pi.avatar_url,
    bio: pi.bio,
    member_since: pi.member_since,
    is_profile_public: true,
    badge: 'none',
  }

  // Infer badge: if there's any verified work in the OW profile, it's verified.
  const badgeStatus: BadgeStatus =
    owp && owp.summary && owp.summary.total_reports > 0 ? 'verified' : 'none'

  const hasProfileData = owp && owp.summary && owp.summary.total_reports > 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="profile-page">
        <ProfileCard profile={profileData} badgeStatus={badgeStatus} />

        {hasProfileData && (
          <Suspense fallback={null}>
            <ProfileViewToggle owProfile={profile.ow_profile} resume={profile.resume} />
          </Suspense>
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
