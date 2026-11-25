import { Seo } from '../../app/Seo'
import { ChapterHeading, SpeechBubble } from '../../components/manga'
import { Mascot } from '../../components/manga/Mascot'
import { CopyButton } from '../../components/ui/CopyButton'
import { InkButton } from '../../components/ui/InkButton'
import { TerminalWindow } from '../../components/ui/TerminalWindow'
import { profile } from '../../data/profile'
import { ContactForm } from './ContactForm'
import s from './contact.module.css'

const COMMAND: Record<string, string> = {
  email: 'mail gowtham',
  linkedin: 'open linkedin',
  github: 'open github',
  instagram: 'open instagram',
}

/** Ch.03 · Final panel: a terminal (Direction J) with real links and an honest contact form. */
export default function ContactPage() {
  const links = profile.links.filter((l) => l.id in COMMAND)
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
          <div className={s.headArt}>
            <SpeechBubble tail="right">Got a quest?</SpeechBubble>
            <Mascot className={s.mascot} mask="down" armed={false} />
          </div>
        </div>

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
            <ContactForm />
          </TerminalWindow>
        </div>
      </div>
    </div>
  )
}
