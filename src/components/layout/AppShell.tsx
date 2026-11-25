import { useEffect, useRef, useState } from 'react'
import { Outlet, ScrollRestoration, useLocation, useNavigation } from 'react-router'
import { cx } from '../../utils/cx'
import { DroneFollower } from '../../features/secrets/DroneFollower'
import { UnlockBanner, useSecretKeys } from '../../features/secrets/SecretTrigger'
import { MascotSprite } from '../manga/MascotSprite'
import { Shuriken } from '../manga/Mascot'
import { BottomNav } from './BottomNav'
import { Footer } from './Footer'
import { HudRail } from './HudRail'
import { MenuSheet } from './MenuSheet'
import { TopBar } from './TopBar'
import s from './layout.module.css'

export function AppShell() {
  const { pathname } = useLocation()
  const navigation = useNavigation()
  const [menuOpen, setMenuOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const lastPath = useRef(pathname)
  useSecretKeys()

  // Recruiter page swaps the decorative rail for a plain top bar (spec §2).
  const plain = pathname.startsWith('/recruiter')

  // Close the menu and move focus to the new page on navigation, so screen
  // reader and keyboard users start at the top of the new content.
  useEffect(() => {
    setMenuOpen(false)
    // Compare paths rather than counting renders: StrictMode runs effects twice.
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className={cx(s.shell, !plain && s.shellRail)}>
      <a href="#main" className={`${s.skip} no-print`}>
        Skip to content
      </a>
      <MascotSprite />
      {plain ? <TopBar /> : <HudRail />}

      <main id="main" ref={mainRef} tabIndex={-1} className={s.main}>
        <Outlet />
      </main>

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
