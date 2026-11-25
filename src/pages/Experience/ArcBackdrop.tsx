import s from './backdrop.module.css'

/* Deterministic window grid for the skyline (no randomness between renders). */
const BUILDINGS = [
  { x: 0, w: 70, h: 120 },
  { x: 74, w: 46, h: 190 },
  { x: 124, w: 88, h: 140 },
  { x: 216, w: 40, h: 230 },
  { x: 260, w: 96, h: 160 },
  { x: 360, w: 54, h: 260 },
  { x: 418, w: 80, h: 150 },
  { x: 502, w: 44, h: 210 },
  { x: 550, w: 110, h: 130 },
  { x: 664, w: 50, h: 280 },
  { x: 718, w: 86, h: 170 },
  { x: 808, w: 42, h: 220 },
  { x: 854, w: 100, h: 145 },
  { x: 958, w: 58, h: 245 },
  { x: 1020, w: 90, h: 165 },
  { x: 1114, w: 46, h: 205 },
  { x: 1164, w: 116, h: 135 },
]
const H = 300

const windows = BUILDINGS.flatMap((b, bi) =>
  Array.from({ length: Math.floor(b.h / 26) }, (_, row) =>
    Array.from({ length: Math.max(1, Math.floor(b.w / 18)) }, (_, col) => ({
      x: b.x + 8 + col * 18,
      y: H - b.h + 14 + row * 26,
      on: (bi * 7 + row * 3 + col * 5) % 9 < 2,
      blink: (bi + row + col) % 13 === 0,
    })),
  ).flat(),
).filter((w) => w.on)

const STREAKS = [8, 23, 37, 61, 74, 88]

/** Night-city backdrop for the Career Arc. Decorative only. */
export function ArcBackdrop() {
  return (
    <div className={s.backdrop} aria-hidden="true">
      <div className={s.glow} />
      <div className={s.tone} />
      {STREAKS.map((left, i) => (
        <span key={left} className={s.streak} style={{ left: `${left}%`, animationDelay: `${i * -2.3}s`, animationDuration: `${9 + (i % 3) * 3}s` }} />
      ))}
      <svg className={s.skyline} viewBox={`0 0 1280 ${H}`} preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="arc-sky-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#14141C" />
            <stop offset="1" stopColor="#0A0A0F" />
          </linearGradient>
        </defs>
        {BUILDINGS.map((b) => (
          <rect key={b.x} x={b.x} y={H - b.h} width={b.w} height={b.h} fill="url(#arc-sky-fade)" stroke="rgb(0 229 255 / 0.25)" strokeWidth="1" />
        ))}
        {windows.map((w) => (
          <rect key={`${w.x}-${w.y}`} x={w.x} y={w.y} width="7" height="9" className={w.blink ? s.blink : s.win} />
        ))}
        <line x1="0" y1={H - 1} x2="1280" y2={H - 1} stroke="#FF2A6D" strokeWidth="2" />
      </svg>
    </div>
  )
}
