import { Link, useParams } from 'react-router'
import { Seo } from '../../app/Seo'
import { MangaPanel, NeedsInput, Sfx, Stamp } from '../../components/manga'
import { Drone } from '../../components/manga/Mascot'
import { MascotAction } from '../../components/manga/MascotAction'
import { SpeedLines } from '../../components/manga/art'
import { ScreenshotGallery } from '../../components/projects/ScreenshotGallery'
import { TechTags } from '../../components/projects/TechTags'
import { IconKunai } from '../../components/ui/icons'
import { TerminalWindow } from '../../components/ui/TerminalWindow'
import { projects } from '../../data/projects'
import { CATEGORY_LABEL, CONTRIBUTION_LABEL, formatRange } from '../../utils/labels'
import { relatedProjects } from '../../utils/projectFilters'
import NotFoundPage from '../NotFound/NotFoundPage'
import s from './detail.module.css'

function SectionTitle({ id, kicker, children }: { id: string; kicker: string; children: string }) {
  return (
    <header className={s.sectionHead}>
      <p className={s.sectionKicker}>{kicker}</p>
      <h2 id={id} className={s.sectionTitle}>
        {children}
      </h2>
    </header>
  )
}

export default function ProjectDetailPage() {
  const { slug = '' } = useParams()
  const index = projects.findIndex((p) => p.slug === slug)
  const project = projects[index]
  if (!project) return <NotFoundPage />

  const prev = projects[(index - 1 + projects.length) % projects.length]!
  const next = projects[(index + 1) % projects.length]!
  const ep = `EP.${String(index + 1).padStart(2, '0')}`
  const builtModules = project.modules?.filter((m) => m.status !== 'planned') ?? []
  const plannedModules = project.modules?.filter((m) => m.status === 'planned') ?? []
  const hasFeatures = Boolean(project.features?.built.length || builtModules.length)
  const hasPlanned = Boolean(project.features?.planned?.length || plannedModules.length)
  const hasNotes = Boolean(
    project.challenges?.length || project.decisions?.length || project.lessons?.length || project.architecture,
  )
  const related = relatedProjects(project, projects)

  if (project.status === 'placeholder') {
    return (
      <div className="page">
        <Seo />
        <div className={s.stack}>
          <p className={s.back}>
            <Link to="/projects">← All works</Link>
          </p>
          <MangaPanel surface="night" tone>
            <div className={s.soon}>
              <Drone className={s.soonDrone} />
              <div>
                <p className={s.ep}>{ep} · coming soon</p>
                <h1 className={s.title}>{project.title}</h1>
                <p>{project.summary}</p>
              </div>
            </div>
          </MangaPanel>
          <NeedsInput items={project.needsInput} />
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <Seo />
      <article className={s.stack} aria-labelledby="project-title">
        <p className={s.back}>
          <Link to="/projects">← All works</Link>
        </p>

        {/* 1 · Splash */}
        <header className={s.splash}>
          <SpeedLines className={s.splashLines} color="rgb(0 229 255 / 0.07)" cx={92} cy={10} inner={12} seed={index + 5} />
          <div className={s.splashText}>
            <p className={s.ep}>
              <span>{ep}</span> {CATEGORY_LABEL[project.category]}
            </p>
            <h1 id="project-title" className={s.title}>
              {project.title}
            </h1>
            {project.subtitle && <p className={s.subtitle}>{project.subtitle}</p>}
            <div className={s.badges}>
              <Stamp status={project.status} />
              {project.contribution && <span className={s.chip}>{CONTRIBUTION_LABEL[project.contribution]}</span>}
            </div>
            {(project.demoUrl || project.githubUrl) && (
              <p className={s.links}>
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    {project.category === 'freelance' ? 'Visit live site' : 'Live demo'}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    GitHub repository<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </p>
            )}
          </div>
          <dl className={s.facts}>
            {project.role && (
              <>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </>
            )}
            {project.organization && (
              <>
                <dt>At</dt>
                <dd>{project.organization}</dd>
              </>
            )}
            {project.startDate && (
              <>
                <dt>Timeline</dt>
                <dd>{formatRange(project.startDate, project.endDate)}</dd>
              </>
            )}
            <dt>Stack</dt>
            <dd>
              <TechTags items={project.technologies} label={`${project.title} technologies`} />
            </dd>
          </dl>
          <Sfx text="ドン" size="clamp(2rem, 6vw, 3.25rem)" className={s.splashSfx} />
        </header>

        <NeedsInput items={project.needsInput} />

        {project.visibility === 'restricted' && (
          <p className={s.notice}>
            <strong>Confidential work.</strong> Details here are limited to what's publicly shareable; internal data
            and screens stay private.
          </p>
        )}

        {/* 2 · Overview */}
        {(project.problem || project.description) && (
          <section aria-labelledby="overview-title">
            <MangaPanel as="div" surface="paper" slant="right">
              <div className={s.panelBody}>
                <SectionTitle id="overview-title" kicker="Overview">
                  The mission
                </SectionTitle>
                {project.problem && <p className={s.lede}>{project.problem}</p>}
                {project.description && <p>{project.description}</p>}
              </div>
            </MangaPanel>
          </section>
        )}

        {/* 3 · My role vs team */}
        {(project.responsibilities?.length || project.teamContext) && (
          <section aria-labelledby="role-title" className={s.section} data-reveal-item>
            <SectionTitle id="role-title" kicker="Dossier">
              My part in it
            </SectionTitle>
            <div className={s.roleGrid}>
              {project.responsibilities?.length ? (
                <div className={s.didBox}>
                  <h3 className={s.boxTitle}>What I did</h3>
                  <ul className={s.list}>
                    {project.responsibilities.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {project.teamContext && (
                <div className={s.teamBox}>
                  <h3 className={s.boxTitle}>Team context</h3>
                  <p>{project.teamContext}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4 · Features & roadmap */}
        {(hasFeatures || hasPlanned) && (
          <section aria-labelledby="features-title" className={s.section} data-reveal-item>
            <SectionTitle id="features-title" kicker="Abilities unlocked">
              {builtModules.length ? 'Modules' : 'Features'}
            </SectionTitle>
            <div className={s.featGrid}>
              {hasFeatures && (
                <div className={s.builtBox}>
                  <h3 className={s.boxTitle}>Built</h3>
                  {builtModules.length > 0 ? (
                    <ul className={s.modules}>
                      {builtModules.map((m) => (
                        <li key={m.name}>
                          <div className={s.moduleHead}>
                            <span className={s.moduleName}>{m.name}</span>
                            <Stamp status={m.status} />
                          </div>
                          <p>{m.summary}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className={s.list}>
                      {project.features?.built.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {hasPlanned && (
                <div className={s.plannedBox}>
                  <h3 className={s.boxTitle}>Roadmap (not built yet)</h3>
                  <ul className={s.planned}>
                    {plannedModules.map((m) => (
                      <li key={m.name}>
                        <strong>{m.name}</strong>: {m.summary}
                      </li>
                    ))}
                    {project.features?.planned?.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 5 · Engineering notes */}
        {hasNotes && (
          <section aria-labelledby="notes-title" className={s.section} data-reveal-item>
            <SectionTitle id="notes-title" kicker="Behind the panels">
              Engineering notes
            </SectionTitle>
            <div className={s.notes}>
              {project.challenges?.length ? (
                <TerminalWindow title="challenges.log" accent="magenta" className={s.notesWide} as="div">
                  <ol className={s.challenges}>
                    {project.challenges.map((c) => (
                      <li key={c.problem}>
                        <p className={s.problem}>
                          <span aria-hidden="true">! </span>
                          <span className="sr-only">Problem: </span>
                          {c.problem}
                        </p>
                        <p className={s.solution}>
                          <span aria-hidden="true">&gt; </span>
                          <span className="sr-only">Solution: </span>
                          {c.solution}
                        </p>
                      </li>
                    ))}
                  </ol>
                </TerminalWindow>
              ) : null}
              {project.architecture && (
                <TerminalWindow title="architecture.md" as="div">
                  <p>{project.architecture.summary}</p>
                </TerminalWindow>
              )}
              {project.decisions?.length ? (
                <TerminalWindow title="decisions.md" as="div">
                  <ul className={s.termList}>
                    {project.decisions.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </TerminalWindow>
              ) : null}
              {project.lessons?.length ? (
                <TerminalWindow title="lessons.txt" accent="yellow" as="div">
                  <ul className={s.termList}>
                    {project.lessons.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </TerminalWindow>
              ) : null}
            </div>
          </section>
        )}

        {/* 6 · Media */}
        {project.media?.length ? (
          <section aria-labelledby="media-title" className={s.section} data-reveal-item>
            <SectionTitle id="media-title" kicker="Panels">
              Screens
            </SectionTitle>
            <ScreenshotGallery media={project.media} title={project.title} />
          </section>
        ) : null}

        {/* 7 · Related */}
        {related.length > 0 && (
          <section aria-labelledby="related-title" className={s.section} data-reveal-item>
            <SectionTitle id="related-title" kicker="Crossovers">
              Related series
            </SectionTitle>
            <ul className={s.related}>
              {related.map((r) => (
                <li key={r.id}>
                  <Link to={`/projects/${r.slug}`} className={s.relatedLink}>
                    <span className={s.relatedTitle}>{r.title}</span>
                    <span className={s.relatedSub}>{r.subtitle ?? CATEGORY_LABEL[r.category]}</span>
                    <IconKunai />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 8 · Episode navigation */}
        <div className={s.toNext} aria-hidden="true">
          <MascotAction action="throw" className={s.toNextArt} />
        </div>
        <nav aria-label="Other episodes" className={s.episodes}>
          <Link to={`/projects/${prev.slug}`} rel="prev" className={s.epLink}>
            <span className={s.epDir}>← Previous episode</span>
            <span className={s.epName}>{prev.title}</span>
          </Link>
          <Link to={`/projects/${next.slug}`} rel="next" className={s.epLink}>
            <span className={s.epDir}>Next episode →</span>
            <span className={s.epName}>{next.title}</span>
          </Link>
        </nav>
      </article>
    </div>
  )
}
