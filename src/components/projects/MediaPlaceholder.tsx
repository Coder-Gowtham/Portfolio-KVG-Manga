import type { MediaItem } from '../../types/content'
import { cx } from '../../utils/cx'
import s from './projects.module.css'

/**
 * Shown wherever a screenshot is not yet available or approved.
 * Clearly labelled so it is never mistaken for a real screenshot.
 */
export function MediaPlaceholder({
  item,
  title,
  className,
}: {
  item?: MediaItem
  title: string
  className?: string
}) {
  const device = item?.device ?? 'desktop'
  return (
    <figure className={cx(s.placeholder, device === 'mobile' && s.placeholderMobile, className)}>
      <div className={s.placeholderChrome} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <figcaption className={s.placeholderLabel}>
        <span className={s.placeholderTag}>{device === 'mobile' ? 'MOBILE' : 'DESKTOP'}</span>
        Screenshot pending
        <span className={s.placeholderSub}>{title}</span>
      </figcaption>
    </figure>
  )
}
