import s from './backdrop.module.css'

const RETICLES = [
  { top: '22%', left: '6%' },
  { top: '48%', left: '90%' },
  { top: '78%', left: '12%' },
]

/** Mission-control backdrop for the Works page: hex grid, radar sweep, scan line, target reticles. */
export function WorksBackdrop() {
  return (
    <div className={s.backdrop} aria-hidden="true">
      <div className={s.hex} />
      <div className={s.radar}>
        <span className={s.sweep} />
        <span className={s.blip} style={{ top: '30%', left: '62%' }} />
        <span className={s.blip} style={{ top: '64%', left: '36%', animationDelay: '-2.1s' }} />
      </div>
      <span className={s.scan} />
      {RETICLES.map((r, i) => (
        <svg key={i} className={s.reticle} style={{ ...r, animationDelay: `${i * -1.3}s` }} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" />
          <path d="M20 2v10M20 28v10M2 20h10M28 20h10" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      ))}
    </div>
  )
}
