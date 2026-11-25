import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import type { MediaItem } from '../../types/content'
import { cx } from '../../utils/cx'
import { IconClose } from '../ui/icons'
import { MediaPlaceholder } from './MediaPlaceholder'
import s from './gallery.module.css'

type Device = 'desktop' | 'mobile'

const isReal = (m: MediaItem) => Boolean(m.src && m.approvedForPublic)

/**
 * Screenshot gallery with a desktop/mobile toggle and a lightbox built on the
 * native <dialog> (focus trap + Esc for free). Unapproved or missing media
 * render as labelled placeholders and are never clickable.
 */
export function ScreenshotGallery({ media, title }: { media: MediaItem[]; title: string }) {
  const devices = [...new Set(media.map((m) => m.device ?? 'desktop'))] as Device[]
  const [device, setDevice] = useState<Device | 'all'>(devices.length > 1 ? 'all' : (devices[0] ?? 'desktop'))
  const shown = device === 'all' ? media : media.filter((m) => (m.device ?? 'desktop') === device)
  const real = shown.filter(isReal)
  const [open, setOpen] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (open !== null && !d.open) d.showModal()
    if (open === null && d.open) d.close()
  }, [open])

  const close = () => {
    setOpen(null)
    openerRef.current?.focus()
  }
  const step = (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + real.length) % real.length))
  const onKey = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowRight') step(1)
    if (e.key === 'ArrowLeft') step(-1)
  }
  const current = open !== null ? real[open] : undefined

  return (
    <div className={s.gallery}>
      {devices.length > 1 && (
        <div className={s.toggle} role="group" aria-label="Screenshot device">
          {(['all', ...devices] as const).map((d) => (
            <button key={d} type="button" aria-pressed={device === d} onClick={() => setDevice(d)}>
              {d === 'all' ? 'All' : d === 'desktop' ? 'Desktop' : 'Mobile'}
            </button>
          ))}
        </div>
      )}

      <ul className={s.grid}>
        {shown.map((m, i) => (
          <li key={`${m.alt}-${i}`} className={cx(s.item, m.device === 'mobile' && s.mobile)}>
            {isReal(m) ? (
              m.kind === 'video' ? (
                <figure className={s.figure}>
                  <video className={s.video} src={m.src} controls preload="none" aria-label={m.alt} />
                  {m.caption && <figcaption>{m.caption}</figcaption>}
                </figure>
              ) : (
                <figure className={s.figure}>
                  <button
                    type="button"
                    className={s.thumb}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      openerRef.current = e.currentTarget
                      setOpen(real.indexOf(m))
                    }}
                    aria-label={`Open screenshot: ${m.alt}`}
                  >
                    <img src={m.src} alt="" width={m.width} height={m.height} loading="lazy" decoding="async" />
                  </button>
                  {m.caption && <figcaption>{m.caption}</figcaption>}
                </figure>
              )
            ) : (
              <MediaPlaceholder item={m} title={title} className={s.ph} />
            )}
          </li>
        ))}
      </ul>
      {shown.some((m) => !isReal(m)) && (
        <p className={s.note}>Screenshots appear here once they're approved for public sharing.</p>
      )}

      <dialog
        ref={dialogRef}
        className={s.lightbox}
        aria-label={current ? `Screenshot: ${current.alt}` : 'Screenshot viewer'}
        onClose={() => setOpen(null)}
        onKeyDown={onKey}
      >
        {current && (
          <>
            <img className={s.full} src={current.src} alt={current.alt} />
            <div className={s.controls}>
              <p className={s.caption}>
                {current.caption ?? current.alt}
                <span>
                  {' '}
                  · {(open ?? 0) + 1}/{real.length}
                </span>
              </p>
              {real.length > 1 && (
                <>
                  <button type="button" onClick={() => step(-1)} aria-label="Previous screenshot">
                    ←
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label="Next screenshot">
                    →
                  </button>
                </>
              )}
              <button type="button" onClick={close} aria-label="Close viewer">
                <IconClose />
              </button>
            </div>
          </>
        )}
      </dialog>
    </div>
  )
}
