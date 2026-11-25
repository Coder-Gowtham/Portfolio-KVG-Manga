import type { ElementType, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import s from './manga.module.css'

/* ---------- ChapterHeading ---------- */
export interface ChapterHeadingProps {
  /** e.g. "CH.01" or "OMAKE" */
  number: string
  title: string
  kicker?: string
  lede?: ReactNode
  level?: 1 | 2 | 3
  glitch?: boolean
  id?: string
}

export function ChapterHeading({ number, title, kicker, lede, level = 1, glitch = false, id }: ChapterHeadingProps) {
  const Heading = `h${level}` as 'h1' | 'h2' | 'h3'
  return (
    <header className={s.chapter} data-reveal-item>
      <p className={s.kicker}>
        <span className={s.kickerTag}>{number}</span>
        {kicker && <span>{kicker}</span>}
      </p>
      <Heading id={id} className={cx(s.chapterTitle, glitch && s.chapterTitleGlitch)}>
        {title}
      </Heading>
      {lede && <p className={s.chapterLede}>{lede}</p>}
    </header>
  )
}

/* ---------- MangaPanel ---------- */
export interface MangaPanelProps {
  children: ReactNode
  surface?: 'paper' | 'night'
  slant?: 'none' | 'left' | 'right'
  tone?: boolean
  neon?: boolean
  as?: ElementType
  className?: string
  'aria-labelledby'?: string
}

export function MangaPanel({
  children,
  surface = 'paper',
  slant = 'none',
  tone = false,
  neon = false,
  as: Tag = 'section',
  className,
  ...rest
}: MangaPanelProps) {
  return (
    <Tag className={cx(s.frame, neon && s.frameNeon, className)} data-reveal-item {...rest}>
      <div
        className={cx(
          s.outer,
          surface === 'paper' ? s.panelPaper : s.panelNight,
          slant === 'right' && s.slantRight,
          slant === 'left' && s.slantLeft,
          tone && s.panelTone,
        )}
      >
        <div className={cx(s.inner, surface === 'paper' && 'on-paper')}>{children}</div>
      </div>
    </Tag>
  )
}

/* ---------- SpeechBubble ---------- */
export function SpeechBubble({
  children,
  tail = 'left',
  shape = 'oval',
  className,
}: {
  children: ReactNode
  tail?: 'left' | 'right'
  shape?: 'oval' | 'box'
  className?: string
}) {
  return (
    <p className={cx(s.bubble, shape === 'box' && s.bubbleBox, tail === 'left' ? s.tailLeft : s.tailRight, className)}>
      {children}
    </p>
  )
}

/* ---------- NarrationBox ---------- */
export function NarrationBox({ children, surface = 'paper' }: { children: ReactNode; surface?: 'paper' | 'night' }) {
  return <div className={cx(s.narration, surface === 'night' && s.narrationNight)}>{children}</div>
}

/* ---------- Sfx (always decorative) ---------- */
export function Sfx({ text, size = '2.5rem', className }: { text: string; size?: string; className?: string }) {
  return (
    <span className={cx(s.sfx, className)} style={{ fontSize: size }} aria-hidden="true">
      {text}
    </span>
  )
}

/* ---------- Stamp ---------- */
const STAMP_LABEL: Record<string, string> = {
  'in-development': 'In development',
  shipped: 'Shipped',
  maintained: 'Maintained',
  archived: 'Archived',
  placeholder: 'Coming soon',
  done: 'Done',
  testing: 'Testing',
  'partly-done': 'Partly done',
  planned: 'Planned',
  training: 'In training',
  'draft-ready': 'Draft ready',
}

export function Stamp({ status }: { status: keyof typeof STAMP_LABEL | string }) {
  return <span className={cx(s.stamp, s[`stamp-${status}`])}>{STAMP_LABEL[status] ?? status}</span>
}

/* ---------- NeedsInput: dev-only reminder, stripped from production ---------- */
export function NeedsInput({ items }: { items?: string[] }) {
  if (!import.meta.env.DEV || !items?.length) return null
  return (
    <aside className={s.needsInput} aria-label="Content awaiting input (development only)">
      <strong>NEEDS INPUT (dev only)</strong>
      <ul>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </aside>
  )
}
