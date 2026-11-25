# Portfolio KVG: Gowtham KV

Cyberpunk × manga portfolio for a backend-focused full-stack developer.
React 19 · TypeScript (strict) · Vite 7 · React Router 7 · CSS Modules. No UI kit.

> **Status: Phase 6 (Fun Zone) done.** Home, Works, project detail, Career Arc, Recruiter, Contact, plus the
> Omake arcade: Quick-draw, Memory match, Bug hunt, Neon typer, the Cyber-oracle (fictional fortunes) and a quotes terminal, and the
> hidden chapter "Ch.∞: Origin of the Mask". Phase 7 is QA and deploy. See `docs/phase-2-design-spec.md`.

### Fun Zone modules

Each module lives in `src/features/` and is registered once in `src/features/registry.ts`; the hub page
renders whatever is registered. Game logic is kept in plain TypeScript files (`memory.ts`, `reaction.ts`,
`oracle.ts`, `quotes.ts`) with unit tests in `src/features/fun.test.ts`. Scores, favourites and the secret
state live in `localStorage` under `kvg:*` keys and never leave the visitor's device.

**Mascot poses:** `src/components/manga/MascotAction.tsx` adds four action poses built from the approved
sprite layers: `slash` (Works, 404), `draw` (Career Arc), `power` (Home training arc) and `throw` (project
pages, above the episode links). Use `<MascotAction action="…" />`; pass `label` when it carries meaning.

**Hidden chapter:** type `sudo kvg` (or the Konami code) anywhere outside a form field, or tap the footer
KVG patch five times. Unlocking adds the "Off-duty skin" (mask down site-wide) and an optional drone that
follows the cursor (mouse only, disabled for reduced motion).

### Contact form delivery

The form validates input, then opens the visitor's own email app with the message pre-filled
(`src/features/contact/contactForm.ts`). Nothing is stored or sent by the site, and the UI says so.
To use a form service later (Formspree, Web3Forms…), replace the `openMail` call in
`src/pages/Contact/ContactForm.tsx` with a `fetch` to the service and keep the same success state.

## Run it

```sh
npm install
npm run dev          # http://localhost:5173
npm run check        # typecheck + lint + unit tests + production build
npm run test:e2e     # Playwright smoke tests at 360 / 768 / 1280 px (first run: npx playwright install chromium)
```

Requires Node 20.19+ (Vite 7).

## Edit content (no component changes needed)

| What | Where |
|---|---|
| Name, intro, contact links, availability, résumé path | `src/data/profile.ts` |
| Projects (add one = add one object) | `src/data/projects.ts` |
| Career timeline | `src/data/experience.ts` |
| Skills (described, never rated) | `src/data/skills.ts` |
| Fun Zone quotes | `src/data/quotes.ts` |
| Home copy (status strip, cover lines, recap, closing) | `src/data/home.ts` |
| Page titles / descriptions | `src/app/routes.ts` |
| Colours, type, spacing, motion | `src/styles/tokens.css` |
| Résumé PDF | `public/resume/gowtham-kv-resume.pdf` |
| Project screenshots | `public/images/projects/<slug>/…` then add to the project's `media` with alt text and `approvedForPublic: true` |

`needsInput` on any record lists facts still awaiting confirmation. In `npm run dev` these show as a
yellow **NEEDS INPUT** box on the page. They never render in production builds.

### Content rules (enforced by `src/data/data.test.ts`)

- No numeric impact metrics (no "20% faster").
- Planned work never appears as built.
- Only real `https://` demo / GitHub links.
- Media without `approvedForPublic` can't ship a real file.
- Instagram stays off the Recruiter page.

## Structure

```
src/
  app/          router (lazy routes), route metadata, <Seo>
  components/
    layout/     AppShell, BottomNav, HudRail, MenuSheet, TopBar, Footer
    manga/      ChapterHeading, MangaPanel, SpeechBubble, NarrationBox, Sfx, Stamp, Mascot, sprite
    ui/         InkButton, icons
  data/         profile, projects, experience, skills, quotes (+ integrity tests)
  pages/        one folder per route
  styles/       tokens.css, base.css, fonts
  types/        content model
  features/     games / horoscope / secrets (Phase 6)
docs/           design spec + approved mascot sprite
e2e/            Playwright smoke tests
```

## Navigation

- **< 1024 px:** bottom bar (Home · Works · Arc · Hire · Menu). It hides on scroll-down and returns on
  scroll-up. Menu opens a native `<dialog>` sheet (focus-trapped, Esc closes).
- **≥ 1024 px:** fixed HUD rail that expands on hover or keyboard focus.
- **Recruiter page:** plain top bar instead of the rail.
- Skip link, `aria-current`, and focus moves to the new page on navigation.

## SEO & deployment

The build writes one HTML file per route (including each project) with its own title, description,
Open Graph tags and canonical URL, so link previews work on a static host. Set the public origin first:

```sh
cp .env.example .env   # then set SITE_URL=https://your-domain
npm run build          # dist/ also gets sitemap.xml + robots.txt
```

Deploy `dist/` to Cloudflare Pages, Netlify or Vercel. Static `dist/<route>/index.html` files cover
every known route; configure an SPA fallback to `index.html` for anything else, so the 404 page renders.

## Verification notes (Phase 3)

Built in an environment without npm registry access. Before handover it was verified with
React 19.2 + esbuild, a stand-in router, and headless Chromium:

- All 9 routes render with an `<h1>`, no runtime errors, and **no horizontal overflow at 360, 768 and 1280 px**.
- Keyboard order: skip link → logo → chapters; focus moves into the new page after navigation.
- Menu sheet opens, focuses its close button, and closes on Esc.
- One `<title>` and one `meta description` per page.
- 16/16 data-integrity tests pass.
- Source type-checks under strict mode (against minimal type shims).

**Not yet run against the real packages:** `npm run check` (official types, ESLint, Vitest, Vite build)
and `npm run test:e2e`. Run `npm run check` once after `npm install`. If anything fails, the error
output is enough to fix it in the next session.
# Portfolio-KVG-Manga
