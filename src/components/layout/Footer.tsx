import { Link } from 'react-router'
import { profile } from '../../data/profile'
import { PatchTrigger } from '../../features/secrets/SecretTrigger'
import { railItems } from './nav'
import s from './layout.module.css'

export function Footer() {
  return (
    <footer className={`${s.footer} no-print`}>
      <div className={s.footerInner}>
        {/* Touch-friendly secret trigger (spec §6): five taps unlock the hidden chapter. */}
        <PatchTrigger className={s.patch} />
        <nav aria-label="Footer">
          <ul className={s.footerLinks}>
            {railItems.map((i) => (
              <li key={i.to}>
                <Link to={i.to}>{i.label}</Link>
              </li>
            ))}
            <li>
              <a href={profile.resume.href} download={profile.resume.fileName}>
                Résumé (PDF)
              </a>
            </li>
            {profile.links
              .filter((l) => l.href.startsWith('http'))
              .map((l) => (
                <li key={l.id}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
          </ul>
        </nav>
        <p className={s.footerMeta}>
          © {new Date().getFullYear()} {profile.name}
          <br />
          Original art. No franchise characters were harmed.
        </p>
      </div>
    </footer>
  )
}
