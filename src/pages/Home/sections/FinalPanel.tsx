import { MangaPanel, Sfx, SpeechBubble } from '../../../components/manga'
import { QuestBoard } from '../../../components/manga/QuestBoard'
import { Drone } from '../../../components/manga/Mascot'
import { CopyButton } from '../../../components/ui/CopyButton'
import { InkButton } from '../../../components/ui/InkButton'
import { home } from '../../../data/home'
import { profile } from '../../../data/profile'
import { useReveal } from '../../../hooks/useReveal'
import s from '../home.module.css'

const COMMANDS: Record<string, string> = {
  email: 'mail gowtham',
  linkedin: 'open linkedin',
  github: 'open github',
  instagram: 'open instagram',
}

/** Final panel: the drone relays contact commands. One of the two "loud" panels on the page. */
export function FinalPanel() {
  const ref = useReveal<HTMLElement>()
  const links = profile.links.filter((l) => l.id in COMMANDS)

  return (
    <section ref={ref} className={s.section} aria-labelledby="final-title">
      <MangaPanel as="div" surface="paper" slant="left" neon className={s.final}>
        <div className={s.finalGrid}>
          <div className={s.finalArt}>
            <Sfx text="ピピッ" size="2rem" className={s.finalSfx} />
            <Drone className={s.finalDroneHero} />
          </div>
          <div className={s.finalText}>
            <p className={s.finalKicker}>
              <span>FIN.</span> To be continued…
            </p>
            <h2 id="final-title" className={s.finalTitle}>
              {home.closing.bubble}
            </h2>
            <p>{home.closing.lede}</p>
            <QuestBoard />
            <div className={s.terminal}>
              <p className={s.terminalBar} aria-hidden="true">
                <span />
                <span />
                <span />
                kvg@night-city: ~
              </p>
              <ul className={s.terminalList}>
                {links.map((l) => (
                  <li key={l.id}>
                    <InkButton
                      variant="command"
                      href={l.href}
                      {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {COMMANDS[l.id]}
                      <span className="sr-only">
                        {' '}
                        ({l.label}: {l.handle}
                        {l.href.startsWith('http') ? ', opens in a new tab' : ''})
                      </span>
                    </InkButton>
                  </li>
                ))}
              </ul>
              <CopyButton value={profile.email} label="Copy email" />
            </div>
            <SpeechBubble tail="right" className={s.finalBubble}>
              Beep. Message relayed to KVG.
            </SpeechBubble>
          </div>
        </div>
      </MangaPanel>
    </section>
  )
}
