/**
 * Bug hunt: whack-a-bug on a 3×3 grid against a 30-second deploy timer.
 * Pure reducer driven by timestamps, so it is fully testable without timers.
 */
export const GRID = 9
export const ROUND_MS = 30_000

export type BugKind = 'bug' | 'golden'
export interface ActiveBug {
  id: number
  cell: number
  kind: BugKind
  expiresAt: number
}

export interface HuntState {
  phase: 'ready' | 'playing' | 'over'
  startedAt: number
  now: number
  score: number
  squashed: number
  escaped: number
  bugs: ActiveBug[]
  nextSpawnAt: number
  nextId: number
  /** Last cell hit and what happened, for feedback. */
  last: { cell: number; result: 'hit' | 'miss' } | null
}

export type HuntAction =
  | { type: 'start'; now: number }
  | { type: 'tick'; now: number; random: () => number }
  | { type: 'hit'; cell: number; now: number }

export const POINTS: Record<BugKind, number> = { bug: 1, golden: 3 }

export const initialHunt: HuntState = {
  phase: 'ready',
  startedAt: 0,
  now: 0,
  score: 0,
  squashed: 0,
  escaped: 0,
  bugs: [],
  nextSpawnAt: 0,
  nextId: 1,
  last: null,
}

/** 0 at the start of a round, 1 at the end. Bugs get faster as the deploy gets closer. */
const progress = (s: HuntState, now: number) => Math.min(1, (now - s.startedAt) / ROUND_MS)
export const lifetimeAt = (p: number) => Math.round(1250 - 600 * p)
export const spawnGapAt = (p: number) => Math.round(750 - 380 * p)
export const maxBugsAt = (p: number) => (p < 0.35 ? 1 : p < 0.7 ? 2 : 3)

export const timeLeft = (s: HuntState) => (s.phase === 'playing' ? Math.max(0, ROUND_MS - (s.now - s.startedAt)) : s.phase === 'over' ? 0 : ROUND_MS)

export function huntReducer(s: HuntState, a: HuntAction): HuntState {
  switch (a.type) {
    case 'start':
      return { ...initialHunt, phase: 'playing', startedAt: a.now, now: a.now, nextSpawnAt: a.now + 400 }

    case 'hit': {
      if (s.phase !== 'playing') return s
      const bug = s.bugs.find((b) => b.cell === a.cell && b.expiresAt > a.now)
      if (!bug) return { ...s, last: { cell: a.cell, result: 'miss' } }
      return {
        ...s,
        score: s.score + POINTS[bug.kind],
        squashed: s.squashed + 1,
        bugs: s.bugs.filter((b) => b.id !== bug.id),
        last: { cell: a.cell, result: 'hit' },
      }
    }

    case 'tick': {
      if (s.phase !== 'playing') return s
      const now = a.now
      const alive = s.bugs.filter((b) => b.expiresAt > now)
      const escaped = s.escaped + (s.bugs.length - alive.length)
      if (now - s.startedAt >= ROUND_MS) {
        return { ...s, now, phase: 'over', bugs: [], escaped: escaped + alive.length }
      }
      let next: HuntState = { ...s, now, bugs: alive, escaped }
      const p = progress(s, now)
      if (now >= s.nextSpawnAt && alive.length < maxBugsAt(p)) {
        const free = Array.from({ length: GRID }, (_, i) => i).filter((c) => !alive.some((b) => b.cell === c))
        const cell = free[Math.floor(a.random() * free.length)]!
        const kind: BugKind = a.random() < 0.12 ? 'golden' : 'bug'
        next = {
          ...next,
          bugs: [...alive, { id: s.nextId, cell, kind, expiresAt: now + lifetimeAt(p) }],
          nextId: s.nextId + 1,
          nextSpawnAt: now + spawnGapAt(p),
        }
      }
      return next
    }
  }
}

export function huntVerdict(score: number): string {
  if (score >= 40) return 'Zero-bug release. The QA team wants your autograph.'
  if (score >= 28) return 'Clean deploy. Only a few bugs slipped into the changelog.'
  if (score >= 16) return 'Shipped with known issues. Classic Friday.'
  return 'Production is on fire. Roll back and try again.'
}
