export interface NavItem {
  to: string
  label: string
  /** Short chapter marker shown on the desktop rail. */
  chapter: string
  end?: boolean
}

export const NAV = {
  home: { to: '/', label: 'Home', chapter: 'CH.00', end: true },
  works: { to: '/projects', label: 'Works', chapter: 'CH.01' },
  arc: { to: '/experience', label: 'Arc', chapter: 'CH.02' },
  hire: { to: '/recruiter', label: 'Hire', chapter: 'HIRE' },
  contact: { to: '/contact', label: 'Contact', chapter: 'CH.03' },
  omake: { to: '/playground', label: 'Fun Zone', chapter: 'OMAKE' },
} satisfies Record<string, NavItem>

/** Bottom bar: four destinations + Menu. Keep it at five slots. */
export const bottomNavItems: NavItem[] = [NAV.home, NAV.works, NAV.arc, NAV.hire]

/** Desktop rail: every chapter. */
export const railItems: NavItem[] = [NAV.home, NAV.works, NAV.arc, NAV.hire, NAV.contact, NAV.omake]

/** Secondary destinations in the mobile menu sheet. */
export const menuItems: NavItem[] = [NAV.contact, NAV.omake]
