import { useState } from 'react'
import { Seo } from '../../app/Seo'
import { ChapterHeading, SpeechBubble } from '../../components/manga'
import { SpeedLines } from '../../components/manga/art'
import { Mascot } from '../../components/manga/Mascot'
import { QuestBoard } from '../../components/manga/QuestBoard'
import { CopyButton } from '../../components/ui/CopyButton'
import { InkButton } from '../../components/ui/InkButton'
import { TerminalWindow } from '../../components/ui/TerminalWindow'
import { profile } from '../../data/profile'
import { cx } from '../../utils/cx'
import { questSubject, type QuestId } from '../../data/quests'
import { ContactForm } from './ContactForm'
import s from './contact.module.css'

const COMMAND: Record<string, string> = {
  email: 'mail gowtham',
  linkedin: 'open linkedin',
  github: 'open github',
  instagram: 'open instagram',
}

/**
 * The netrunner host. Idle: rises in, nods now and then, bubble floats.
 * Hover (mouse) or tap: he pulls the mask up and arms up, with a speed-line burst.
 */
function ContactMascot({ className }: { className?: string }) {
  const [ready, setReady] = useState(false)
  return (
    <div
      className={cx(s.host, ready && s.ready, className)}
      // Hover is for mice only; on touch screens a tap toggles (see the button).
      onPointerEnter={(e) => e.pointerType === 'mouse' && setReady(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setReady(false)}
    >
      <SpeechBubble tail="right" className={s.hostBubble}>
        <span key={String(ready)} className={s.hostLine}>
          {ready ? 'Say the word.' : 'Got a quest?'}
        </span>
      </SpeechBubble>
      <button
        type="button"
        className={s.hostButton}
        aria-pressed={ready}
        aria-label="Netrunner: mask up"
        onClick={() => setReady((r) => !r)}
      >
        <SpeedLines className={s.hostLines} color="var(--neon-cyan)" count={40} inner={38} cy={55} />
        <Mascot className={s.mascot} mask={ready ? 'up' : 'down'} armed={ready} />
      </button>
    </div>
  )
}

/** Ch.03 · Final panel: a terminal (Direction J) with real links and an honest contact form. */
export default function ContactPage() {
  const links = profile.links.filter((l) => l.id in COMMAND)
  const [quest, setQuest] = useState<QuestId | null>(null)
  return (
    <div className={s.page}>
      <Seo />
      <div className={`page ${s.inner}`}>
        <div className={s.head}>
          <ChapterHeading
            number="CH.03"
            kicker="Final panel"
            title="Ping me"
            lede="Hiring, a freelance build, or just a good bug story: all welcome. Email is the fastest way to reach me."
          />
          <ContactMascot className={s.hostTop} />
        </div>

        <section className={s.board} aria-labelledby="quest-title">
          <h2 id="quest-title" className={s.boardTitle}>
            Quest board
          </h2>
          <p className={s.boardLede}>
            Open to full-time, contract, freelance and collaboration. Pick one and your message starts with it.
          </p>
          <QuestBoard selected={quest} onSelect={setQuest} entrance label="Pick a quest type" className={s.boardList} />
          <p className="sr-only" aria-live="polite">
            {quest ? `${questSubject(quest).replace(/:\s*$/, '')} selected. The message subject has been filled in.` : ''}
          </p>
        </section>

        <div className={s.grid}>
          <TerminalWindow title="kvg@night-city: ~/contact" labelledBy="ping-title">
            <h2 id="ping-title" className={s.prompt}>
              <span aria-hidden="true">$ </span>ping gowtham
            </h2>
            <p className={s.out}>
              <span className={s.ok}>[OK]</span> host reachable · {profile.availability.toLowerCase()}
            </p>
            <ul className={s.commands}>
              {links.map((l) => (
                <li key={l.id}>
                  <InkButton
                    variant="command"
                    href={l.href}
                    {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {COMMAND[l.id]}
                    <span className={s.handle}>
                      {' '}
                      # {l.handle}
                    </span>
                    {l.href.startsWith('http') && <span className="sr-only"> (opens in a new tab)</span>}
                  </InkButton>
                </li>
              ))}
            </ul>
            <CopyButton value={profile.email} label="Copy email" />
          </TerminalWindow>

          <TerminalWindow title="compose.msg" accent="magenta" labelledBy="form-title">
            <h2 id="form-title" className={s.prompt}>
              <span aria-hidden="true">$ </span>compose --to gowtham
            </h2>
            <ContactForm presetSubject={quest ? questSubject(quest) : undefined} />
          </TerminalWindow>
        </div>

        {/* Phones: the host signs off below the form instead of taking the top of the screen. */}
        <ContactMascot className={s.hostBottom} />
      </div>
    </div>
  )
}
