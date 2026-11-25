import { useEffect, useState } from 'react'

/**
 * Reports whether the user is scrolling down past a threshold, so the bottom
 * nav can hide. Shows again on scroll-up, near the top, or after idling.
 */
export function useHideOnScroll({ threshold = 8, idleMs = 1200 } = {}) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    let idle: ReturnType<typeof setTimeout> | undefined
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const delta = y - last
        if (y < 80) setHidden(false)
        else if (delta > threshold) setHidden(true)
        else if (delta < -threshold) setHidden(false)
        last = y
        ticking = false
        clearTimeout(idle)
        idle = setTimeout(() => setHidden(false), idleMs)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(idle)
    }
  }, [threshold, idleMs])

  return hidden
}
