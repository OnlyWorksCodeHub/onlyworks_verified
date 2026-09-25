/**
 * Week 8 demo-flow coverage.
 * These tests simulate the Group A funnel end-to-end at the decision layer
 * (gates, SEO privacy, publish/draft routing) without requiring a live backend.
 */
import { describe, expect, it } from 'vitest'
import { formatPlanLabel, isPaidHiringPlan } from './hiring'
import {
  buildCreateJobPayload,
  canAdvanceJobStep,
  canSubmitJobPost,
  interpretHiringJobsAccess,
  mergeSkills,
  parseSkillInput,
  resolveJobCreateFollowUp,
  type JobFormState,
} from './job-post'
import { buildProfileMetadata, isUsableOwId } from './profile-seo'

function walkWizard(form: JobFormState) {
  const visited: number[] = []
  for (let step = 1 as 1 | 2 | 3 | 4; step <= 4; step = (step + 1) as 1 | 2 | 3 | 4) {
    if (!canAdvanceJobStep(step, form) && step < 4) {
      return { ok: false as const, blockedAt: step, visited }
    }
    visited.push(step)
    if (step === 4) break
  }
  return { ok: true as const, visited, canPublish: canSubmitJobPost(form) }
}

describe('Flow A — Public profile share + SEO privacy', () => {
  it('indexes public profiles and blocks private ones without leaking bio', () => {
    const publicMeta = buildProfileMetadata({
      owId: 'OW-A7B2K9',
      isPublic: true,
      fullName: 'Brodey Wang',
      jobTitle: 'Frontend Intern',
      bio: 'Building verified work proof.',
      appUrl: 'https://www.only-works.com',
      pathPrefix: '/p',
      pathId: 'OW-A7B2K9',
    })
    expect(publicMeta.robots.index).toBe(true)
    expect(publicMeta.openGraphUrl).toContain('/p/OW-A7B2K9')

    const privateMeta = buildProfileMetadata({
      owId: 'OW-SECRET',
      isPublic: false,
      fullName: 'Hidden',
      bio: 'secret-bio-leak',
      appUrl: 'https://www.only-works.com',
      pathPrefix: '/p',
      pathId: 'OW-SECRET',
    })
    expect(privateMeta.robots).toEqual({ index: false, follow: false })
    expect(privateMeta.description).not.toContain('secret-bio-leak')
    expect(privateMeta.description).not.toContain('Hidden')
  })

  it('rejects placeholder OW ids before Express Interest', () => {
    expect(isUsableOwId('OW-?????')).toBe(false)
    expect(isUsableOwId('OW-A7B2K9')).toBe(true)
  })
})

describe('Flow B — Hiring manager paid gate → job wizard → publish/draft', () => {
  it('blocks free plans and unlocks active/trialing', () => {
    expect(isPaidHiringPlan('inactive')).toBe(false)
    expect(formatPlanLabel('inactive')).toMatch(/Free/i)
    expect(isPaidHiringPlan('active')).toBe(true)
    expect(interpretHiringJobsAccess(403).kind).toBe('forbidden')
    expect(interpretHiringJobsAccess(200).kind).toBe('ok')
  })

  it('walks the 4-step wizard and builds a publish payload', () => {
    let form: JobFormState = {
      title: '',
      description: '',
      required_skills: [],
      nice_to_have_skills: [],
      experience_level: 'junior',
      field_of_work: 'software-development',
    }

    expect(walkWizard(form).ok).toBe(false)

    form = { ...form, title: 'Frontend Intern' }
    form = {
      ...form,
      required_skills: mergeSkills(form.required_skills, parseSkillInput('React, TypeScript')),
      nice_to_have_skills: mergeSkills([], parseSkillInput('Next.js')),
      description: 'Ship public profile polish.',
    }

    const walk = walkWizard(form)
    expect(walk.ok).toBe(true)
    if (!walk.ok) return
    expect(walk.visited).toEqual([1, 2, 3, 4])
    expect(walk.canPublish).toBe(true)

    const payload = buildCreateJobPayload(form)
    expect(payload.title).toBe('Frontend Intern')
    expect(payload.required_skills).toEqual(['React', 'TypeScript'])
    expect(payload.nice_to_have_skills).toEqual(['Next.js'])
  })

  it('routes draft vs publish follow-ups without false success toasts', () => {
    expect(resolveJobCreateFollowUp(false, 'job-42')).toEqual({
      toast: 'published',
      href: '/hiring/jobs/job-42',
    })
    expect(resolveJobCreateFollowUp(true, null).toast).toBe('draft_partial')
    expect(resolveJobCreateFollowUp(true, 'draft-7').href).toBe('/hiring/jobs/draft-7')
  })
})

describe('Flow C — Express Interest prerequisites', () => {
  it('requires usable OW id + paid plan before outreach is meaningful', () => {
    const candidateOk = isUsableOwId('OW-A7B2K9')
    const hmPaid = isPaidHiringPlan('trialing')
    const jobsAccess = interpretHiringJobsAccess(200)
    expect(candidateOk && hmPaid && jobsAccess.kind === 'ok').toBe(true)

    const blocked =
      !isUsableOwId('OW-?????') ||
      !isPaidHiringPlan('canceled') ||
      interpretHiringJobsAccess(403).kind === 'forbidden'
    expect(blocked).toBe(true)
  })
})
