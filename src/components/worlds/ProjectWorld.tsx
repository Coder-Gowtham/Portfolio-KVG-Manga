import { useEffect, useId, useLayoutEffect, useRef, useState, type ComponentType, type CSSProperties, type RefObject } from 'react'
import { loadMotion, prefersReducedMotion } from '../../motion/gsap'
import { WORLDS } from '../../data/worlds'
import { cx } from '../../utils/cx'
import { FoundationScene, IntelligenceScene, InterfaceScene, NexusScene, PresenceScene } from './scenes'
import s from './worlds.module.css'

const SCENES: Record<string, ComponentType<{ p: string }>> = {
  'times-black': NexusScene,
  clusterix: InterfaceScene,
  'loglens-ai': IntelligenceScene,
  'roshan-tiwari-consultants': PresenceScene,
  'vscc-erp': FoundationScene,
}

/** True while the element is on screen; drives the looping micro-animations. */
function useOnScreen(ref: RefObject<Element | null>) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setOn(!!e?.isIntersecting), { rootMargin: '80px' })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return on
}

/**
 * Entrance for the full-size scene: layers rise in back to front and a light
 * sweeps across, the first time the scene scrolls into view. GSAP, lazy-loaded.
 */
function useWorldEntrance(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useLayoutEffect(() => {
    const root = ref.current
    if (!root || !enabled || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return
    let revert: (() => void) | undefined
    let done = false
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting || done) return
        done = true
        io.disconnect()
        loadMotion()
          .then(({ gsap }) => {
            const ctx = gsap.context(() => {
              const q = gsap.utils.selector(root)
              const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
              tl.fromTo(q('[data-w-layer="bg"]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0)
                .fromTo(q('[data-w-layer="far"]'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.1)
                .fromTo(q('[data-w-layer="mid"]'), { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.25)
                .fromTo(q('[data-w-layer="near"]'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.4)
                .fromTo(q('[data-w-sweep]'), { xPercent: -100, autoAlpha: 1 }, { xPercent: 300, duration: 1.1, ease: 'power2.inOut' }, 0.5)
                .to(q('[data-w-sweep]'), { autoAlpha: 0, duration: 0.2 }, 1.5)
            }, root)
            revert = () => ctx.revert()
          })
          .catch(() => {})
      },
      { threshold: 0.3 },
    )
    io.observe(root)
    return () => {
      io.disconnect()
      revert?.()
    }
  }, [ref, enabled])
}

/**
 * A project's illustrated world. `scene`: the large establishing shot on the
 * project page (announced to screen readers as an illustration). `tile`: the
 * compact version on Works tiles (decorative; the tile's text says it all).
 */
export function ProjectWorld({ slug, variant = 'scene', className }: { slug: string; variant?: 'scene' | 'tile'; className?: string }) {
  const world = WORLDS[slug]
  const Scene = SCENES[slug]
  const p = `w${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const ref = useRef<HTMLElement>(null)
  const on = useOnScreen(ref)
  useWorldEntrance(ref, variant === 'scene')
  if (!world || !Scene) return null
  const decorative = variant === 'tile'

  return (
    <figure
      ref={ref}
      className={cx(s.world, s[variant], className)}
      data-active={on || undefined}
      style={{ '--world-accent': world.accent } as CSSProperties}
      aria-hidden={decorative || undefined}
    >
      <svg
        className={s.art}
        viewBox="0 0 800 450"
        preserveAspectRatio="xMidYMid slice"
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : `Illustration: ${world.alt}`}
        focusable="false"
      >
        <Scene p={p} />
      </svg>
      <span className={s.sweep} data-w-sweep aria-hidden="true" />
      <figcaption className={s.caption}>
        <span className={s.name}>
          World <span aria-hidden="true">·</span> {world.name}
        </span>
        <span className={s.tag}>
          Illustration<span className="sr-only">, not a product screenshot</span>
        </span>
      </figcaption>
    </figure>
  )
}
