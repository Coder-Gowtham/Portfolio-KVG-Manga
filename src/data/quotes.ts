import type { Quote } from '../types/content'

/**
 * Quotes for the Fun Zone terminal.
 * Real quotes: short, with attribution and a documented primary source.
 * Original lines are tagged `original` and shown as "Original — KVG".
 */
export const quotes: Quote[] = [
  {
    id: 'torvalds-show-code',
    text: 'Talk is cheap. Show me the code.',
    author: 'Linus Torvalds',
    source: 'Linux kernel mailing list, 2000',
    category: 'engineering',
  },
  {
    id: 'knuth-premature',
    text: 'Premature optimization is the root of all evil.',
    author: 'Donald Knuth',
    source: '"Structured Programming with go to Statements", 1974',
    category: 'engineering',
  },
  {
    id: 'sicp-people',
    text: 'Programs must be written for people to read, and only incidentally for machines to execute.',
    author: 'Harold Abelson and Gerald Jay Sussman',
    source: 'Structure and Interpretation of Computer Programs, 1985',
    category: 'craft',
  },
  {
    id: 'dijkstra-testing',
    text: 'Testing shows the presence, not the absence of bugs.',
    author: 'Edsger W. Dijkstra',
    source: 'NATO Software Engineering Techniques conference report, 1969',
    category: 'engineering',
  },
  {
    id: 'dijkstra-simplicity',
    text: 'Simplicity is prerequisite for reliability.',
    author: 'Edsger W. Dijkstra',
    source: 'EWD498, "How do we tell truths that might hurt?", 1975',
    category: 'craft',
  },
  {
    id: 'brooks-law',
    text: 'Adding manpower to a late software project makes it later.',
    author: 'Fred Brooks',
    source: 'The Mythical Man-Month, 1975',
    category: 'engineering',
  },
  {
    id: 'kay-future',
    text: 'The best way to predict the future is to invent it.',
    author: 'Alan Kay',
    source: 'Xerox PARC meeting, 1971 (as recounted by Kay)',
    category: 'mindset',
  },
  { id: 'kvg-bugs', text: 'Relax. I only hunt bugs.', author: 'KVG', category: 'original', original: true },
  {
    id: 'kvg-logs',
    text: 'Logs are just your code keeping a diary. Read it.',
    author: 'KVG',
    category: 'original',
    original: true,
  },
  {
    id: 'kvg-ship',
    text: 'Ship the small thing today. Polish is a sequel, not a prequel.',
    author: 'KVG',
    category: 'original',
    original: true,
  },
  {
    id: 'kvg-mask',
    text: 'The mask is not for hiding. It keeps the noise out.',
    author: 'KVG',
    category: 'original',
    original: true,
  },
  {
    id: 'kvg-fullstack',
    text: 'Full stack means you get to be wrong in every layer. Learn in every layer too.',
    author: 'KVG',
    category: 'original',
    original: true,
  },
  {
    id: 'kvg-training',
    text: 'Every arc starts with a training montage. Mine has a lot of documentation.',
    author: 'KVG',
    category: 'mindset',
    original: true,
  },
  {
    id: 'kvg-rest',
    text: 'Even netrunners log off. Rest is part of the build.',
    author: 'KVG',
    category: 'mindset',
    original: true,
  },
]
