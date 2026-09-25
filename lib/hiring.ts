/** Shared hiring-manager helpers for Week 7 dashboard / job posts. */

export type HiringPlanStatus =
  | 'active'
  | 'trialing'
  | 'canceled'
  | 'past_due'
  | 'inactive'
  | string
  | null
  | undefined

export function formatPlanLabel(status: HiringPlanStatus): string {
  switch (status) {
    case 'active':
      return 'Pro · Active'
    case 'trialing':
      return 'Pro · Trial'
    case 'past_due':
      return 'Pro · Past due'
    case 'canceled':
      return 'Canceled'
    case 'inactive':
    case null:
    case undefined:
    case '':
      return 'Free · Upgrade to publish'
    default:
      return String(status)
  }
}

export function isPaidHiringPlan(status: HiringPlanStatus): boolean {
  return status === 'active' || status === 'trialing'
}
