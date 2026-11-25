import { describe, expect, it } from 'vitest'
import { projects } from './projects'
import { experience } from './experience'
import { profile } from './profile'
import { skills } from './skills'
import { metaFor, prerenderPaths } from '../app/routes'

/** Every user-facing string in a project, for content-rule checks. */
const projectText = (p: (typeof projects)[number]) =>
  [
    p.title,
    p.subtitle,
    p.summary,
    p.description,
    p.problem,
    ...(p.responsibilities ?? []),
    ...(p.features?.built ?? []),
    ...(p.features?.planned ?? []),
    ...(p.modules ?? []).map((m) => m.summary),
    ...(p.challenges ?? []).flatMap((c) => [c.problem, c.solution]),
    ...(p.decisions ?? []),
  ]
    .filter(Boolean)
    .join(' ')

describe('project data', () => {
  it('has unique ids and URL-safe unique slugs', () => {
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length)
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length)
    for (const p of projects) expect(p.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  })

  it('shows no résumé impact metrics (content rule)', () => {
    for (const p of projects) expect(projectText(p), p.slug).not.toMatch(/\d+\s?%/)
    for (const e of experience) expect([e.summary, ...e.responsibilities].join(' '), e.id).not.toMatch(/\d+\s?%/)
  })

  it('excludes the résumé dashboards Gowtham asked to leave out', () => {
    const titles = projects.map((p) => p.title.toLowerCase()).join(' ')
    expect(titles).not.toMatch(/savings account|loan workflow and status dashboard/)
  })

  it('only links real https demo/GitHub URLs', () => {
    for (const p of projects) {
      for (const url of [p.demoUrl, p.githubUrl].filter(Boolean)) expect(url).toMatch(/^https:\/\//)
    }
  })

  it('never shows unapproved media as a real file', () => {
    for (const p of projects) for (const m of p.media ?? []) if (!m.approvedForPublic) expect(m.src, p.slug).toBeUndefined()
  })

  it('requires alt text on every media item', () => {
    for (const p of projects) for (const m of p.media ?? []) expect(m.alt.trim().length).toBeGreaterThan(0)
  })

  it('marks VSCC ERP as in development with planned work kept separate', () => {
    const vscc = projects.find((p) => p.slug === 'vscc-erp')
    expect(vscc?.status).toBe('in-development')
    expect(vscc?.modules?.some((m) => m.status === 'planned')).toBe(true)
  })

  it('keeps Vector Mind as a placeholder until details are provided', () => {
    const vm = projects.find((p) => p.slug === 'vector-mind')
    expect(vm?.status).toBe('placeholder')
    expect(vm?.features).toBeUndefined()
    expect(vm?.githubUrl).toBeUndefined()
  })
})

describe('profile, experience, skills', () => {
  it('keeps Instagram off the recruiter page', () => {
    expect(profile.links.find((l) => l.id === 'instagram')?.showOnRecruiter).toBe(false)
  })

  it('uses https for every external profile link', () => {
    for (const l of profile.links.filter((l) => !['email', 'phone'].includes(l.id))) expect(l.href).toMatch(/^https:\/\//)
  })

  it('orders experience newest first with valid dates', () => {
    const starts = experience.map((e) => e.startDate)
    expect([...starts].sort().reverse()).toEqual(starts)
    for (const e of experience) {
      expect(e.startDate).toMatch(/^\d{4}-\d{2}$/)
      if (e.endDate) expect(e.endDate >= e.startDate).toBe(true)
    }
  })

  it('links experience only to existing projects', () => {
    const slugs = new Set(projects.map((p) => p.slug))
    for (const e of experience) for (const s of e.projectSlugs ?? []) expect(slugs.has(s), s).toBe(true)
  })

  it('describes every skill instead of rating it', () => {
    for (const c of skills) for (const k of c.skills) expect(k.note.length).toBeGreaterThan(5)
  })
})

describe('route metadata', () => {
  it('prerenders every page and project', () => {
    const paths = prerenderPaths()
    for (const p of ['/', '/projects', '/experience', '/recruiter', '/contact', '/playground']) expect(paths).toContain(p)
    for (const p of projects) expect(paths).toContain(`/projects/${p.slug}`)
  })

  it('gives each route a unique title', () => {
    const titles = prerenderPaths().map((p) => metaFor(p).title)
    expect(new Set(titles).size).toBe(titles.length)
  })

  it('hides placeholders and the secret page from search engines', () => {
    expect(metaFor('/playground/secret').noindex).toBe(true)
    expect(metaFor('/projects/vector-mind').noindex).toBe(true)
    expect(metaFor('/projects/does-not-exist').noindex).toBe(true)
  })
})
