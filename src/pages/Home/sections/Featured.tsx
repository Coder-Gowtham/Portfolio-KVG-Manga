import { ChapterHeading } from '../../../components/manga'
import { ProjectShowcase, type ShowcaseLayout } from '../../../components/projects/ProjectShowcase'
import { InkButton } from '../../../components/ui/InkButton'
import { featuredProjects } from '../../../data/projects'
import s from '../home.module.css'

const LAYOUTS: ShowcaseLayout[] = ['impact', 'split', 'closeup']

/** 04 · Featured series as battle spreads. The in-development project gets its own section below. */
export function Featured() {
  const list = featuredProjects().filter((p) => p.status !== 'in-development')
  return (
    <section className={s.section} aria-labelledby="featured-title">
      <ChapterHeading id="featured-title" number="CH.01" kicker="Featured series" title="Battle-tested works" level={2} />
      <div className={s.spreads}>
        {list.map((p, i) => (
          <ProjectShowcase key={p.id} project={p} layout={LAYOUTS[i % LAYOUTS.length]!} index={i} />
        ))}
      </div>
      <div className={s.sectionCta}>
        <InkButton to="/projects" variant="secondary">
          All works
        </InkButton>
      </div>
    </section>
  )
}
