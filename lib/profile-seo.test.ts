import { describe, expect, it } from 'vitest'
import {
  buildProfileMetadata,
  buildProfileRobots,
  isUsableOwId,
} from './profile-seo'

describe('buildProfileRobots', () => {
  it('indexes public profiles and blocks private ones', () => {
    expect(buildProfileRobots(true)).toEqual({ index: true, follow: true })
    expect(buildProfileRobots(false)).toEqual({ index: false, follow: false })
  })
})

describe('buildProfileMetadata', () => {
  it('never leaks private profile details into SEO', () => {
    const meta = buildProfileMetadata({
      owId: 'OW-SECRET',
      isPublic: false,
      fullName: 'Hidden Person',
      bio: 'should not appear',
      appUrl: 'https://www.only-works.com',
      pathPrefix: '/p',
      pathId: 'OW-SECRET',
    })
    expect(meta.title).toBe('Private profile | OnlyWorks')
    expect(meta.description).not.toContain('Hidden Person')
    expect(meta.description).not.toContain('should not appear')
    expect(meta.robots.index).toBe(false)
  })

  it('builds shareable public metadata for demo surface', () => {
    const meta = buildProfileMetadata({
      owId: 'OW-A7B2K9',
      isPublic: true,
      fullName: 'Brodey Wang',
      jobTitle: 'Software Engineer',
      bio: 'CS junior building toward a frontend internship.',
      appUrl: 'https://www.only-works.com',
      pathPrefix: '/ow',
      pathId: 'share-token',
    })
    expect(meta.title).toContain('Brodey Wang')
    expect(meta.description).toContain('frontend internship')
    expect(meta.robots).toEqual({ index: true, follow: true })
    expect(meta.openGraphUrl).toBe('https://www.only-works.com/ow/share-token')
  })
})

describe('isUsableOwId', () => {
  it('rejects placeholder / empty ids before Express Interest', () => {
    expect(isUsableOwId('OW-?????')).toBe(false)
    expect(isUsableOwId('')).toBe(false)
    expect(isUsableOwId(null)).toBe(false)
    expect(isUsableOwId('OW-A7B2K9')).toBe(true)
  })
})
