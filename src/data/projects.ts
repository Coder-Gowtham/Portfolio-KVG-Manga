import type { Project } from '../types/content'

/**
 * Rules for this file (see docs/phase-2-design-spec.md §9):
 * - No numeric impact metrics.
 * - Planned work lives in `features.planned` / modules with status 'planned', never in `built`.
 * - Only real demo/GitHub URLs.
 * - Client-confidential details stay out.
 */
export const projects: Project[] = [
  {
    id: 'vscc-erp',
    slug: 'vscc-erp',
    title: 'VSCC ERP',
    subtitle: 'Construction ERP: web app + installable phone app',
    summary:
      'An ERP for a construction group: role-based access, approvals, HR, attendance, payroll, daily site reports and client billing, with a phone app for site staff.',
    description:
      'A full ERP for a group of construction companies, built module by module with the client. Office staff use the web ERP; site staff use an installable phone web app for attendance and daily progress reports. Everything shares one API and database.',
    category: 'freelance',
    status: 'in-development',
    featured: true,
    featuredOrder: 1,
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'AWS'],
    role: 'Full-stack developer',
    startDate: '2026-11',
    problem:
      'Site and office teams ran attendance, payroll, daily progress and billing on spreadsheets. The ERP replaces retyping with one system, one approval flow and figures calculated by the server.',
    modules: [
      {
        name: 'Foundation & administration',
        status: 'done',
        summary:
          'Multi-company and project scoping, role permission matrix, full change history, one approval workflow with recall, and an approvals inbox.',
      },
      {
        name: 'Data protection',
        status: 'done',
        summary: 'Sensitive identity and bank fields encrypted at rest, masked on screen, unmasked only with a dedicated permission.',
      },
      {
        name: 'Masters',
        status: 'done',
        summary: 'Reference lists (units, materials, labour, plant, parties, BoQ) on one generic, data-driven screen, plus configurable extra fields.',
      },
      {
        name: 'Excel import engine',
        status: 'done',
        summary: 'Upload any sheet layout, auto-suggested column matching with aliases, saved templates, row-level preview, then an atomic import with logs.',
      },
      {
        name: 'HR / employment',
        status: 'testing',
        summary: 'Employee master, documents with expiry tracking, transfers and change requests applied only on approval.',
      },
      {
        name: 'Attendance & leave',
        status: 'testing',
        summary: 'Calendars, shifts, leave types and balances, approvals and monthly registers that feed payroll.',
      },
      {
        name: 'Payroll',
        status: 'testing',
        summary: 'Salary structures with arrears, monthly run, payslips, loans, reimbursements, tax declarations, statutory files and full-and-final settlement.',
      },
      {
        name: 'Phone app',
        status: 'testing',
        summary: 'Installable web app: PIN login with lockout, daily check-in/out with live photo and GPS, queued offline and synced later.',
      },
      {
        name: 'Daily progress report',
        status: 'partly-done',
        summary: 'One report per site per day from phone or ERP; site staff type quantities, the server calculates amounts; photos and approvals.',
      },
      {
        name: 'Client billing',
        status: 'testing',
        summary: 'Contracts, variations, running bills, payment certificates, notes, receipts, printable bills and billing reports.',
      },
      {
        name: 'Procurement, inventory, plant, project cost, accounts, fixed assets',
        status: 'planned',
        summary: 'Next priority, built in dependency order.',
      },
    ],
    challenges: [
      {
        problem: 'Every document type needed approval, and each department wanted its own flow.',
        solution: 'One generic workflow (Draft → Submitted → Approved / Sent back, with recall), configured per document type and company.',
      },
      {
        problem: 'Staff keep data in sheets with their own column names and layouts.',
        solution: 'An import engine that suggests column matches from known aliases, previews every row, and saves the mapping as a reusable template.',
      },
      {
        problem: 'Sites often have no mobile signal.',
        solution: 'Phone check-ins are queued on the device and synced when the connection returns.',
      },
    ],
    decisions: [
      'Site staff type only quantities; all amounts are computed server-side from rates.',
      'Sensitive fields are encrypted at the database level and masked by default in the UI.',
      'An installable web app instead of a store app, so updates ship with the server.',
    ],
    visibility: 'restricted',
    media: [
      { kind: 'image', alt: 'VSCC ERP web dashboard (screenshot pending approval)', device: 'desktop', approvedForPublic: false },
      { kind: 'image', alt: 'VSCC ERP phone check-in screen (screenshot pending approval)', device: 'mobile', approvedForPublic: false },
    ],
    needsInput: [
      'Confirm VSCC may be named publicly',
      'Confirm role (sole developer?)',
      'Approved screenshots with dummy data',
    ],
  },
  {
    id: 'loglens-ai',
    slug: 'loglens-ai',
    title: 'LogLens AI',
    subtitle: 'AI-assisted log analysis',
    summary:
      'Classifies log severity, summarises issues and suggests troubleshooting steps using the OpenAI API, with analysis running as background jobs.',
    category: 'personal',
    status: 'shipped',
    featured: true,
    featuredOrder: 2,
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'BullMQ', 'Docker', 'OpenAI API'],
    role: 'Solo developer',
    contribution: 'solo',
    startDate: '2026-05',
    features: {
      built: [
        'Severity classification of log entries',
        'Issue summarisation',
        'Troubleshooting recommendations',
        'Analysis queued with Redis + BullMQ, outside the request lifecycle',
        'React frontend and Node.js backend, with PostgreSQL for persistence',
      ],
    },
    decisions: ['Long-running AI analysis moved to background workers so API requests return immediately.'],
    lessons: ['Explored asynchronous processing and AI-powered analysis workflows for work that should not block a request.'],
    visibility: 'public',
    media: [{ kind: 'image', alt: 'LogLens AI analysis view (screenshot pending)', device: 'desktop', approvedForPublic: false }],
    needsInput: ['GitHub / demo links', 'Screenshots'],
  },
  {
    id: 'vector-mind',
    slug: 'vector-mind',
    title: 'Vector Mind',
    summary: 'Personal project. Details coming soon.',
    category: 'personal',
    status: 'placeholder',
    technologies: [],
    visibility: 'public',
    needsInput: ['Summary', 'Technologies', 'Features', 'Links', 'Screenshots'],
  },
  {
    id: 'times-black',
    slug: 'times-black',
    title: 'Times Black',
    subtitle: 'FinTech credit-card onboarding',
    summary:
      'Backend for a digital credit-card customer-acquisition journey: APIs, orchestration of downstream services, validation, authentication and third-party integrations.',
    category: 'professional',
    status: 'shipped',
    featured: true,
    featuredOrder: 3,
    organization: 'Niveus Solutions',
    technologies: ['Node.js', 'Express', 'JavaScript', 'MySQL', 'REST APIs', 'JWT', 'Microservices'],
    role: 'Backend engineer',
    contribution: 'co-owned',
    responsibilities: [
      'Co-owned end-to-end backend development of the premium credit-card onboarding journey',
      'Implemented APIs and business workflows for eligible customers on the CAP architecture',
      'Orchestrated downstream services and third-party integrations',
      'Validation, JWT authentication, retries and error handling',
      'Database-driven configuration that returned UI components and controlled page navigation',
    ],
    teamContext: 'Co-owned with the team. Built on the Customer Acquisition Platform (CAP), whose initial orchestration framework Gowtham built.',
    visibility: 'restricted',
    startDate: '2022-05',
    endDate: '2025-08',
    needsInput: ['OK to name the product publicly'],
  },
  {
    id: 'yeida',
    slug: 'yeida',
    title: 'YEIDA',
    subtitle: 'Loan application workflows',
    summary: 'Backend for a digital loan journey: eligible users see their approved loan amount and submit a loan request for downstream bank processing. Owned through UAT.',
    problem: 'Eligible users needed a digital way to view approved loan amounts and submit loan requests that flow on to the bank.',
    category: 'professional',
    status: 'shipped',
    featured: true,
    featuredOrder: 4,
    organization: 'Niveus Solutions',
    technologies: ['Node.js', 'Express', 'JavaScript', 'MySQL', 'REST APIs', 'Microservices'],
    role: 'Backend engineer',
    contribution: 'owner',
    responsibilities: [
      'Owned the loan workflow backend through UAT',
      'Business logic and input validation',
      'Built on the CAP orchestration framework for downstream API coordination, retries and error handling',
    ],
    visibility: 'restricted',
    startDate: '2022-05',
    endDate: '2025-08',
    needsInput: ['OK to name publicly'],
  },
  {
    id: 'clusterix',
    slug: 'clusterix',
    title: 'Clusterix',
    subtitle: 'Customised ONLYOFFICE editors',
    summary:
      'Frontend work extending the open-source ONLYOFFICE JavaScript editors (documents, spreadsheets, presentations) toward a Google Docs-like experience.',
    category: 'professional',
    status: 'shipped',
    organization: 'Innoscripta SE',
    technologies: ['JavaScript', 'ONLYOFFICE', 'HTML', 'CSS/LESS', 'UI integration'],
    role: 'Full-stack developer',
    contribution: 'team-member',
    responsibilities: [
      'Extended the editors with Clusterix-specific frontend functionality without breaking core editing',
      'Built and modified side panels, toolbar and ribbon actions, dropdown menus and layouts',
      'Integrated frontend components with existing APIs and editor functionality',
      'Debugged and traced functionality across a large-scale JavaScript codebase',
    ],
    teamContext: 'Worked with other developers on editor interactions.',
    visibility: 'restricted',
    startDate: '2025-09',
    endDate: '2026-04',
    needsInput: ['OK to name publicly', 'Approved screenshots'],
  },
]

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug)

export const featuredProjects = () =>
  projects
    .filter((p) => p.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))
