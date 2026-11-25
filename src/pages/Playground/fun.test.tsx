import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { routes } from '../../app/router'
import { QuickDraw } from '../../features/games/QuickDraw'
import { MemoryMatch } from '../../features/games/MemoryMatch'
import { BugHunt } from '../../features/games/BugHunt'
import { NeonTyper } from '../../features/games/NeonTyper'
import { CyberOracle } from '../../features/horoscope/CyberOracle'
import { QuotesTerminal } from '../../features/quotes/QuotesTerminal'
import { secretStore } from '../../features/secrets/secretStore'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
  return router
}

beforeEach(() => {
  localStorage.clear()
  act(() => secretStore.lock())
})

afterEach(() => vi.useRealTimers())

describe('Showdown hub', () => {
  it('lists every registered module as a cabinet', async () => {
    renderAt('/playground')
    await screen.findByRole('heading', { level: 1, name: /showdown/i })
    for (const name of ['Quick-draw', 'Memory match', 'Cyber-oracle', 'Quotes terminal', 'Bug hunt', 'Neon typer']) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument()
    }
    const nav = screen.getByRole('navigation', { name: /arcade cabinets/i })
    expect(within(nav).getAllByRole('link')).toHaveLength(6)
    expect(within(nav).queryByText(/coming soon/i)).not.toBeInTheDocument()
  })
})

describe('Showdown on small screens', () => {
  it('folds every game window until it is opened', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: q.includes('max-width: 767px'),
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    }))
    renderAt('/playground')
    await screen.findByRole('heading', { level: 1, name: /showdown/i })
    const toggle = screen.getByRole('button', { name: /quick-draw/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('button', { name: /tap to start/i })).not.toBeInTheDocument()
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: /tap to start/i })).toBeInTheDocument()
    vi.unstubAllGlobals()
  })
})

describe('Quick-draw', () => {
  it('calls a foul when firing before DRAW', () => {
    vi.useFakeTimers()
    render(<QuickDraw />)
    const arena = screen.getByRole('button', { name: /tap to start/i })
    fireEvent.pointerDown(arena)
    fireEvent.pointerDown(arena)
    expect(screen.getByText(/foul\. the bug saw you coming/i)).toBeInTheDocument()
  })

  it('measures a reaction and saves the best time (keyboard path)', () => {
    vi.useFakeTimers()
    render(<QuickDraw />)
    const arena = screen.getByRole('button', { name: /tap to start/i })
    fireEvent.click(arena, { detail: 0 })
    act(() => {
      vi.advanceTimersByTime(4100)
    })
    expect(arena).toHaveTextContent('DRAW!')
    fireEvent.click(arena, { detail: 0 })
    expect(screen.getByRole('status')).toHaveTextContent(/\d+ ms/)
    expect(localStorage.getItem('kvg:quickdraw-best')).not.toBeNull()
  })
})

describe('Memory match', () => {
  it('reveals a card and supports arrow-key focus movement', async () => {
    const user = userEvent.setup()
    render(<MemoryMatch />)
    const cards = screen.getAllByRole('button', { name: /^card \d+/i })
    expect(cards).toHaveLength(16)
    await user.click(cards[0]!)
    expect(cards[0]).not.toHaveAccessibleName(/hidden/)
    cards[0]!.focus()
    await user.keyboard('{ArrowRight}')
    expect(cards[1]).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(cards[5]).toHaveFocus()
  })
})

