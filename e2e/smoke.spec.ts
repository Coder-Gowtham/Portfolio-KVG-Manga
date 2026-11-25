import { expect, test } from '@playwright/test'

const ROUTES = ['/', '/projects', '/projects/vscc-erp', '/experience', '/recruiter', '/contact', '/playground', '/nope']

for (const path of ROUTES) {
  test(`${path} renders with no horizontal overflow`, async ({ page }) => {
    await page.goto(path)
    await expect(page.locator('h1').first()).toBeVisible()
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })
}

test('each route ships its own title in static HTML', async ({ request }) => {
  const res = await request.get('/recruiter/')
  expect(await res.text()).toContain('<title>Hire brief — Gowtham KV</title>')
})

test('résumé PDF downloads', async ({ request }) => {
  const res = await request.get('/resume/gowtham-kv-resume.pdf')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('pdf')
})

test('keyboard: skip link moves focus into main content', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
})
