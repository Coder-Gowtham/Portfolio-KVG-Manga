import type { ReactNode } from 'react'
import { MangaPanel } from '../components/manga'
import s from './pages.module.css'

/** Marks a page section that a later phase will build. Removed as pages ship. */
export function WipPanel({ phase, children }: { phase: number; children: ReactNode }) {
  return (
    <MangaPanel surface="night" tone>
      <div className={s.wip}>
        <p className={s.wipLabel}>// Panel inking in progress · Phase {phase}</p>
        <div>{children}</div>
      </div>
    </MangaPanel>
  )
}
