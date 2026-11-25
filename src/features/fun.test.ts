import { describe, expect, it } from 'vitest'
import { quotes } from '../data/quotes'
import { seeded } from '../utils/random'
import { dayKey, hashString } from '../utils/storage'
import { PAIRS, initialMemory, isMismatch, isWon, makeDeck, memoryReducer, type MemoryState } from './games/memory'
import { ROUND_MS, huntReducer, initialHunt, maxBugsAt, timeLeft } from './games/hunt'
import { COMMANDS, checkTyped, fuseFor, pickCommand, poolFor } from './games/typer'
import { MAX_DELAY, MIN_DELAY, drawDelay, isNewBest, rankFor } from './games/reaction'
import { SIGNS, fortuneFor, isSign } from './horoscope/oracle'
import { attribution, filterQuotes, nextRandom, quoteOfTheDay, shareText, toggleFavourite } from './quotes/quotes'
import { PATCH_TAPS, createSequenceMatcher } from './secrets/sequence'

describe('storage helpers', () => {
  it('builds a local day key and a stable hash', () => {
    expect(dayKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
    expect(hashString('kvg')).toBe(hashString('kvg'))
    expect(hashString('kvg')).not.toBe(hashString('kvh'))
  })
})

describe('quick-draw', () => {
  it('keeps the random delay inside the window', () => {
    expect(drawDelay(() => 0)).toBe(MIN_DELAY)
    expect(drawDelay(() => 0.999999)).toBeLessThanOrEqual(MAX_DELAY)
  })
  it('ranks reaction times and detects a new best', () => {
    expect(rankFor(150).rank).toBe('S')
    expect(rankFor(250).rank).toBe('A')
    expect(rankFor(900).rank).toBe('D')
    expect(isNewBest(300, null)).toBe(true)
    expect(isNewBest(300, 250)).toBe(false)
    expect(isNewBest(200, 250)).toBe(true)
  })
})

describe('memory match', () => {
  const deck = makeDeck(seeded(3))
  const pairOf = (s: MemoryState, i: number) => s.deck.findIndex((c, j) => j !== i && c.symbol === s.deck[i]!.symbol)
  const otherThan = (s: MemoryState, i: number) => s.deck.findIndex((c) => c.symbol !== s.deck[i]!.symbol)

  it('deals two of every symbol', () => {
    expect(deck).toHaveLength(PAIRS.length * 2)
    for (const p of PAIRS) expect(deck.filter((c) => c.symbol === p.id)).toHaveLength(2)
  })

  it('matches a pair and counts one move', () => {
    let s = initialMemory(deck)
    s = memoryReducer(s, { type: 'flip', index: 0 })
    s = memoryReducer(s, { type: 'flip', index: pairOf(s, 0) })
    expect(s.matched).toEqual([deck[0]!.symbol])
    expect(s.open).toEqual([])
    expect(s.moves).toBe(1)
  })

  it('holds a mismatch open until hidden, and blocks a third flip', () => {
    let s = initialMemory(deck)
    const b = otherThan(s, 0)
    s = memoryReducer(s, { type: 'flip', index: 0 })
    s = memoryReducer(s, { type: 'flip', index: b })
    expect(isMismatch(s)).toBe(true)
    const third = s.deck.findIndex((_, i) => i !== 0 && i !== b)
    expect(memoryReducer(s, { type: 'flip', index: third })).toBe(s)
    s = memoryReducer(s, { type: 'hide' })
    expect(s.open).toEqual([])
    expect(s.moves).toBe(1)
  })

  it('ignores flipping the same card twice or a matched card', () => {
    let s = initialMemory(deck)
    s = memoryReducer(s, { type: 'flip', index: 0 })
    expect(memoryReducer(s, { type: 'flip', index: 0 })).toBe(s)
    s = memoryReducer(s, { type: 'flip', index: pairOf(s, 0) })
    expect(memoryReducer(s, { type: 'flip', index: 0 })).toBe(s)
  })

  it('is won when every pair is found', () => {
    let s = initialMemory(deck)
    const done = new Set<number>()
    for (let i = 0; i < deck.length; i++) {
      if (done.has(i)) continue
      const j = pairOf(s, i)
      s = memoryReducer(memoryReducer(s, { type: 'flip', index: i }), { type: 'flip', index: j })
      done.add(i).add(j)
    }
    expect(isWon(s)).toBe(true)
    expect(s.moves).toBe(PAIRS.length)
  })
})

describe('cyber-oracle', () => {
  const day = new Date(2026, 10, 23, 10)
  it('is deterministic for a sign and a day', () => {
    expect(fortuneFor('leo', day)).toEqual(fortuneFor('leo', new Date(2026, 10, 23, 22)))
  })
  it('gives every sign a complete fortune and a different match sign', () => {
    for (const z of SIGNS) {
      const f = fortuneFor(z.id, day)
      expect(f.reading.length).toBeGreaterThan(10)
      expect(f.match.id).not.toBe(z.id)
      expect(f.stats.every((st) => st.value >= 1 && st.value <= 5)).toBe(true)
    }
  })
  it('changes over a week', () => {
    const readings = new Set(Array.from({ length: 7 }, (_, i) => fortuneFor('virgo', new Date(2026, 10, 23 + i)).reading))
    expect(readings.size).toBeGreaterThan(1)
  })
  it('validates sign ids', () => {
    expect(isSign('aries')).toBe(true)
    expect(isSign('ophiuchus')).toBe(false)
    expect(isSign(null)).toBe(false)
  })
})

describe('quotes', () => {
  it('has unique ids, sources for real quotes and short lines', () => {
    expect(new Set(quotes.map((q) => q.id)).size).toBe(quotes.length)
    for (const q of quotes) {
      if (!q.original) expect(q.source, q.id).toBeTruthy()
      expect(q.text.split(/\s+/).length, q.id).toBeLessThanOrEqual(16)
    }
  })
  it('picks the same quote of the day all day', () => {
    expect(quoteOfTheDay(quotes, new Date(2026, 10, 23, 1)).id).toBe(quoteOfTheDay(quotes, new Date(2026, 10, 23, 23)).id)
  })
  it('filters by category and favourites', () => {
    expect(filterQuotes(quotes, 'original', []).every((q) => q.category === 'original')).toBe(true)
    expect(filterQuotes(quotes, 'favourites', ['kvg-bugs']).map((q) => q.id)).toEqual(['kvg-bugs'])
    expect(filterQuotes(quotes, 'all', [])).toHaveLength(quotes.length)
  })
  it('pulls a different random quote when it can', () => {
    for (let i = 0; i < 20; i++) expect(nextRandom(quotes, 'kvg-bugs')!.id).not.toBe('kvg-bugs')
    expect(nextRandom([], 'x')).toBeUndefined()
  })
  it('formats attribution and favourites', () => {
    const own = quotes.find((q) => q.original)!
    expect(attribution(own)).toBe('Original — KVG')
    expect(shareText(own)).toContain('Original — KVG')
    expect(toggleFavourite(toggleFavourite([], 'a'), 'a')).toEqual([])
  })
})

describe('secret sequences', () => {
  it('unlocks on "sudo kvg" typed after other keys', () => {
    const push = createSequenceMatcher()
    const keys = [...'hello sudo kv', 'G']
    const results = keys.map((k) => push(k))
    expect(results.at(-1)).toBe('sudo')
    expect(results.slice(0, -1).every((r) => r === null)).toBe(true)
  })
  it('unlocks on the Konami code', () => {
    const push = createSequenceMatcher()
    const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
    expect(seq.map((k) => push(k)).at(-1)).toBe('konami')
  })
  it('does not unlock on a broken sequence', () => {
    const push = createSequenceMatcher()
    expect([...'sudo kxg'].map((k) => push(k)).some(Boolean)).toBe(false)
  })
  it('needs five patch taps', () => {
    expect(PATCH_TAPS).toBe(5)
  })
})

describe('bug hunt', () => {
  const rnd = seeded(9)
  const run = (until: number) => {
    let s = huntReducer(initialHunt, { type: 'start', now: 0 })
    for (let t = 50; t <= until; t += 50) s = huntReducer(s, { type: 'tick', now: t, random: rnd })
    return s
  }
  it('spawns bugs and scores a hit', () => {
    const s = run(1000)
    expect(s.bugs.length).toBeGreaterThan(0)
    const bug = s.bugs[0]!
    const hit = huntReducer(s, { type: 'hit', cell: bug.cell, now: 1000 })
    expect(hit.score).toBeGreaterThan(0)
    expect(hit.squashed).toBe(1)
    expect(hit.bugs.some((b) => b.id === bug.id)).toBe(false)
  })
  it('ignores a miss and never exceeds the bug limit', () => {
    let s = run(1000)
    const empty = Array.from({ length: 9 }, (_, i) => i).find((c) => !s.bugs.some((b) => b.cell === c))!
    expect(huntReducer(s, { type: 'hit', cell: empty, now: 1000 }).score).toBe(s.score)
    for (let t = 1050; t < ROUND_MS; t += 50) {
      s = huntReducer(s, { type: 'tick', now: t, random: rnd })
      expect(s.bugs.length).toBeLessThanOrEqual(maxBugsAt(t / ROUND_MS))
    }
  })
  it('ends after 30 seconds and counts escaped bugs', () => {
    const s = run(ROUND_MS + 50)
    expect(s.phase).toBe('over')
    expect(s.escaped).toBeGreaterThan(0)
    expect(timeLeft(s)).toBe(0)
    expect(huntReducer(s, { type: 'hit', cell: 0, now: ROUND_MS + 100 })).toBe(s)
  })
})

describe('neon typer', () => {
  it('opens longer commands as the level rises', () => {
    expect(poolFor(0)).toHaveLength(6)
    expect(poolFor(50)).toHaveLength(COMMANDS.length)
  })
  it('never repeats the previous command', () => {
    for (let i = 0; i < 30; i++) expect(pickCommand(0, 'ls')).not.toBe('ls')
  })
  it('gives longer commands more time, and tightens with level (to a floor)', () => {
    expect(fuseFor('docker compose up -d', 0)).toBeGreaterThan(fuseFor('ls', 0))
    expect(fuseFor('git push', 5)).toBeLessThan(fuseFor('git push', 0))
    expect(fuseFor('git push', 100)).toBe(fuseFor('git push', 1000))
  })
  it('checks typed text character by character', () => {
    expect(checkTyped('git push', 'git p')).toEqual({ correct: 5, error: false, done: false })
    expect(checkTyped('git push', 'git x')).toEqual({ correct: 4, error: true, done: false })
    expect(checkTyped('git push', 'git push')).toEqual({ correct: 8, error: false, done: true })
  })
})
