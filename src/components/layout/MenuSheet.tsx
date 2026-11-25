import { useEffect, useRef, type MouseEvent } from 'react'
import { NavLink } from 'react-router'
import { profile } from '../../data/profile'
import { IconClose, IconDownload, linkIcon } from '../ui/icons'
import { InkButton } from '../ui/InkButton'
import { menuItems } from './nav'
import s from './layout.module.css'

/**
 * Bottom sheet built on the native <dialog>: modal focus trap, Esc to close
 * and inert background come from the browser.
 */
export function MenuSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    // Backdrop click is a mouse convenience; keyboard users close with Esc (native) or the close button.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      id="menu-sheet"
      className={s.sheet}
      aria-labelledby="menu-sheet-title"
      onClose={onClose}
      onClick={(e: MouseEvent<HTMLDialogElement>) => {
        // Clicks on the backdrop target the dialog element itself.
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className={s.sheetHead}>
        <h2 id="menu-sheet-title" className={s.sheetTitle}>
          // MORE CHAPTERS
        </h2>
        <button type="button" className={s.iconBtn} onClick={onClose} aria-label="Close menu">
          <IconClose />
        </button>
      </div>

      <ul className={s.sheetList}>
        {menuItems.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} className={s.sheetLink} onClick={onClose}>
              <span>{item.chapter}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <InkButton href={profile.resume.href} download={profile.resume.fileName} variant="secondary" block icon={<IconDownload />}>
        Download résumé (PDF)
      </InkButton>

      <ul className={s.socials} aria-label="Contact links">
        {profile.links
          .filter((l) => l.id !== 'phone')
          .map((l) => {
            const Icon = linkIcon[l.id]
            const external = l.href.startsWith('http')
            return (
              <li key={l.id}>
                <a
                  className={s.socialLink}
                  href={l.href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <Icon />
                  {l.label}
                  {external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              </li>
            )
          })}
      </ul>
    </dialog>
  )
}
