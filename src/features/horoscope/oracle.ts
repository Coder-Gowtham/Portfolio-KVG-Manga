/**
 * Cyber-oracle: fictional fortunes, for fun only. Every line is original and
 * the pick is deterministic: same sign + same local day = same fortune.
 */
import { hashString, dayKey } from '../../utils/storage'

export const SIGNS = [
  { id: 'aries', name: 'Aries', glyph: '♈\uFE0E', dates: 'Mar 21 – Apr 19' },
  { id: 'taurus', name: 'Taurus', glyph: '♉\uFE0E', dates: 'Apr 20 – May 20' },
  { id: 'gemini', name: 'Gemini', glyph: '♊\uFE0E', dates: 'May 21 – Jun 20' },
  { id: 'cancer', name: 'Cancer', glyph: '♋\uFE0E', dates: 'Jun 21 – Jul 22' },
  { id: 'leo', name: 'Leo', glyph: '♌\uFE0E', dates: 'Jul 23 – Aug 22' },
  { id: 'virgo', name: 'Virgo', glyph: '♍\uFE0E', dates: 'Aug 23 – Sep 22' },
  { id: 'libra', name: 'Libra', glyph: '♎\uFE0E', dates: 'Sep 23 – Oct 22' },
  { id: 'scorpio', name: 'Scorpio', glyph: '♏\uFE0E', dates: 'Oct 23 – Nov 21' },
  { id: 'sagittarius', name: 'Sagittarius', glyph: '♐\uFE0E', dates: 'Nov 22 – Dec 21' },
  { id: 'capricorn', name: 'Capricorn', glyph: '♑\uFE0E', dates: 'Dec 22 – Jan 19' },
  { id: 'aquarius', name: 'Aquarius', glyph: '♒\uFE0E', dates: 'Jan 20 – Feb 18' },
  { id: 'pisces', name: 'Pisces', glyph: '♓\uFE0E', dates: 'Feb 19 – Mar 20' },
] as const

export type SignId = (typeof SIGNS)[number]['id']

const READINGS = [
  'A merge conflict you have been avoiding resolves itself the moment you open the file.',
  'Your code compiles on the first try. Do not tell anyone; they will not believe you.',
  'A forgotten console.log from last month finally tells you something useful.',
  'The bug you blamed on the framework was yours all along. Growth arc unlocked.',
  'Someone reads your README today and actually follows the steps. Rare alignment.',
  'Deploy before lunch, not after. The stars are clear on this one.',
  'A stranger on the internet answers your exact question from 2019. Bookmark it.',
  'Your tests pass locally and in CI. Screenshot this moment.',
  'An old side project calls to you. Answer, but set a timer.',
  'Today a slow query meets its index. Latency bows before you.',
  'You will name a variable perfectly on the first attempt. Savour it.',
  'The cache was the problem. The cache is always the problem.',
  'A teammate asks for a review. Be kind; the stars are watching the diff.',
  'Delete more code than you write today and feel strangely powerful.',
  'A flaky test stops flaking. Do not ask why. Walk away slowly.',
  'Your 2 a.m. idea is actually good. Write it down before it compiles into regret.',
]

const ADVICE = [
  'Read the error message twice before searching it.',
  'Commit small. Future you is a different, more tired person.',
  'Drink water between deploys.',
  'Rubber-duck it out loud. The drone is listening.',
  'Close the tabs you will never read.',
  'Leave the code a little cleaner than you found it.',
  'Ask the question in the team channel. Someone else has it too.',
  'Take the walk. The answer is waiting outside.',
]

const LUCKY = [
  { label: 'Lucky port', values: ['3000', '5173', '8080', '4173', '1337', '6379'] },
  { label: 'Lucky status code', values: ['200 OK', '201 Created', '204 No Content', '304 Not Modified', '418 I am a teapot'] },
  { label: 'Lucky shortcut', values: ['Ctrl + Shift + P', 'Ctrl + D', 'Alt + ↑', 'Ctrl + `', 'F2 (rename all)'] },
  { label: 'Lucky command', values: ['git stash', 'npm ci', 'git bisect', 'docker compose up', 'git commit --amend'] },
]

const STATS = ['Focus', 'Luck', 'Caffeine'] as const

export interface Fortune {
  sign: (typeof SIGNS)[number]
  day: string
  reading: string
  advice: string
  lucky: { label: string; value: string }
  stats: { label: (typeof STATS)[number]; value: number }[]
  match: (typeof SIGNS)[number]
}

export function isSign(value: string | null | undefined): value is SignId {
  return SIGNS.some((s) => s.id === value)
}

export function fortuneFor(signId: SignId, date: Date): Fortune {
  const day = dayKey(date)
  const pick = (salt: string, n: number) => hashString(`${signId}|${day}|${salt}`) % n
  const sign = SIGNS.find((s) => s.id === signId)!
  const lucky = LUCKY[pick('lucky', LUCKY.length)]!
  const others = SIGNS.filter((s) => s.id !== signId)
  return {
    sign,
    day,
    reading: READINGS[pick('reading', READINGS.length)]!,
    advice: ADVICE[pick('advice', ADVICE.length)]!,
    lucky: { label: lucky.label, value: lucky.values[pick('lucky-value', lucky.values.length)]! },
    stats: STATS.map((label) => ({ label, value: 1 + pick(label, 5) })),
    match: others[pick('match', others.length)]!,
  }
}
