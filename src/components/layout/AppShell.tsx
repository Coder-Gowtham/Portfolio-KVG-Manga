import { useEffect, useRef, useState } from 'react'
import { Outlet, ScrollRestoration, useLocation, useNavigation } from 'react-router'
import { cx } from '../../utils/cx'
import { DroneFollower } from '../../features/secrets/DroneFollower'
import { UnlockBanner, useSecretKeys } from '../../features/secrets/SecretTrigger'
import { useRevealAll } from '../../hooks/useRevealAll'
import { MascotSprite } from '../manga/MascotSprite'
import { Shuriken } from '../manga/Mascot'
import { BottomNav } from './BottomNav'
import { Footer } from './Footer'
import { HudRail } from './HudRail'
import { MenuSheet } from './MenuSheet'
import s from './layout.module.css'

export function AppShell() {
  const { pathname } = useLocation()
  const navigation = useNavigation()
  const [menuOpen, setMenuOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const lastPath = useRef(pathname)
  // Counts client-side page changes; 0 on first load, so the cover intro plays alone.
  const [turns, setTurns] = useState(0)
  useSecretKeys()
  useRevealAll(mainRef, pathname)

  // Close the menu and move focus to the new page on navigation, so screen
  // reader and keyboard users start at the top of the new content.
  useEffect(() => {
    setMenuOpen(false)
    // Compare paths rather than counting renders: StrictMode runs effects twice.
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    setTurns((t) => t + 1)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className={cx(s.shell, s.shellRail)}>
      <a href="#main" className={`${s.skip} no-print`}>
        Skip to content
      </a>
      <MascotSprite />
      {/* Same frame on every page, the Hire brief included, so navigation never jumps. */}
      <HudRail />

      <main id="main" ref={mainRef} tabIndex={-1} className={s.main}>
        {/* Keyed per page so each page change replays the enter animation. */}
        <div key={pathname} className={cx(s.page, turns > 0 && s.pageEnter)}>
          <Outlet />
        </div>
      </main>
      {/* Manga page-turn: an ink panel sweeps off-screen as the new page lands. */}
      {turns > 0 && <span key={`turn-${turns}`} className={`${s.pageTurn} no-print`} aria-hidden="true" />}

      <Footer />
      <BottomNav menuOpen={menuOpen} onMenu={() => setMenuOpen((o) => !o)} />
      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} />

      <UnlockBanner />
      <DroneFollower />

      {navigation.state === 'loading' && <Shuriken className={s.loading} label="Loading page" />}
      <ScrollRestoration />
    </div>
  )
}
