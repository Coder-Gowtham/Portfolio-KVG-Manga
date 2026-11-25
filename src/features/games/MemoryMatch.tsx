import { useEffect, useReducer, useRef, useState, type KeyboardEvent } from 'react'
import { cx } from '../../utils/cx'
import { readJSON, writeJSON } from '../../utils/storage'
import { PAIRS, initialMemory, isMismatch, isWon, labelFor, makeDeck, memoryReducer } from './memory'
import { CardSymbol } from './symbols'
import s from './games.module.css'

const BEST_KEY = 'memory-best'
const COLS = 4
const HIDE_AFTER = 800

/** 4×4 memory match. Roving focus: one tab stop, arrow keys move between cards. */
export function MemoryMatch() {
  const [state, dispatch] = useReducer(memoryReducer, undefined, () => initialMemory(makeDeck()))
  const [best, setBest] = useState<number | null>(() => readJSON<number | null>(BEST_KEY, null))
  const [focusIndex, setFocusIndex] = useState(0)
  const cards = useRef<(HTMLButtonElement | null)[]>([])
  const won = isWon(state)

  useEffect(() => {
    if (!isMismatch(state)) return
    const t = setTimeout(() => dispatch({ type: 'hide' }), HIDE_AFTER)
    return () => clearTimeout(t)
  }, [state])

  useEffect(() => {
    if (won && (best === null || state.moves < best)) {
      setBest(state.moves)
      writeJSON(BEST_KEY, state.moves)
    }
  }, [won, state.moves, best])

  const move = (to: number) => {
    const i = (to + state.deck.length) % state.deck.length
    setFocusIndex(i)
    cards.current[i]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const delta: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: COLS, ArrowUp: -COLS }
    if (e.key in delta) {
      e.preventDefault()
      move(i + delta[e.key]!)
    } else if (e.key === 'Home') {
      e.preventDefault()
      move(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      move(state.deck.length - 1)
    }
  }

  const restart = () => {
    dispatch({ type: 'reset', deck: makeDeck() })
    setFocusIndex(0)
  }

  const lastOpen = state.open.at(-1)
  const announce = won
    ? `All ${PAIRS.length} pairs found in ${state.moves} moves.`
    : isMismatch(state)
      ? `No match: ${state.open.map((i) => labelFor(state.deck[i]!.symbol)).join(' and ')}.`
      : lastOpen !== undefined
        ? `${labelFor(state.deck[lastOpen]!.symbol)} revealed.`
        : ''

  return (
    <div className={s.memory}>
      <div className={s.memoryBar}>
        <p className={s.counter}>
          Moves <strong>{state.moves}</strong>
        </p>
        <p className={s.counter}>
          Pairs <strong>{state.matched.length}</strong>/{PAIRS.length}
        </p>
        <p className={s.counter}>
          Best <strong>{best ?? '–'}</strong>
        </p>
        <button type="button" className={s.smallBtn} onClick={restart}>
          New game
        </button>
      </div>

      <div className={s.board} role="group" aria-label="Memory cards, 4 by 4. Use arrow keys to move.">
        {state.deck.map((card, i) => {
          const matched = state.matched.includes(card.symbol)
          const faceUp = matched || state.open.includes(i)
          return (
            <button
              key={card.key}
              ref={(el) => {
                cards.current[i] = el
              }}
              type="button"
              className={cx(s.card, faceUp && s.cardUp, matched && s.cardMatched)}
              tabIndex={i === focusIndex ? 0 : -1}
              aria-label={`Card ${i + 1}: ${faceUp ? labelFor(card.symbol) : 'hidden'}${matched ? ', matched' : ''}`}
              aria-disabled={matched || undefined}
              onFocus={() => setFocusIndex(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              onClick={() => dispatch({ type: 'flip', index: i })}
            >
              <span className={s.cardInner} aria-hidden="true">
                <span className={s.cardBack}>KVG</span>
                <span className={s.cardFace}>
                  <CardSymbol id={card.symbol} />
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
      {won && (
        <p className={s.win}>
          <span className={s.badge}>Cleared</span> {state.moves} moves.{' '}
          {state.moves <= PAIRS.length + 4 ? 'Photographic memory. Suspicious.' : 'Every pair found. Bugs fear you.'}
        </p>
      )}
    </div>
  )
}
