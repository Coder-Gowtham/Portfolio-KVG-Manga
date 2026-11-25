import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, RouterProvider, createMemoryRouter } from 'react-router'
import { routes } from '../app/router'
import { profile } from '../data/profile'
import { ContactForm } from './Contact/ContactForm'
import { ScreenshotGallery } from '../components/projects/ScreenshotGallery'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
  return router
}

describe('Works page', () => {
  it('filters by category, updates the shareable URL and announces the count', async () => {
    const user = userEvent.setup()
    const router = renderAt('/projects')
    await screen.findByRole('heading', { level: 1, name: /mission log/i })
    expect(screen.getByRole('status')).toHaveTextContent('Showing 6 of 6 missions')

    expect(screen.queryByRole('button', { name: /clear filters/i })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /personal project/i }))
    expect(screen.getByRole('status')).toHaveTextContent('Showing 2 of 6 missions')
    expect(router.state.location.search).toBe('?cat=personal')
    expect(screen.getByRole('button', { name: /personal project/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument()
  })

  it('keeps technology chips behind a toggle until needed', async () => {
    const user = userEvent.setup()
    renderAt('/projects')
    await screen.findByRole('heading', { level: 1, name: /mission log/i })
    const toggle = screen.getByRole('button', { name: /technology/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('button', { name: 'Redis' })).not.toBeInTheDocument()
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Redis' })).toBeInTheDocument()
  })

  it('restores filters from the URL and combines category + technology', async () => {
    renderAt('/projects?cat=professional&tech=mysql')
    await screen.findByRole('heading', { level: 1, name: /mission log/i })
    const titles = screen.getAllByRole('article').map((a) => within(a).getByRole('heading').textContent)
    expect(titles).toEqual(['Times Black'])
  })

  it('shows an empty state that clears filters', async () => {
    const user = userEvent.setup()
    renderAt('/projects?cat=professional&tech=redis')
    expect(await screen.findByText(/no missions match/i)).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: /clear filters/i })[0]!)
    expect(screen.getByRole('status')).toHaveTextContent('Showing 6 of 6 missions')
  })
})

describe('Project detail', () => {
  it('keeps planned VSCC modules out of the built list', async () => {
    renderAt('/projects/vscc-erp')
    await screen.findByRole('heading', { level: 1, name: /vscc erp/i })
    const built = screen.getByRole('heading', { name: /^built$/i }).parentElement!
    const roadmap = screen.getByRole('heading', { name: /roadmap/i }).parentElement!
    expect(within(built).queryByText(/procurement/i)).not.toBeInTheDocument()
    expect(within(roadmap).getByText(/procurement/i)).toBeInTheDocument()
  })

  it('shows engineering notes, a confidentiality notice and episode navigation', async () => {
    renderAt('/projects/vscc-erp')
    await screen.findByRole('heading', { level: 1, name: /vscc erp/i })
    expect(screen.getByRole('heading', { name: /engineering notes/i })).toBeInTheDocument()
    expect(screen.getByText(/confidential work/i)).toBeInTheDocument()
    const nav = screen.getByRole('navigation', { name: /other episodes/i })
    expect(within(nav).getAllByRole('link')).toHaveLength(2)
  })

  it('renders a placeholder project as "coming soon" without invented details', async () => {
    renderAt('/projects/vector-mind')
    expect(await screen.findByText(/details coming soon/i)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /engineering notes/i })).not.toBeInTheDocument()
  })
})

describe('Screenshot gallery', () => {
  it('opens approved screenshots in a lightbox and steps between them', async () => {
    const user = userEvent.setup()
    render(
      <ScreenshotGallery
        title="Demo"
        media={[
          { kind: 'image', src: '/a.png', alt: 'Dashboard', approvedForPublic: true },
          { kind: 'image', src: '/b.png', alt: 'Settings', approvedForPublic: true },
          { kind: 'image', alt: 'Secret screen', approvedForPublic: false },
        ]}
      />,
    )
    // Unapproved media is a labelled placeholder, never clickable.
    expect(screen.queryByRole('button', { name: /secret screen/i })).not.toBeInTheDocument()
    expect(screen.getByText(/screenshot pending/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /open screenshot: dashboard/i }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('img', { name: 'Dashboard' })).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: /next screenshot/i }))
    expect(within(dialog).getByRole('img', { name: 'Settings' })).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: /close viewer/i }))
    expect(dialog).not.toHaveAttribute('open')
  })
})

