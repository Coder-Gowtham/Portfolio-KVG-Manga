import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { cx } from '../../utils/cx'
import { readJSON, writeJSON } from '../../utils/storage'
import { drawDelay, isNewBest, rankFor, type DrawPhase } from './reaction'
import s from './games.module.css'

const BEST_KEY = 'quickdraw-best'

const LABEL: Record<DrawPhase, string> = {
  ready: 'Tap to start',
  waiting: 'Wait for it…',
  draw: 'DRAW!',
  result: 'Tap to go again',
  foul: 'Too early! Tap to retry',
}

/** Reaction-time duel with the Breakpoint blaster. One big target for touch, mouse and keyboard. */
export function QuickDraw() {
  const [phase, setPhase] = useState<DrawPhase>('ready')
  const [time, setTime] = useState<number | null>(null)
  const [best, setBest] = useState<number | null>(() => readJSON<number | null>(BEST_KEY, null))
  const [newBest, setNewBest] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const shownAt = useRef(0)

  useEffect(() => () => clearTimeout(timer.current), [])

  const start = () => {
    setPhase('waiting')
    setTime(null)
    setNewBest(false)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      shownAt.current = performance.now()
      setPhase('draw')
    }, drawDelay())
  }

  const act = () => {
    if (phase === 'waiting') {
      clearTimeout(timer.current)
      setPhase('foul')
      return
    }
    if (phase === 'draw') {
      const ms = Math.round(performance.now() - shownAt.current)
      setTime(ms)
      setPhase('result')
      if (isNewBest(ms, best)) {
        setBest(ms)
        setNewBest(true)
        writeJSON(BEST_KEY, ms)
      }
      return
    }
    start()
  }

  // Pointer-down fires on touch, which is faster than click. Keyboard and
  // assistive tech produce a click with detail 0, so those are handled there.
  const onClick = (e: MouseEvent) => {
    if (e.detail === 0) act()
  }

  const rank = time !== null ? rankFor(time) : null

  return (
    <div className={s.draw}>
      <button
        type="button"
        className={cx(s.arena, s[`arena-${phase}`])}
        onPointerDown={(e) => {
          if (!(e.button > 0)) act()
        }}
        onClick={onClick}
        aria-describedby="draw-help"
      >
        <span className={s.arenaLabel}>{LABEL[phase]}</span>
        {phase === 'draw' && (
          <span className={s.arenaSfx} aria-hidden="true">
            バン
          </span>
        )}
      </button>
      <p id="draw-help" className={s.help}>
        Start, wait for <strong>DRAW!</strong>, then tap the panel (or press Enter) as fast as you can. Firing early is a foul.
      </p>

      <div className={s.scoreRow} role="status" aria-live="polite">
        {phase === 'foul' && <p className={s.foul}>Foul. The bug saw you coming.</p>}
        {phase === 'draw' && <p className="sr-only">Draw!</p>}
        {phase === 'result' && time !== null && rank && (
          <p className={s.result}>
            <span className={s.rank} aria-hidden="true">
              {rank.rank}
            </span>
            <span>
              <strong>{time} ms</strong>
              <span className="sr-only">, rank {rank.rank}</span>
              {newBest && <span className={s.badge}>New best</span>}
              <br />
              {rank.line}
            </span>
          </p>
        )}
      </div>
      <p className={s.best}>
        Best: <strong>{best !== null ? `${best} ms` : 'no record yet'}</strong> <span className={s.muted}>(saved on this device)</span>
      </p>
    </div>
  )
}
