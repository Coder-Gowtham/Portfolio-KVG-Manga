import { useEffect, type RefObject } from 'react'

const ITEM = '[data-reveal-item]'
const STAGGER_MS = 70
const MAX_STAGGER = 5

/**
 * Site-wide scroll reveal. Any element marked `data-reveal-item` that starts
 * below the fold ink-wipes in when it scrolls into view; items arriving together
 * are staggered. Content is visible by default: nothing is hidden unless JS runs,
 * motion is allowed and the element is still off-screen. Elements inside another
 * revealed element are left alone, so nothing wipes twice.
 */
export function useRevealAll(rootRef: RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
          .forEach((e, i) => {
            const el = e.target as HTMLElement
            el.style.setProperty('--reveal-delay', `${Math.min(i, MAX_STAGGER) * STAGGER_MS}ms`)
            el.dataset.reveal = 'in'
            io.unobserve(el)
          })
      },
      { rootMargin: '0px 0px -8% 0px' },
    )

    const arm = (el: HTMLElement) => {
      if (el.dataset.reveal) return
      if (el.parentElement?.closest('[data-reveal]')) return
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return
      el.dataset.reveal = 'pending'
      io.observe(el)
    }

    let queued = false
    const scan = () => {
      queued = false
      root.querySelectorAll<HTMLElement>(ITEM).forEach(arm)
    }
    scan()
    // New content (filters, lazy sections) gets the same treatment; batched per frame.
    const mo = new MutationObserver(() => {
      if (queued) return
      queued = true
      requestAnimationFrame(scan)
    })
    mo.observe(root, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
      // Never leave anything hidden after navigating away or re-running.
      root.querySelectorAll<HTMLElement>('[data-reveal="pending"]').forEach((el) => (el.dataset.reveal = 'in'))
    }
  }, [rootRef, key])
}
