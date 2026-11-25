import { useEffect, useRef, useState } from 'react'
import { cx } from '../../utils/cx'
import s from './ui.module.css'

async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch {
    // fall through to the legacy path (e.g. insecure context or denied permission)
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = value
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  } catch {
    return false
  }
}

/** Copies a value and announces the result to screen readers. */
export function CopyButton({ value, label, className }: { value: string; label: string; className?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const onClick = async () => {
    const ok = await copyText(value)
    setState(ok ? 'copied' : 'failed')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setState('idle'), 2400)
  }

  return (
    <>
      <button type="button" className={cx(s.copy, state === 'copied' && s.copyDone, className)} onClick={onClick}>
        <span aria-hidden="true" className={s.copyIcon}>
          {state === 'copied' ? '✓' : '⧉'}
        </span>
        {state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed, select it manually' : label}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {state === 'copied' ? `${value} copied to clipboard` : state === 'failed' ? 'Copy failed' : ''}
      </span>
    </>
  )
}
