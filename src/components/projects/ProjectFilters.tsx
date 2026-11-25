import { useId, useState } from 'react'
import type { Project, ProjectCategory } from '../../types/content'
import { cx } from '../../utils/cx'
import { CATEGORY_LABEL } from '../../utils/labels'
import { CATEGORY_ORDER, categoryCounts, techOptions, type ProjectFilter } from '../../utils/projectFilters'
import s from './filters.module.css'

/**
 * Category + technology filters. Toggle buttons (aria-pressed), so every
 * filter is one tap and fully keyboard-operable. State lives in the URL.
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
  const techId = useId()
  const counts = categoryCounts(projects)
  const cats = CATEGORY_ORDER.filter((c) => (counts.get(c) ?? 0) > 0)
  const techs = techOptions(projects)
  const active = value.category !== null || value.tech.length > 0
  const [techOpen, setTechOpen] = useState(value.tech.length > 0)

  const setCategory = (c: ProjectCategory | null) => onChange({ ...value, category: c })
  const toggleTech = (slug: string) =>
    onChange({
      ...value,
      tech: value.tech.includes(slug) ? value.tech.filter((t) => t !== slug) : [...value.tech, slug],
    })

  return (
    <div className={s.filters}>
      <div role="group" aria-labelledby={catId} className={s.group}>
        <p id={catId} className={s.label}>
          Category
        </p>
        <div className={s.chips}>
          <button
            type="button"
            className={s.chip}
            aria-pressed={value.category === null}
            onClick={() => setCategory(null)}
          >
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
              {CATEGORY_LABEL[c]} <span className={s.count}>{counts.get(c)}</span>
            </button>
          ))}
        </div>
      </div>

      <details className={s.techBox} open={techOpen} onToggle={(e) => setTechOpen(e.currentTarget.open)}>
        <summary className={s.techSummary}>
          <span id={techId}>Technology</span>
          {value.tech.length > 0 && <span className={s.selected}>{value.tech.length} selected</span>}
        </summary>
        <div role="group" aria-labelledby={techId} className={cx(s.chips, s.techChips)}>
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
      </details>

      {active && (
        <button type="button" className={s.clear} onClick={() => onChange({ category: null, tech: [] })}>
          Clear filters
        </button>
      )}
    </div>
  )
}
