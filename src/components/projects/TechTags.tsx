import { cx } from '../../utils/cx'
import s from './tags.module.css'

/** Mono technology tags. `tone` matches the surface they sit on. */
export function TechTags({
  items,
  label,
  max,
  tone = 'night',
  className,
}: {
  items: string[]
  label: string
  max?: number
  tone?: 'night' | 'paper'
  className?: string
}) {
  if (!items.length) return null
  const shown = max ? items.slice(0, max) : items
  const rest = items.length - shown.length
  return (
    <ul className={cx(s.tags, tone === 'paper' && s.paper, className)} aria-label={label}>
      {shown.map((t) => (
        <li key={t}>{t}</li>
      ))}
      {rest > 0 && (
        <li className={s.more}>
          +{rest}
          <span className="sr-only"> more</span>
        </li>
      )}
    </ul>
  )
}
