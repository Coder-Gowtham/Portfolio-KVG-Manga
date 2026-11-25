/**
 * Home-page copy. Facts only (from the résumé and Gowtham's answers);
 * edit freely, no component changes needed.
 */
export const home = {
  status: ['KVG.SYS // ONLINE', 'Available for immediate joining', 'Next arc: AI integration'],
  cover: {
    issueLabel: 'CYBER ISSUE',
    tagline: 'MANGA × CODE',
    /** Cover lines shown over the art. Keep them short. */
    lines: ['React.js', 'Node.js', 'Full stack', 'Fintech arc'],
    newArc: { label: 'NEW ARC!', title: 'VSCC ERP', slug: 'vscc-erp' },
  },
  /** "Previously on…": the manga recap, three narration boxes. */
  recap: [
    {
      kicker: 'Origin',
      text: 'A full stack developer with about four years across React and JavaScript front ends and Node.js/Express back ends.',
    },
    {
      kicker: 'The fintech arc',
      text: 'At Niveus Solutions: Node.js microservices for credit-card onboarding and loan journeys, starting with the orchestration framework behind the Customer Acquisition Platform.',
    },
    {
      kicker: 'The frontend arc',
      text: 'At Innoscripta: extended the ONLYOFFICE JavaScript editors for Clusterix. Now building a construction ERP and opening a new arc in AI integration.',
    },
  ],
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
    lede: 'Open to full-time roles and interesting builds. Replies are fastest by email.',
  },
} as const
