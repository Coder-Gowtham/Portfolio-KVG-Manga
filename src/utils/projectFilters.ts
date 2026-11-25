import type { Project, ProjectCategory } from '../types/content'

export type TileSize = 'wide' | 'tall' | 'regular'

/** URL-safe slug for a technology name: "Node.js" → "node-js". */
export const techSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const CATEGORY_ORDER: ProjectCategory[] = ['professional', 'freelance', 'personal', 'experiment']

export interface ProjectFilter {
  category: ProjectCategory | null
  /** Tech slugs. A project must use every selected technology. */
  tech: string[]
}

export function parseFilter(params: URLSearchParams): ProjectFilter {
  const cat = params.get('cat')
  const category = CATEGORY_ORDER.includes(cat as ProjectCategory) ? (cat as ProjectCategory) : null
  const tech = (params.get('tech') ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
  return { category, tech: [...new Set(tech)] }
}

export function toParams(f: ProjectFilter): URLSearchParams {
  const p = new URLSearchParams()
  if (f.category) p.set('cat', f.category)
  if (f.tech.length) p.set('tech', f.tech.join(','))
  return p
}

export function applyFilter(list: Project[], f: ProjectFilter): Project[] {
  return list.filter((p) => {
    if (f.category && p.category !== f.category) return false
    if (f.tech.length) {
      const have = new Set(p.technologies.map(techSlug))
      if (!f.tech.every((t) => have.has(t))) return false
    }
    return true
  })
}

/** Technologies used across projects, most common first, as { slug, label, count }. */
export function techOptions(list: Project[]) {
  const map = new Map<string, { slug: string; label: string; count: number }>()
  for (const p of list) {
    for (const t of p.technologies) {
      const slug = techSlug(t)
      const entry = map.get(slug) ?? { slug, label: t, count: 0 }
      entry.count += 1
      map.set(slug, entry)
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

export function categoryCounts(list: Project[]) {
  const counts = new Map<ProjectCategory, number>()
  for (const p of list) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
  return counts
}

/**
 * Panel sizes for a manga page: one wide splash panel, then rows that
 * alternate 2-up and 3-up. Always fills complete rows, so no gaps.
 */
export function pageLayout(count: number): TileSize[] {
  if (count === 0) return []
  const sizes: TileSize[] = ['wide']
  let rest = count - 1
  let row = 0
  while (rest > 0) {
    const take = Math.min(row % 2 === 0 ? 2 : 3, rest)
    const size: TileSize = take === 1 ? 'wide' : take === 2 ? 'regular' : 'tall'
    for (let i = 0; i < take; i++) sizes.push(size)
    rest -= take
    row++
  }
  return sizes
}


/** Up to three related series: shared technologies first, then same category. */
export function relatedProjects(project: Project, all: Project[], max = 3): Project[] {
  const mine = new Set(project.technologies.map(techSlug))
  return all
    .filter((p) => p.id !== project.id && p.status !== 'placeholder')
    .map((p) => ({
      p,
      score: p.technologies.filter((t) => mine.has(techSlug(t))).length * 2 + (p.category === project.category ? 1 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((x) => x.p)
}

