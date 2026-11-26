import { Link } from 'react-router'
import { ChapterHeading, Stamp } from '../../../components/manga'
import { ProjectWorld } from '../../../components/worlds/ProjectWorld'
import { hasWorld } from '../../../data/worlds'
import { featuredProjects } from '../../../data/projects'
import { CATEGORY_LABEL } from '../../../utils/labels'
import s from '../home.module.css'

const MAX_TAGS = 4

/** Featured works: three cards, each opening on the project's illustrated world (tagged as an illustration). */
export function Featured() {
  const list = featuredProjects()
    .filter((p) => p.status !== 'in-development')
    .slice(0, 3)
  return (
    <section className={s.section} aria-labelledby="featured-title">
      <ChapterHeading id="featured-title" number="CH.01" kicker="Featured series" title="Selected works" level={2} />
      <ul className={s.works}>
        {list.map((p, i) => (
          <li key={p.id}>
            <article className={s.work} data-reveal-item>
              {hasWorld(p.slug) && (
                <div className={s.workWorld}>
                  <ProjectWorld slug={p.slug} variant="tile" />
                </div>
              )}
              <p className={s.workKicker}>
                <span aria-hidden="true">EP.{String(i + 1).padStart(2, '0')} · </span>
                {CATEGORY_LABEL[p.category]}
              </p>
              <h3 className={s.workTitle}>
                <Link to={`/projects/${p.slug}`} className={s.workLink}>
                  {p.title}
                </Link>
              </h3>
              {p.subtitle && <p className={s.workSub}>{p.subtitle}</p>}
              <p className={s.workSummary}>{p.summary}</p>
              <ul className={s.workTags} aria-label="Technologies">
                {p.technologies.slice(0, MAX_TAGS).map((t) => (
                  <li key={t}>{t}</li>
                ))}
                {p.technologies.length > MAX_TAGS && (
                  <li aria-label={`and ${p.technologies.length - MAX_TAGS} more`}>+{p.technologies.length - MAX_TAGS}</li>
                )}
              </ul>
              <p className={s.workFoot}>
                <Stamp status={p.status} />
                <span className={s.workMore} aria-hidden="true">
                  View →
                </span>
              </p>
            </article>
          </li>
        ))}
      </ul>
      <p className={s.calmLinks}>
        <Link to="/projects">All works →</Link>
      </p>
    </section>
  )
}
