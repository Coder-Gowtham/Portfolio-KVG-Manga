/**
 * Secret key sequences. Matching is done on a rolling buffer of recent keys,
 * so it works wherever the sequence starts and ignores everything before it.
 */
export const SEQUENCES: Record<string, string[]> = {
  sudo: [...'sudo kvg'],
  konami: ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'],
}

const MAX = Math.max(...Object.values(SEQUENCES).map((s) => s.length))

export function normaliseKey(key: string): string {
  return key.toLowerCase()
}

/** Returns a push(key) function that reports when any sequence completes. */
export function createSequenceMatcher(sequences: Record<string, string[]> = SEQUENCES) {
  let buffer: string[] = []
  return function push(key: string): string | null {
    buffer = [...buffer, normaliseKey(key)].slice(-MAX)
    for (const [id, seq] of Object.entries(sequences)) {
      if (buffer.length >= seq.length && seq.every((k, i) => buffer[buffer.length - seq.length + i] === k)) {
        buffer = []
        return id
      }
    }
    return null
  }
}

/** Number of footer patch taps that unlock the chapter on touch screens. */
export const PATCH_TAPS = 5
/** Taps further apart than this start the count again. */
export const PATCH_WINDOW_MS = 4000
