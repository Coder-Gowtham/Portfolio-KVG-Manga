import { Link } from 'react-router'
import { ChapterHeading, Stamp } from '../../../components/manga'
import { MascotAction } from '../../../components/manga/MascotAction'
import { InkButton } from '../../../components/ui/InkButton'
import { home } from '../../../data/home'
import { projectBySlug } from '../../../data/projects'
import { profile } from '../../../data/profile'
import { cx } from '../../../utils/cx'
import s from '../home.module.css'

/** Now building (VSCC ERP, summarised) beside the next arc (AI integration, framed as training). */
export function NowBuilding({ slug = 'vscc-erp' }: { slug?: string }) {
  const project = projectBySlug(slug)
  if (!project) return null
  const modules = project.modules ?? []
  const built = modules.filter((m) => m.status !== 'planned')
  const count = (st: string) => built.filter((m) => m.status === st).length
  const done = count('done')
  const testing = count('testing') + count('partly-done')
  const arc = profile.nextArc

  return (
    <section className={s.section} aria-labelledby="now-title">
      <ChapterHeading id="now-title" number="NOW" kicker="Currently" title="Building and training" level={2} />
      <div className={s.nowGrid}>
        <article className={s.nowCard} aria-labelledby="now-project" data-reveal-item>
          <p className={s.workKicker}>Now serialising</p>
          <h3 id="now-project" className={s.workTitle}>
            {project.title}
          </h3>
          {project.subtitle && <p className={s.workSub}>{project.subtitle}</p>}
          <p className={s.workSummary}>{project.summary}</p>

          <div className={s.progress}>
            <p className={s.progressLabel}>
              <strong>{done}</strong> of {built.length} modules done · <strong>{testing}</strong> in testing
            </p>
            <span className={s.progressBar} aria-hidden="true">
              {built.map((m) => (
                <span key={m.name} className={cx(s.seg, s[`seg-${m.status}`])} />
              ))}
            </span>
          </div>

          <p className={s.workFoot}>
            <Stamp status={project.status} />
          </p>
          <InkButton to={`/projects/${project.slug}`} variant="secondary" className={s.nowCta}>
            Follow the series
          </InkButton>
        </article>

        <article className={cx(s.nowCard, s.arcCard)} aria-labelledby="training-title" data-reveal-item>
          <MascotAction action="power" className={s.arcPose} />
          <p className={s.workKicker}>{arc.label}</p>
          <h3 id="training-title" className={s.workTitle}>
            {arc.title}
          </h3>
          <p className={s.stampRow}>
            <Stamp status="training" />
          </p>
          <p className={s.workSummary}>{arc.text}</p>
          <ul className={s.drills}>
            {home.training.drills.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className={s.calmLinks}>
            <span className={s.mission}>First mission:</span>
            <Link to={`/projects/${home.training.firstMission.slug}`}>{home.training.firstMission.label}</Link>
          </p>
        </article>
      </div>
    </section>
  )
}
