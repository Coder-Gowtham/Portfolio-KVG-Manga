import { useId } from 'react'
import { useSecret } from '../../features/secrets/secretStore'
import { cx } from '../../utils/cx'
import s from './action.module.css'

export type MascotActionKind = 'slash' | 'throw' | 'power' | 'draw'

export interface MascotActionProps {
  action: MascotActionKind
  /** Accessible label. Omit for decorative use (aria-hidden). */
  label?: string
  className?: string
}

/* Shared pieces, drawn in the same line language as the base sprite. */
const INK = '#0A0A0F'
const INK2 = '#1D1D27'
const CYAN = '#00E5FF'
const MAGENTA = '#FF2A6D'
const YELLOW = '#F5E500'
const BLADE = '#D8DBE3'

function Fist({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <rect x="-8" y="-7" width="16" height="14" rx="3" fill={INK2} stroke={CYAN} strokeWidth="1.2" />
      <path d="M-4 -7 V-2 M0 -7 V-2 M4 -7 V-2" stroke={CYAN} strokeWidth="0.8" />
    </g>
  )
}

function Kunai({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(1.35)`}>
      <path d="M-14 0 L-20 -2.5 L-20 2.5 Z" fill="none" stroke={CYAN} strokeWidth="1" />
      <rect x="-13" y="-1.4" width="7" height="2.8" fill={MAGENTA} stroke={INK} strokeWidth="0.6" />
      <path d="M-6 0 L2 -4 L12 0 L2 4 Z" fill={BLADE} stroke={INK} strokeWidth="0.9" />
      <line x1="-5" y1="0" x2="10" y2="0" stroke={CYAN} strokeWidth="0.6" />
    </g>
  )
}

function Slash() {
  return (
    <>
      {/* Swing trail behind the raised blade */}
      <g className={s.trail}>
        <path d="M48 -24 Q-44 -14 -36 100 Q-20 6 48 -24 Z" fill="#F4F1EA" stroke={CYAN} strokeWidth="1.4" />
        <path d="M40 -18 Q-26 -4 -30 80" fill="none" stroke={MAGENTA} strokeWidth="1.2" />
      </g>
      <use href="#kvg-body" width="120" height="140" />
      <use href="#kvg-mask-up" width="120" height="140" data-mask="up" />
      <use href="#kvg-head" width="120" height="140" />
      {/* Raised right arm */}
      <path d="M96 100 L116 112 L146 76 L132 64 Z" fill={INK} stroke={CYAN} strokeWidth="1.3" />
      {/* Katana: hilt in the fist, blade overhead */}
      <path d="M146 76 L130 92" stroke={INK} strokeWidth="5.5" strokeLinecap="round" />
      <path d="M144 77 L141 80 M140 81 L137 84 M136 85 L133 88" stroke={MAGENTA} strokeWidth="1.5" />
      <ellipse cx="140" cy="66" rx="7" ry="2.6" transform="rotate(-50 140 66)" fill={YELLOW} stroke={INK} strokeWidth="1.2" />
      <path d="M138 64 L44 -22" stroke={INK} strokeWidth="6.5" strokeLinecap="round" />
      <path d="M138 64 L44 -22" stroke={BLADE} strokeWidth="4" strokeLinecap="round" />
      <path d="M132 57 L52 -16" stroke={CYAN} strokeWidth="0.8" />
      <Fist x={140} y={70} r={-50} />
      <text x="-34" y="132" className={s.sfx} fill={MAGENTA}>
        斬
      </text>
    </>
  )
}

function Throw() {
  return (
    <>
      <use href="#kvg-katana-back" width="120" height="140" />
      <use href="#kvg-body" width="120" height="140" />
      <use href="#kvg-mask-up" width="120" height="140" data-mask="up" />
      <use href="#kvg-head" width="120" height="140" />
      {/* Arm extended after the throw */}
      <path d="M98 100 L112 116 L152 100 L148 86 Z" fill={INK} stroke={CYAN} strokeWidth="1.3" />
      <g transform="translate(156 93)">
        <rect x="-6" y="-8" width="10" height="15" rx="2.5" fill={INK2} stroke={CYAN} strokeWidth="1.2" />
        <path d="M4 -6 L13 -9 M4 -2 L14 -3 M4 2 L14 3 M3 6 L11 9" stroke={CYAN} strokeWidth="1.3" strokeLinecap="round" />
      </g>
      {/* Kunai in flight + motion streaks */}
      <g className={s.fly}>
        <path d="M150 70 H172 M156 96 H186 M150 120 H176" stroke={CYAN} strokeWidth="0.9" strokeDasharray="6 3" opacity="0.8" />
        <Kunai x={180} y={70} r={-6} />
        <Kunai x={194} y={96} />
        <Kunai x={184} y={121} r={7} />
      </g>
      <text x="120" y="40" className={s.sfx} fill={YELLOW}>
        シュッ
      </text>
    </>
  )
}

function Power() {
  return (
    <>
      {/* Aura: two jagged flame outlines around the silhouette */}
      <g className={s.aura}>
        <polygon
          points="-18,150 -10,104 -24,92 -2,90 -8,56 10,64 6,22 22,36 24,-6 40,14 52,-22 62,4 78,-20 84,10 104,-8 102,24 122,12 114,46 136,40 120,72 142,80 124,96 138,108 132,150"
          fill="rgb(255 42 109 / 0.16)"
          stroke={MAGENTA}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <polygon
          points="-6,150 2,108 -8,98 10,96 6,64 20,70 18,34 30,44 34,8 46,24 56,-8 64,14 76,-6 80,18 96,4 94,30 110,22 104,52 122,50 110,76 128,86 114,98 124,112 120,150"
          fill="rgb(0 229 255 / 0.14)"
          stroke={CYAN}
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </g>
      <use href="#kvg-katana-back" width="120" height="140" />
      <use href="#kvg-body" width="120" height="140" />
      <use href="#kvg-kunai-strap" width="120" height="140" />
      <use href="#kvg-mask-up" width="120" height="140" data-mask="up" />
      <use href="#kvg-head" width="120" height="140" />
      {/* Cyber-eye overcharge */}
      <g className={s.eye}>
        <circle cx="69" cy="53" r="12" fill="none" stroke={CYAN} strokeWidth="1" strokeDasharray="2 3" />
        <path d="M81 53 H112 M78 45 L104 30 M78 61 L100 72" stroke={CYAN} strokeWidth="1.2" strokeLinecap="round" />
      </g>
      {/* Sparks and rising hex shards */}
      <g fill="none" strokeLinejoin="round" strokeLinecap="round">
        <polyline points="-20,60 -12,52 -16,48 -6,38" stroke={YELLOW} strokeWidth="1.6" />
        <polyline points="140,62 132,54 138,50 128,40" stroke={YELLOW} strokeWidth="1.6" />
        <polyline points="10,132 18,124 14,120 24,112" stroke={YELLOW} strokeWidth="1.3" />
      </g>
      <g className={s.shards} fill="none" stroke={CYAN} strokeWidth="1">
        <polygon points="-24,24 -19,21 -14,24 -14,30 -19,33 -24,30" />
        <polygon points="130,0 134,-2 138,0 138,5 134,7 130,5" />
        <polygon points="144,110 148,108 152,110 152,115 148,117 144,115" stroke={MAGENTA} />
      </g>
      <text x="82" y="146" className={s.sfx} fill={MAGENTA}>
        ゴゴゴ
      </text>
    </>
  )
}

function Draw() {
  return (
    <>
      <use href="#kvg-katana-back" width="120" height="140" />
      <use href="#kvg-body" width="120" height="140" />
      <use href="#kvg-kunai-strap" width="120" height="140" />
      <use href="#kvg-mask-up" width="120" height="140" data-mask="up" />
      <use href="#kvg-head" width="120" height="140" />
      {/* Hand over the shoulder, gripping the hilt */}
      <path d="M90 104 L108 106 L114 56 L100 52 Z" fill={INK} stroke={CYAN} strokeWidth="1.3" />
      <Fist x={106} y={44} r={-30} />
      {/* Gleam on the guard */}
      <g className={s.gleam} stroke={YELLOW} strokeWidth="1.4" strokeLinecap="round">
        <path d="M94 56 L94 40 M86 48 L102 48 M89 43 L99 53 M99 43 L89 53" />
      </g>
      <text x="114" y="74" className={s.sfx} fill={YELLOW}>
        キン
      </text>
    </>
  )
}

const POSES = { slash: Slash, throw: Throw, power: Power, draw: Draw }

/** Framing per pose: room for the effect, no more. */
const VIEWBOX: Record<MascotActionKind, string> = {
  slash: '-42 -30 202 172',
  throw: '0 -4 214 146',
  power: '-30 -26 184 178',
  draw: '0 -6 162 148',
}

/**
 * Action poses for the netrunner: katana slash, kunai throw, power-up, and
 * drawing the blade. Built from the approved sprite layers plus effects.
 */
export function MascotAction({ action, label, className }: MascotActionProps) {
  const titleId = useId()
  const { unlocked, offDuty } = useSecret()
  const Pose = POSES[action]
  return (
    <svg
      viewBox={VIEWBOX[action]}
      className={cx(s.action, s[action], unlocked && offDuty && s.offDuty, className)}
      role={label ? 'img' : undefined}
      aria-labelledby={label ? titleId : undefined}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {label && <title id={titleId}>{label}</title>}
      <Pose />
      {unlocked && offDuty && <use href="#kvg-mask-down" width="120" height="140" />}
    </svg>
  )
}
