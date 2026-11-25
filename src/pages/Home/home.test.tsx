import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { routes } from '../../app/router'
import { home } from '../../data/home'
import { profile } from '../../data/profile'

async function renderHome() {
  const router = createMemoryRouter(routes, { initialEntries: ['/'] })
  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1, name: /gowtham kv/i })
  return router
}

afterEach(() => vi.restoreAllMocks())

describe('home page', () => {
  it('has a single H1 with the name and role, and the three hero actions', async () => {
    await renderHome()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByText('Full Stack Developer')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /explore projects/i })).toHaveAttribute('href', '/projects')
    const resume = screen.getAllByRole('link', { name: /download résumé/i })[0]
    expect(resume).toHaveAttribute('href', '/resume/gowtham-kv-resume.pdf')
    expect(screen.getAllByRole('link', { name: /contact me/i })[0]).toHaveAttribute('href', '/contact')
  })

  it('shows the catchphrase right under the name and role', async () => {
    await renderHome()
    const cover = screen.getByRole('heading', { level: 1 }).closest('section')!
    expect(within(cover).getByText('Relax. I only hunt bugs.')).toBeInTheDocument()
  })

  it('stays short: five sections, cover to final panel', async () => {
    await renderHome()
    const main = screen.getByRole('main')
    expect(within(main).getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Abilities',
      'Selected works',
      'Building and training',
      home.closing.bubble,
    ])
  })

  it('links the "new arc" burst to the in-development project', async () => {
    await renderHome()
    const burst = screen.getByRole('link', { name: /new arc.*vscc erp.*in development/i })
    expect(burst).toHaveAttribute('href', '/projects/vscc-erp')
  })

  it('shows the stack as a logo board, with text badges where no official logo exists', async () => {
    await renderHome()
    const react = screen.getByRole('list', { name: /frontend tools/i })
    expect(within(react).getByText('React')).toBeInTheDocument()
    expect(react.querySelector('svg path')).not.toBeNull()
    const devops = screen.getByRole('list', { name: /cloud & devops tools/i })
    expect(within(devops).getByText('AWS', { selector: 'span:not([aria-hidden])' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /read the full arc/i })).toHaveAttribute('href', '/experience')
    expect(screen.getByRole('link', { name: /skills with details/i })).toHaveAttribute('href', '/recruiter')
  })

  it('shows three text-first work cards (no placeholder media), each linking to its project', async () => {
    await renderHome()
    const section = screen.getByRole('heading', { level: 2, name: 'Selected works' }).closest('section')!
    const cards = within(section).getAllByRole('article')
    expect(cards.map((a) => within(a).getByRole('heading', { level: 3 }).textContent)).toEqual(['LogLens AI', 'Roshan Tiwari Consultants', 'Times Black'])
    expect(within(section).queryByText(/screenshot pending/i)).not.toBeInTheDocument()
    expect(within(cards[0]!).getByRole('link', { name: 'LogLens AI' })).toHaveAttribute('href', '/projects/loglens-ai')
  })

  it('summarises VSCC progress without counting planned modules as built', async () => {
    await renderHome()
    expect(screen.getByText(/of 10 modules done/i)).toBeInTheDocument()
    expect(screen.queryByText(/procurement/i)).not.toBeInTheDocument()
  })

  it('presents AI integration as an upcoming training arc, not a finished skill', async () => {
    await renderHome()
    // "AI integration" is also an Abilities group title; take the training-arc card.
    const arc = screen
      .getAllByRole('heading', { level: 3, name: /^ai integration$/i })
      .find((h) => h.id === 'training-title')!
      .closest('article')!
    expect(within(arc).getByText(/in training/i)).toBeInTheDocument()
    expect(within(arc).getByRole('link', { name: /loglens ai/i })).toHaveAttribute('href', '/projects/loglens-ai')
  })

  it('shows the quest board: full-time, contract, freelance and collaboration', async () => {
    await renderHome()
    const board = screen.getByRole('list', { name: /open to/i })
    expect(within(board).getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      'Main questFull-time role',
      'Side questContract role',
      'BountyFreelance project',
      'Co-opCollaboration',
    ])
  })

  it('copies the email address and announces it', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    await renderHome()
    await user.click(screen.getByRole('button', { name: /copy email/i }))
    expect(writeText).toHaveBeenCalledWith(profile.email)
    expect(await screen.findByRole('button', { name: /copied/i })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/copied to clipboard/i)
  })

  it('shows contact commands that open real profiles in a new tab', async () => {
    await renderHome()
    const linkedin = screen.getByRole('link', { name: /open linkedin/i })
    expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/gowtham-kv-9b0314173/')
    expect(linkedin).toHaveAttribute('target', '_blank')
    expect(linkedin).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(screen.getByRole('link', { name: /mail gowtham/i })).toHaveAttribute('href', `mailto:${profile.email}`)
  })
})
