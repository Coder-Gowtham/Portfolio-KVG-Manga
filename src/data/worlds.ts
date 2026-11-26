/**
 * Project worlds: the illustrated scene each project opens on (until real
 * screenshots exist). Data only; the drawings live in components/worlds/scenes.tsx.
 */
export interface WorldInfo {
  name: string
  /** What the illustration shows, for screen readers. */
  alt: string
  accent: string
}

export const WORLDS: Record<string, WorldInfo> = {
  'times-black': {
    name: 'Nexus',
    alt: 'an orchestrator hub routing data signals between API gateway, validation, auth, partner APIs and notifications',
    accent: '#00e5ff',
  },
  clusterix: {
    name: 'Interface',
    alt: 'a violet-lit document editor workspace with a toolbar of modules, a plugin panel and a cells module',
    accent: '#7c5cfc',
  },
  'loglens-ai': {
    name: 'Intelligence',
    alt: 'an observability room with a live log stream, an AI analysis radar and a severity histogram',
    accent: '#ff2a6d',
  },
  'roshan-tiwari-consultants': {
    name: 'Presence',
    alt: 'a consultancy website shown on a desktop browser and, responsive, on a phone',
    accent: '#ff2a6d',
  },
  'vscc-erp': {
    name: 'Foundation',
    alt: 'a construction site crane beside an ERP dashboard with attendance, payroll, approvals and billing, plus a site-report phone app',
    accent: '#f5e500',
  },
}

export const hasWorld = (slug: string) => slug in WORLDS
