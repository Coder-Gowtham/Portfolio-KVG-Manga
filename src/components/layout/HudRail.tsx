import { Link, NavLink } from 'react-router'
import { profile } from '../../data/profile'
import { IconDownload } from '../ui/icons'
import { HexPatch } from './HexPatch'
import { railItems } from './nav'
import s from './layout.module.css'

/** Desktop navigation: a fixed spine that expands on hover or keyboard focus. */
export function HudRail() {
  return (
    <nav aria-label="Chapters" className={`${s.rail} no-print`}>
      <Link to="/" className={s.railHome} aria-label={`${profile.name}, home`}>
        <HexPatch />
      </Link>
      <ul className={s.railList}>
        {railItems.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} end={item.end} className={s.railLink}>
              <span className={s.railChapter} aria-hidden="true">
                {item.chapter}
              </span>
              <span className={s.railLabel}>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className={s.railFoot}>
        <a
          href={profile.resume.href}
          download={profile.resume.fileName}
          className={s.railResume}
          aria-label="Download résumé (PDF)"
          title="Download résumé (PDF)"
        >
          <IconDownload />
        </a>
      </div>
    </nav>
  )
}
