/**
 * Pure helpers for the Week 7–8 job-post wizard.
 * Kept free of React so unit tests can cover the publish funnel without mounting UI.
 */

export type JobPostStep = 1 | 2 | 3 | 4

export type JobFormState = {
  title: string
  description: string
  required_skills: string[]
  nice_to_have_skills: string[]
  experience_level: string
  field_of_work: string
}

export function parseSkillInput(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function mergeSkills(existing: string[], incoming: string[]): string[] {
  return Array.from(new Set([...existing, ...incoming]))
}

export function canAdvanceJobStep(step: JobPostStep, form: Pick<JobFormState, 'title'>): boolean {
  if (step === 1) return form.title.trim().length > 0
  return true
}

export function canSubmitJobPost(form: Pick<JobFormState, 'title'>): boolean {
  return form.title.trim().length > 0
}

export function buildCreateJobPayload(form: JobFormState) {
  return {
    title: form.title.trim(),
    description: form.description.trim() || undefined,
    required_skills: form.required_skills,
    nice_to_have_skills: form.nice_to_have_skills,
    experience_level: form.experience_level || undefined,
    field_of_work: form.field_of_work || undefined,
  }
}

export type HiringAccessResult =
  | { kind: 'ok' }
  | { kind: 'forbidden'; message: string }
  | { kind: 'not_registered'; message: string }
  | { kind: 'error'; message: string }

export function interpretHiringJobsAccess(status: number, message?: string): HiringAccessResult {
  if (status === 200 || status === 201) return { kind: 'ok' }
  if (status === 403) {
    return {
      kind: 'forbidden',
      message: message || 'Active subscription required to publish job posts.',
    }
  }
  if (status === 404) {
    return {
      kind: 'not_registered',
      message: message || 'Register as a hiring manager before posting jobs.',
    }
  }
  return { kind: 'error', message: message || 'Could not verify hiring access' }
}

export function resolveJobCreateFollowUp(asDraft: boolean, jobId?: string | null): {
  toast: 'draft' | 'published' | 'draft_partial'
  href: string
} {
  if (asDraft) {
    if (jobId) return { toast: 'draft', href: `/hiring/jobs/${jobId}` }
    return { toast: 'draft_partial', href: '/hiring/jobs' }
  }
  return {
    toast: 'published',
    href: jobId ? `/hiring/jobs/${jobId}` : '/hiring/jobs',
  }
}
