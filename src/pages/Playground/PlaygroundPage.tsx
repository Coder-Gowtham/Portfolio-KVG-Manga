import { Link } from 'react-router'
import { Seo } from '../../app/Seo'
import { ChapterHeading, MangaPanel, NarrationBox, SpeechBubble } from '../../components/manga'
import { Drone } from '../../components/manga/Mascot'
import { TerminalWindow } from '../../components/ui/TerminalWindow'
import { profile } from '../../data/profile'
import { comingSoon, funModules, type FunModule } from '../../features/registry'
import { useSecret } from '../../features/secrets/secretStore'
import s from './playground.module.css'

function ModuleSection({ module: m, index }: { module: FunModule; index: number }) {
  const titleId = `${m.id}-title`
  const heading = (
    <header className={s.moduleHead}>
      <p className={s.moduleKicker}>
        <span aria-hidden="true">{String(index + 1).padStart(2, '0')} · </span>
        {m.kicker}
      </p>
      <h2 id={titleId} className={s.moduleTitle}>
        {m.title}
      </h2>
    </header>
  )
  const body = (
    <>
      {heading}
      <m.Component />
    </>
  )
  return (
    <div id={m.id} className={s.anchor}>
      {m.surface === 'terminal' ? (
        <TerminalWindow title={`kvg@night-city: ~/omake/${m.id}`} labelledBy={titleId}>
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

/** Omake: the drone-hosted arcade (spec §4.6). Modules come from features/registry.ts. */
export default function PlaygroundPage() {
  const { unlocked } = useSecret()
  const instagram = profile.links.find((l) => l.id === 'instagram')

  return (
    <div className={s.page}>
      <Seo />
      <div className={`page ${s.inner}`}>
        <div className={s.head}>
          <ChapterHeading
            number="OMAKE"
            kicker="Bonus chapter"
            title="Fun zone"
            lede="No case studies here. Just a few small games and toys I built for this site, hosted by the bug-hunter drone."
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
                <a className={s.cabinet} href={`#${m.id}`}>
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
            <ModuleSection key={m.id} module={m} index={i} />
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
