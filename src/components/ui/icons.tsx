import type { SVGProps } from 'react'

/** Small original stroke icons (24×24). Decorative by default. */
function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export const IconHome = () => (
  <Icon>
    <path d="M3 11 12 3l9 8" />
    <path d="M5 9.5V21h5v-6h4v6h5V9.5" />
  </Icon>
)

export const IconWorks = () => (
  <Icon>
    <path d="M3 3h11v8H3zM17 3h4v8h-4zM3 14h5v7H3zM11 14h10v7H11z" />
  </Icon>
)

export const IconArc = () => (
  <Icon>
    <path d="M5 3v18" />
    <path d="M5 6h9l-2 3 2 3H5" />
    <path d="M5 15h12l-2 3 2 3H5" />
  </Icon>
)

export const IconHire = () => (
  <Icon>
    <path d="M3 7h18v13H3z" />
    <path d="M9 7V4h6v3" />
    <path d="M3 13h18" />
    <path d="M11 12h2v3h-2z" />
  </Icon>
)

export const IconMenu = () => (
  <Icon>
    <path d="M4 6h16M4 12h16M4 18h10" />
  </Icon>
)

export const IconClose = () => (
  <Icon>
    <path d="M5 5l14 14M19 5 5 19" />
  </Icon>
)

export const IconDownload = () => (
  <Icon>
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M4 20h16" />
  </Icon>
)

export const IconMail = () => (
  <Icon>
    <path d="M3 5h18v14H3z" />
    <path d="m3 6 9 7 9-7" />
  </Icon>
)

export const IconPhone = () => (
  <Icon>
    <path d="M7 3h4l1 5-3 2a12 12 0 0 0 5 5l2-3 5 1v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z" />
  </Icon>
)

export const IconCode = () => (
  <Icon>
    <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
  </Icon>
)

export const IconProfile = () => (
  <Icon>
    <path d="M3 3h18v18H3z" />
    <path d="M7 10v7M7 7v.01M11 17v-7M11 13c0-2 1.5-3 3-3s3 1 3 3v4" />
  </Icon>
)

export const IconCamera = () => (
  <Icon>
    <path d="M4 4h16v16H4z" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17 7h.01" />
  </Icon>
)

export const IconOmake = () => (
  <Icon>
    <path d="M6 8h12l2 10H4z" />
    <path d="M9 12h2M10 11v2M15 12h.01M14 13h.01" />
  </Icon>
)

export const IconKunai = () => (
  <Icon>
    <path d="M3 12h7" />
    <path d="M10 12l4-4 8 4-8 4z" />
  </Icon>
)

export const linkIcon = {
  email: IconMail,
  phone: IconPhone,
  github: IconCode,
  linkedin: IconProfile,
  instagram: IconCamera,
} as const
