import { useLayoutEffect, type RefObject } from 'react'
import { loadMotion, prefersReducedMotion } from '../../motion/gsap'

/**
 * Hero entrance (once per session), layered on top of a fully rendered cover:
 * the masthead glitches in, the cover art rises, the NEW ARC burst stamps down,
 * the name is revealed with a light sweep and the copy follows.
 * Reduced motion: nothing runs. If GSAP fails to load, the content shows anyway.
 */
export function useHeroMotion(ref: RefObject<HTMLElement | null>, intro: boolean) {
  useLayoutEffect(() => {
    const root = ref.current
    if (!root || !intro || prefersReducedMotion()) return

    // Hide the intro pieces before first paint; CSS reveals them anyway after ~1.6s
    // if GSAP is slow or blocked.
    root.dataset.intro = 'pending'

    let cancelled = false
    let revert: (() => void) | undefined

    loadMotion()
      .then(({ gsap }) => {
        if (cancelled) return
        const ctx = gsap.context(() => {
          const q = gsap.utils.selector(root)
          gsap.set(q('[data-intro]'), { autoAlpha: 0 })
          delete root.dataset.intro

          const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.7 } })
          tl.fromTo(q('[data-intro="masthead"]'), { x: -16, skewX: -12 }, { x: 0, skewX: 0, autoAlpha: 1, duration: 0.6, ease: 'steps(4)' }, 0)
            .fromTo(q('[data-intro="art"]'), { y: 32 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.1)
            .fromTo(
              q('[data-intro="burst"]'),
              { scale: 1.6, rotation: -14 },
              { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.2)', clearProps: 'transform' },
              0.6,
            )
            .fromTo(
              q('[data-intro="title"]'),
              { x: -24, clipPath: 'inset(0 100% 0 0)' },
              { x: 0, autoAlpha: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'power4.out', clearProps: 'clipPath' },
              0.3,
            )
            .fromTo(q('[data-intro="sweep"]'), { xPercent: -120 }, { xPercent: 300, autoAlpha: 1, duration: 0.9, ease: 'power2.inOut' }, 0.9)
            .to(q('[data-intro="sweep"]'), { autoAlpha: 0, duration: 0.2 }, 1.7)
            .fromTo(q('[data-intro="line"]'), { y: 14 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.5 }, 0.5)
            .fromTo(
              q('[data-intro="stamp"]'),
              { scale: 0.6, rotation: -10 },
              { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(2.2)' },
              0.9,
            )
            .fromTo(q('[data-intro="cta"]'), { y: 16 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.5 }, 1.1)
        }, root)
        revert = () => ctx.revert()
      })
      .catch(() => {
        delete root.dataset.intro
      })

    return () => {
      cancelled = true
      revert?.()
      delete root.dataset.intro
    }
  }, [ref, intro])
}
