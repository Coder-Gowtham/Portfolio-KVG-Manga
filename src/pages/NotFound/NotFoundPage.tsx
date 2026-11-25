import { Seo } from '../../app/Seo'
import { ChapterHeading, MangaPanel } from '../../components/manga'
import { MascotAction } from '../../components/manga/MascotAction'
import { InkButton } from '../../components/ui/InkButton'
import s from '../pages.module.css'

export default function NotFoundPage() {
  return (
    <div className="page">
      <Seo title="Page not found — Gowtham KV" description="This page got refactored out of existence." />
      <MangaPanel surface="paper" slant="left" neon>
        <div className={`${s.split} ${s.splitArt}`}>
          <div className={s.stack}>
            <ChapterHeading number="404" kicker="Missing page" title="Refactored out of existence" glitch />
            <div className={s.actions}>
              <InkButton to="/">Back to home</InkButton>
              <InkButton to="/projects" variant="paper">
                Browse works
              </InkButton>
            </div>
          </div>
          <div className={s.art}>
            <MascotAction action="slash" className={s.actionArt} label="KVG slicing the missing page in half with his katana" />
          </div>
        </div>
      </MangaPanel>
    </div>
  )
}
