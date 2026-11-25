import { Seo } from '../../app/Seo'
import { home } from '../../data/home'
import { Abilities } from './sections/Abilities'
import { ArcStrip } from './sections/ArcStrip'
import { Cover } from './sections/Cover'
import { Featured } from './sections/Featured'
import { FinalPanel } from './sections/FinalPanel'
import { NowSerialising } from './sections/NowSerialising'
import { Recap } from './sections/Recap'
import { TrainingArc } from './sections/TrainingArc'
import s from './home.module.css'

/** Home: one issue of Weekly KVG, cover to final panel (Phase 2 spec §3). */
export default function HomePage() {
  return (
    <>
      <Seo />
      <p className={s.hud}>
        <span className={s.hudDot} aria-hidden="true" />
        {home.status.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </p>
      <div className={s.home}>
        <Cover />
        <Recap />
        <Abilities />
        <Featured />
        <ArcStrip />
        <NowSerialising />
        <TrainingArc />
        <FinalPanel />
      </div>
    </>
  )
}