describe('Experience', () => {
  it('switches between latest-first and from-the-beginning order', async () => {
    const user = userEvent.setup()
    renderAt('/experience')
    await screen.findByRole('heading', { level: 1, name: /the story so far/i })
    const roles = () => screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(roles()[0]).toMatch(/career break/i)
    expect(screen.queryByText(/plot twist/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /from the beginning/i }))
    expect(roles().slice(0, 4)).toEqual([
      expect.stringMatching(/b\.tech/i),
      'Customer Care Executive',
      'Customer Care Associate',
      'Self-taught developer',
    ])
  })

  it('keeps each chapter to a short summary, with no bullet lists', async () => {
    renderAt('/experience')
    await screen.findByRole('heading', { level: 1, name: /the story so far/i })
    const timeline = screen.getByRole('list', { name: /career chapters/i })
    expect(timeline.querySelectorAll('article ul:not([aria-label$="technologies"])')).toHaveLength(0)
    expect(screen.getByText('2019 – 2020')).toBeInTheDocument()
    expect(screen.getByText('Jan 2021 – Jun 2021')).toBeInTheDocument()
    expect(screen.getByText(/i learned to listen first/i)).toBeInTheDocument()
    expect(screen.getByText(/that question never left/i)).toBeInTheDocument()
    const niveus = screen.getByRole('heading', { name: /cloud associate/i }).closest('article')!
    expect(within(niveus).getByRole('link', { name: 'Times Black' })).toHaveAttribute('href', '/projects/times-black')
    expect(within(niveus).getByText('Savings Account')).toBeInTheDocument()
    expect(within(niveus).getByText('Credit cards')).toBeInTheDocument()
    const indie = screen.getByRole('heading', { name: /career break/i }).closest('article')!
    expect(within(indie).getByRole('link', { name: 'Roshan Tiwari Consultants' })).toHaveAttribute(
      'href',
      '/projects/roshan-tiwari-consultants',
    )
  })
})

describe('Contact quest board', () => {
  it('fills the subject from a picked quest, and leaves a typed subject alone', async () => {
    const user = userEvent.setup()
    renderAt('/contact')
    await screen.findByRole('heading', { level: 1 })
    const board = screen.getByRole('list', { name: /pick a quest type/i })
    await user.click(within(board).getByRole('button', { name: /contract role/i }))
    expect(within(board).getByRole('button', { name: /contract role/i })).toHaveAttribute('aria-pressed', 'true')
    const subject = screen.getByLabelText(/subject/i)
    expect(subject).toHaveValue('Contract role: ')
    await user.type(subject, 'API work')
    await user.click(within(board).getByRole('button', { name: /freelance project/i }))
    expect(subject).toHaveValue('Freelance project: API work')
    await user.clear(subject)
    await user.type(subject, 'My own subject')
    await user.click(within(board).getByRole('button', { name: /collaboration/i }))
    expect(subject).toHaveValue('My own subject')
  })
})

describe('Contact host mascot', () => {
  it('pulls the mask up when tapped, and back down on a second tap', async () => {
    const user = userEvent.setup()
    renderAt('/contact')
    await screen.findByRole('heading', { level: 1 })
    const [host] = screen.getAllByRole('button', { name: /netrunner: mask up/i })
    expect(host).toHaveAttribute('aria-pressed', 'false')
    await user.click(host!)
    expect(host).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByText('Say the word.').length).toBeGreaterThan(0)
    await user.click(host!)
    expect(host).toHaveAttribute('aria-pressed', 'false')
  })
})

describe('Recruiter', () => {
  it('keeps résumé and email one tap away and Instagram off the page', async () => {
    renderAt('/recruiter')
    await screen.findByRole('heading', { level: 1, name: /gowtham kv/i })
    const quick = screen.getByRole('region', { name: /quick actions/i })
    expect(within(quick).getByRole('link', { name: /résumé/i })).toHaveAttribute('href', profile.resume.href)
    expect(within(quick).getByRole('link', { name: /email/i })).toHaveAttribute('href', `mailto:${profile.email}`)
    expect(screen.getByText('Looking for')).toBeInTheDocument()
    expect(screen.getByText(/full-time, contract, freelance and collaborations/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /phone/i })).toHaveAttribute('href', 'tel:+917067277125')
    // The site footer may link Instagram; the recruiter content itself must not.
    expect(within(screen.getByRole('main')).queryByText(/instagram/i)).not.toBeInTheDocument()
  })
})

describe('Contact form', () => {
  it('validates on submit and focuses the first invalid field', async () => {
    const user = userEvent.setup()
    const openMail = vi.fn()
    render(
      <MemoryRouter>
        <ContactForm openMail={openMail} />
      </MemoryRouter>,
    )
    await user.click(screen.getByRole('button', { name: /open in email app/i }))
    expect(openMail).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Name')).toHaveFocus()
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Enter your name.')).toBeInTheDocument()
  })

  it('opens the email app with a pre-filled message and says so honestly', async () => {
    const user = userEvent.setup()
    const openMail = vi.fn()
    render(
      <MemoryRouter>
        <ContactForm openMail={openMail} />
      </MemoryRouter>,
    )
    await user.type(screen.getByLabelText('Name'), 'Asha')
    await user.type(screen.getByLabelText('Your email'), 'asha@company.com')
    await user.type(screen.getByLabelText('Message'), 'We have a full stack role open.')
    await user.click(screen.getByRole('button', { name: /open in email app/i }))

    expect(openMail).toHaveBeenCalledTimes(1)
    expect(openMail.mock.calls[0]![0]).toMatch(new RegExp(`^mailto:${profile.email}\\?subject=`))
    expect(screen.getByRole('status')).toHaveTextContent(/email app should now be open/i)
    expect(screen.queryByText(/message sent/i)).not.toBeInTheDocument()
  })

  it('silently drops bot submissions caught by the honeypot', async () => {
    const user = userEvent.setup()
    const openMail = vi.fn()
    const { container } = render(
      <MemoryRouter>
        <ContactForm openMail={openMail} />
      </MemoryRouter>,
    )
    const honey = container.querySelector('input[name="website"]') as HTMLInputElement
    await user.type(honey, 'spam')
    await user.click(screen.getByRole('button', { name: /open in email app/i }))
    expect(openMail).not.toHaveBeenCalled()
  })
})
