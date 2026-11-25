import { Fragment, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Seo } from '../../app/Seo'
import { ChapterHeading, NeedsInput, SpeechBubble } from '../../components/manga'
import { MascotAction } from '../../components/manga/MascotAction'
import { TechTags } from '../../components/projects/TechTags'
import { IconDownload } from '../../components/ui/icons'
import { InkButton } from '../../components/ui/InkButton'
import { experience } from '../../data/experience'
import { profile } from '../../data/profile'
import { projectBySlug } from '../../data/projects'
import { cx } from '../../utils/cx'
import { periodLabel } from '../../utils/labels'
import { useTimelineProgress } from '../../hooks/useTimelineProgress'
import { ArcBackdrop } from './ArcBackdrop'
import s from './experience.module.css'

const KIND_LABEL = { job: 'Job', education: 'Education', independent: 'Independent', learning: 'Self-taught' } as const
const MODE_LABEL = { remote: 'Remote', onsite: 'On-site', hybrid: 'Hybrid' } as const

/** Career Arc: a storyline along a neon spine. Newest first, or read from the beginning. */
export default function ExperiencePage() {
  const [order, setOrder] = useState<'newest' | 'oldest'>('newest')
  const timelineRef = useRef<HTMLDivElement>(null)
  useTimelineProgress(timelineRef, order)
  const chapters = [...experience].sort((a, b) => (order === 'newest' ? b.chapter - a.chapter : a.chapter - b.chapter))

  const resume = (
    <InkButton href={profile.resume.href} download={profile.resume.fileName} variant="secondary" icon={<IconDownload />}>
      Download résumé (PDF)
    </InkButton>
  )

  return (
    <div className={s.arc}>
      <ArcBackdrop />
      <div className="page">
        <Seo />
        <div className={s.stack}>
          <ChapterHeading
            number="CH.02"
            kicker="Career arc"
            title="The story so far"
            lede={`From customer care to code: self-taught, then about ${profile.experienceYears} years as a developer across fintech backends, a large JavaScript editor front end and full stack client work.`}
          />

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

          <div ref={timelineRef} className={s.timelineWrap}>
            {/* Story progress: the spine fills and an orb travels down as you read. */}
            <span className={s.spineFill} aria-hidden="true" />
            <span className={s.orb} aria-hidden="true" />
            <ol className={s.timeline} aria-label={order === 'newest' ? 'Career chapters, latest first' : 'Career chapters, oldest first'}>
              {chapters.map((c, i) => {
                const current = Boolean(c.startDate) && !c.endDate && !c.period
                // The plot twist sits between the self-taught chapter and the first developer job.
                const twistAfter = order === 'newest' ? 'niveus' : 'self-taught'
                return (
                  <Fragment key={c.id}>
                    <li className={cx(s.chapter, i % 2 ? s.right : s.left, current && s.current)}>
                      <span className={s.node} aria-hidden="true" data-node />
                      <article className={s.card} aria-labelledby={`ch-${c.id}`} data-reveal-item>
                        <span className={s.numeral} aria-hidden="true">
                          {String(c.chapter).padStart(2, '0')}
                        </span>
                        <p className={s.meta}>
                          <span className={s.kind}>
                            Ch.{String(c.chapter).padStart(2, '0')} · {KIND_LABEL[c.kind]}
                          </span>
                          {periodLabel(c) && <span>{periodLabel(c)}</span>}
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
                        {c.note && (
                          <p className={s.note}>
                            <span className="sr-only">Personal note: </span>
                            {c.note}
                          </p>
                        )}
                        {c.technologies.length > 0 && (
                          <TechTags items={c.technologies} label={`${c.organization} technologies`} tone="paper" max={6} />
                        )}
                        {c.projectSlugs?.length || c.episodes?.length ? (
                          <p className={s.projects}>
                            <span>Episodes:</span>
                            {(c.projectSlugs ?? []).map((slug) => {
                              const p = projectBySlug(slug)
                              return p ? (
                                <Link key={slug} to={`/projects/${slug}`}>
                                  {p.title}
                                </Link>
                              ) : null
                            })}
                            {c.episodes?.map((e) =>
                              typeof e === 'string' ? (
                                <span key={e} className={s.episodeLabel}>
                                  {e}
                                </span>
                              ) : (
                                <a key={e.href} href={e.href} target="_blank" rel="noopener noreferrer">
                                  {e.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                                </a>
                              ),
                            )}
                          </p>
                        ) : null}
                        <NeedsInput items={c.needsInput} />
                      </article>
                    </li>
                    {c.id === twistAfter && (
                      <li className={s.interlude} aria-hidden="true" data-reveal-item>
                        <MascotAction action="draw" className={s.interludeArt} />
                        <SpeechBubble tail="left" className={s.interludeBubble}>
                          Plot twist: the customer care guy learns to code.
                        </SpeechBubble>
                      </li>
                    )}
                  </Fragment>
                )
              })}
            </ol>
          </div>

          <div className={s.toolbar}>{resume}</div>
        </div>
      </div>
    </div>
  )
}
