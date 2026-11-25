import { Link } from 'react-router'
import { ChapterHeading, Stamp } from '../../../components/manga'
import { home } from '../../../data/home'
import { profile } from '../../../data/profile'
import { logoColour, stack, type StackItem } from '../../../data/stack'
import { cx } from '../../../utils/cx'
import s from '../home.module.css'

function TechLogo({ item }: { item: StackItem }) {
  if ('badge' in item.icon) {
    return (
      <span className={s.logoBadge} aria-hidden="true">
        {item.icon.badge}
      </span>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className={s.logoSvg} aria-hidden="true" focusable="false">
      <path d={item.icon.path} fill={logoColour(item.icon.hex)} />
    </svg>
  )
}

/** Abilities: the stack as a board of official logos, grouped by role. Calm style. */
export function Abilities() {
  return (
    <section className={s.section} aria-labelledby="abilities-title">
      <ChapterHeading
        id="abilities-title"
        number="STATS"
        kicker="Skill tree"
        title="Abilities"
        level={2}
        lede={`About ${profile.experienceYears} years on both sides of the stack. ${home.glance.text}`}
      />
      <p className={s.calmLinks}>
        <Link to="/experience">Read the full arc →</Link>
        <Link to="/recruiter">Skills with details →</Link>
      </p>

      <ul className={s.board}>
        {stack.map((g) => (
          <li key={g.id} className={cx(s.group, g.training && s.groupTraining)} data-reveal-item>
            <div className={s.groupHead}>
              <h3 className={s.groupTitle}>{g.title}</h3>
              {g.training ? <Stamp status="training" /> : <span className={s.groupKicker}>{g.kicker}</span>}
            </div>
            <ul className={s.logos} aria-label={`${g.title} tools`}>
              {g.items.map((it) => (
                <li key={it.name} className={s.logoTile}>
                  <TechLogo item={it} />
                  <span className={s.logoName}>{it.name}</span>
                </li>
              ))}
            </ul>
            {g.also && (
              <p className={s.also}>
                <span className={s.alsoLabel}>Also</span> {g.also.join(' · ')}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
