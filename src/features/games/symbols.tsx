import type { ReactNode } from 'react'
import type { SymbolId } from './memory'

/** Card faces for Memory match: loadout weapons + tech icons, distinct in shape (not only colour). */
export function CardSymbol({ id }: { id: SymbolId }) {
  switch (id) {
    case 'shuriken':
      return (
        <svg viewBox="0 0 60 60" aria-hidden="true" focusable="false">
          <use href="#kvg-shuriken" width="60" height="60" />
        </svg>
      )
    case 'drone':
      return (
        <svg viewBox="0 0 40 32" aria-hidden="true" focusable="false">
          <use href="#kvg-drone" width="40" height="32" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          {SHAPES[id]}
        </svg>
      )
  }
}

const SHAPES: Record<Exclude<SymbolId, 'shuriken' | 'drone'>, ReactNode> = {
  katana: (
    <g strokeLinecap="round">
      <path d="M10 40 L36 10" stroke="#0A0A0F" strokeWidth="6" />
      <path d="M10 40 L36 10" stroke="#D8DBE3" strokeWidth="3" />
      <path d="M33 16 L41 9" stroke="#0A0A0F" strokeWidth="1" />
      <ellipse cx="34" cy="13" rx="5" ry="2" transform="rotate(-48 34 13)" fill="#F5E500" stroke="#0A0A0F" />
      <path d="M36 11 L44 3" stroke="#FF2A6D" strokeWidth="5" />
    </g>
  ),
  kunai: (
    <g stroke="#0A0A0F" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M24 4 L31 20 L24 30 L17 20 Z" fill="#D8DBE3" />
      <rect x="21.5" y="30" width="5" height="10" fill="#FF2A6D" />
      <circle cx="24" cy="43" r="3.2" fill="none" stroke="#00E5FF" strokeWidth="2" />
    </g>
  ),
  blaster: (
    <g stroke="#0A0A0F" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M6 16 H38 L42 20 V24 H22 L20 38 H12 L14 24 H6 Z" fill="#1D1D27" />
      <rect x="10" y="18" width="20" height="3" fill="#00E5FF" stroke="none" />
      <path d="M42 22 H46" stroke="#FF2A6D" strokeWidth="3" />
    </g>
  ),
  bug: (
    <g stroke="#0A0A0F" strokeWidth="1.8" strokeLinecap="round">
      <path d="M8 18 L15 22 M8 30 L15 29 M10 40 L16 35 M40 18 L33 22 M40 30 L33 29 M38 40 L32 35 M19 10 L21 14 M29 10 L27 14" />
      <ellipse cx="24" cy="28" rx="10" ry="13" fill="#FF2A6D" />
      <circle cx="24" cy="15" r="6" fill="#0A0A0F" />
      <path d="M24 17 V40" stroke="#0A0A0F" />
    </g>
  ),
  react: (
    <g fill="none" stroke="#00B8D9" strokeWidth="2.4">
      <ellipse cx="24" cy="24" rx="19" ry="7.5" />
      <ellipse cx="24" cy="24" rx="19" ry="7.5" transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="19" ry="7.5" transform="rotate(120 24 24)" />
      <circle cx="24" cy="24" r="3.6" fill="#00B8D9" stroke="none" />
    </g>
  ),
  node: (
    <g strokeLinejoin="round">
      <polygon points="24,4 41,14 41,34 24,44 7,34 7,14" fill="#3C873A" stroke="#0A0A0F" strokeWidth="2" />
      <text x="24" y="30" textAnchor="middle" fontFamily="'Share Tech Mono', monospace" fontSize="14" fill="#F4F1EA">
        JS
      </text>
    </g>
  ),
}
