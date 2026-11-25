import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'
import s from './terminal.module.css'

/** A cyberpunk terminal window (Direction J): title bar + scanlined body. */
export function TerminalWindow({
  title,
  accent = 'cyan',
  children,
  className,
  as: Tag = 'section',
  labelledBy,
}: {
  title: string
  accent?: 'cyan' | 'magenta' | 'yellow'
  children: ReactNode
  className?: string
  as?: 'section' | 'div' | 'article'
  labelledBy?: string
}) {
  return (
    <Tag className={cx(s.window, s[accent], className)} aria-labelledby={labelledBy}>
      <p className={s.bar} aria-hidden={labelledBy ? true : undefined}>
        <span className={s.dot} />
        <span className={s.dot} />
        <span className={s.dot} />
        <span className={s.title}>{title}</span>
      </p>
      <div className={cx(s.body, 'scanlines')}>{children}</div>
    </Tag>
  )
}
