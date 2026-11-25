/**
 * Contact form logic, kept free of React so it can be unit-tested.
 *
 * Delivery is honest: until a form service is configured, submitting opens the
 * visitor's own email app with the message filled in. Nothing pretends to send.
 */
export interface ContactValues {
  name: string
  email: string
  subject: string
  message: string
  /** Honeypot. Real people never see or fill this. */
  website: string
}

export type ContactErrors = Partial<Record<Exclude<keyof ContactValues, 'website'>, string>>

export const LIMITS = {
  name: { max: 80 },
  subject: { max: 120 },
  message: { min: 20, max: 2000 },
} as const

// Pragmatic check: something@something.tld, no spaces.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateContact(v: ContactValues): ContactErrors {
  const e: ContactErrors = {}
  const name = v.name.trim()
  const email = v.email.trim()
  const subject = v.subject.trim()
  const message = v.message.trim()

  if (!name) e.name = 'Enter your name.'
  else if (name.length > LIMITS.name.max) e.name = `Keep your name under ${LIMITS.name.max} characters.`

  if (!email) e.email = 'Enter your email so I can reply.'
  else if (!EMAIL_RE.test(email)) e.email = 'That email looks incomplete. Check for typos (e.g. name@example.com).'

  if (subject.length > LIMITS.subject.max) e.subject = `Keep the subject under ${LIMITS.subject.max} characters.`

  if (!message) e.message = 'Write a message.'
  else if (message.length < LIMITS.message.min)
    e.message = `Add a little more detail: at least ${LIMITS.message.min} characters (${message.length} so far).`
  else if (message.length > LIMITS.message.max)
    e.message = `Keep the message under ${LIMITS.message.max} characters (${message.length} now).`

  return e
}

export const isBot = (v: ContactValues) => v.website.trim().length > 0

/** Builds the mailto: link for the visitor's email app. */
export function buildMailto(to: string, v: ContactValues): string {
  const subject = v.subject.trim() || `Portfolio enquiry from ${v.name.trim()}`
  const body = `${v.message.trim()}\n\n— ${v.name.trim()}\nReply to: ${v.email.trim()}`
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
