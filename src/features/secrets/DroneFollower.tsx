import { useEffect, useRef } from 'react'
import { Drone } from '../../components/manga/Mascot'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useSecret } from './secretStore'
import s from './secrets.module.css'

/** The bug-hunter drone trails the cursor on every page. Mouse/trackpad only, never with reduced motion. */
export function DroneFollower() {
  const { droneFollow } = useSecret()
  const fine = useMediaQuery('(pointer: fine)')
  const calm = useMediaQuery('(prefers-reduced-motion: reduce)')
  const on = droneFollow && fine && !calm
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!on) return
    let target = { x: window.innerWidth - 80, y: window.innerHeight - 120 }
    let pos = { ...target }
    let frame = 0
    const onMove = (e: PointerEvent) => {
      target = { x: e.clientX + 18, y: e.clientY + 14 }
    }
    const tick = () => {
      pos = { x: pos.x + (target.x - pos.x) * 0.12, y: pos.y + (target.y - pos.y) * 0.12 }
      const tilt = Math.max(-14, Math.min(14, (target.x - pos.x) * 0.2))
      if (el.current) el.current.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${tilt}deg)`
      frame = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove)
    frame = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [on])

  if (!on) return null
  return (
    <div ref={el} className={s.follower} aria-hidden="true">
      <Drone className={s.followerDrone} />
    </div>
  )
}
