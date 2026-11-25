import { ChapterHeading } from '../../../components/manga'
import { home } from '../../../data/home'
import { useReveal } from '../../../hooks/useReveal'
import s from '../home.module.css'

/** 02 · "Previously on…": the manga recap page. */
export function Recap() {
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} className={s.section} aria-labelledby="recap-title">
      <ChapterHeading id="recap-title" number="RECAP" kicker="Summary" title="Previously on…" level={2} />
      <ol className={s.recap}>
        {home.recap.map((r, i) => (
          <li key={r.kicker} className={s.recapBox}>
            <span className={s.recapNo} aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className={s.recapKicker}>{r.kicker}</p>
            <p>{r.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
