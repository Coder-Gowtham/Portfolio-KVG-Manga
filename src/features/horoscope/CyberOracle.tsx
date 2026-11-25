import { useMemo, useState } from 'react'
import { cx } from '../../utils/cx'
import { readJSON, writeJSON } from '../../utils/storage'
import { SIGNS, fortuneFor, isSign, type SignId } from './oracle'
import s from './oracle.module.css'

const SIGN_KEY = 'oracle-sign'

/** Fictional daily fortunes. Same sign + same day = same card. */
export function CyberOracle({ today: todayProp }: { today?: Date }) {
  const [today] = useState(() => todayProp ?? new Date())
  const [sign, setSign] = useState<SignId | null>(() => {
    const saved = readJSON<string | null>(SIGN_KEY, null)
    return isSign(saved) ? saved : null
  })
  const fortune = useMemo(() => (sign ? fortuneFor(sign, today) : null), [sign, today])

  const choose = (id: SignId) => {
    setSign(id)
    writeJSON(SIGN_KEY, id)
  }

  const dateLabel = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className={s.oracle}>
      <p className={s.disclaimer}>
        <span className={s.disclaimerTag}>For fun</span> Fictional fortunes, generated from original lines. Not astrology, not advice.
      </p>

      <fieldset className={s.signs}>
        <legend className={s.legend}>Pick your sign</legend>
        <div className={s.signGrid}>
          {SIGNS.map((z) => (
            <button
              key={z.id}
              type="button"
              className={cx(s.sign, sign === z.id && s.signOn)}
              aria-pressed={sign === z.id}
              onClick={() => choose(z.id)}
            >
              <span className={s.glyph} aria-hidden="true">
                {z.glyph}
              </span>
              <span className={s.signName}>{z.name}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div aria-live="polite">
        {fortune ? (
          <article className={s.card} aria-labelledby="fortune-title">
            <header className={s.cardHead}>
              <span className={s.cardGlyph} aria-hidden="true">
                {fortune.sign.glyph}
              </span>
              <div>
                <h3 id="fortune-title" className={s.cardTitle}>
                  {fortune.sign.name}
                </h3>
                <p className={s.cardMeta}>
                  {fortune.sign.dates} · transmission for {dateLabel}
                </p>
              </div>
            </header>
            <p className={s.reading}>{fortune.reading}</p>
            <dl className={s.facts}>
              <div>
                <dt>Advice</dt>
                <dd>{fortune.advice}</dd>
              </div>
              <div>
                <dt>{fortune.lucky.label}</dt>
                <dd className={s.mono}>{fortune.lucky.value}</dd>
              </div>
              <div>
                <dt>Pair-programming match</dt>
                <dd>
                  <span aria-hidden="true">{fortune.match.glyph} </span>
                  {fortune.match.name}
                </dd>
              </div>
            </dl>
            <ul className={s.stats} aria-label="Today's levels">
              {fortune.stats.map((st) => (
                <li key={st.label}>
                  <span className={s.statLabel}>{st.label}</span>
                  <span className={s.meter} aria-hidden="true">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={cx(s.pip, i < st.value && s.pipOn)} />
                    ))}
                  </span>
                  <span className="sr-only">
                    {st.value} out of 5
                  </span>
                </li>
              ))}
            </ul>
            <p className={s.footnote}>New transmission at midnight. Same sign, same day, same fortune.</p>
          </article>
        ) : (
          <p className={s.empty}>The oracle is listening. Choose a sign to receive today’s transmission.</p>
        )}
      </div>
    </div>
  )
}
