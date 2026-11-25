import { useEffect, type RefObject } from 'react'

/**
 * Scroll-linked story progress for the Career Arc: sets `--progress` (0–1) on the
 * wrapper and marks each chapter `data-lit` once the reading line passes its node.
 * Scroll-linked rather than timed, so it simply follows the reader.
 */
export function useTimelineProgress(wrapRef: RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    let frame = 0

    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.6
      const rect = wrap.getBoundingClientRect()
      const p = rect.height > 0 ? Math.min(1, Math.max(0, (line - rect.top) / rect.height)) : 0
      wrap.style.setProperty('--progress', p.toFixed(4))
      wrap.querySelectorAll<HTMLElement>('[data-node]').forEach((node) => {
        const li = node.closest('li')
        if (li) li.toggleAttribute('data-lit', node.getBoundingClientRect().top < line)
      })
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [wrapRef, key])
}
