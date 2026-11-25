import { Link } from 'react-router'
import type { Project } from '../../types/content'
import { cx } from '../../utils/cx'
import { CATEGORY_LABEL, CONTRIBUTION_LABEL } from '../../utils/labels'
import { useReveal } from '../../hooks/useReveal'
import { Sfx, Stamp } from '../manga'
import { SpeedLines } from '../manga/art'
import { IconKunai } from '../ui/icons'
import { MediaPlaceholder } from './MediaPlaceholder'
import s from './projects.module.css'

export type ShowcaseLayout = 'impact' | 'split' | 'closeup'

const SFX: Record<ShowcaseLayout, string> = { impact: 'ドン', split: 'ズバッ', closeup: 'キラッ' }

/**
 * A featured project as a manga "battle spread". Three compositions rotate so
 * neighbouring spreads never look alike; content stays identical and readable.
 */
export function ProjectShowcase({ project, layout, index }: { project: Project; layout: ShowcaseLayout; index: number }) {
  const ref = useReveal<HTMLElement>()
  const media = project.media?.find((m) => m.approvedForPublic && m.src) ?? project.media?.[0]
  const headingId = `showcase-${project.slug}`

  return (
    <article ref={ref} className={cx(s.showcase, s[layout])} aria-labelledby={headingId}>
      <div className={s.mediaPanel}>
        <div className={s.mediaInner}>
        <SpeedLines className={s.mediaLines} cx={layout === 'split' ? 70 : 50} cy={40} seed={index + 3} />
        {media?.src && media.approvedForPublic ? (
          <img
            className={s.mediaImg}
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <MediaPlaceholder item={media} title={project.title} className={s.mediaPh} />
        )}
        <Sfx text={SFX[layout]} size="clamp(1.75rem, 6vw, 2.75rem)" className={s.showcaseSfx} />
        </div>
      </div>

      <div className={s.textPanel}>
        <p className={s.episode}>
          <span>EP.{String(index + 1).padStart(2, '0')}</span>
          <span>{CATEGORY_LABEL[project.category]}</span>
        </p>
        <h3 id={headingId} className={s.showcaseTitle}>
          {project.title}
        </h3>
        {project.subtitle && <p className={s.showcaseSub}>{project.subtitle}</p>}
        <p>{project.summary}</p>
        <div className={s.badges}>
          <Stamp status={project.status} />
          {project.contribution && <span className={s.contribution}>{CONTRIBUTION_LABEL[project.contribution]}</span>}
          {project.organization && <span className={s.org}>@ {project.organization}</span>}
        </div>
        {project.technologies.length > 0 && (
          <ul className={s.stack} aria-label={`${project.title} technologies`}>
            {project.technologies.slice(0, 6).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        <Link to={`/projects/${project.slug}`} className={s.viewLink}>
          View project<span className="sr-only">: {project.title}</span>
          <IconKunai />
        </Link>
      </div>
    </article>
  )
}
