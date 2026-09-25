/**
 * SEO / privacy helpers for public profile pages (Week 7–8 demo surface).
 */

export type ProfileSeoInput = {
  owId: string
  isPublic: boolean
  fullName?: string | null
  name?: string | null
  jobTitle?: string | null
  bio?: string | null
  appUrl: string
  pathPrefix: '/p' | '/ow'
  pathId: string
}

export function buildProfileRobots(isPublic: boolean): { index: boolean; follow: boolean } {
  if (!isPublic) return { index: false, follow: false }
  return { index: true, follow: true }
}

export function buildProfileMetadata(input: ProfileSeoInput): {
  title: string
  description: string
  robots: { index: boolean; follow: boolean }
  openGraphUrl: string
} {
  if (!input.isPublic) {
    return {
      title: 'Private profile | OnlyWorks',
      description: 'This OnlyWorks profile is private.',
      robots: buildProfileRobots(false),
      openGraphUrl: `${input.appUrl}${input.pathPrefix}/${input.pathId}`,
    }
  }

  const displayName = input.fullName || input.name || input.owId
  const role = input.jobTitle || 'professional'
  const description =
    input.bio?.trim() ||
    `Verified ${role} profile on OnlyWorks — skills proven by real work sessions.`

  return {
    title: `${displayName} | ${input.owId} | OnlyWorks`,
    description,
    robots: buildProfileRobots(true),
    openGraphUrl: `${input.appUrl}${input.pathPrefix}/${input.pathId}`,
  }
}

export function isUsableOwId(owId: string | null | undefined): boolean {
  if (!owId) return false
  const normalized = owId.trim()
  if (!normalized) return false
  if (normalized.includes('?')) return false
  return /^OW-/i.test(normalized)
}
