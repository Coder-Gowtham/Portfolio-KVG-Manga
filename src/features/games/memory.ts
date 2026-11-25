/** Memory match: pure game state, so the rules are tested without the UI. */
export const PAIRS = [
  { id: 'katana', label: 'Katana' },
  { id: 'kunai', label: 'Kunai' },
  { id: 'shuriken', label: 'Shuriken' },
  { id: 'blaster', label: 'Blaster' },
  { id: 'drone', label: 'Drone' },
  { id: 'bug', label: 'Bug' },
  { id: 'react', label: 'React' },
  { id: 'node', label: 'Node.js' },
] as const

export type SymbolId = (typeof PAIRS)[number]['id']

export interface Card {
  key: number
  symbol: SymbolId
}

export interface MemoryState {
  deck: Card[]
  /** Indexes face up and not yet resolved (0–2). */
  open: number[]
  matched: SymbolId[]
  moves: number
}

export type MemoryAction = { type: 'flip'; index: number } | { type: 'hide' } | { type: 'reset'; deck: Card[] }

/** Fisher–Yates over two copies of every symbol. */
export function makeDeck(random: () => number = Math.random): Card[] {
  const symbols = PAIRS.flatMap((p) => [p.id, p.id])
  for (let i = symbols.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[symbols[i], symbols[j]] = [symbols[j]!, symbols[i]!]
  }
  return symbols.map((symbol, key) => ({ key, symbol }))
}

export const initialMemory = (deck: Card[]): MemoryState => ({ deck, open: [], matched: [], moves: 0 })

export function memoryReducer(state: MemoryState, action: MemoryAction): MemoryState {
  switch (action.type) {
    case 'reset':
      return initialMemory(action.deck)
    case 'hide':
      return { ...state, open: [] }
    case 'flip': {
      const card = state.deck[action.index]
      if (!card || state.open.length >= 2 || state.open.includes(action.index) || state.matched.includes(card.symbol)) {
        return state
      }
      const open = [...state.open, action.index]
      if (open.length < 2) return { ...state, open }
      const first = state.deck[open[0]!]!
      const moves = state.moves + 1
      if (first.symbol === card.symbol) {
        return { ...state, open: [], matched: [...state.matched, card.symbol], moves }
      }
      return { ...state, open, moves }
    }
  }
}

export const isMismatch = (s: MemoryState) => s.open.length === 2
export const isWon = (s: MemoryState) => s.matched.length === PAIRS.length
export const labelFor = (id: SymbolId) => PAIRS.find((p) => p.id === id)!.label
