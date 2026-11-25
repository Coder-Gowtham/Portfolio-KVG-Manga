import { useId, useState } from 'react'
import type { Project, ProjectCategory } from '../../types/content'
import { cx } from '../../utils/cx'
import { CATEGORY_LABEL } from '../../utils/labels'
import { CATEGORY_ORDER, categoryCounts, techOptions, type ProjectFilter } from '../../utils/projectFilters'
import s from './filters.module.css'

/** Short chip labels; the full label stays available to screen readers via the button text. */
const SHORT: Record<ProjectCategory, string> = {
  professional: 'Professional',
  freelance: 'Client',
  personal: 'Personal',
  experiment: 'Experiment',
}

/**
 * Compact filter bar: one row of category chips (scrolls sideways on phones)
 * plus a Tech toggle that reveals technology chips. State lives in the URL.
 */
export function ProjectFilters({
  projects,
  value,
  onChange,
}: {
  projects: Project[]
  value: ProjectFilter
  onChange: (next: ProjectFilter) => void
}) {
  const catId = useId()
  const panelId = useId()
  const counts = categoryCounts(projects)
  const cats = CATEGORY_ORDER.filter((c) => (counts.get(c) ?? 0) > 0)
  const techs = techOptions(projects)
  const [techOpen, setTechOpen] = useState(value.tech.length > 0)

  const setCategory = (c: ProjectCategory | null) => onChange({ ...value, category: c })
  const toggleTech = (slug: string) =>
    onChange({
      ...value,
      tech: value.tech.includes(slug) ? value.tech.filter((t) => t !== slug) : [...value.tech, slug],
    })

  return (
    <div className={s.filters}>
      <div className={s.bar}>
        <p id={catId} className="sr-only">
          Category
        </p>
        <div role="group" aria-labelledby={catId} className={s.scroller}>
          <button type="button" className={s.chip} aria-pressed={value.category === null} onClick={() => setCategory(null)}>
            All <span className={s.count}>{projects.length}</span>
          </button>
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              className={s.chip}
              aria-pressed={value.category === c}
              onClick={() => setCategory(value.category === c ? null : c)}
            >
              <span aria-hidden="true">{SHORT[c]}</span>
              <span className="sr-only">{CATEGORY_LABEL[c]}</span>
              <span className={s.count}>{counts.get(c)}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className={cx(s.chip, s.techToggle)}
          aria-expanded={techOpen}
          aria-controls={panelId}
          onClick={() => setTechOpen((o) => !o)}
        >
          <span className={s.plus} aria-hidden="true">
            {techOpen ? '−' : '+'}
          </span>
          Technology
          {value.tech.length > 0 && <span className={s.selected}>{value.tech.length}</span>}
        </button>
      </div>

      <div id={panelId} role="group" aria-label="Technology" className={s.techChips} hidden={!techOpen}>
        {techs.map((t) => (
          <button
            key={t.slug}
            type="button"
            className={cx(s.chip, s.techChip)}
            aria-pressed={value.tech.includes(t.slug)}
            onClick={() => toggleTech(t.slug)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
