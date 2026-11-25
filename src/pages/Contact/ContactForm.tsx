import { useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Stamp } from '../../components/manga'
import { Drone } from '../../components/manga/Mascot'
import {
  LIMITS,
  buildMailto,
  isBot,
  validateContact,
  type ContactErrors,
  type ContactValues,
} from '../../features/contact/contactForm'
import { profile } from '../../data/profile'
import { cx } from '../../utils/cx'
import s from './contact.module.css'

const EMPTY: ContactValues = { name: '', email: '', subject: '', message: '', website: '' }
type Field = keyof ContactErrors
const ORDER: Field[] = ['name', 'email', 'subject', 'message']

/**
 * Validated contact form. On submit it opens the visitor's email app with the
 * message pre-filled; the UI says exactly that, never "message sent".
 */
export function ContactForm({ openMail = (url: string) => window.location.assign(url) }: { openMail?: (url: string) => void }) {
  const uid = useId()
  const id = (f: string) => `${uid}-${f}`
  const [values, setValues] = useState<ContactValues>(EMPTY)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [status, setStatus] = useState<'idle' | 'opened'>('idle')
  const [shake, setShake] = useState<Field | null>(null)
  const refs = useRef<Partial<Record<Field, HTMLInputElement | HTMLTextAreaElement | null>>>({})

  const set = (f: keyof ContactValues) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [f]: e.target.value }
    setValues(next)
    if (f !== 'website' && touched[f]) setErrors((prev) => ({ ...prev, [f]: validateContact(next)[f] }))
  }
  const blur = (f: Field) => () => {
    setTouched((t) => ({ ...t, [f]: true }))
    setErrors((prev) => ({ ...prev, [f]: validateContact(values)[f] }))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (isBot(values)) {
      setStatus('opened')
      return
    }
    const found = validateContact(values)
    setErrors(found)
    setTouched({ name: true, email: true, subject: true, message: true })
    const first = ORDER.find((f) => found[f])
    if (first) {
      refs.current[first]?.focus()
      setShake(first)
      window.setTimeout(() => setShake(null), 400)
      return
    }
    openMail(buildMailto(profile.email, values))
    setStatus('opened')
  }

  const fieldProps = (f: Field) => ({
    id: id(f),
    name: f,
    value: values[f],
    onChange: set(f),
    onBlur: blur(f),
    'aria-invalid': errors[f] ? true : undefined,
    'aria-describedby': cx(errors[f] && id(`${f}-err`), f === 'message' && id('message-hint')) || undefined,
    className: cx(s.input, errors[f] && s.invalid, shake === f && s.shake),
  })

  const err = (f: Field) =>
    errors[f] ? (
      <p id={id(`${f}-err`)} className={s.error}>
        {errors[f]}
      </p>
    ) : null

  if (status === 'opened') {
    return (
      <div className={s.done} role="status">
        <Drone className={s.doneDrone} />
        <Stamp status="draft-ready" />
        <p>
          <strong>Your email app should now be open</strong> with the message ready to send. Hit send there to deliver
          it.
        </p>
        <p className={s.fallback}>
          Nothing opened? Email me directly at <a href={`mailto:${profile.email}`}>{profile.email}</a>.
        </p>
        <button type="button" className={s.again} onClick={() => setStatus('idle')}>
          Edit the message
        </button>
      </div>
    )
  }

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate aria-describedby={id('how')}>
      <p id={id('how')} className={s.how}>
        This form opens your own email app with the message filled in. Nothing is stored or sent by this site.
      </p>

      <div className={s.field}>
        <label htmlFor={id('name')}>Name</label>
        <input
          {...fieldProps('name')}
          ref={(el) => {
            refs.current.name = el
          }}
          type="text"
          autoComplete="name"
          maxLength={LIMITS.name.max + 20}
          required
        />
        {err('name')}
      </div>

      <div className={s.field}>
        <label htmlFor={id('email')}>Your email</label>
        <input
          {...fieldProps('email')}
          ref={(el) => {
            refs.current.email = el
          }}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@example.com"
          required
        />
        {err('email')}
      </div>

      <div className={s.field}>
        <label htmlFor={id('subject')}>
          Subject <span className={s.optional}>(optional)</span>
        </label>
        <input
          {...fieldProps('subject')}
          ref={(el) => {
            refs.current.subject = el
          }}
          type="text"
          maxLength={LIMITS.subject.max + 20}
        />
        {err('subject')}
      </div>

      <div className={s.field}>
        <label htmlFor={id('message')}>Message</label>
        <textarea
          {...fieldProps('message')}
          ref={(el) => {
            refs.current.message = el
          }}
          rows={6}
          required
        />
        <p id={id('message-hint')} className={s.hint}>
          {values.message.trim().length}/{LIMITS.message.max} · at least {LIMITS.message.min} characters
        </p>
        {err('message')}
      </div>

      {/* Honeypot: hidden from people and assistive tech */}
      <div className={s.honey} aria-hidden="true">
        <label htmlFor={id('website')}>Website</label>
        <input id={id('website')} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
      </div>

      <button type="submit" className={s.submit}>
        Open in email app
      </button>
    </form>
  )
}
