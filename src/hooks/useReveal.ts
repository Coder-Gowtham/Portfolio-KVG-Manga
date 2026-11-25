import { useEffect, useRef } from 'react'

/**
 * Ink-wipe reveal on scroll. Content is visible by default: the hidden
 * starting state only applies once JS confirms motion is allowed and the
 * element is still below the fold, so nothing depends on the animation.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') return
    if (el.getBoundingClientRect().top < window.innerHeight) return

    el.dataset.reveal = 'pending'
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.dataset.reveal = 'in'
            io.disconnect()
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    // Safety net: never leave content hidden.
    const t = setTimeout(() => (el.dataset.reveal = 'in'), 8000)
    return () => {
      io.disconnect()
      clearTimeout(t)
    }
  }, [])

  return ref
}
