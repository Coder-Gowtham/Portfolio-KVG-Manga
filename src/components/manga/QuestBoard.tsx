import type { CSSProperties } from 'react'
import { quests, type QuestId } from '../../data/quests'
import { cx } from '../../utils/cx'
import s from './quests.module.css'

interface QuestBoardProps {
  /** Interactive mode (Contact): notices become toggle buttons. */
  selected?: QuestId | null
  onSelect?: (id: QuestId | null) => void
  /** Pin the notices up on mount (for boards that are on screen at load). */
  entrance?: boolean
  label?: string
  className?: string
}

/** Quest board: full-time, contract, freelance and collaboration as pinned notices. */
export function QuestBoard({ selected = null, onSelect, entrance = false, label = 'Open to', className }: QuestBoardProps) {
  return (
    <ul className={cx(s.quests, entrance && s.entrance, className)} aria-label={label}>
      {quests.map((q, i) => {
        const body = (
          <>
            <span className={s.tag}>{q.tag}</span>
            <span className={s.title}>{q.title}</span>
          </>
        )
        return (
          <li key={q.id} className={s.item} style={{ '--i': i } as CSSProperties}>
            {onSelect ? (
              <button
                type="button"
                className={cx(s.quest, s.button)}
                aria-pressed={selected === q.id}
                onClick={() => onSelect(selected === q.id ? null : q.id)}
              >
                {body}
              </button>
            ) : (
              <span className={s.quest}>{body}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
