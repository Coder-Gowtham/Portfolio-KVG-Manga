import { useEffect, useState, type MouseEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { Seo } from '../../app/Seo'
import { ChapterHeading, MangaPanel, NarrationBox, SpeechBubble } from '../../components/manga'
import { Drone } from '../../components/manga/Mascot'
import { TerminalWindow } from '../../components/ui/TerminalWindow'
import { profile } from '../../data/profile'
import { comingSoon, funModules, type FunModule } from '../../features/registry'
import { useSecret } from '../../features/secrets/secretStore'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import s from './playground.module.css'

interface SectionProps {
  module: FunModule
  index: number
  /** Small screens: the window folds down to its title bar. */
  collapsible: boolean
  expanded: boolean
  onToggle: (id: string) => void
}

function ModuleSection({ module: m, index, collapsible, expanded, onToggle }: SectionProps) {
  const titleId = `${m.id}-title`
  const bodyId = `${m.id}-body`
  const open = !collapsible || expanded
  const kicker = (
    <p className={s.moduleKicker}>
      <span aria-hidden="true">{String(index + 1).padStart(2, '0')} · </span>
      {m.kicker}
    </p>
  )
  const heading = collapsible ? (
    <header className={s.moduleHead}>
      {kicker}
      <h2 id={titleId} className={s.moduleTitle}>
        <button
          type="button"
          className={s.toggle}
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => onToggle(m.id)}
        >
          <span>{m.title}</span>
          <span className={s.toggleHint} aria-hidden="true">
            {open ? '− Close' : `+ ${m.action ?? 'Play'}`}
          </span>
        </button>
      </h2>
      {!open && <p className={s.moduleBlurb}>{m.blurb}</p>}
    </header>
  ) : (
    <header className={s.moduleHead}>
      {kicker}
      <h2 id={titleId} className={s.moduleTitle}>
        {m.title}
      </h2>
    </header>
  )
  // Collapsed games are unmounted, so their timers stop instead of running unseen.
  const body = (
    <>
      {heading}
      {open && (
        <div id={bodyId} className={collapsible ? s.moduleBody : undefined}>
          <m.Component />
        </div>
      )}
    </>
  )
  return (
    <div id={m.id} className={s.anchor}>
      {m.surface === 'terminal' ? (
        <TerminalWindow title={`kvg@night-city: ~/showdown/${m.id}`} labelledBy={titleId}>
          {body}
        </TerminalWindow>
      ) : (
        <MangaPanel surface={m.surface} aria-labelledby={titleId} neon={m.surface === 'night'}>
          {body}
        </MangaPanel>
      )}
    </div>
  )
}

/** Showdown: the drone-hosted arcade (spec §4.6). Modules come from features/registry.ts. */
export default function PlaygroundPage() {
  const { unlocked } = useSecret()
  const instagram = profile.links.find((l) => l.id === 'instagram')
  const small = useMediaQuery('(max-width: 767px)')
  const [expanded, setExpanded] = useState<string[]>([])
  const toggle = (id: string) => setExpanded((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))

  // A link straight to a game (#bug-hunt) opens that window, on load or later.
  const { hash } = useLocation()
  useEffect(() => {
    const open = (raw: string) => {
      const id = raw.replace(/^#/, '')
      if (funModules.some((m) => m.id === id)) setExpanded((ids) => (ids.includes(id) ? ids : [...ids, id]))
    }
    open(hash || window.location.hash)
    const onHash = () => open(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [hash])

  /** Cabinet tap on small screens: open the window first, then scroll to it. */
  const jump = (e: MouseEvent, id: string) => {
    if (!small) return
    e.preventDefault()
    setExpanded((ids) => (ids.includes(id) ? ids : [...ids, id]))
    window.history.replaceState(null, '', `#${id}`)
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }))
  }

  return (
    <div className={s.page}>
      <Seo />
      <div className={`page ${s.inner}`}>
        <div className={s.head}>
          <ChapterHeading
            number="VS"
            kicker="Bonus chapter"
            title="Showdown"
            lede="Step into the arena. Test your reflexes, memory and typing speed against the bug-hunter drone, then grab a fortune on the way out. Best scores stay on your device."
            glitch
          />
          <div className={s.host}>
            <SpeechBubble tail="right">Beep. Welcome to the arcade. No coins needed.</SpeechBubble>
            <Drone className={s.hostDrone} />
          </div>
        </div>

        <nav aria-label="Arcade cabinets">
          <ul className={s.cabinets}>
            {funModules.map((m, i) => (
              <li key={m.id}>
                <a className={s.cabinet} href={`#${m.id}`} onClick={(e) => jump(e, m.id)}>
                  <span className={s.cabNum} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={s.cabTitle}>{m.title}</span>
                  <span className={s.cabBlurb}>{m.blurb}</span>
                </a>
              </li>
            ))}
            {comingSoon.map((c) => (
              <li key={c.id}>
                <div className={`${s.cabinet} ${s.cabSoon}`}>
                  <span className={s.cabNum}>
                    <span aria-hidden="true">??</span>
                    <span className="sr-only">Coming soon:</span>
                  </span>
                  <span className={s.cabTitle}>{c.title}</span>
                  <span className={s.cabBlurb}>{c.blurb}</span>
                  <span className={s.soonTag} aria-hidden="true">
                    Coming soon
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.modules}>
          {funModules.map((m, i) => (
            <ModuleSection
              key={m.id}
              module={m}
              index={i}
              collapsible={small}
              expanded={expanded.includes(m.id)}
              onToggle={toggle}
            />
          ))}
        </div>

        <section className={s.rumours} aria-labelledby="rumours-title">
          <h2 id="rumours-title" className={s.moduleTitle}>
            Rumours
          </h2>
          {unlocked ? (
            <NarrationBox surface="night">
              You found the hidden chapter.{' '}
              <Link to="/playground/secret" className={s.inlineLink}>
                Read Ch.∞ again
              </Link>{' '}
              or switch on its perks there.
            </NarrationBox>
          ) : (
            <NarrationBox surface="night">
              They say there is a chapter missing from this book. The patch remembers every tap… and some terminals still
              answer to <code>sudo</code>.
            </NarrationBox>
          )}
          {instagram && (
            <p className={s.offDuty}>
              Off-duty, away from the keyboard:{' '}
              <a href={instagram.href} target="_blank" rel="noopener noreferrer" className={s.inlineLink}>
                {instagram.handle} on Instagram
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
