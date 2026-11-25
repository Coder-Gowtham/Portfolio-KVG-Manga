import {
  siChai,
  siClaude,
  siCss,
  siDocker,
  siExpress,
  siGit,
  siGooglecloud,
  siHtml5,
  siJavascript,
  siJenkins,
  siJsonwebtokens,
  siLinux,
  siMocha,
  siMysql,
  siNodedotjs,
  siPostgresql,
  siReact,
  siRedis,
  siSwagger,
  siTypescript,
  siUbuntu,
} from 'simple-icons'

/**
 * The home "Abilities" board: the stack as logos, grouped like data/skills.ts
 * (which keeps the described version for the Recruiter page).
 *
 * Logos come from Simple Icons (CC0, official brand marks). Tools that Simple
 * Icons does not carry (AWS, OpenAI, Codex, BullMQ, Apigee, Sinon) get a plain text
 * badge instead of an imitation logo.
 */
export interface BrandIcon {
  title: string
  hex: string
  path: string
}

export interface StackItem {
  name: string
  /** Official logo, or a short text badge when no logo is available. */
  icon: BrandIcon | { badge: string }
}

export interface StackGroup {
  id: string
  title: string
  kicker: string
  items: StackItem[]
  /** Practices and concepts that have no logo. */
  also?: string[]
  training?: boolean
}

const logo = (name: string, icon: BrandIcon): StackItem => ({ name, icon })
const badge = (name: string, text: string): StackItem => ({ name, icon: { badge: text } })

export const stack: StackGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    kicker: 'Main weapon · left hand',
    items: [
      logo('React', siReact),
      logo('TypeScript', siTypescript),
      logo('JavaScript', siJavascript),
      logo('HTML5', siHtml5),
      logo('CSS', siCss),
    ],
    also: ['LESS', 'UI integration'],
  },
  {
    id: 'backend',
    title: 'Backend',
    kicker: 'Main weapon · right hand',
    items: [
      logo('Node.js', siNodedotjs),
      logo('Express', siExpress),
      logo('Swagger', siSwagger),
      logo('JWT', siJsonwebtokens),
      badge('BullMQ', 'MQ'),
    ],
    also: ['REST APIs & microservices', 'API orchestration'],
  },
  {
    id: 'databases',
    title: 'Databases',
    kicker: 'Memory core',
    items: [logo('MySQL', siMysql), logo('PostgreSQL', siPostgresql), logo('Redis', siRedis)],
  },
  {
    id: 'devops',
    title: 'Cloud & DevOps',
    kicker: 'Launch systems',
    items: [
      logo('Google Cloud', siGooglecloud),
      logo('Docker', siDocker),
      logo('Jenkins', siJenkins),
      badge('AWS', 'AWS'),
      badge('Apigee', 'APG'),
    ],
    also: ['CI/CD'],
  },
  {
    id: 'testing',
    title: 'Testing',
    kicker: 'Bug radar',
    items: [logo('Mocha', siMocha), logo('Chai', siChai), badge('Sinon', 'SN')],
    also: ['Integration testing', 'UAT support'],
  },
  {
    id: 'tools',
    title: 'Developer tools',
    kicker: 'Utility belt',
    items: [logo('Git', siGit), logo('Linux', siLinux), logo('Ubuntu', siUbuntu)],
  },
  {
    id: 'ai',
    title: 'AI integration',
    kicker: 'Training arc',
    training: true,
    items: [logo('Claude', siClaude), badge('Codex', 'CDX'), badge('OpenAI API', 'API')],
    also: ['LLM features in apps', 'Async AI pipelines'],
  },
]

/* ---------- Colour: brand colour when it reads on the dark card, else paper ---------- */
const CARD_BG = '#1D1D27'
const FALLBACK = '#EDEBE4'

function luminance(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a.replace('#', '')), luminance(b.replace('#', ''))].sort((m, n) => n - m) as [number, number]
  return (x + 0.05) / (y + 0.05)
}

/** WCAG 1.4.11 asks 3:1 for meaningful graphics; dark brand marks switch to paper. */
export function logoColour(hex: string): string {
  return contrast(`#${hex}`, CARD_BG) >= 3 ? `#${hex}` : FALLBACK
}
