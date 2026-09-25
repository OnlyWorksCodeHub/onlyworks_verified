import { describe, expect, it } from 'vitest'
import {
  buildCreateJobPayload,
  canAdvanceJobStep,
  canSubmitJobPost,
  interpretHiringJobsAccess,
  mergeSkills,
  parseSkillInput,
  resolveJobCreateFollowUp,
} from './job-post'

describe('parseSkillInput', () => {
  it('splits commas and trims blanks', () => {
    expect(parseSkillInput(' React, TypeScript , ,Next.js ')).toEqual([
      'React',
      'TypeScript',
      'Next.js',
    ])
  })

  it('returns empty for blank input', () => {
    expect(parseSkillInput('   ')).toEqual([])
    expect(parseSkillInput('')).toEqual([])
  })
})

describe('mergeSkills', () => {
  it('dedupes while preserving order', () => {
    expect(mergeSkills(['React'], ['React', 'TypeScript'])).toEqual(['React', 'TypeScript'])
  })
})

describe('job post step gates', () => {
  it('blocks step 1 continue without a title', () => {
    expect(canAdvanceJobStep(1, { title: '  ' })).toBe(false)
    expect(canAdvanceJobStep(1, { title: 'Frontend Engineer' })).toBe(true)
  })

  it('allows later steps even without skills', () => {
    expect(canAdvanceJobStep(2, { title: '' })).toBe(true)
    expect(canAdvanceJobStep(4, { title: '' })).toBe(true)
  })

  it('requires a title before submit/publish', () => {
    expect(canSubmitJobPost({ title: '' })).toBe(false)
    expect(canSubmitJobPost({ title: ' Intern ' })).toBe(true)
  })
})

describe('buildCreateJobPayload', () => {
  it('trims title/description and drops empty optional strings', () => {
    expect(
      buildCreateJobPayload({
        title: '  FE Intern  ',
        description: '  ship UI  ',
        required_skills: ['React'],
        nice_to_have_skills: [],
        experience_level: 'entry',
        field_of_work: 'software-development',
      })
    ).toEqual({
      title: 'FE Intern',
      description: 'ship UI',
      required_skills: ['React'],
      nice_to_have_skills: [],
      experience_level: 'entry',
      field_of_work: 'software-development',
    })
  })

  it('omits blank description', () => {
    const payload = buildCreateJobPayload({
      title: 'Role',
      description: '   ',
      required_skills: [],
      nice_to_have_skills: [],
      experience_level: '',
      field_of_work: '',
    })
    expect(payload.description).toBeUndefined()
    expect(payload.experience_level).toBeUndefined()
    expect(payload.field_of_work).toBeUndefined()
  })
})

describe('interpretHiringJobsAccess', () => {
  it('treats 200/201 as ok (paid funnel unlocked)', () => {
    expect(interpretHiringJobsAccess(200).kind).toBe('ok')
    expect(interpretHiringJobsAccess(201).kind).toBe('ok')
  })

  it('maps 403 to subscription gate', () => {
    const result = interpretHiringJobsAccess(403, 'Active subscription required for this feature')
    expect(result).toEqual({
      kind: 'forbidden',
      message: 'Active subscription required for this feature',
    })
  })

  it('maps 404 to not-registered gate', () => {
    expect(interpretHiringJobsAccess(404).kind).toBe('not_registered')
  })
})

describe('resolveJobCreateFollowUp', () => {
  it('routes published jobs to detail when id exists', () => {
    expect(resolveJobCreateFollowUp(false, 'job-1')).toEqual({
      toast: 'published',
      href: '/hiring/jobs/job-1',
    })
  })

  it('does not claim draft success without an id', () => {
    expect(resolveJobCreateFollowUp(true, null)).toEqual({
      toast: 'draft_partial',
      href: '/hiring/jobs',
    })
  })

  it('routes draft saves to the job detail', () => {
    expect(resolveJobCreateFollowUp(true, 'draft-9')).toEqual({
      toast: 'draft',
      href: '/hiring/jobs/draft-9',
    })
  })
})
