import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { cx } from '../../utils/cx'
import { readJSON, writeJSON } from '../../utils/storage'
import { LIVES, checkTyped, fuseFor, pickCommand, typerVerdict } from './typer'
import s from './games.module.css'

const BEST_KEY = 'typer-best'
const TICK_MS = 50

interface Round {
  command: string
  startedAt: number
  fuse: number
}

/** Type the command before its fuse burns out. Three lives. */
export function NeonTyper() {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'over'>('ready')
  const [round, setRound] = useState<Round | null>(null)
  const [typed, setTyped] = useState('')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(LIVES)
  const [now, setNow] = useState(0)
  const [best, setBest] = useState<number | null>(() => readJSON<number | null>(BEST_KEY, null))
  const [newBest, setNewBest] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const startBtn = useRef<HTMLButtonElement>(null)

  const nextRound = (level: number, previous: string | null) => {
    const command = pickCommand(level, previous)
    const t = performance.now()
    setRound({ command, startedAt: t, fuse: fuseFor(command, level) })
    setTyped('')
    setNow(t)
  }

  const start = () => {
    setScore(0)
    setLives(LIVES)
    setNewBest(false)
    setPhase('playing')
    nextRound(0, null)
    requestAnimationFrame(() => input.current?.focus())
  }

  const end = (finalScore: number) => {
    setPhase('over')
    if (best === null || finalScore > best) {
      setBest(finalScore)
      setNewBest(true)
      writeJSON(BEST_KEY, finalScore)
    }
    requestAnimationFrame(() => startBtn.current?.focus())
  }

  // Clock: burn the fuse; when it runs out, lose a life.
  useEffect(() => {
    if (phase !== 'playing' || !round) return
    const id = setInterval(() => {
      const t = performance.now()
      setNow(t)
      if (t - round.startedAt >= round.fuse) {
        const remaining = lives - 1
        setLives(remaining)
        if (remaining <= 0) end(score)
        else nextRound(score, round.command)
      }
    }, TICK_MS)
    return () => clearInterval(id)
    // Restart the clock for each new round.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round])

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (phase !== 'playing' || !round) return
    const value = e.target.value
    setTyped(value)
    if (checkTyped(round.command, value).done) {
      const next = score + 1
      setScore(next)
      nextRound(next, round.command)
    }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault()
  }

  const check = round ? checkTyped(round.command, typed) : { correct: 0, error: false, done: false }
  const remaining = round ? Math.max(0, round.fuse - (now - round.startedAt)) : 0
  const ratio = round ? remaining / round.fuse : 1

  return (
    <div className={s.typer}>
      <div className={s.huntBar}>
        <p className={s.counter}>
          Cleared <strong>{score}</strong>
        </p>
        <p className={s.counter}>
          Lives{' '}
          <strong aria-hidden="true" className={s.lives}>
            {'■'.repeat(lives)}
            <span className={s.lifeLost}>{'□'.repeat(LIVES - lives)}</span>
          </strong>
          <span className="sr-only">{lives} of {LIVES}</span>
        </p>
        <p className={s.counter}>
          Best <strong>{best ?? '–'}</strong>
        </p>
      </div>

      <div className={s.screen}>
        {phase === 'playing' && round ? (
          <>
            <p className={s.target} aria-label={`Type: ${round.command}`}>
              <span className={s.promptSign} aria-hidden="true">
                $
              </span>
              <span aria-hidden="true">
                {[...round.command].map((ch, i) => (
                  <span
                    key={i}
                    className={cx(
                      i < check.correct && s.chOk,
                      i === check.correct && (check.error ? s.chBad : s.chNext),
                    )}
                  >
                    {ch === ' ' ? ' ' : ch}
                  </span>
                ))}
              </span>
            </p>
            <div className={s.fuse} aria-hidden="true">
              <span className={cx(s.fuseFill, ratio < 0.3 && s.fuseLow)} style={{ transform: `scaleX(${ratio})` }} />
            </div>
            <p className={s.fuseText} aria-hidden="true">
              {(remaining / 1000).toFixed(1)}s
            </p>
          </>
        ) : (
          <p className={s.target}>
            <span className={s.promptSign} aria-hidden="true">
              $
            </span>
            {phase === 'over' ? 'session terminated' : 'ready_'}
          </p>
        )}
      </div>

      <label className={s.typeLabel} htmlFor="typer-input">
        Your command
      </label>
      <input
        id="typer-input"
        ref={input}
        className={cx(s.typeInput, check.error && s.typeError)}
        value={typed}
        onChange={onChange}
        onKeyDown={onKeyDown}
        disabled={phase !== 'playing'}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="done"
        aria-invalid={check.error || undefined}
      />

      <div role="status" aria-live="polite" className={s.huntStatus}>
        {phase === 'ready' && <p>Type each command exactly before its fuse burns out. Three lives. Commands get longer as you go.</p>}
        {phase === 'over' && (
          <p className={s.result}>
            <span>
              <strong>{score} commands</strong>
              {newBest && <span className={s.badge}>New best</span>}
              <br />
              {typerVerdict(score)}
            </span>
          </p>
        )}
      </div>

      {phase !== 'playing' && (
        <button ref={startBtn} type="button" className={s.goBtn} onClick={start}>
          {phase === 'over' ? 'Run it again' : 'Start typing'}
        </button>
      )}
    </div>
  )
}
