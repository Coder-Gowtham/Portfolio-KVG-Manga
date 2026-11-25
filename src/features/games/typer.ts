/**
 * Neon typer: type the command before its fuse burns out. Three lives.
 * Pure helpers; the component owns the clock.
 */
export const LIVES = 3

/** Ordered roughly by length, so later levels draw longer commands. */
export const COMMANDS = [
  'ls',
  'cd ..',
  'git add .',
  'npm i',
  'npm test',
  'git push',
  'git status',
  'npm run dev',
  'docker ps -a',
  'git pull --rebase',
  'git stash pop',
  'npm run build',
  'git checkout -b fix',
  'docker compose up -d',
  'git log --oneline',
  'kubectl get pods',
  'npx vitest --run',
  'git rebase -i HEAD~3',
  'grep -rn TODO src',
  'chmod +x deploy.sh',
] as const

/** Commands open up as the level rises (level = commands cleared so far). */
export function poolFor(level: number): readonly string[] {
  const size = Math.min(COMMANDS.length, 6 + level * 2)
  return COMMANDS.slice(0, size)
}

export function pickCommand(level: number, previous: string | null, random: () => number = Math.random): string {
  const pool = poolFor(level).filter((c) => c !== previous)
  return pool[Math.floor(random() * pool.length)]!
}

/** Fuse length: generous per character, shrinking a little each level, never below 0.7× */
export function fuseFor(command: string, level: number): number {
  const base = 1400 + command.length * 330
  return Math.round(base * Math.max(0.7, 1 - level * 0.03))
}

/** How much of the target is typed correctly, and whether the last keystroke went wrong. */
export function checkTyped(target: string, typed: string): { correct: number; error: boolean; done: boolean } {
  let correct = 0
  while (correct < typed.length && correct < target.length && typed[correct] === target[correct]) correct++
  return { correct, error: correct < typed.length, done: typed === target }
}

export function typerVerdict(score: number): string {
  if (score >= 20) return 'Senior-engineer fingers. The terminal fears you.'
  if (score >= 12) return 'Fast hands. Your shell history is proud.'
  if (score >= 6) return 'Respectable. Muscle memory is compiling.'
  return 'Warm-up round. Try again with fewer typos.'
}
