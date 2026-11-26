import { useLayoutEffect, type RefObject } from 'react'
import { hasFinePointer, loadMotion, prefersReducedMotion } from '../../motion/gsap'

/**
 * Hero motion, layered on top of a fully rendered hero:
 * - intro (once per session): the city fades up layer by layer, a searchlight
 *   sweeps, the name is revealed and the copy follows;
 * - pointer parallax on the three depth layers and the cover (mouse only);
 * - gentle scroll parallax as the hero leaves the screen.
 * Reduced motion: none of it runs. If GSAP fails to load, the content shows anyway.
 */
export function useHeroMotion(ref: RefObject<HTMLElement | null>, intro: boolean) {
  useLayoutEffect(() => {
    const root = ref.current
    if (!root || prefersReducedMotion()) return

    // Hide the intro pieces before first paint; CSS reveals them anyway after ~1.6s
    // if GSAP is slow or blocked.
    if (intro) root.dataset.intro = 'pending'

    let cancelled = false
    let revert: (() => void) | undefined
    let removePointer: (() => void) | undefined

    loadMotion()
      .then(({ gsap }) => {
        if (cancelled) return
        const ctx = gsap.context(() => {
          const q = gsap.utils.selector(root)
          const layer = (name: string) => q(`[data-layer="${name}"]`)

          if (intro) {
            gsap.set([...q('[data-intro]'), ...q('[data-layer]')], { autoAlpha: 0 })
            delete root.dataset.intro

            const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } })
            tl.to(layer('sky'), { autoAlpha: 1, duration: 1 }, 0)
              .fromTo(layer('far'), { y: 60 }, { y: 0, autoAlpha: 1, duration: 1.2 }, 0.1)
              .to(layer('haze'), { autoAlpha: 1, duration: 1.4 }, 0.2)
              .fromTo(layer('mid'), { y: 80 }, { y: 0, autoAlpha: 1, duration: 1.1 }, 0.25)
              .fromTo(layer('near'), { y: 40 }, { y: 0, autoAlpha: 1, duration: 0.9 }, 0.4)
              .to(layer('scrim'), { autoAlpha: 1, duration: 0.6 }, 0)
              .fromTo(layer('beam'), { x: -700 }, { x: 0, autoAlpha: 1, duration: 1.4, ease: 'power2.inOut' }, 0.3)
              .fromTo(q('[data-intro="kicker"]'), { y: 12 }, { y: 0, autoAlpha: 1, duration: 0.5 }, 0.2)
              .fromTo(
                q('[data-intro="title"]'),
                { x: -24, clipPath: 'inset(0 100% 0 0)' },
                { x: 0, autoAlpha: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.9, stagger: 0.15, ease: 'power4.out', clearProps: 'clipPath' },
                0.35,
              )
              .fromTo(
                q('[data-intro="sweep"]'),
                { xPercent: -120 },
                { xPercent: 260, autoAlpha: 1, duration: 0.9, ease: 'power2.inOut' },
                0.95,
              )
              .to(q('[data-intro="sweep"]'), { autoAlpha: 0, duration: 0.2 }, 1.75)
              .fromTo(q('[data-intro="line"]'), { y: 14 }, { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.6 }, 0.9)
              .fromTo(
                q('[data-intro="stamp"]'),
                { scale: 0.6, rotation: -12 },
                { scale: 1, rotation: -2, autoAlpha: 1, duration: 0.5, ease: 'back.out(2.2)' },
                1.2,
              )
              .fromTo(q('[data-intro="cta"]'), { y: 16 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.5 }, 1.3)
              .fromTo(q('[data-intro="art"]'), { x: 60 }, { x: 0, autoAlpha: 1, duration: 1.1 }, 0.45)
              .fromTo(q('[data-intro="cue"]'), { y: -8 }, { y: 0, autoAlpha: 1, duration: 0.5 }, 1.6)
          }

          // Scroll: layers drift at different speeds as the hero leaves the screen.
          const scroll = { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.6 }
          // (Wrapper groups, so these never fight the intro's own y tweens.)
          gsap.to(q('[data-scroll="far"]'), { y: 70, ease: 'none', scrollTrigger: scroll })
          gsap.to(q('[data-scroll="mid"]'), { y: 40, ease: 'none', scrollTrigger: { ...scroll } })
          gsap.to(q('[data-scroll="beam"]'), { y: 120, ease: 'none', scrollTrigger: { ...scroll } })

          // Pointer: small horizontal parallax, mouse only.
          if (hasFinePointer()) {
            const movers = [
              { el: layer('far'), depth: -6 },
              { el: layer('mid'), depth: -14 },
              { el: layer('near'), depth: -22 },
              { el: q('[data-depth="card"]'), depth: 10 },
            ].map(({ el, depth }) => ({ to: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' }), depth }))

            const onMove = (e: PointerEvent) => {
              if (e.pointerType !== 'mouse') return
              const r = root.getBoundingClientRect()
              const nx = ((e.clientX - r.left) / r.width) * 2 - 1
              movers.forEach((m) => m.to(nx * m.depth))
            }
            const onLeave = () => movers.forEach((m) => m.to(0))
            root.addEventListener('pointermove', onMove)
            root.addEventListener('pointerleave', onLeave)
            removePointer = () => {
              root.removeEventListener('pointermove', onMove)
              root.removeEventListener('pointerleave', onLeave)
            }
          }
        }, root)
        revert = () => ctx.revert()
      })
      .catch(() => {
        delete root.dataset.intro
      })

    return () => {
      cancelled = true
      removePointer?.()
      revert?.()
      delete root.dataset.intro
    }
  }, [ref, intro])
}
