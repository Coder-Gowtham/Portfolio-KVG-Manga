import type { Contribution, ProjectCategory } from '../types/content'

export const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  professional: 'Professional work',
  freelance: 'Freelance / client work',
  personal: 'Personal project',
  experiment: 'Experiment',
}

export const CONTRIBUTION_LABEL: Record<Contribution, string> = {
  solo: 'Solo build',
  owner: 'Owned end-to-end',
  lead: 'Lead developer',
  'co-owned': 'Co-owned with the team',
  'team-member': 'Team contributor',
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2022-05" → "May 2022" */
export function formatMonth(ym: string): string {
  const [y, m] = ym.split('-')
  const month = MONTHS[Number(m) - 1]
  return month && y ? `${month} ${y}` : ym
}

export function formatRange(start: string, end?: string): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'Present'}`
}
