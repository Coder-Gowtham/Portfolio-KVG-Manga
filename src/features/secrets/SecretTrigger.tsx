import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { HexPatch } from '../../components/layout/HexPatch'
import { SpeedLines } from '../../components/manga/art'
import { cx } from '../../utils/cx'
import { PATCH_TAPS, PATCH_WINDOW_MS, createSequenceMatcher } from './sequence'
import { secretStore, useSecret } from './secretStore'
import s from './secrets.module.css'

const TYPING = 'input, textarea, select, [contenteditable="true"]'

/** Desktop trigger: type `sudo kvg` (or the Konami code) anywhere outside a form field. */
export function useSecretKeys() {
  useEffect(() => {
    const push = createSequenceMatcher()
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.target instanceof Element && e.target.closest(TYPING)) return
      if (push(e.key)) secretStore.unlock()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

/**
 * Touch trigger: the footer KVG patch. Each tap lights a hex edge so progress
 * is visible; once unlocked it becomes a link to the chapter.
 */
export function PatchTrigger({ className }: { className?: string }) {
  const { unlocked } = useSecret()
  const [taps, setTaps] = useState(0)
  const last = useRef(0)

  if (unlocked) {
    return (
      <Link to="/playground/secret" className={cx(s.patchButton, className)} aria-label="Hidden chapter: Origin of the mask">
        <HexPatch className={s.patchArt} />
      </Link>
    )
  }

  const onTap = () => {
    const now = Date.now()
    const next = now - last.current > PATCH_WINDOW_MS ? 1 : taps + 1
    last.current = now
    if (next >= PATCH_TAPS) {
      setTaps(0)
      secretStore.unlock()
    } else {
      setTaps(next)
    }
  }

  // 6 hex edges spread over 5 taps; 0 taps shows the patch dimmed.
  const progress = taps === 0 ? 0 : Math.ceil((taps / PATCH_TAPS) * 6)

  return (
    <button type="button" className={cx(s.patchButton, className)} onClick={onTap} aria-label="KVG patch">
      <HexPatch className={s.patchArt} progress={progress} />
    </button>
  )
}

/** "HIDDEN CHAPTER UNLOCKED": shown once after either trigger fires. */
export function UnlockBanner() {
  const { banner } = useSecret()
  const link = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (banner) link.current?.focus()
  }, [banner])

  if (!banner) return null
  return (
    <div className={cx(s.banner, 'no-print')} role="region" aria-label="Hidden chapter unlocked">
      <SpeedLines className={s.bannerLines} color="var(--neon-yellow)" count={48} inner={40} cy={50} />
      <div className={s.bannerBody}>
        <p className={s.bannerTitle} role="status">
          Hidden chapter unlocked
        </p>
        <div className={s.bannerActions}>
          <Link ref={link} to="/playground/secret" className={s.bannerLink} onClick={secretStore.dismissBanner}>
            Read Ch.∞ →
          </Link>
          <button type="button" className={s.bannerClose} onClick={secretStore.dismissBanner}>
            Later
          </button>
        </div>
      </div>
    </div>
  )
}
