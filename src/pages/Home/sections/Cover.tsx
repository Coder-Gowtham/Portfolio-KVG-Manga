import { useState } from 'react'
import { Link } from 'react-router'
import { SpeechBubble } from '../../../components/manga'
import { Burst, NeonSun } from '../../../components/manga/art'
import { Mascot } from '../../../components/manga/Mascot'
import { IconDownload } from '../../../components/ui/icons'
import { InkButton } from '../../../components/ui/InkButton'
import { home } from '../../../data/home'
import { profile } from '../../../data/profile'
import { cx } from '../../../utils/cx'
import s from '../home.module.css'

const INTRO_KEY = 'kvg-intro-played'

/** Play the entrance animation once per browser session. */
function useIntroOnce() {
  const [play] = useState(() => {
    try {
      if (sessionStorage.getItem(INTRO_KEY)) return false
      sessionStorage.setItem(INTRO_KEY, '1')
      return true
    } catch {
      return false
    }
  })
  return play
}

/** 01 · Weekly KVG magazine cover (Direction I). */
export function Cover() {
  const intro = useIntroOnce()
  const issue = String(profile.experienceYears).padStart(2, '0')

  return (
    <section className={cx(s.cover, intro && s.intro)} aria-labelledby="home-title">
      {/* Masthead restates the name decoratively; the real heading is the H1 below. */}
      <div className={s.masthead} aria-hidden="true">
        <span className={s.weekly}>週刊</span>
        <span className={s.mega} data-text="KVG">
          KVG
        </span>
        <span className={s.issue}>
          <span className={s.issueLabel}>{home.cover.issueLabel}</span>
          <span className={s.issueNo}>No.{issue}</span>
          <span className={s.issueTag}>{home.cover.tagline}</span>
        </span>
      </div>

      <div className={s.art}>
        <NeonSun className={s.sun} />
        <div className={s.artTone} aria-hidden="true" />
        <Mascot className={s.coverMascot} mask="up" label="KVG, the masked netrunner mascot, katana on his back" />

        <Link to={`/projects/${home.cover.newArc.slug}`} className={s.newArc}>
          <Burst className={s.burst}>
            <span className={s.burstLabel}>{home.cover.newArc.label}</span>
            <span className={s.burstTitle}>{home.cover.newArc.title}</span>
            <span className="sr-only">: in development. View project</span>
          </Burst>
        </Link>

        <ul className={s.coverLines} aria-label="Cover lines">
          {home.cover.lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
          <li className={s.coverLineHot}>{profile.experienceYears} yrs exp</li>
          <li className={s.coverLineNext}>Next: AI arc</li>
        </ul>
        <span className={s.barcode} aria-hidden="true" />
      </div>

      <div className={s.coverText}>
        <p className={s.coverKicker}>
          <span>CH.00</span> The developer's story
        </p>
        <h1 id="home-title" className={s.coverTitle}>
          {profile.name}
        </h1>
        <p className={s.coverRole}>{profile.role}</p>
        <SpeechBubble className={s.catchphrase}>{home.cover.catchphrase}</SpeechBubble>
        <p className={s.nextArc}>
          <span>{profile.nextArc.label}</span> {profile.nextArc.title}
        </p>
        <p className={s.coverIntro}>{profile.intro}</p>
        <div className={s.ctas}>
          <InkButton to="/projects">Explore projects</InkButton>
          <InkButton href={profile.resume.href} download={profile.resume.fileName} variant="secondary" icon={<IconDownload />}>
            Download résumé
          </InkButton>
          <InkButton to="/contact" variant="command">
            Contact me
          </InkButton>
        </div>
      </div>
    </section>
  )
}
