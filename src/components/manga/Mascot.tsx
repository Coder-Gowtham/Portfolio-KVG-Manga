import { useId } from 'react'
import { useSecret } from '../../features/secrets/secretStore'

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
      {armed && layer('kvg-katana-back')}
      {layer('kvg-body')}
      {armed && layer('kvg-kunai-strap')}
      {layer(face === 'up' ? 'kvg-mask-up' : 'kvg-mask-down')}
      {layer('kvg-head')}
    </svg>
  )
}

export function Drone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 32" className={className} aria-hidden="true" focusable="false">
      <use href="#kvg-drone" width="40" height="32" />
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
