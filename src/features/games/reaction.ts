/** Quick-draw: wait for "DRAW!", then fire. Firing early is a foul. */
export type DrawPhase = 'ready' | 'waiting' | 'draw' | 'result' | 'foul'

export const MIN_DELAY = 1500
export const MAX_DELAY = 4000

/** Random wait before "DRAW!" so the signal can't be anticipated. */
export function drawDelay(random: () => number = Math.random): number {
  return Math.round(MIN_DELAY + random() * (MAX_DELAY - MIN_DELAY))
}

export function rankFor(ms: number): { rank: string; line: string } {
  if (ms < 200) return { rank: 'S', line: 'Cyber-reflexes. The bug never saw it coming.' }
  if (ms < 280) return { rank: 'A', line: 'Sharp shot. Production is safe tonight.' }
  if (ms < 380) return { rank: 'B', line: 'Solid. One more cup of chai and you hit S.' }
  if (ms < 550) return { rank: 'C', line: 'The bug escaped to staging. Try again.' }
  return { rank: 'D', line: 'Lag detected. Did someone open 40 browser tabs?' }
}

export function isNewBest(ms: number, best: number | null): boolean {
  return best === null || ms < best
}
