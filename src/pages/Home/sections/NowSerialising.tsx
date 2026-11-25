import { ChapterHeading, MangaPanel, Stamp } from '../../../components/manga'
import { Burst, SpeedLines } from '../../../components/manga/art'
import { InkButton } from '../../../components/ui/InkButton'
import { projectBySlug } from '../../../data/projects'
import { useReveal } from '../../../hooks/useReveal'
import s from '../home.module.css'

/** 06 · Now serialising: the in-development project, with built and planned work kept apart. */
export function NowSerialising({ slug = 'vscc-erp' }: { slug?: string }) {
  const ref = useReveal<HTMLElement>()
  const project = projectBySlug(slug)
  if (!project) return null

  const built = (project.modules ?? []).filter((m) => m.status !== 'planned')
  const planned = (project.modules ?? []).filter((m) => m.status === 'planned')

  return (
    <section ref={ref} className={s.section} aria-labelledby="now-title">
      <ChapterHeading number="NOW" kicker="Currently building" title="Now serialising" level={2} />
      <MangaPanel as="div" surface="night" neon className={s.now}>
        <SpeedLines className={s.nowLines} color="rgb(0 229 255 / 0.08)" cx={85} cy={15} inner={10} seed={21} />
        <div className={s.nowBody}>
        <div className={s.nowHead}>
          <div>
            <h3 id="now-title" className={s.nowTitle}>
              {project.title}
            </h3>
            {project.subtitle && <p className={s.nowSub}>{project.subtitle}</p>}
          </div>
          <Burst className={s.nowBurst}>
            <span className={s.burstLabel}>NEW</span>
            <span className={s.burstTitle}>ARC</span>
          </Burst>
        </div>
        <div className={s.nowMeta}>
          <Stamp status={project.status} />
          <ul className={s.nowStack} aria-label="Technologies">
            {project.technologies.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <p className={s.nowSummary}>{project.summary}</p>

        <div className={s.nowCols}>
          <div>
            <h4 className={s.nowColTitle}>Built so far</h4>
            <ul className={s.modules}>
              {built.map((m) => (
                <li key={m.name} className={s.module}>
                  <span className={s.moduleName}>{m.name}</span>
                  <Stamp status={m.status} />
                </li>
              ))}
            </ul>
          </div>
          {planned.length > 0 && (
            <div>
              <h4 className={s.nowColTitle}>Planned next</h4>
              <ul className={s.modulesPlanned}>
                {planned.map((m) => (
                  <li key={m.name}>{m.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <InkButton to={`/projects/${project.slug}`} className={s.nowCta}>
          Follow the series
        </InkButton>
        </div>
      </MangaPanel>
    </section>
  )
}
