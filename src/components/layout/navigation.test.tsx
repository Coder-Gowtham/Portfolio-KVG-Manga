import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { routes } from '../../app/router'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
  return router
}

describe('navigation shell', () => {
  it('marks the current page in the bottom nav', async () => {
    renderAt('/projects')
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    const works = await within(nav).findByRole('link', { name: /works/i })
    expect(works).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: /home/i })).not.toHaveAttribute('aria-current')
  })

  it('keeps Works active on a project detail page', async () => {
    renderAt('/projects/vscc-erp')
    await screen.findByRole('heading', { level: 1, name: /vscc erp/i })
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    expect(within(nav).getByRole('link', { name: /works/i })).toHaveAttribute('aria-current', 'page')
  })

  it('opens the menu sheet, then navigates and closes it', async () => {
    const user = userEvent.setup()
    const router = renderAt('/')
    const menuButton = await screen.findByRole('button', { name: /menu/i })
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    const sheet = screen.getByRole('dialog', { name: /more chapters/i })

    await user.click(within(sheet).getByRole('link', { name: /contact/i }))
    expect(router.state.location.pathname).toBe('/contact')
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the menu with its close button', async () => {
    const user = userEvent.setup()
    renderAt('/')
    const menuButton = await screen.findByRole('button', { name: /menu/i })
    await user.click(menuButton)
    await user.click(screen.getByRole('button', { name: /close menu/i }))
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('offers the résumé as a real PDF download', async () => {
    renderAt('/recruiter')
    const links = await screen.findAllByRole('link', { name: /download résumé/i })
    for (const link of links) {
      expect(link).toHaveAttribute('href', '/resume/gowtham-kv-resume.pdf')
      expect(link).toHaveAttribute('download')
    }
  })

  it('renders the 404 chapter for unknown routes and unknown project slugs', async () => {
    renderAt('/nope')
    expect(await screen.findByRole('heading', { name: /refactored out of existence/i })).toBeInTheDocument()
  })

  it('renders 404 for an unknown project slug', async () => {
    renderAt('/projects/not-a-project')
    expect(await screen.findByRole('heading', { name: /refactored out of existence/i })).toBeInTheDocument()
  })

  it('provides a skip link to the main content', async () => {
    renderAt('/')
    const skip = await screen.findByRole('link', { name: /skip to content/i })
    expect(skip).toHaveAttribute('href', '#main')
    expect(document.getElementById('main')).toBeInTheDocument()
  })
})
