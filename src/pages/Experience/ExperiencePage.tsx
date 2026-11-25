import { useState } from 'react'
import { Link } from 'react-router'
import { Seo } from '../../app/Seo'
import { ChapterHeading, NeedsInput } from '../../components/manga'
import { MascotAction } from '../../components/manga/MascotAction'
import { TechTags } from '../../components/projects/TechTags'
import { IconDownload } from '../../components/ui/icons'
import { InkButton } from '../../components/ui/InkButton'
import { experience } from '../../data/experience'
import { profile } from '../../data/profile'
import { projectBySlug } from '../../data/projects'
import { cx } from '../../utils/cx'
import { formatRange } from '../../utils/labels'
import s from './experience.module.css'

const KIND_LABEL = { job: 'Job', education: 'Education', independent: 'Independent' } as const
const MODE_LABEL = { remote: 'Remote', onsite: 'On-site', hybrid: 'Hybrid' } as const

/** Career Arc: a storyline along a neon spine. Newest first, or read from the beginning. */
export default function ExperiencePage() {
  const [order, setOrder] = useState<'newest' | 'oldest'>('newest')
  const chapters = [...experience].sort((a, b) => (order === 'newest' ? b.chapter - a.chapter : a.chapter - b.chapter))

  const resume = (
    <InkButton href={profile.resume.href} download={profile.resume.fileName} variant="secondary" icon={<IconDownload />}>
      Download résumé (PDF)
    </InkButton>
  )

  return (
    <div className="page">
      <Seo />
      <div className={s.stack}>
        <div className={s.head}>
          <ChapterHeading
            number="CH.02"
            kicker="Career arc"
            title="Chapters of an engineer"
            lede={`About ${profile.experienceYears} years across fintech backends, a large JavaScript editor front end, and full stack client work.`}
          />
          <MascotAction action="draw" className={s.headArt} />
        </div>

        <div className={s.toolbar}>
          {resume}
          <div className={s.order} role="group" aria-label="Reading order">
            <button type="button" aria-pressed={order === 'newest'} onClick={() => setOrder('newest')}>
              Latest first
            </button>
            <button type="button" aria-pressed={order === 'oldest'} onClick={() => setOrder('oldest')}>
              From the beginning
            </button>
          </div>
        </div>

        <ol className={s.timeline} aria-label={order === 'newest' ? 'Career chapters, latest first' : 'Career chapters, oldest first'}>
          {chapters.map((c, i) => {
            const current = !c.endDate
            return (
              <li key={c.id} className={cx(s.chapter, i % 2 ? s.right : s.left, current && s.current)}>
                <span className={s.node} aria-hidden="true" />
                <article className={s.card} aria-labelledby={`ch-${c.id}`}>
                  <span className={s.numeral} aria-hidden="true">
                    {String(c.chapter).padStart(2, '0')}
                  </span>
                  <p className={s.meta}>
                    <span className={s.kind}>
                      Ch.{String(c.chapter).padStart(2, '0')} · {KIND_LABEL[c.kind]}
                    </span>
                    <span>{formatRange(c.startDate, c.endDate)}</span>
                    {current && <span className={s.now}>Current arc</span>}
                  </p>
                  <h2 id={`ch-${c.id}`} className={s.role}>
                    {c.role}
                  </h2>
                  <p className={s.org}>
                    {c.organization}
                    {c.location && c.location !== 'Remote' ? ` · ${c.location}` : ''}
                    {c.workMode ? ` · ${MODE_LABEL[c.workMode]}` : ''}
                  </p>
                  {c.summary && <p className={s.summary}>{c.summary}</p>}
                  {c.responsibilities.length > 0 && (
                    <ul className={s.duties}>
                      {c.responsibilities.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  )}
                  {c.achievements?.length ? (
                    <ul className={s.duties} aria-label="Key achievements">
                      {c.achievements.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  ) : null}
                  <TechTags items={c.technologies} label={`${c.organization} technologies`} tone="paper" />
                  {c.projectSlugs?.length ? (
                    <p className={s.projects}>
                      <span>Episodes:</span>
                      {c.projectSlugs.map((slug) => {
                        const p = projectBySlug(slug)
                        return p ? (
                          <Link key={slug} to={`/projects/${slug}`}>
                            {p.title}
                          </Link>
                        ) : null
                      })}
                    </p>
                  ) : null}
                  <NeedsInput items={c.needsInput} />
                </article>
              </li>
            )
          })}
        </ol>

        <div className={s.toolbar}>{resume}</div>
      </div>
    </div>
  )
}
