import { Link } from 'react-router'
import type { Project } from '../../types/content'
import { cx } from '../../utils/cx'
import { CATEGORY_LABEL, CONTRIBUTION_LABEL } from '../../utils/labels'
import type { TileSize } from '../../utils/projectFilters'
import { Stamp } from '../manga'
import { SpeedLines } from '../manga/art'
import { MediaPlaceholder } from './MediaPlaceholder'
import { ProjectWorld, hasWorld } from '../worlds/ProjectWorld'
import { TechTags } from './TechTags'
import s from './tile.module.css'


/**
 * A project as one panel on the Works page. The whole panel is clickable
 * (stretched link on the title), so the hit area is large on touch screens.
 */
export function ProjectTile({ project, size, index }: { project: Project; size: TileSize; index: number }) {
  const media = project.media?.find((m) => m.approvedForPublic && m.src) ?? project.media?.[0]
  const placeholder = project.status === 'placeholder'
  // No approved screenshot yet: show the project's illustrated world, clearly tagged as an illustration.
  const showWorld = !(media?.src && media.approvedForPublic) && hasWorld(project.slug)

  return (
    <article
      className={cx(s.tile, s[size], index % 2 ? s.slantLeft : s.slantRight, placeholder && s.ghost, project.noMedia && s.textOnly)}
      data-reveal-item
    >
      {/* Target-lock brackets, shown on hover/focus */}
      <span className={s.lock} aria-hidden="true" />
      {!project.noMedia && (
        <div className={cx(s.media, showWorld && s.mediaWorld)}>
          <SpeedLines className={s.lines} cx={index % 2 ? 80 : 20} cy={30} seed={index + 11} inner={18} />
          {media?.src && media.approvedForPublic ? (
            <img className={s.img} src={media.src} alt={media.alt} loading="lazy" decoding="async" />
          ) : showWorld ? (
            <ProjectWorld slug={project.slug} variant="tile" />
          ) : placeholder ? (
            <span className={s.soon} aria-hidden="true">
              ???
            </span>
          ) : (
            <MediaPlaceholder item={media} title={project.title} className={s.ph} />
          )}
        </div>
      )}
      <div className={s.body}>
        <p className={s.meta}>
          <span>{CATEGORY_LABEL[project.category]}</span>
          {project.organization && <span>@ {project.organization}</span>}
        </p>
        <h2 className={s.title}>
          <Link to={`/projects/${project.slug}`} className={s.link}>
            {project.title}
          </Link>
        </h2>
        <p className={s.summary}>{project.summary}</p>
        <div className={s.badges}>
          <Stamp status={project.status} />
          {project.contribution && <span className={s.contribution}>{CONTRIBUTION_LABEL[project.contribution]}</span>}
        </div>
        <TechTags items={project.technologies} max={size === 'wide' ? 6 : 4} label={`${project.title} technologies`} />
      </div>
    </article>
  )
}
