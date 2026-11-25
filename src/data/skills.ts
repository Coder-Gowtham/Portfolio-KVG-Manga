import type { SkillCategory } from '../types/content'

/**
 * Categorised, described skills. No percentages or skill bars, by design.
 * Source: résumé "GOWTHAM_KV_RESUME_FULLSTACK" + tools used in listed projects.
 */
export const skills: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    kicker: 'Main weapon · left hand',
    skills: [
      { name: 'React.js', note: 'Component-based UIs: LogLens AI and ERP screens' },
      { name: 'JavaScript', note: 'Large-codebase work extending the ONLYOFFICE editors' },
      { name: 'HTML & CSS/LESS', note: 'Layouts, panels, toolbars and responsive UI' },
      { name: 'TypeScript', note: 'Typed front ends and services' },
      { name: 'UI integration', note: 'Wiring components to APIs and editor internals' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    kicker: 'Main weapon · right hand',
    skills: [
      { name: 'Node.js & Express.js', note: 'APIs and services since 2022' },
      { name: 'REST APIs & microservices', note: 'Fintech onboarding and loan journeys' },
      { name: 'API orchestration', note: 'Downstream coordination, retries, error handling' },
      { name: 'OpenAPI / Swagger', note: 'Documented API contracts' },
      { name: 'JWT', note: 'Token-based authentication' },
      { name: 'BullMQ', note: 'Background job queues' },
    ],
  },
  {
    id: 'ai',
    title: 'AI integration',
    kicker: 'Training arc',
    skills: [
      { name: 'OpenAI API', note: 'Severity classification, summaries, recommendations' },
      { name: 'LLM features in apps', note: 'Turning model output into product features' },
      { name: 'Async AI pipelines', note: 'Running AI work in background jobs' },
    ],
  },
  {
    id: 'databases',
    title: 'Databases',
    kicker: 'Memory core',
    skills: [
      { name: 'MySQL', note: 'Schemas, joins, subqueries, transactions, indexes, stored procedures' },
      { name: 'PostgreSQL', note: 'ERP and side projects' },
      { name: 'Redis', note: 'Backing store for job queues' },
    ],
  },
  {
    id: 'devops',
    title: 'Cloud & DevOps',
    kicker: 'Launch systems',
    skills: [
      { name: 'Google Cloud Platform', note: 'Log-driven debugging of UAT and production' },
      { name: 'Jenkins & CI/CD', note: 'Deploying microservices' },
      { name: 'Apigee', note: 'API management' },
      { name: 'Docker', note: 'Containerised services' },
      { name: 'AWS', note: 'ERP UAT hosting' },
    ],
  },
  {
    id: 'testing',
    title: 'Testing',
    kicker: 'Bug radar',
    skills: [
      { name: 'Mocha · Chai · Sinon', note: 'Unit tests, assertions, stubs' },
      { name: 'Integration testing', note: 'API and service-level checks' },
      { name: 'UAT support', note: 'Resolving issues before release' },
    ],
  },
  {
    id: 'tools',
    title: 'Developer tools',
    kicker: 'Utility belt',
    skills: [
      { name: 'Git', note: 'Version control and reviews' },
      { name: 'Linux (Ubuntu)', note: 'Development environments and servers' },
    ],
  },
]