describe('Cyber-oracle', () => {
  it('is badged as fiction and remembers the chosen sign', async () => {
    const user = userEvent.setup()
    render(<CyberOracle today={new Date(2026, 10, 23)} />)
    expect(screen.getByText(/fictional fortunes/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /leo/i }))
    expect(screen.getByRole('heading', { name: 'Leo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /leo/i })).toHaveAttribute('aria-pressed', 'true')
    expect(localStorage.getItem('kvg:oracle-sign')).toBe('"leo"')
  })
})

describe('Quotes terminal', () => {
  it('shows the quote of the day and saves favourites on this device', async () => {
    const user = userEvent.setup()
    render(<QuotesTerminal today={new Date(2026, 10, 23)} />)
    expect(screen.getByText(/quote of the day/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '☆ Save' }))
    expect(JSON.parse(localStorage.getItem('kvg:quote-favourites')!)).toHaveLength(1)
    expect(screen.getByRole('button', { name: '★ Saved' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: /favourites/i }))
    expect(screen.getByText(/quote of the day/i)).toBeInTheDocument()
  })
})

describe('Hidden chapter', () => {
  it('stays sealed until unlocked', async () => {
    renderAt('/playground/secret')
    expect(await screen.findByText(/classified/i)).toBeInTheDocument()
    expect(screen.queryByRole('list', { name: /story panels/i })).not.toBeInTheDocument()
  })

  it('unlocks when "sudo kvg" is typed outside form fields', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await screen.findByRole('heading', { level: 1 })
    await user.keyboard('sudo kvg')
    expect(await screen.findByText(/hidden chapter unlocked/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /read ch/i })).toHaveFocus()
  })

  it('unlocks after five taps on the footer patch', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const patch = await screen.findByRole('button', { name: /kvg patch/i })
    for (let i = 0; i < 5; i++) await user.click(patch)
    expect(await screen.findByText(/hidden chapter unlocked/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /hidden chapter: origin of the mask/i })).toBeInTheDocument()
  })

  it('shows the story and the off-duty skin puts every mask down', async () => {
    const user = userEvent.setup()
    act(() => secretStore.unlock())
    const { container } = render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/playground/secret'] })} />)
    expect(await screen.findByRole('list', { name: /story panels/i })).toBeInTheDocument()
    expect(container.querySelector('use[href="#kvg-mask-up"]')).not.toBeNull()
    await user.click(screen.getByRole('switch', { name: /off-duty skin/i }))
    expect(screen.getByRole('switch', { name: /off-duty skin/i })).toHaveAttribute('aria-checked', 'true')
    expect(container.querySelector('use[href="#kvg-mask-up"]')).toBeNull()
  })
})

describe('Bug hunt', () => {
  it('runs a 30-second round and ends with a score', () => {
    vi.useFakeTimers()
    render(<BugHunt />)
    expect(screen.getAllByRole('button', { name: /^server \d/i })[0]).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: /start the hunt/i }))
    expect(screen.getAllByRole('button', { name: /^server \d/i })[0]).toBeEnabled()
    act(() => {
      vi.advanceTimersByTime(31_000)
    })
    expect(screen.getByRole('status')).toHaveTextContent(/points/)
    expect(screen.getByRole('button', { name: /hunt again/i })).toHaveFocus()
  })
})

describe('Neon typer', () => {
  it('clears a command typed exactly and loses a life when the fuse burns out', () => {
    vi.useFakeTimers()
    render(<NeonTyper />)
    fireEvent.click(screen.getByRole('button', { name: /start typing/i }))
    const target = screen.getByLabelText(/^type: /i).getAttribute('aria-label')!.replace(/^Type: /, '')
    fireEvent.change(screen.getByRole('textbox', { name: /your command/i }), { target: { value: target } })
    expect(screen.getByText(/cleared/i)).toHaveTextContent('1')
    act(() => {
      vi.advanceTimersByTime(20_000)
    })
    expect(screen.getByText(/of 3/)).toHaveTextContent(/[0-2] of 3/)
  })
})

describe('Mascot action poses', () => {
  it('renders each pose, labelled or decorative', async () => {
    const { MascotAction } = await import('../../components/manga/MascotAction')
    const { container } = render(
      <>
        <MascotAction action="slash" label="Katana slash" />
        <MascotAction action="throw" />
        <MascotAction action="power" />
        <MascotAction action="draw" />
      </>,
    )
    expect(screen.getByRole('img', { name: 'Katana slash' })).toBeInTheDocument()
    expect(container.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(3)
  })
})
