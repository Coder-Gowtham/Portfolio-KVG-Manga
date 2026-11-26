/**
 * Home-page copy. Facts only (from the résumé and Gowtham's answers);
 * edit freely, no component changes needed.
 */
export const home = {
  status: ['KVG.SYS // ONLINE', 'Available for immediate joining', 'Next arc: AI integration'],
  cover: {
    /** Hero title, split so the initials and the name can be styled apart. */
    title: { initials: 'K.V.', name: 'Gowtham' },
    issueLabel: 'CYBER ISSUE',
    mastheadTag: 'MANGA × CODE',
    /** Cover lines shown over the art. Keep them short. */
    lines: ['React.js', 'Node.js', 'Full stack', 'Fintech arc'],
    newArc: { label: 'NEW ARC!', title: 'VSCC ERP', slug: 'vscc-erp' },
    /** The mascot's catchphrase, shown beside the name. */
    catchphrase: 'Relax. I only hunt bugs.',
  },
  /** "At a glance": one short paragraph. The stack itself is the Abilities board (data/stack.ts). */
  glance: {
    text: 'Node.js microservices for fintech onboarding at Niveus, ONLYOFFICE editor front ends at Innoscripta, and now a construction ERP built end to end.',
  },
  /** "Next arc" panel: what the AI-integration training covers. Goals, not claims. */
  training: {
    drills: [
      'Prompts and structured outputs that a product can rely on',
      'AI work in background queues, so apps stay fast and responsive',
      'Features people can review and trust, with sensible fallbacks when a model gets it wrong',
    ],
    firstMission: { label: 'LogLens AI: AI-assisted log analysis', slug: 'loglens-ai' },
  },
  closing: {
    bubble: 'Got a quest? Ping me.',
    lede: 'Quest board is open. Pick a type and send it over; replies are fastest by email.',
  },
} as const
