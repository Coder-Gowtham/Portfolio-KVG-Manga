import { Link } from 'react-router'
import { ChapterHeading } from '../../../components/manga'
import { experience } from '../../../data/experience'
import { useReveal } from '../../../hooks/useReveal'
import { cx } from '../../../utils/cx'
import { formatRange } from '../../../utils/labels'
import s from '../home.module.css'

/** 05 · Career Arc preview: chapter tiles read left → right, oldest first. */
export function ArcStrip() {
  const ref = useReveal<HTMLElement>()
  const chapters = [...experience].sort((a, b) => a.chapter - b.chapter)
  return (
    <section ref={ref} className={s.section} aria-labelledby="arc-title">
      <ChapterHeading id="arc-title" number="CH.02" kicker="Career arc" title="The story so far" level={2} />
      <ol className={s.arc} aria-label="Career chapters, oldest first">
        {chapters.map((c) => {
          const current = !c.endDate
          return (
            <li key={c.id} className={cx(s.arcTile, current && s.arcCurrent)}>
              <span className={s.arcNo} aria-hidden="true">
                {String(c.chapter).padStart(2, '0')}
              </span>
              <p className={s.arcDates}>{formatRange(c.startDate, c.endDate)}</p>
              <h3 className={s.arcRole}>{c.role}</h3>
              <p className={s.arcOrg}>
                {c.organization}
                {c.location && c.kind === 'job' ? ` · ${c.location}` : ''}
              </p>
              {current && <p className={s.arcNow}>Current arc</p>}
            </li>
          )
        })}
      </ol>
      <p className={s.sectionCta}>
        <Link to="/experience" className={s.textLink}>
          Read the full arc →
        </Link>
      </p>
    </section>
  )
}
