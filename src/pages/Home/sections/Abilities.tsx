import { useState } from 'react'
import { ChapterHeading } from '../../../components/manga'
import { skills } from '../../../data/skills'
import { useMediaQuery } from '../../../hooks/useMediaQuery'
import { useReveal } from '../../../hooks/useReveal'
import { cx } from '../../../utils/cx'
import s from '../home.module.css'

/**
 * 03 · Abilities. Phones: accordion with the first two categories open.
 * Desktop: every category open in an asymmetric panel grid.
 */
export function Abilities() {
  const ref = useReveal<HTMLElement>()
  const desktop = useMediaQuery('(min-width: 1024px)')
  const [open, setOpen] = useState<Set<string>>(() => new Set(skills.slice(0, 2).map((c) => c.id)))

  return (
    <section ref={ref} className={s.section} aria-labelledby="abilities-title">
      <ChapterHeading
        id="abilities-title"
        number="STATS"
        kicker="Skill tree"
        title="Abilities"
        level={2}
        lede="What I use, and what I use it for. No made-up percentages."
      />
      <div className={s.abilities}>
        {skills.map((cat) => {
          const isOpen = desktop || open.has(cat.id)
          return (
            <details
              key={cat.id}
              className={cx(s.ability, desktop && s.abilityStatic)}
              open={isOpen}
              onToggle={(e) => {
                if (desktop) return
                const nowOpen = e.currentTarget.open
                setOpen((prev) => {
                  if (prev.has(cat.id) === nowOpen) return prev
                  const next = new Set(prev)
                  if (nowOpen) next.add(cat.id)
                  else next.delete(cat.id)
                  return next
                })
              }}
            >
              <summary
                className={s.abilitySummary}
                tabIndex={desktop ? -1 : undefined}
                onClick={(e) => {
                  // On desktop every category stays open.
                  if (desktop) e.preventDefault()
                }}
              >
                <span className={s.abilityKicker}>{cat.kicker}</span>
                <span className={s.abilityTitle}>{cat.title}</span>
                <span className={s.abilityCount}>{cat.skills.length}</span>
              </summary>
              <ul className={s.skillList}>
                {cat.skills.map((k) => (
                  <li key={k.name} className={s.skill}>
                    <span className={s.skillName}>{k.name}</span>
                    <span className={s.skillNote}>{k.note}</span>
                  </li>
                ))}
              </ul>
            </details>
          )
        })}
      </div>
    </section>
  )
}
