import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Seo } from '../../app/Seo'
import { ChapterHeading, MangaPanel, NarrationBox, Sfx, SpeechBubble } from '../../components/manga'
import { Burst, SpeedLines } from '../../components/manga/art'
import { Drone, Mascot } from '../../components/manga/Mascot'
import { InkButton } from '../../components/ui/InkButton'
import { secretStore, useSecret } from '../../features/secrets/secretStore'
import { cx } from '../../utils/cx'
import s from './secret.module.css'

interface Panel {
  id: string
  size: 'wide' | 'half' | 'third'
  surface: 'paper' | 'night'
  narration: ReactNode
  art: ReactNode
}

const LOG_LINES = [
  'GET /api/ledger 200 41ms',
  'GET /api/ledger 200 39ms',
  'WARN retry queue depth=3',
  'GET /api/ledger 200 44ms',
  'ERR 00:00:00.000 ??????',
  'GET /api/ledger 200 40ms',
  'WARN clock skew 0ms→∞',
  'GET /api/ledger 500 —',
]

/** Original story, "Ch.∞: Origin of the Mask" (spec §4.7). Eight panels. */
const PANELS: Panel[] = [
  {
    id: 'red-build',
    size: 'wide',
    surface: 'night',
    narration: <>Night City, 03:12. Every screen in the office has gone dark except one. The build is red. Again.</>,
    art: (
      <div className={s.artBuild}>
        <p className={s.buildLine}>
          <span className={s.fail}>✕ BUILD FAILED</span> · pipeline #4096
        </p>
        <Mascot className={s.mascotSide} mask="down" armed={false} />
      </div>
    ),
  },
  {
    id: 'midnight',
    size: 'half',
    surface: 'paper',
    narration: <>The bug nobody could reproduce. It only woke up at midnight, and only in production.</>,
    art: (
      <div className={s.artClock}>
        <span className={s.clock}>00:00</span>
        <Sfx text="チク タク" size="1.5rem" className={s.tick} />
      </div>
    ),
  },
  {
    id: 'logs',
    size: 'half',
    surface: 'night',
    narration: <>So he jacked in. The logs fell like rain. Somewhere inside them, something was reading him back.</>,
    art: (
      <div className={s.artLogs} aria-hidden="true">
        {LOG_LINES.map((l, i) => (
          <span key={i} className={cx(s.logLine, l.startsWith('ERR') && s.logErr)}>
            {l}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: 'strike',
    size: 'wide',
    surface: 'paper',
    narration: <>The glitch struck first. It tore through half the screen, and through the left side of his vision with it.</>,
    art: (
      <div className={s.artStrike}>
        <SpeedLines color="var(--ink)" count={72} inner={30} cy={50} />
        <Burst className={s.burst} color="var(--neon-magenta)">
          <span className={s.burstText}>KZZT</span>
        </Burst>
      </div>
    ),
  },
  {
    id: 'one-line',
    size: 'third',
    surface: 'night',
    narration: <>One line fixed it. An off-by-one in a date check. The pipeline turned green.</>,
    art: (
      <pre className={s.diff} aria-label="Code diff: one line changed">
        <span className={s.del}>- if (now &gt; end)</span>
        {'\n'}
        <span className={s.add}>+ if (now &gt;= end)</span>
      </pre>
    ),
  },
  {
    id: 'eye',
    size: 'third',
    surface: 'night',
    narration: <>But the glitch left a mark. His left eye now sees stack traces hanging in the air. He calls it a feature.</>,
    art: (
      <div className={s.artEye}>
        <svg viewBox="0 0 100 60" className={s.eye} aria-hidden="true">
          <path d="M6 30 Q50 -6 94 30 Q50 66 6 30 Z" fill="#0A0A0F" stroke="#00E5FF" strokeWidth="3" />
          <circle cx="50" cy="30" r="14" fill="#00E5FF" />
          <circle cx="50" cy="30" r="6" fill="#0A0A0F" />
          <path d="M50 12 V20 M50 40 V48 M32 30 H40 M60 30 H68" stroke="#FF2A6D" strokeWidth="2" />
        </svg>
        <span className={s.trace} aria-hidden="true">
          at checkDate (ledger.js:42)
        </span>
      </div>
    ),
  },
  {
    id: 'drone',
    size: 'third',
    surface: 'paper',
    narration: <>Something crawled out of the crash dump: a tiny drone, the bug’s last test case. It beeped once. He kept it.</>,
    art: (
      <div className={s.artDrone}>
        <SpeechBubble tail="right" className={s.beep}>
          Beep?
        </SpeechBubble>
        <Drone className={s.droneBig} />
      </div>
    ),
  },
  {
    id: 'mask',
    size: 'wide',
    surface: 'night',
    narration: (
      <>
        Then he pulled the mask up. Not to hide. To keep the noise out. And every bug in Night City learned a new name: KVG.
      </>
    ),
    art: (
      <div className={s.artFinal}>
        <SpeedLines color="var(--neon-cyan)" count={56} inner={44} cy={55} className={s.finalLines} />
        <Mascot className={s.mascotHero} mask="up" label="KVG with his mask up, katana on his back" />
        <SpeechBubble className={s.finalBubble}>Relax. I only hunt bugs.</SpeechBubble>
      </div>
    ),
  },
]

function Switch({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint: string }) {
  return (
    <div className={s.switchRow}>
      <button type="button" role="switch" aria-checked={checked} className={s.switch} onClick={() => onChange(!checked)}>
        <span className={s.track} aria-hidden="true">
          <span className={s.thumb} />
        </span>
        <span className={s.switchLabel}>{label}</span>
      </button>
      <p className={s.switchHint}>{hint}</p>
    </div>
  )
}

function Locked() {
  return (
    <div className={s.locked}>
      <MangaPanel surface="night" neon>
        <div className={s.lockedBody}>
          <p className={s.classified}>Classified</p>
          <NarrationBox surface="night">
            This chapter is sealed. On a keyboard, some terminals still answer to <code>sudo</code>. On a phone, the patch in the
            footer remembers every tap…
          </NarrationBox>
          <InkButton to="/playground" variant="secondary">
            Back to the Fun zone
          </InkButton>
        </div>
      </MangaPanel>
    </div>
  )
}

/** Ch.∞, the hidden chapter. Reachable directly once unlocked (stored on this device). */
export default function SecretPage() {
  const { unlocked, offDuty, droneFollow } = useSecret()

  return (
    <div className={s.page}>
      <Seo />
      <div className={`page ${s.inner}`}>
        <ChapterHeading
          number="CH.∞"
          kicker="Hidden chapter"
          title="Origin of the mask"
          lede={unlocked ? 'An original short story. Every netrunner has one bug that changed everything. This is his.' : undefined}
          glitch
        />

        {!unlocked ? (
          <Locked />
        ) : (
          <>
            <ol className={s.story} aria-label="Story panels">
              {PANELS.map((p, i) => (
                <li key={p.id} className={cx(s.cell, s[p.size])}>
                  <MangaPanel surface={p.surface} as="article" className={s.panel}>
                    <p className={s.panelNum} aria-hidden="true">
                      {i + 1}
                    </p>
                    <div className={s.art}>{p.art}</div>
                    <p className={s.narration}>{p.narration}</p>
                  </MangaPanel>
                </li>
              ))}
            </ol>
            <p className={s.end} aria-hidden="true">
              — END OF CH.∞ —
            </p>

            <section className={s.perks} aria-labelledby="perks-title">
              <h2 id="perks-title" className={s.perksTitle}>
                Unlocked perks
              </h2>
              <Switch
                checked={offDuty}
                onChange={secretStore.setOffDuty}
                label="Off-duty skin"
                hint="The mascot keeps his mask down on every page."
              />
              <Switch
                checked={droneFollow}
                onChange={secretStore.setDroneFollow}
                label="Drone follows cursor"
                hint="Mouse or trackpad only. Stays off if your device asks for reduced motion."
              />
              <div className={s.perkActions}>
                <InkButton to="/playground" variant="secondary">
                  Back to the Fun zone
                </InkButton>
                <button type="button" className={s.relock} onClick={secretStore.lock}>
                  Seal the chapter again
                </button>
              </div>
              <p className={s.note}>Saved on this device only. Nothing is sent anywhere.</p>
            </section>
          </>
        )}
        <p className={s.back}>
          <Link to="/">← Back to the main story</Link>
        </p>
      </div>
    </div>
  )
}
