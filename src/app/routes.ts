/**
 * Route metadata shared by the app (<Seo>) and the build plugin (per-route
 * HTML, sitemap). Must stay free of JSX/CSS so vite.config.ts can import it.
 */
import { projects } from '../data/projects'
import { profile } from '../data/profile'

export interface RouteMeta {
  title: string
  description: string
  noindex?: boolean
}

const SITE = `${profile.name} — ${profile.role}`

export const staticMeta: Record<string, RouteMeta> = {
  '/': {
    title: SITE,
    description: `${profile.name} is a full stack developer with about ${profile.experienceYears} years across React, JavaScript and Node.js, now training as an AI integrator.`,
  },
  '/projects': {
    title: `Works — ${profile.name}`,
    description: 'Professional, client and personal projects: fintech backends, an ERP, AI log analysis and editor customisation.',
  },
  '/experience': {
    title: `Career Arc — ${profile.name}`,
    description: 'Professional timeline: Niveus Solutions, Innoscripta SE, and independent work.',
  },
  '/recruiter': {
    title: `Hire brief — ${profile.name}`,
    description: `Quick profile, skills, experience snapshot, résumé and contact details for ${profile.name}.`,
  },
  '/contact': {
    title: `Contact — ${profile.name}`,
    description: `Email, LinkedIn, GitHub and a contact form for ${profile.name}.`,
  },
  '/playground': {
    title: `Showdown — ${profile.name}`,
    description: 'Step into the arena: reflex, memory and typing mini-games, a cyber-oracle, quotes and a hidden chapter.',
  },
  '/playground/secret': {
    title: `Hidden chapter — ${profile.name}`,
    description: 'You found it.',
    noindex: true,
  },
}

export function metaFor(path: string): RouteMeta {
  const fixed = staticMeta[path]
  if (fixed) return fixed
  const match = /^\/projects\/([^/]+)$/.exec(path)
  const project = match ? projects.find((p) => p.slug === match[1]) : undefined
  if (project) {
    return {
      title: `${project.title} — ${profile.name}`,
      description: project.summary,
      noindex: project.status === 'placeholder',
    }
  }
  return { title: `Page not found — ${profile.name}`, description: 'This page got refactored out of existence.', noindex: true }
}

/** Every path that gets its own HTML document at build time. */
export function prerenderPaths(): string[] {
  return [...Object.keys(staticMeta), ...projects.map((p) => `/projects/${p.slug}`)]
}
