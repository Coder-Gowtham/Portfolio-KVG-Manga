import { Seo } from '../../app/Seo'
import { home } from '../../data/home'
import { Abilities } from './sections/Abilities'
import { Cover } from './sections/Cover'
import { Featured } from './sections/Featured'
import { FinalPanel } from './sections/FinalPanel'
import { NowBuilding } from './sections/NowBuilding'
import { HomeBackdrop } from './HomeBackdrop'
import s from './home.module.css'

/**
 * Home: a short read. Five sections; only the cover and the final panel get the
 * full manga treatment, everything between stays calm. Depth lives on the inner pages.
 */
export default function HomePage() {
  return (
    <div className={s.stage}>
      <HomeBackdrop />
      <Seo />
      <p className={s.hud}>
        <span className={s.hudDot} aria-hidden="true" />
        {home.status.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </p>
      <div className={s.home}>
        <Cover />
        <Abilities />
        <Featured />
        <NowBuilding />
        <FinalPanel />
      </div>
    </div>
  )
}
