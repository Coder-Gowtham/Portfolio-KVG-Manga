import type { ComponentType } from 'react'
import { BugHunt } from './games/BugHunt'
import { MemoryMatch } from './games/MemoryMatch'
import { NeonTyper } from './games/NeonTyper'
import { QuickDraw } from './games/QuickDraw'
import { CyberOracle } from './horoscope/CyberOracle'
import { QuotesTerminal } from './quotes/QuotesTerminal'

/** Every Showdown module, registered once (spec §4.6). Add a module here and the hub picks it up. */
export interface FunModule {
  id: string
  title: string
  kicker: string
  blurb: string
  surface: 'paper' | 'night' | 'terminal'
  /** Verb on the fold-out button on small screens (default "Play"). */
  action?: string
  Component: ComponentType
}

export const funModules: FunModule[] = [
  {
    id: 'quick-draw',
    title: 'Quick-draw',
    kicker: 'Reflex test',
    blurb: 'Wait for the signal, then fire the Breakpoint blaster.',
    surface: 'night',
    Component: QuickDraw,
  },
  {
    id: 'memory-match',
    title: 'Memory match',
    kicker: 'Loadout recall',
    blurb: 'Find all eight pairs of weapons and tech in as few moves as you can.',
    surface: 'paper',
    Component: MemoryMatch,
  },
  {
    id: 'cyber-oracle',
    title: 'Cyber-oracle',
    kicker: 'Daily transmission',
    blurb: 'Pick a sign, get a dev fortune. Fictional, for fun.',
    surface: 'night',
    action: 'Open',
    Component: CyberOracle,
  },
  {
    id: 'quotes',
    title: 'Quotes terminal',
    kicker: 'Words to code by',
    blurb: 'A quote a day, random pulls, and favourites you can save.',
    surface: 'terminal',
    action: 'Open',
    Component: QuotesTerminal,
  },
  {
    id: 'bug-hunt',
    title: 'Bug hunt',
    kicker: '30-second deploy',
    blurb: 'Squash the bugs before the deploy timer ends.',
    surface: 'night',
    Component: BugHunt,
  },
  {
    id: 'neon-typer',
    title: 'Neon typer',
    kicker: 'Terminal speedrun',
    blurb: 'Type the command before the fuse burns out.',
    surface: 'terminal',
    Component: NeonTyper,
  },
]

/** Greyed "coming soon" cabinets. Empty for now; add an entry to tease the next module. */
export const comingSoon: { id: string; title: string; blurb: string }[] = []
