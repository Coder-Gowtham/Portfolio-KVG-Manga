import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { SpeechBubble } from '../../../components/manga'
import { Burst, NeonSun } from '../../../components/manga/art'
import { Mascot } from '../../../components/manga/Mascot'
import { IconDownload } from '../../../components/ui/icons'
import { InkButton } from '../../../components/ui/InkButton'
import { home } from '../../../data/home'
import { profile } from '../../../data/profile'
import s from '../home.module.css'
import { useHeroMotion } from '../useHeroMotion'
import { HeroScene } from './HeroScene'

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

/**
 * 01 · Hero. An establishing shot: night city in three depth layers behind,
 * the name as the single focal point on the left, the KVG cover issue on the right.
 */
export function Cover() {
  const ref = useRef<HTMLElement>(null)
  const intro = useIntroOnce()
  useHeroMotion(ref, intro)
  const issue = String(profile.experienceYears).padStart(2, '0')

  const scrollOn = () => {
    const next = document.getElementById('abilities-title')
    const smooth = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    next?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  }

  return (
    <section ref={ref} className={s.cover} aria-labelledby="home-title">
      <HeroScene className={s.scene} />

      <div className={s.coverText}>
        <p className={s.coverKicker} data-intro="kicker">
          <span>CH.00</span> The developer's story
        </p>
        <h1 id="home-title" className={s.coverTitle}>
          <span className={s.titleInitials} data-intro="title">
            {home.cover.title.initials}
          </span>{' '}
          <span className={s.titleName} data-intro="title">
            {home.cover.title.name}
          </span>
          <span className={s.sweepClip} aria-hidden="true">
            <span className={s.titleSweep} data-intro="sweep" />
          </span>
        </h1>
        <p className={s.tagline}>
          {home.cover.tagline.map((line, i) => (
            <span key={line} className={i ? s.taglineAccent : undefined} data-intro="line">
              {line}
              {i < home.cover.tagline.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
        <p className={s.coverRole} data-intro="line">
          {profile.role}
        </p>
        <div className={s.catchphraseWrap} data-intro="stamp">
          <SpeechBubble className={s.catchphrase}>{home.cover.catchphrase}</SpeechBubble>
        </div>
        <p className={s.coverIntro} data-intro="line">
          {profile.intro}
        </p>
        <div className={s.ctas}>
          <span data-intro="cta">
            <InkButton to="/projects">Explore projects</InkButton>
          </span>
          <span data-intro="cta">
            <InkButton href={profile.resume.href} download={profile.resume.fileName} variant="secondary" icon={<IconDownload />}>
              Download résumé
            </InkButton>
          </span>
          <span data-intro="cta">
            <InkButton to="/contact" variant="command">
              Contact me
            </InkButton>
          </span>
        </div>
      </div>

      <div className={s.artWrap} data-intro="art">
        <div className={s.art} data-depth="card">
          {/* Masthead restates the name decoratively; the real heading is the H1. */}
          <div className={s.masthead} aria-hidden="true">
            <span className={s.weekly}>週刊</span>
            <span className={s.mega} data-text="KVG">
              KVG
            </span>
            <span className={s.issue}>
              <span className={s.issueLabel}>{home.cover.issueLabel}</span>
              <span className={s.issueNo}>No.{issue}</span>
              <span className={s.issueTag}>{home.cover.mastheadTag}</span>
            </span>
          </div>
          <div className={s.artBody}>
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
            </ul>
            <span className={s.barcode} aria-hidden="true" />
          </div>
        </div>
      </div>

      <button type="button" className={s.scrollCue} onClick={scrollOn} data-intro="cue">
        <span className={s.scrollLabel}>Scroll</span>
        <span className={s.scrollTrack} aria-hidden="true">
          <span className={s.scrollDot} />
        </span>
        <span className="sr-only"> to abilities</span>
      </button>
    </section>
  )
}
