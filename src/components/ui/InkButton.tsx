import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from 'react-router'
import { cx } from '../../utils/cx'
import s from './ui.module.css'

type Variant = 'primary' | 'secondary' | 'paper' | 'command'

interface Common {
  variant?: Variant
  icon?: ReactNode
  children: ReactNode
  className?: string
  block?: boolean
}

type AsLink = Common & { to: string; href?: never } & Omit<ComponentPropsWithoutRef<typeof Link>, 'to' | 'className'>
type AsAnchor = Common & { href: string; to?: never } & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className'>
type AsButton = Common & { to?: never; href?: never } & Omit<ComponentPropsWithoutRef<'button'>, 'className'>

export type InkButtonProps = AsLink | AsAnchor | AsButton

/** All button variants from spec §1.6. Renders a router Link, an anchor, or a button. */
export function InkButton(props: InkButtonProps) {
  const { variant = 'primary', icon, children, className, block, ...rest } = props
  const classes = cx(s.btn, s[variant], block && s.block, className)
  const inner = (
    <>
      {variant === 'command' && (
        <span className={s.prompt} aria-hidden="true">
          &gt;
        </span>
      )}
      <span>{children}</span>
      {icon && (
        <span className={s.icon} aria-hidden="true">
          {icon}
        </span>
      )}
    </>
  )

  if ('to' in rest && rest.to !== undefined) {
    const { to, ...linkRest } = rest as AsLink
    return (
      <Link to={to} className={classes} {...linkRest}>
        {inner}
      </Link>
    )
  }
  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as Omit<AsAnchor, keyof Common>)}>
        {inner}
      </a>
    )
  }
  const buttonRest = rest as Omit<AsButton, keyof Common>
  return (
    <button type="button" className={classes} {...buttonRest}>
      {inner}
    </button>
  )
}
