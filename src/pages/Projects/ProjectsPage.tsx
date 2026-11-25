import { Fragment, useRef, type CSSProperties } from 'react'
import { useSearchParams } from 'react-router'
import { Seo } from '../../app/Seo'
import { ChapterHeading, SpeechBubble } from '../../components/manga'
import { Drone } from '../../components/manga/Mascot'
import { MascotAction } from '../../components/manga/MascotAction'
import { ProjectFilters } from '../../components/projects/ProjectFilters'
import { ProjectTile } from '../../components/projects/ProjectTile'
import { projects } from '../../data/projects'
import { cx } from '../../utils/cx'
import { applyFilter, interludeAfter, pageLayout, parseFilter, toParams, type ProjectFilter } from '../../utils/projectFilters'
import s from './projects.module.css'
import { WorksBackdrop } from './WorksBackdrop'

/** Featured series first (by featuredOrder), then the rest in data order. */
const ordered = [...projects].sort((a, b) => {
  if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1
  return (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99)
})

export default function ProjectsPage() {
  const [params, setParams] = useSearchParams()
  const filter = parseFilter(params)
  const list = applyFilter(ordered, filter)
  const sizes = pageLayout(list.length)
  const interlude = list.length >= 2 ? interludeAfter(sizes) : -1
  const active = filter.category !== null || filter.tech.length > 0
  // Re-deal the cards when the filter changes (skip the first render; the page-enter covers it).
  const filterKey = toParams(filter).toString()
  const firstKey = useRef(filterKey)
  const dealt = filterKey !== firstKey.current

  const update = (next: ProjectFilter) => setParams(toParams(next), { replace: true, preventScrollReset: true })

  return (
    <div className={s.works}>
      <WorksBackdrop />
      <div className="page">
        <Seo />
        <div className={s.stack}>
          <ChapterHeading
            number="CH.01"
            kicker="Works"
            title="Mission log"
            lede="Day jobs, client contracts and side quests. Filter by type or tech; the link keeps your filters."
          />

          <ProjectFilters projects={projects} value={filter} onChange={update} />

          <div className={s.countRow}>
            <p key={`count-${filterKey}`} className={cx(s.count, dealt && s.countFlash)} role="status" aria-live="polite">
              Showing {list.length} of {projects.length} missions
            </p>
            {active && (
              <button type="button" className={s.clear} onClick={() => update({ category: null, tech: [] })}>
                Clear filters
              </button>
            )}
          </div>

          {list.length > 0 ? (
            <ul key={filterKey} className={cx(s.grid, dealt && s.deal)}>
              {list.map((p, i) => (
                <Fragment key={p.id}>
                  <li className={s[sizes[i] ?? 'regular']} style={{ '--i': i } as CSSProperties}>
                    <ProjectTile project={p} size={sizes[i] ?? 'regular'} index={i} />
                  </li>
                  {i === interlude && (
                    <li className={s.interlude} aria-hidden="true" data-reveal-item>
                      <MascotAction action="slash" className={s.interludeArt} />
                      <SpeechBubble tail="left" className={s.interludeBubble}>
                        Pick a mission. I’ll handle the bugs.
                      </SpeechBubble>
                    </li>
                  )}
                </Fragment>
              ))}
            </ul>
          ) : (
            <div className={s.empty}>
              <Drone className={s.emptyDrone} />
              <SpeechBubble>No missions match. Try fewer filters?</SpeechBubble>
              <button type="button" className={s.emptyClear} onClick={() => update({ category: null, tech: [] })}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
