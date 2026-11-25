import { useId } from 'react'
import { useSecret } from '../../features/secrets/secretStore'
import { cx } from '../../utils/cx'
import m from './mascot.module.css'

export interface MascotProps {
  /** 'up' for combat pages, 'down' (smirk) for friendly pages. */
  mask?: 'up' | 'down'
  /** Katana on the back and kunai on the strap. */
  armed?: boolean
  /** Accessible label. Omit for decorative use (aria-hidden). */
  label?: string
  className?: string
}

/** The netrunner mascot, composed from the shared sprite layers. */
export function Mascot({ mask = 'up', armed = true, label, className }: MascotProps) {
  const titleId = useId()
  // Secret perk: the "off-duty skin" keeps the mask down site-wide.
  const { unlocked, offDuty } = useSecret()
  const face = unlocked && offDuty ? 'down' : mask
  const layer = (id: string) => <use href={`#${id}`} x="0" y="0" width="120" height="140" />

  return (
    <svg
      viewBox="0 0 120 140"
      className={className}
      role={label ? 'img' : undefined}
      aria-labelledby={label ? titleId : undefined}
      aria-hidden={label ? undefined : true}
      focusable="false"
      overflow="visible"
    >
      {label && <title id={titleId}>{label}</title>}
      {/* Idle "breathing": the whole figure rises a hair and settles. */}
      <g className={m.breathe}>
        {armed && layer('kvg-katana-back')}
        {layer('kvg-body')}
        {armed && layer('kvg-kunai-strap')}
        {layer(face === 'up' ? 'kvg-mask-up' : 'kvg-mask-down')}
        {layer('kvg-head')}
        {/* Cyber-eye: a scanning ring and a flicker of the iris. */}
        <g className={m.eye}>
          <circle className={m.scan} cx="69" cy="53" r="9.5" fill="none" stroke="#00E5FF" strokeWidth="0.7" strokeDasharray="5 3 1 3" />
          <circle className={m.iris} cx="69" cy="53" r="3.6" fill="#00E5FF" />
          <circle cx="69" cy="53" r="1.3" fill="#0A0A0F" />
        </g>
      </g>
    </svg>
  )
}

export function Drone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 32" className={cx(m.drone, className)} aria-hidden="true" focusable="false">
      <use href="#kvg-drone" width="40" height="32" />
      {/* Blinking status light */}
      <circle className={m.led} cx="33" cy="12" r="1.4" fill="#FF2A6D" />
    </svg>
  )
}

export function Shuriken({ className, label = 'Loading' }: { className?: string; label?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} role="img" aria-label={label}>
      <use href="#kvg-shuriken" width="60" height="60" />
    </svg>
  )
}
