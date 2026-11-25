import { useEffect, useReducer, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { cx } from '../../utils/cx'
import { readJSON, writeJSON } from '../../utils/storage'
import { GRID, ROUND_MS, huntReducer, huntVerdict, initialHunt, timeLeft } from './hunt'
import s from './games.module.css'

const BEST_KEY = 'bughunt-best'
const TICK_MS = 50

function BugSprite({ golden }: { golden: boolean }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" className={s.bugSprite}>
      <g stroke="#0A0A0F" strokeWidth="2" strokeLinecap="round">
        <path d="M8 18 L15 22 M8 30 L15 29 M10 40 L16 35 M40 18 L33 22 M40 30 L33 29 M38 40 L32 35 M19 9 L21 14 M29 9 L27 14" />
        <ellipse cx="24" cy="28" rx="10" ry="13" fill={golden ? '#F5E500' : '#FF2A6D'} />
        <circle cx="24" cy="15" r="6" fill="#0A0A0F" />
        <path d="M24 17 V40" />
      </g>
      <circle cx="21.5" cy="14" r="1.6" fill="#00E5FF" />
      <circle cx="26.5" cy="14" r="1.6" fill="#00E5FF" />
    </svg>
  )
}

/** Whack-a-bug against the deploy timer. Touch, mouse, Tab + Enter, or number keys 1–9. */
export function BugHunt() {
  const [state, dispatch] = useReducer(huntReducer, initialHunt)
  const [best, setBest] = useState<number | null>(() => readJSON<number | null>(BEST_KEY, null))
  const [newBest, setNewBest] = useState(false)
  const startBtn = useRef<HTMLButtonElement>(null)
  const playing = state.phase === 'playing'

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => dispatch({ type: 'tick', now: performance.now(), random: Math.random }), TICK_MS)
    return () => clearInterval(id)
  }, [playing])

  useEffect(() => {
    if (state.phase !== 'over') return
    if (best === null || state.score > best) {
      setBest(state.score)
      setNewBest(true)
      writeJSON(BEST_KEY, state.score)
    }
    startBtn.current?.focus()
    // Only when a round ends.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase])

  const start = () => {
    setNewBest(false)
    dispatch({ type: 'start', now: performance.now() })
  }

  const hit = (cell: number) => dispatch({ type: 'hit', cell, now: performance.now() })

  const onKeyDown = (e: KeyboardEvent) => {
    if (!playing || !/^[1-9]$/.test(e.key)) return
    e.preventDefault()
    hit(Number(e.key) - 1)
  }

  const left = timeLeft(state)
  const seconds = Math.ceil(left / 1000)

  return (
    <div className={s.hunt} onKeyDown={onKeyDown}>
      <div className={s.huntBar}>
        <p className={s.counter}>
          Score <strong>{state.score}</strong>
        </p>
        <p className={s.counter}>
          Deploy in <strong>{seconds}s</strong>
        </p>
        <p className={s.counter}>
          Best <strong>{best ?? '–'}</strong>
        </p>
      </div>
      <div className={s.deploy} aria-hidden="true">
        <span className={s.deployFill} style={{ transform: `scaleX(${left / ROUND_MS})` }} />
      </div>

      <div className={s.servers} role="group" aria-label="Servers, 3 by 3. Number keys 1 to 9 squash a bug.">
        {Array.from({ length: GRID }, (_, cell) => {
          const bug = state.bugs.find((b) => b.cell === cell)
          const flash = state.last?.cell === cell ? state.last.result : null
          return (
            <button
              key={cell}
              type="button"
              className={cx(s.server, bug && s.serverBug, flash === 'hit' && s.serverHit)}
              disabled={!playing}
              aria-label={`Server ${cell + 1}${bug ? (bug.kind === 'golden' ? ': golden bug!' : ': bug!') : ''}`}
              onPointerDown={(e) => {
                if (!(e.button > 0)) hit(cell)
              }}
              onClick={(e: MouseEvent) => {
                if (e.detail === 0) hit(cell)
              }}
            >
              <span className={s.serverNum} aria-hidden="true">
                {cell + 1}
              </span>
              {bug && (
                <span key={bug.id} className={s.bugPop}>
                  <BugSprite golden={bug.kind === 'golden'} />
                </span>
              )}
              {flash === 'hit' && !bug && (
                <span className={s.splat} aria-hidden="true" key={`${state.squashed}`}>
                  SPLAT
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div role="status" aria-live="polite" className={s.huntStatus}>
        {state.phase === 'ready' && <p>Bugs are leaking into production. Squash as many as you can before the deploy.</p>}
        {playing && <p className="sr-only">Round started. 30 seconds.</p>}
        {state.phase === 'over' && (
          <p className={s.result}>
            <span>
              <strong>{state.score} points</strong>
              {newBest && <span className={s.badge}>New best</span>}
              <br />
              {state.squashed} squashed · {state.escaped} escaped. {huntVerdict(state.score)}
            </span>
          </p>
        )}
      </div>

      {!playing && (
        <button ref={startBtn} type="button" className={s.goBtn} onClick={start}>
          {state.phase === 'over' ? 'Hunt again' : 'Start the hunt'}
        </button>
      )}
      <p className={s.help}>
        Golden bugs are worth 3. Missed taps cost nothing, but escaped bugs ship to prod.
      </p>
    </div>
  )
}
