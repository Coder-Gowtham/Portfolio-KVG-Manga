import { describe, expect, it } from 'vitest'
import { projects } from '../data/projects'
import { applyFilter, pageLayout, parseFilter, relatedProjects, techOptions, techSlug, toParams } from './projectFilters'

describe('project filters', () => {
  it('slugifies technology names for URLs', () => {
    expect(techSlug('Node.js')).toBe('node-js')
    expect(techSlug('OpenAI API')).toBe('openai-api')
  })

  it('round-trips filters through the URL and ignores unknown categories', () => {
    const f = parseFilter(new URLSearchParams('cat=personal&tech=react,node-js,react'))
    expect(f).toEqual({ category: 'personal', tech: ['react', 'node-js'] })
    expect(toParams(f).toString()).toBe('cat=personal&tech=react%2Cnode-js')
    expect(parseFilter(new URLSearchParams('cat=hacker')).category).toBe(null)
  })

  it('filters by category', () => {
    const list = applyFilter(projects, { category: 'professional', tech: [] })
    expect(list.map((p) => p.slug)).toEqual(['times-black', 'yeida', 'clusterix'])
  })

  it('requires every selected technology (AND)', () => {
    const redis = applyFilter(projects, { category: null, tech: ['redis'] })
    expect(redis.map((p) => p.slug)).toEqual(['loglens-ai'])
    const none = applyFilter(projects, { category: 'professional', tech: ['redis'] })
    expect(none).toHaveLength(0)
  })

  it('offers each technology once, most used first', () => {
    const opts = techOptions(projects)
    expect(new Set(opts.map((o) => o.slug)).size).toBe(opts.length)
    expect(opts[0]!.count).toBeGreaterThan(1)
  })
})

describe('manga page layout', () => {
  it('always fills complete rows, so no gaps appear', () => {
    const width = { wide: 6, regular: 3, tall: 2 } as const
    for (let n = 0; n <= 12; n++) {
      const sizes = pageLayout(n)
      expect(sizes).toHaveLength(n)
      const total = sizes.reduce((sum, s) => sum + width[s], 0)
      expect(total % 6).toBe(0)
    }
  })

  it('opens with a wide splash panel', () => {
    expect(pageLayout(6)).toEqual(['wide', 'regular', 'regular', 'tall', 'tall', 'tall'])
  })
})

describe('related projects', () => {
  it('never includes the project itself or placeholders', () => {
    for (const p of projects) {
      const rel = relatedProjects(p, projects)
      expect(rel.some((r) => r.id === p.id)).toBe(false)
      expect(rel.some((r) => r.status === 'placeholder')).toBe(false)
      expect(rel.length).toBeLessThanOrEqual(3)
    }
  })

  it('ranks shared technology highest', () => {
    const times = projects.find((p) => p.slug === 'times-black')!
    expect(relatedProjects(times, projects)[0]!.slug).toBe('yeida')
  })
})
