import { Link } from 'react-router'
import { ChapterHeading, MangaPanel, Stamp } from '../../../components/manga'
import { Drone } from '../../../components/manga/Mascot'
import { MascotAction } from '../../../components/manga/MascotAction'
import { SpeedLines } from '../../../components/manga/art'
import { home } from '../../../data/home'
import { profile } from '../../../data/profile'
import { useReveal } from '../../../hooks/useReveal'
import s from '../home.module.css'

/** "Next arc": the AI integration training arc. Framed as in progress, never as mastered. */
export function TrainingArc() {
  const ref = useReveal<HTMLElement>()
  const arc = profile.nextArc
  return (
    <section ref={ref} className={s.section} aria-labelledby="training-title">
      <ChapterHeading number="NEXT ARC" kicker="Training arc" title={arc.title} level={2} id="training-title" />
      <MangaPanel as="div" surface="paper" slant="right" className={s.training}>
        <SpeedLines className={s.trainingLines} cx={88} cy={20} inner={14} seed={42} color="rgb(10 10 15 / 0.14)" />
        <div className={s.trainingGrid}>
          <div className={s.trainingText}>
            <Stamp status="training" />
            <p className={s.trainingLede}>{arc.text}</p>
            <h3 className={s.trainingSub}>Training drills</h3>
            <ol className={s.drills}>
              {home.training.drills.map((d, i) => (
                <li key={d}>
                  <span className={s.drillNo} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {d}
                </li>
              ))}
            </ol>
            <p className={s.trainingMission}>
              <span>First mission</span>
              <Link to={`/projects/${home.training.firstMission.slug}`}>{home.training.firstMission.label}</Link>
            </p>
          </div>
          <div className={s.trainingArt} aria-hidden="true">
            <MascotAction action="power" className={s.trainingPose} />
            <Drone className={s.trainingDrone} />
            <span className={s.trainingChip}>LLM.LINK // SYNCING</span>
          </div>
        </div>
      </MangaPanel>
    </section>
  )
}
