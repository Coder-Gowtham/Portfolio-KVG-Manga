import { describe, expect, it } from 'vitest'
import { buildMailto, isBot, validateContact, type ContactValues } from './contactForm'

const valid: ContactValues = {
  name: 'Asha',
  email: 'asha@company.com',
  subject: '',
  message: 'We have a full stack role and would love to talk.',
  website: '',
}

describe('contact form validation', () => {
  it('accepts a complete message (subject optional)', () => {
    expect(validateContact(valid)).toEqual({})
  })

  it('requires name, email and message', () => {
    const e = validateContact({ ...valid, name: ' ', email: '', message: '' })
    expect(Object.keys(e).sort()).toEqual(['email', 'message', 'name'])
  })

  it('rejects malformed emails', () => {
    for (const email of ['asha', 'asha@', 'asha@company', 'a sha@company.com']) {
      expect(validateContact({ ...valid, email }).email, email).toMatch(/incomplete/)
    }
  })

  it('enforces message length with the current count', () => {
    expect(validateContact({ ...valid, message: 'Hi there' }).message).toMatch(/at least 20 characters \(8 so far\)/)
    expect(validateContact({ ...valid, message: 'x'.repeat(2001) }).message).toMatch(/under 2000/)
  })

  it('flags the honeypot', () => {
    expect(isBot(valid)).toBe(false)
    expect(isBot({ ...valid, website: 'spam.example' })).toBe(true)
  })
})

describe('mailto builder', () => {
  it('encodes subject and body and includes a reply address', () => {
    const url = buildMailto('me@example.com', { ...valid, subject: 'Role & chat?' })
    expect(url.startsWith('mailto:me@example.com?subject=Role%20%26%20chat%3F&body=')).toBe(true)
    expect(decodeURIComponent(url.split('body=')[1]!)).toContain('Reply to: asha@company.com')
  })

  it('falls back to a default subject', () => {
    expect(decodeURIComponent(buildMailto('me@example.com', valid))).toContain('subject=Portfolio enquiry from Asha')
  })
})
