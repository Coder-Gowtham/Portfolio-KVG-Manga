import type { ComponentType } from 'react'
import { NavLink } from 'react-router'
import { cx } from '../../utils/cx'
import { useHideOnScroll } from '../../hooks/useScrollDirection'
import { IconArc, IconHire, IconHome, IconMenu, IconWorks } from '../ui/icons'
import { bottomNavItems } from './nav'
import s from './layout.module.css'

const ICONS: Record<string, ComponentType> = {
  '/': IconHome,
  '/projects': IconWorks,
  '/experience': IconArc,
  '/recruiter': IconHire,
}

export function BottomNav({ menuOpen, onMenu }: { menuOpen: boolean; onMenu: () => void }) {
  const hidden = useHideOnScroll()

  return (
    <nav aria-label="Primary" className={cx(s.bottomNav, 'no-print', hidden && !menuOpen && s.bottomNavHidden)}>
      <ul className={s.bottomList}>
        {bottomNavItems.map((item) => {
          const Icon = ICONS[item.to] ?? IconHome
          return (
            <li key={item.to}>
              <NavLink to={item.to} end={item.end} className={s.bottomLink}>
                <Icon />
                <span>{item.label}</span>
              </NavLink>
            </li>
          )
        })}
        <li>
          <button
            type="button"
            className={s.bottomLink}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="menu-sheet"
            onClick={onMenu}
          >
            <IconMenu />
            <span>Menu</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
