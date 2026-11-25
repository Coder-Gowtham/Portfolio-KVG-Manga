import { Link, NavLink } from 'react-router'
import { profile } from '../../data/profile'
import { NAV, type NavItem } from './nav'
import s from './layout.module.css'

/** Plain desktop bar for the Recruiter page: clarity over decoration. */
export function TopBar() {
  const items: NavItem[] = [NAV.home, NAV.works, NAV.arc, NAV.contact]
  return (
    <header className={`${s.topBar} no-print`}>
      <Link to="/" className={s.topBarBrand}>
        {profile.name}
      </Link>
      <nav aria-label="Site">
        <ul className={s.topBarLinks}>
          {items.map((i) => (
            <li key={i.to}>
              <NavLink to={i.to} end={i.end}>
                {i.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
