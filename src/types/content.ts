/**
 * Content model for the portfolio. Pages render from these types only, so
 * adding a project or job means editing data files, never components.
 *
 * `needsInput` lists facts awaiting Gowtham's confirmation. It renders a
 * visible badge in development and is never shown in production builds.
 */

export type ProjectCategory = 'professional' | 'freelance' | 'personal' | 'experiment'
export type ProjectStatus = 'in-development' | 'shipped' | 'maintained' | 'archived' | 'placeholder'
export type ModuleStatus = 'done' | 'testing' | 'partly-done' | 'planned'
export type Contribution = 'solo' | 'owner' | 'lead' | 'co-owned' | 'team-member'
export type Visibility = 'public' | 'restricted'

export interface MediaItem {
  kind: 'image' | 'video' | 'diagram'
  /** Omit until a real, approved file exists; a labelled placeholder renders instead. */
  src?: string
  alt: string
  device?: 'desktop' | 'mobile'
  width?: number
  height?: number
  caption?: string
  /** WebVTT captions file. Required for every video (WCAG 1.2.2); a data test enforces it. */
  captions?: string
  approvedForPublic: boolean
}

export interface ProjectModule {
  name: string
  status: ModuleStatus
  summary: string
}

export interface Project {
  id: string
  slug: string
  title: string
  subtitle?: string
  summary: string
  description?: string
  category: ProjectCategory
  status: ProjectStatus
  featured?: boolean
  featuredOrder?: number
  technologies: string[]
  organization?: string
  role?: string
  contribution?: Contribution
  /** What Gowtham personally did. */
  responsibilities?: string[]
  /** What the wider team did, so individual and team work stay distinct. */
  teamContext?: string
  features?: { built: string[]; planned?: string[] }
  /** For larger systems: module-by-module status. */
  modules?: ProjectModule[]
  problem?: string
  challenges?: { problem: string; solution: string }[]
  decisions?: string[]
  architecture?: { summary: string; diagram?: MediaItem }
  lessons?: string[]
  media?: MediaItem[]
  /** True when the project will never show screenshots: tiles render text-only, no placeholder. */
  noMedia?: boolean
  demoUrl?: string
  githubUrl?: string
  visibility: Visibility
  startDate?: string
  endDate?: string
  needsInput?: string[]
}

export interface ExperienceEntry {
  id: string
  chapter: number
  kind: 'job' | 'education' | 'independent' | 'learning'
  /** 'origin' = the road before the first developer role (shown on the Career Arc, not on the Recruiter snapshot). */
  track?: 'developer' | 'origin'
  organization: string
  role: string
  location?: string
  workMode?: 'remote' | 'onsite' | 'hybrid'
  /** YYYY-MM. Omit when the exact month is not confirmed; `period` is shown instead. */
  startDate?: string
  /** Undefined = present (when startDate is set). */
  endDate?: string
  /** Shown when exact dates are not confirmed, e.g. "About 1 year". */
  period?: string
  /** A short personal line, shown as a handwritten margin note. */
  note?: string
  summary?: string
  responsibilities: string[]
  technologies: string[]
  projectSlugs?: string[]
  /** Episodes without their own project page: plain labels, or external links (opened in a new tab). */
  episodes?: (string | { label: string; href: string })[]
  /** Only confirmed achievements. No invented metrics. */
  achievements?: string[]
  needsInput?: string[]
}

export interface SkillCategory {
  id: 'frontend' | 'backend' | 'ai' | 'databases' | 'devops' | 'testing' | 'tools'
  title: string
  kicker: string
  skills: { name: string; note: string }[]
}

export interface SocialLink {
  id: 'email' | 'phone' | 'linkedin' | 'github' | 'instagram'
  label: string
  href: string
  handle: string
  /** Where the link may appear. Recruiter page stays strictly professional. */
  showOnRecruiter: boolean
}

export interface Profile {
  name: string
  shortName: string
  role: string
  headline: string
  intro: string
  experienceYears: number
  experienceSince: string
  expertise: string[]
  availability: string
  /** The skill arc in progress, framed honestly as "next", not as mastered. */
  nextArc: { label: string; title: string; text: string }
  location?: string
  employmentPreferences?: string
  email: string
  phone: string
  links: SocialLink[]
  resume: { href: string; fileName: string; available: boolean }
  needsInput?: string[]
}

export interface Quote {
  id: string
  text: string
  author: string
  source?: string
  category: 'engineering' | 'craft' | 'mindset' | 'original'
  original?: boolean
}
