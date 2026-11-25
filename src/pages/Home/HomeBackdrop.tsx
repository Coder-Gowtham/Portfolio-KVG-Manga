import type { CSSProperties } from 'react'
import s from './backdrop.module.css'

/* Deterministic "random" so the rain is identical on every render. */
const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン01{}<>=/;KVG'
const glyphRun = (seed: number, length: number) =>
  Array.from({ length }, (_, i) => GLYPHS[(seed * 31 + i * 17 + ((seed + i) * (i + 3)) % 11) % GLYPHS.length]).join('\n')

/* Columns spread across the width; they show in the gaps between sections and cards. */
const COLUMNS = Array.from({ length: 16 }, (_, i) => 3 + i * 6.2).map((x, i) => ({
  x,
  text: glyphRun(i + 1, 28),
  duration: 9 + ((i * 7) % 8),
  delay: -((i * 3.7) % 9),
  bright: i % 3 === 0,
}))

/** Home backdrop: drifting neon aurora, faint data rain and a light screentone. Decorative. */
export function HomeBackdrop() {
  return (
    <div className={s.backdrop} aria-hidden="true">
      <span className={`${s.blob} ${s.blobA}`} />
      <span className={`${s.blob} ${s.blobB}`} />
      <span className={`${s.blob} ${s.blobC}`} />
      <div className={s.tone} />
      <div className={s.rain}>
        {COLUMNS.map((c) => (
          <span
            key={c.x}
            className={c.bright ? `${s.column} ${s.bright}` : s.column}
            style={{ left: `${c.x}%`, animationDuration: `${c.duration}s`, animationDelay: `${c.delay}s` } as CSSProperties}
          >
            {c.text}
          </span>
        ))}
      </div>
    </div>
  )
}
