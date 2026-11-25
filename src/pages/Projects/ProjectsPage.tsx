import { useSearchParams } from 'react-router'
import { Seo } from '../../app/Seo'
import { ChapterHeading, SpeechBubble } from '../../components/manga'
import { Drone } from '../../components/manga/Mascot'
import { MascotAction } from '../../components/manga/MascotAction'
import { ProjectFilters } from '../../components/projects/ProjectFilters'
import { ProjectTile } from '../../components/projects/ProjectTile'
import { projects } from '../../data/projects'
import { applyFilter, pageLayout, parseFilter, toParams, type ProjectFilter } from '../../utils/projectFilters'
import s from './projects.module.css'

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

  const update = (next: ProjectFilter) => setParams(toParams(next), { replace: true, preventScrollReset: true })

  return (
    <div className="page">
      <Seo />
      <div className={s.stack}>
        <div className={s.head}>
          <ChapterHeading
            number="CH.01"
            kicker="Works"
            title="Series index"
            lede="Professional, client and personal series. Filter by type or technology; the link keeps your filters."
          />
          <MascotAction action="slash" className={s.headArt} />
        </div>

        <ProjectFilters projects={projects} value={filter} onChange={update} />

        <p className={s.count} role="status" aria-live="polite">
          Showing {list.length} of {projects.length} series
        </p>

        {list.length > 0 ? (
          <ul className={s.grid}>
            {list.map((p, i) => (
              <li key={p.id} className={s[sizes[i] ?? 'regular']}>
                <ProjectTile project={p} size={sizes[i] ?? 'regular'} index={i} />
              </li>
            ))}
          </ul>
        ) : (
          <div className={s.empty}>
            <Drone className={s.emptyDrone} />
            <SpeechBubble>No series match. Try fewer filters?</SpeechBubble>
            <button type="button" className={s.emptyClear} onClick={() => update({ category: null, tech: [] })}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
