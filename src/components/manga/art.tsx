import { useId, useMemo, type ReactNode } from 'react'
import { seeded } from '../../utils/random'
import { cx } from '../../utils/cx'
import s from './art.module.css'

/* ---------- SpeedLines: radial manga focus lines, deterministic ---------- */
export function SpeedLines({
  cx: centerX = 50,
  cy: centerY = 45,
  count = 64,
  inner = 26,
  color = 'var(--ink)',
  seed = 7,
  className,
}: {
  /** Focus point in % of the box. */
  cx?: number
  cy?: number
  count?: number
  /** Clear radius around the focus point, in viewBox units (box is 200 wide). */
  inner?: number
  color?: string
  seed?: number
  className?: string
}) {
  const polys = useMemo(() => {
    const rnd = seeded(seed)
    const X = centerX * 2
    const Y = centerY * 2
    const R = 400
    const out: string[] = []
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + (rnd() - 0.5) * 0.05
      const w = 0.01 + rnd() * 0.028
      const r = inner + rnd() * 26
      const p = [
        [X + r * Math.cos(a), Y + r * Math.sin(a)],
        [X + R * Math.cos(a - w), Y + R * Math.sin(a - w)],
        [X + R * Math.cos(a + w), Y + R * Math.sin(a + w)],
      ]
      out.push(p.map(([x, y]) => `${x!.toFixed(1)},${y!.toFixed(1)}`).join(' '))
    }
    return out
  }, [centerX, centerY, count, inner, seed])

  return (
    <svg className={cx(s.fill, className)} viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <g fill={color}>
        {polys.map((pts) => (
          <polygon key={pts} points={pts} />
        ))}
      </g>
    </svg>
  )
}

/* ---------- NeonSun: synthwave sun with stripe cut-outs ---------- */
export function NeonSun({ className }: { className?: string }) {
  const maskId = useId()
  const stripes = [0, 1, 2, 3, 4, 5]
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <defs>
        <mask id={maskId}>
          <rect width="200" height="200" fill="#fff" />
          {stripes.map((i) => (
            <rect key={i} x="0" y={108 + i * 15} width="200" height={3 + i * 1.6} fill="#000" />
          ))}
        </mask>
      </defs>
      <circle cx="100" cy="100" r="96" fill="var(--neon-magenta)" mask={`url(#${maskId})`} />
    </svg>
  )
}

/* ---------- Burst: jagged starburst badge ---------- */
export function Burst({
  children,
  points = 14,
  className,
  color = 'var(--neon-yellow)',
}: {
  children: ReactNode
  points?: number
  className?: string
  color?: string
}) {
  const poly = useMemo(() => {
    const pts: string[] = []
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 ? 36 : 50
      const t = (i * Math.PI) / points - Math.PI / 2
      pts.push(`${(50 + r * Math.cos(t)).toFixed(1)},${(50 + r * Math.sin(t)).toFixed(1)}`)
    }
    return pts.join(' ')
  }, [points])
  return (
    <span className={cx(s.burst, className)}>
      <svg className={s.fill} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <polygon points={poly} fill={color} stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <span className={s.burstInner}>{children}</span>
    </span>
  )
}
