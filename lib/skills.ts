import type { OWProfileSkill } from '@/lib/types/profile'

// The AI pipeline emits category values beyond the old {technical, soft, domain}
// whitelist (e.g. software-development, machine-learning, devops). Render all
// categories — title-case unknowns so new ones don't silently drop from the UI.
export function formatCategoryLabel(category: string | null | undefined): string {
  if (!category) return 'Other'
  const key = String(category).toLowerCase().trim()
  const overrides: Record<string, string> = {
    technical: 'Technical',
    soft: 'Interpersonal',
    domain: 'Domain Knowledge',
    devops: 'DevOps',
  }
  if (overrides[key]) return overrides[key]
  return key
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export interface SkillGroup {
  key: string
  label: string
  skills: OWProfileSkill[]
}

export function groupSkillsByCategory(skills: OWProfileSkill[]): SkillGroup[] {
  const groups = new Map<string, OWProfileSkill[]>()
  for (const s of skills) {
    const key = (s.category || 'other').toLowerCase().trim()
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(s)
  }
  const priority = ['technical', 'soft', 'domain']
  return Array.from(groups.entries())
    .map(([key, catSkills]) => ({ key, label: formatCategoryLabel(key), skills: catSkills }))
    .sort((a, b) => {
      const ai = priority.indexOf(a.key)
      const bi = priority.indexOf(b.key)
      if (ai !== -1 && bi !== -1) return ai - bi
      if (ai !== -1) return -1
      if (bi !== -1) return 1
      return a.label.localeCompare(b.label)
    })
}

// Strip any "OW-" prefix so callers that prepend their own "OW-" don't double it.
export function displayOwId(owId: string | null | undefined): string {
  if (!owId) return ''
  const s = String(owId).trim()
  return s.startsWith('OW-') ? s : `OW-${s}`
}
