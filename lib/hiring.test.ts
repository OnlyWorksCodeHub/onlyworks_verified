import { describe, expect, it } from 'vitest'
import { formatPlanLabel, isPaidHiringPlan } from './hiring'

describe('isPaidHiringPlan', () => {
  it('allows active and trialing plans to publish', () => {
    expect(isPaidHiringPlan('active')).toBe(true)
    expect(isPaidHiringPlan('trialing')).toBe(true)
  })

  it('blocks free / canceled / missing plans', () => {
    expect(isPaidHiringPlan(null)).toBe(false)
    expect(isPaidHiringPlan(undefined)).toBe(false)
    expect(isPaidHiringPlan('')).toBe(false)
    expect(isPaidHiringPlan('inactive')).toBe(false)
    expect(isPaidHiringPlan('canceled')).toBe(false)
    expect(isPaidHiringPlan('past_due')).toBe(false)
  })
})

describe('formatPlanLabel', () => {
  it('renders human labels for known statuses', () => {
    expect(formatPlanLabel('active')).toBe('Pro · Active')
    expect(formatPlanLabel('trialing')).toBe('Pro · Trial')
    expect(formatPlanLabel(null)).toBe('Free · Upgrade to publish')
  })
})
