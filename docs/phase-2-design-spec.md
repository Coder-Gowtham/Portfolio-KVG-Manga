# Portfolio KVG — Phase 2 Design Specification

**Owner:** Gowtham KV · **Status:** Approved; content updated from the full-stack résumé; Phases 4–6 built (23 Nov 2026) · **Date:** 23 Nov 2026
**Direction locked in Phase 1:** Cyberpunk manga. Ink-on-paper manga panels, neon accents, original masked "netrunner" mascot with a bug-hunter drone and a dev-themed weapon loadout.

---

## 0. Decisions locked in Phase 1

| Area | Decision |
|---|---|
| Theme | Cyberpunk × manga. Panels, screentone, speed lines and SFX lettering from manga. Neon, HUD and terminal language from cyberpunk. |
| Positioning | **Full Stack Developer** (React.js · Node.js · JavaScript), not "backend developer". Upcoming arc: **AI integrator**, always framed as in training. |
| Brand mark | **KVG** (Kondapalli Venkat Gowtham) on the hex patch, masthead, favicon, status strip and terminal prompt. Displayed name stays "Gowtham KV". |
| Mascot | Round-3 masked netrunner (source: `design/mascot-sprite.svg`). Mask **up** = combat pages; mask **down + smirk** = friendly pages. |
| Sidekick | Bug-hunter drone. Hosts the Fun Zone, appears in empty/success states. |
| Loadout | Refactor katana (on back), Hotfix kunai (×3 on chest strap), Breakpoint blaster (sidearm), Async shuriken. |
| Page mix | **Home** = Glitch magazine cover (I) → Battle panels (H). **Projects / detail** = Battle spreads (H) + Terminal windows (J) for engineering notes. **Recruiter** = Character dossier (K). **Contact** = Terminal (J). **Fun Zone** = drone-hosted arcade. |

---

## 1. Design tokens

### 1.1 Colour

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#0A0A0F` | Night black. Page background on dark surfaces, all linework, primary text on paper |
| `--ink-2` | `#16161E` | Raised dark surface (terminal windows, collars) |
| `--ink-3` | `#1D1D27` | Dark panel fill, armour plates |
| `--steel` | `#454558` | Seams, dividers on dark |
| `--paper` | `#EDEBE4` | Newsprint. Manga panel interiors, light page background |
| `--paper-2` | `#F4F1EA` | Lightest paper (mascot skin, cards on paper) |
| `--graphite` | `#5C5A55` | Secondary text on paper |
| `--neon-cyan` | `#00E5FF` | Primary neon. Borders, HUD text, focus rings **on dark only** |
| `--neon-magenta` | `#FF2A6D` | Action colour. Primary CTA fill, active nav, SFX, the one hot accent per view |
| `--neon-yellow` | `#F5E500` | Highlight. Bursts, "new" badges, cursor, warnings |
| `--blade` | `#D8DBE3` | Metal (weapons) |

**Contrast rules (WCAG AA, verified by ratio):**
- Cyan, yellow and magenta text are allowed **only on `--ink` / `--ink-2`** (all ≥ 5:1).
- On `--paper`, text is `--ink` or `--graphite` only. Magenta on paper is a **fill**, never small text (≈3:1).
- Magenta fills carry `--ink` text (≈5.5:1), never white.
- Cyan is never used as text on paper (fails).
- Colour never carries meaning alone. Active nav = magenta **plus** bold label **plus** marker.

**Surfaces:** two modes coexist on one page, not a theme toggle.
- *Night surfaces* (`--ink`): site chrome, nav, terminal windows, cover masthead, footer.
- *Paper surfaces* (`--paper`): manga panels, reading content, Recruiter page body.
This is what keeps it manga (paper panels) and cyberpunk (night frame) at once.

### 1.2 Typography

| Role | Family | Use | Notes |
|---|---|---|---|
| Display | **Dela Gothic One** | Chapter titles, masthead, H1/H2, CTA labels | Has Japanese glyphs. Subset to Latin + the exact kana/kanji used (週刊, 開発, 第, 話 …). Self-host WOFF2. |
| SFX | **Reggae One** | Sound effects (ゴゴゴ, チャキ, ドン) | Decorative only, always `aria-hidden`. Subset to ~20 glyphs. |
| HUD / mono | **Share Tech Mono** | Terminal UI, tags, metadata, commands | Latin only. |
| Body | **IBM Plex Sans** (400/500/600) | All reading text, forms, Recruiter page | Highest readability; technical feel without being cold. |

**Type scale (fluid, mobile → desktop):**

| Token | Size | Line height | Family |
|---|---|---|---|
| `--fs-mega` | `clamp(3rem, 14vw, 7.5rem)` | 0.9 | Display (masthead "KVG") |
| `--fs-h1` | `clamp(2rem, 8vw, 4rem)` | 1.0 | Display |
| `--fs-h2` | `clamp(1.5rem, 5.5vw, 2.75rem)` | 1.05 | Display |
| `--fs-h3` | `clamp(1.125rem, 3.5vw, 1.5rem)` | 1.2 | Display |
| `--fs-body` | `1rem` (16px) → `1.0625rem` ≥1024px | 1.6 | Body |
| `--fs-small` | `0.875rem` | 1.5 | Body |
| `--fs-mono` | `0.875rem` | 1.4 | Mono |
| `--fs-micro` | `0.75rem` | 1.3 | Mono (labels only, never paragraphs) |

Rules: display face only in uppercase-safe short strings (≤ 6 words). Paragraph measure 60–72ch. Never set body copy in Dela or Share Tech.

### 1.3 Spacing (4px base)

`--s-1: 4px · --s-2: 8px · --s-3: 12px · --s-4: 16px · --s-5: 24px · --s-6: 32px · --s-7: 48px · --s-8: 64px · --s-9: 96px`

- Page side padding: 16px (<480), 24px (480–1023), 48px (≥1024).
- Panel gutter (white gap between manga panels): `--gutter: 8px` mobile, `14px` desktop.
- Section rhythm: `--s-8` mobile, `--s-9` desktop.

### 1.4 Borders, frames & shapes

| Token | Value | Use |
|---|---|---|
| `--line-1` | 1.5px solid | Speech bubbles, tags |
| `--line-2` | 2.5px solid | Manga panel borders |
| `--line-3` | 4px solid | Page frame, hero panel |
| `--chamfer` | 10px | Cyberpunk cut corner via `clip-path` on buttons/cards |
| `--skew-sm` | 3° | Max panel slant on mobile |
| `--skew-lg` | 7° | Max panel slant on desktop |
| `--neon-offset` | 2px | Chromatic double-border (cyan + magenta offset) for "hero" panels only |

Panel slants are applied to the **panel frame** (clip-path polygon), never to text. Text is always horizontal.

### 1.5 Textures (all CSS/SVG, zero raster)

| Texture | Implementation | Where |
|---|---|---|
| Screentone dots | `radial-gradient` 4px tile, ink or magenta | Panel shading, backgrounds behind mascot |
| Speed lines | Pre-generated SVG (one static file per variant, not JS) | Hero, project spreads, impact moments (max 1 per viewport) |
| Neon sun | SVG circle + horizontal stripe cut-outs | Home cover only |
| Scanlines | `repeating-linear-gradient` 2px, 6% opacity | Terminal windows |
| Grid floor | SVG perspective lines, cyan 50% | Contact terminal, Fun Zone |
| Glitch | Duplicated text layers offset ±2px cyan/magenta | Masthead "KVG" and 404 only |

### 1.6 Buttons

| Variant | Look | Use |
|---|---|---|
| `primary` | Magenta fill, ink text, chamfered corner, 2.5px ink border | One per view (Explore projects / Hire brief / Send) |
| `secondary` | Ink fill, cyan text + border | Download résumé, secondary actions on dark |
| `paper` | Paper fill, ink border + text | Actions inside paper panels |
| `command` | Mono text `> ./projects`, no box, cyan, underline on hover/focus | Terminal-style navigation (Contact, J windows) |
| `icon` | 44×44 min, ink/cyan | Copy email, close lightbox, nav |

States: hover = 2px "impact" offset (translate −2px, −2px) + hard shadow `4px 4px 0 var(--ink)`; active = shadow removed (pressed); focus-visible = 2px cyan outline + 2px ink gap (on paper: ink outline + magenta gap); disabled avoided; loading = shuriken spinner replaces label icon.

### 1.7 Motion tokens

| Token | Value | Use |
|---|---|---|
| `--dur-instant` | 80ms | Press feedback |
| `--dur-fast` | 160ms | Hover, tag toggles |
| `--dur-base` | 240ms | Panel reveal, menus |
| `--dur-slow` | 420ms | Page transition |
| `--dur-dramatic` | 700ms | Hero entrance (once per session) |
| `--ease-ink` | `cubic-bezier(.2,.8,.2,1)` | Default |
| `--ease-impact` | `cubic-bezier(.34,1.56,.64,1)` | Bursts, stamps |
| `--ease-glitch` | `steps(4, end)` | Glitch flicker |

### 1.8 Breakpoints

`xs 320 · sm 480 · md 768 · lg 1024 · xl 1280 · 2xl 1536`. Designed at 360 first, then 768 and 1280.

### 1.9 Icons & illustration conventions

- **Lucide** for UI icons (tree-shaken, ~1KB each), stroke 2, sized 20/24.
- Brand icons (LinkedIn, GitHub) as hand-placed SVG (Lucide no longer ships brand marks).
- Weapons double as micro-icons: kunai = "view project" arrow; shuriken = loader; katana = page-transition wipe.
- All illustration is **inline SVG sprites**, ink stroke 2–2.5 at 1×, palette limited to tokens above. No AI-generated raster art.
- Japanese text is decorative only, always `aria-hidden`, and short; English carries all meaning.

---

## 2. Navigation

### Mobile (< 1024px): bottom HUD bar

`Home · Works · Arc · Hire · Menu`. Five 64px-tall slots, ink background, cyan top border.
- Active: magenta label + magenta marker bar above + `aria-current="page"`.
- Hides on scroll-down, returns on scroll-up or after 1.2s idle; always visible when focus is inside it.
- **Menu** opens a bottom sheet (ink, chamfered top corners): Contact, Fun Zone, Download résumé, email / LinkedIn / GitHub. Focus-trapped, Esc / swipe-down / backdrop closes.
- Respects `env(safe-area-inset-bottom)`.

### Desktop (≥ 1024px): left HUD rail

72px fixed rail: hex "KVG" patch (home link) at top, chapter numbers + vertical labels (`CH.01 WORKS`, `CH.02 ARC`, `HIRE`, `CONTACT`, `OMAKE`), résumé button at bottom. Hover expands the rail to 220px to show full labels (labels are always in the DOM for screen readers). **Recruiter page** swaps the rail for a plain top bar.

### Skip link

"Skip to content" first focusable element on every page.

---

## 3. Home: mobile-first composition (designed at 360 × 740)

Reading order = DOM order = visual order.

**00 · HUD status strip** (ink, 32px): `KVG.SYS // ONLINE` · `Available for immediate joining` · `Next arc: AI integration` (small phones show availability only; editable in `home.ts`).

**01 · Cover hero (Direction I)**
- Masthead block (ink): `週刊` small yellow, glitch-layered **KVG** mega, right column `CYBER ISSUE · No.04` (issue number = years of experience, data-driven).
- Cover art (paper): neon sun + mascot (mask up, katana) + "NEW ARC!" yellow burst → links to VSCC ERP.
- Cover lines (left, ink tags, cyan mono): React.js · Node.js · Full stack · Fintech arc · 4 yrs exp · **Next: AI arc** (yellow).
- **Real H1 below the art** (not inside SVG): "Gowtham KV" + role line "Full Stack Developer" + "Next arc: AI integration" chip (≥480px).
- Intro speech bubble (2 lines): full stack, React, Node.js, JavaScript.
- CTAs stacked full-width: **Explore projects** (primary) · **Download résumé (PDF)** (secondary) · **Contact me** (command).
- Fold target at 360×740: masthead + art + H1 + first CTA visible.

**02 · "Previously on…"** (manga recap convention). 3 narration boxes on paper: who I am, what I've built (fintech onboarding & loan workflows, ONLYOFFICE customisation), what I'm into now. Facts only from résumé/profile data.

**03 · Abilities** (skills). Seven category panels stacked (Frontend, Backend, AI integration, Databases, Cloud & DevOps, Testing, Tools). Each skill = `SkillBadge` (name + one-line "used for…" note). No bars, no percentages. Mobile: accordion with first two open; desktop: asymmetric 3+3 panel grid.

**04 · Featured projects (Direction H battle panels)**. One spread per featured project, cycling three compositions so no two neighbours look alike:
- *Layout A "Impact"*: tall slanted screenshot panel + narration box + stack tags.
- *Layout B "Split"*: diagonal split, screenshot top-right, text bottom-left, SFX accent.
- *Layout C "Close-up"*: full-bleed screenshot with inset caption panel and contribution callout.
Every spread shows: title, one-line summary, status stamp, **My contribution** (solo / co-owned / team), stack tags, "View project" kunai link.

**05 · Career Arc preview**. Horizontal scroll-snap strip of chapter tiles (Ch.01 B.Tech → Ch.02 Niveus → Ch.03 Innoscripta → Ch.04 Now). Each tile: org, role, dates. "Read the full arc →".

**06 · Now serialising: VSCC ERP**. Single large panel, "IN DEVELOPMENT" stamp, two clearly separated lists: **Built so far** and **Planned**. Never mixes the two.

**06b · Next arc: AI integration**. Paper panel with an "IN TRAINING" stamp, the next-arc statement, three "training drills" (goals, not claims) and LogLens AI as the "first mission". Abilities gains an "AI integration · Training arc" category.

**07 · Final panel: Contact CTA**. Mascot mask **down**, bubble "Got a quest? Ping me." Terminal commands: `> mail gowtham` · `> open linkedin` · `> open github`, plus copy-email button.

**08 · Footer** (ink): links, résumé, © 2026, hex KVG patch (secret trigger, see §6).

**Desktop (≥1024):** cover becomes a two-page spread: art left (58%), masthead/H1/intro/CTAs right. Featured projects become full-width spreads with up to 4 panels. Career strip becomes a full horizontal timeline.

---

## 4. Page layouts

### 4.1 `/projects` — Ch.01 Works

- Header panel: chapter title + count ("6 series").
- **Filters**: category chips (All · Professional · Freelance/Client · Personal · Experiments) and a technology multi-select (chips in a sheet on mobile). Filters sync to URL query (`?cat=personal&tech=node`) so filtered views are shareable. Live region announces "4 projects shown".
- Grid: **masonry-like manga page**: panel sizes vary by `featured` and media aspect, never a uniform 3-column card grid. Mobile: single column with alternating slants.
- Each tile: cover screenshot (or labelled placeholder), title, category, status stamp, contribution badge, 3–4 stack tags.
- Empty filter state: drone with "No series match. Clear filters?"

### 4.2 `/projects/:slug` — Project spread

1. **Splash**: title, subtitle, status + category stamps, role, dates, links (demo / GitHub only when real).
2. **Overview** (paper): problem being solved.
3. **My role** (dossier style): responsibilities, with *I built* vs *Team built* clearly split.
4. **Features**: panels; planned features in a separate "Planned" block.
5. **Engineering notes**: **terminal windows (Direction J)**: architecture (diagram slot), challenges → solutions pairs, technical decisions, lessons learned.
6. **Media gallery**: `ScreenshotGallery` (desktop/mobile tabs, lightbox, optional video, alt text required).
7. **Confidentiality notice** when `visibility: 'restricted'` ("Details limited to what's publicly shareable").
8. **Related projects**: 2–3 tiles by shared tech/category.
9. Prev/next "episode" navigation.

### 4.3 `/experience` — Ch.02 Career Arc

- Vertical storyline. Each chapter = `CareerChapter` with org, role, location, dates, responsibilities, technologies, linked projects, and achievements (only if provided).
- Mobile: single column, chapter number in a big outlined numeral, timeline spine on the left. Desktop: alternating left/right panels around a central cyan spine.
- Arc order: newest first, with a "Read from the beginning" toggle (chronological).
- Résumé download at top and bottom.

### 4.4 `/recruiter` — Hire brief (Direction K dossier)

**Clarity over decoration.** Paper background, plain top bar, one small mascot portrait (mask down).
1. **Quick profile** card: name, title, total experience, main expertise, location (if provided), availability, contact buttons, **Download résumé (PDF)** (primary).
2. **Technical skills**: plain categorised lists (no badges art).
3. **Experience snapshot**: compact table-like timeline (role · org · dates · 1-line summary).
4. **Featured work**: 3–4 text links with one-line summaries.
5. **Contact actions**: Email (with copy), phone (`tel:`), LinkedIn, GitHub.
Mobile: sticky bottom action bar with "Résumé" + "Email" while scrolling. Target: everything essential within one scroll and two taps. Print stylesheet included.

### 4.5 `/contact` — Ch.03 Final panel (Direction J terminal)

- Terminal window: `$ ping gowtham`: prints email, LinkedIn, GitHub, Instagram as command lines; copy-email button with "Copied" toast.
- **Contact form** (name, email, subject, message) with inline validation (required, email format, 20–2000 chars, honeypot field).
- **Honest delivery:** until a real service is configured, the form submit **opens the visitor's email app** with a pre-filled message, and the button says so ("Open in email app"). Swap to Formspree/Web3Forms later via one config flag. No fake "Message sent".
- Feedback animations: success = drone thumbs-up + "TRANSMITTED" stamp; error = red glitch shake on the field + message.

### 4.6 `/playground` — Omake (bonus chapter)

Arcade hub hosted by the drone. Each feature is a self-contained module in `features/` registered in one list.
- **Quick-draw** (Reaction time with the Breakpoint blaster): wait for "DRAW!", tap; best time saved locally. Anti-early-tap foul state.
- **Memory match**: 4×4 cards (weapons + tech icons), move counter, best score saved locally, full keyboard + touch.
- **Cyber-oracle** (horoscope): pick zodiac sign → fortune card. Clearly badged **"For fun: fictional fortunes"**. Deterministic by date + sign, generated from original phrase banks. No live source in v1.
- **Quotes terminal**: quote of the day (date-seeded), random, favourites (localStorage), categories, copy/share. Real quotes carry verified attribution + source; original quotes tagged "Original — KVG".
- **Coming soon** slots: greyed panels for future modules.

### 4.7 Secret chapter — `/playground/secret`

"Ch.∞: Origin of the Mask". A 6–8 panel original story of how the netrunner got his cyber-eye (bug-related, of course). Unlocking also enables an "Off-duty skin" toggle (mascot mask down site-wide) and a drone that follows the cursor (desktop).

### 4.8 404

Glitched page, mascot (mask up) and drone with "This page got refactored out of existence." Links to Home and Works.

---

## 5. Components

Shared visual language; layout varies per page. Each lives in `src/components/manga/` unless noted.

| Component | Purpose | Key props |
|---|---|---|
| `MangaPanel` | Bordered paper/ink panel with optional slant, tone, speed lines | `tone`, `slant`, `surface: 'paper' \| 'night'`, `speedLines`, `as` |
| `PanelGrid` | Asymmetric panel composition with gutters | `layout: 'impact' \| 'split' \| 'closeup' \| 'stack'` |
| `ChapterHeading` | "CH.01 / WORKS" + title + optional kanji | `number`, `title`, `kicker`, `level` |
| `SpeechBubble` | Bubble with tail, accessible text | `tail: 'left' \| 'right' \| 'bottom'`, `variant: 'speech' \| 'shout' \| 'thought'` |
| `NarrationBox` | Rectangular caption box for facts | `surface` |
| `Sfx` | Decorative sound-effect lettering | `text`, `color`, `size`; always `aria-hidden` |
| `InkButton` | All button variants (§1.6) | `variant`, `icon`, `href` / `onClick`, `loading` |
| `Stamp` | Status stamps (IN DEVELOPMENT, SHIPPED, CONFIDENTIAL) | `status` |
| `SkillBadge` | Skill + "used for" note | `name`, `note`, `category` |
| `TechTag` | Mono stack tag | `name` |
| `Mascot` | Sprite-based mascot | `pose`, `mask: 'up' \| 'down'`, `weapons`, `size` |
| `Drone` | Sidekick | `mood: 'idle' \| 'alert' \| 'happy'` |
| `TerminalWindow` (`ui/`) | Title bar + scanline body | `title`, `accent` |
| `ProjectShowcase` (`projects/`) | Featured spread, picks layout A/B/C | `project`, `layout` |
| `ProjectTile` (`projects/`) | Projects-page tile | `project`, `size` |
| `ProjectFilters` (`projects/`) | Category + tech filters synced to URL | `categories`, `technologies` |
| `ScreenshotGallery` (`projects/`) | Gallery + lightbox, lazy, video-capable | `media[]` |
| `MediaPlaceholder` (`projects/`) | Labelled "Screenshot pending" slot | `label`, `aspect` |
| `CareerTimeline` / `CareerChapter` | Experience storyline | `entries[]`, `order` |
| `DossierCard` | Recruiter quick profile | `profile` |
| `CopyButton` (`ui/`) | Copy to clipboard + toast | `value`, `label` |
| `BottomNav`, `HudRail`, `MenuSheet` (`layout/`) | Navigation (§2) | `items` |
| `SecretTrigger` (`features/secrets/`) | Key sequence + tap-count unlock | `onUnlock` |
| `Seo` (`app/`) | Title, description, OG, canonical per route | `title`, `description`, `image` |

Abstraction rule: a component is created only when used in ≥ 2 places or when it encapsulates behaviour (gallery, filters, secret). Page-specific compositions stay inside the page folder.

---

## 6. Interactions & animation

| Moment | Behaviour | Reduced motion |
|---|---|---|
| First load (Home, once/session) | Masthead glitch-in (steps), mascot slides up 24px, burst stamps in (`--ease-impact`) | Static, instant |
| Panel reveal on scroll | `clip-path` ink wipe left→right, 240ms, IntersectionObserver, once | Fade only (opacity, 120ms) |
| Page transition | View Transitions API: katana slash wipe (diagonal clip) 420ms | Cross-fade 120ms / none |
| Button hover/press | Impact offset + hard shadow; press removes shadow | Kept (no motion, just shadow) |
| Speed lines | Static SVG; very slow 2° rotation on hero only, paused when off-screen | No rotation |
| Status stamps | Scale 1.2 → 1 + 2° rotate when entering view | Static |
| Copy email | Button morphs to "Copied ✓"; toast with kunai icon | Same, no movement |
| Form errors | Field glitch-shake 3 × 4px, 180ms; message appears below field | No shake; message only |
| Form success | Drone flies in, "TRANSMITTED" stamp | Static stamp |
| Secret unlock | Screen-wide speed lines + "HIDDEN CHAPTER UNLOCKED" | Static banner |

Rules: animate only `transform`, `opacity`, `clip-path`. No scroll-jacking. No animation blocks access to content. Nothing critical is hover-only.

**Secret trigger:** desktop: type `sudo kvg` anywhere (or ↑↑↓↓←→←→BA). Touch: tap the footer hex KVG patch 5 times; each tap fills one hex segment so progress is visible. Hint lives in the Fun Zone ("The patch remembers every tap…"). The secret route is also reachable directly once unlocked (stored in localStorage).

---

## 7. Responsive behaviour

| Element | 320–479 | 480–767 | 768–1023 | ≥1024 |
|---|---|---|---|---|
| Nav | Bottom bar | Bottom bar | Bottom bar | Left HUD rail |
| Home cover | Stacked: masthead → art → H1 → CTAs | Same, larger art | Art + text side by side | Two-page spread |
| Panel slant | ≤3°, max 2 slanted panels per screen | ≤3° | ≤5° | ≤7° |
| Project showcase | 1 column, 2 panels | 1 column, 3 panels | 2 columns | Full spread, 3–4 panels |
| Projects grid | 1 col | 2 col | 2 col | 3 col asymmetric |
| Career arc | Single column, left spine | Same | Same | Alternating around centre spine |
| Gallery | Swipe carousel + lightbox | Same | 2-up grid | 3-up grid |
| SFX lettering | Max 1 per screen, smaller | 1 | 2 | Free |

Guarantees: no horizontal overflow at 320 (Playwright check), body text ≥ 16px, tap targets ≥ 44×44, art never shrinks below legibility; if it would, it is cropped or dropped, never squeezed.

---

## 8. Engineering plan (for Phase 3)

| Concern | Choice | Why |
|---|---|---|
| Framework | React 19 + TypeScript (strict) + Vite | As requested |
| Routing | React Router v7, **framework mode with static pre-rendering** (`ssr: false`, `prerender` all routes incl. each project slug) | Real HTML per route → SEO + Open Graph work without a server |
| Styling | CSS Modules + global `tokens.css` (custom properties) | Hand-crafted visuals; avoids utility-class soup; zero runtime |
| Animation | CSS + View Transitions API. **No Motion/GSAP in v1**; add Motion only if a specific interaction needs it | Lightweight |
| Icons | `lucide-react` | Tree-shaken |
| Fonts | Self-hosted, subset WOFF2, `font-display: swap`, preload display face | Performance |
| Metadata | React 19 native `<title>`/`<meta>` per route; build-time `sitemap.xml` + `robots.txt` | No helmet dependency |
| Tests | Vitest + Testing Library (filters, form validation, games, secret trigger, copy); Playwright (nav flows, résumé download, no-overflow at 320/375/768/1280, screenshots) | Tests real interactions |
| Lint | ESLint (typescript-eslint, jsx-a11y) + Prettier | Quality |
| Hosting | Static: Cloudflare Pages / Vercel / Netlify | Your call, see open questions |

**Performance budget:** initial JS ≤ 90 KB gzip · fonts ≤ 120 KB total · LCP ≤ 2.0s on mid-range Android over 4G · CLS ≤ 0.05 · Lighthouse ≥ 95 performance, 100 accessibility.

### Data models (sketch)

```ts
type ProjectCategory = 'professional' | 'freelance' | 'personal' | 'experiment';
type ProjectStatus = 'in-development' | 'shipped' | 'maintained' | 'archived' | 'placeholder';
type Contribution = 'solo' | 'lead' | 'co-owned' | 'team-member';
type Visibility = 'public' | 'restricted';

interface MediaItem {
  kind: 'image' | 'video' | 'diagram';
  src?: string;            // omitted = render MediaPlaceholder
  alt: string;             // required
  device?: 'desktop' | 'mobile';
  caption?: string;
  approvedForPublic: boolean;
}

interface Project {
  id: string; slug: string; title: string; subtitle?: string;
  summary: string; description?: string;
  category: ProjectCategory; status: ProjectStatus; featured?: boolean;
  technologies: string[];
  role?: string; contribution: Contribution;
  responsibilities?: string[];          // what I personally did
  teamContext?: string;                 // what the team did
  features?: { built: string[]; planned?: string[] };
  challenges?: { problem: string; solution: string }[];
  architecture?: { summary: string; diagram?: MediaItem };
  lessons?: string[];
  media?: MediaItem[];
  demoUrl?: string; githubUrl?: string; // only real links
  visibility: Visibility;
  organization?: string;                // e.g. Niveus Solutions
  startDate?: string; endDate?: string; // ISO yyyy-mm
  needsInput?: string[];                // fields awaiting Gowtham's confirmation (shown in dev only)
}

interface ExperienceEntry {
  id: string; organization: string; role: string;
  location?: string; workMode?: 'remote' | 'onsite' | 'hybrid';
  startDate: string; endDate?: string;  // undefined = present
  summary?: string; responsibilities: string[];
  technologies: string[]; projectSlugs?: string[];
  achievements?: string[];              // only confirmed items
}
```

`needsInput` renders a visible dev-only warning badge and is stripped from production builds, so placeholders are never mistaken for real content.

---

## 9. Content checklist

Legend: ✅ confirmed · ❓ still need confirmation · ⬜ still need from you
*Updated 23 Nov 2026 with Gowtham's answers.*

### Profile
- ✅ Name: Gowtham KV
- ✅ Title: Full Stack Developer (résumé: "Full Stack Developer · React.js | Node.js | JavaScript")
- ✅ Next arc: AI integration ("in training"), shown on the Home cover, a Home "Next arc" panel, the Abilities "AI integration" category and the Recruiter page
- ✅ Experience: ~4 years professional (May 2022 – Apr 2026)
- ✅ Email: gowthamkv.210@gmail.com (updated from the new résumé)
- ✅ Phone: +91-7067277125, **OK to publish** (Recruiter page `tel:` link + résumé PDF)
- ✅ LinkedIn: https://www.linkedin.com/in/gowtham-kv-9b0314173/
- ✅ GitHub: https://github.com/Coder-Gowtham
- ✅ Instagram: https://www.instagram.com/gowtham_kv_/ (Contact page + footer + Fun Zone; **not** on the Recruiter page)
- ✅ Availability: "Available for immediate joining"
- ✅ Location: Bilaspur, Chhattisgarh (from the new résumé)
- ⬜ Employment preferences (remote / hybrid / onsite, roles of interest)
- ⬜ Short personal intro line (or approve one drafted in Phase 4)

### Résumé
- ✅ PDF: GOWTHAM_KV_RESUME_FULLSTACK (2 pages) → `public/resume/gowtham-kv-resume.pdf` (phone number included, approved)

### Rule: no metrics
- ✅ **The site shows no percentage or numeric impact metrics** from the résumé (20%, 15%, 30% etc.). Counts that are plain scope facts (e.g. "3 editor modules") are also avoided unless Gowtham adds them.

### Experience (Career Arc)
- ✅ Ch.01 · B.Tech, Electronics & Telecommunication, Shri Shankaracharya Engineering College, Bhilai, Aug 2015 – Jun 2019
- ✅ Ch.02 · Niveus Solutions: Cloud Associate (Backend Engineer), Mangalore, May 2022 – Aug 2025 (Times Black, YEIDA, CAP orchestration framework)
- ✅ Ch.03 · Innoscripta SE: Full Stack Developer, Remote, Sep 2025 – Apr 2026 (Clusterix / ONLYOFFICE)
- ✅ Ch.04 · May 2026 – present: **Independent: learning new skills, a deliberate break, and building VSCC ERP** (client ERP, active development since Nov 2026) plus LogLens AI (May 2026).
  - ❓ Approve the public wording. Proposed: *"Career break & independent work: levelling up skills, recharging, and building a construction ERP for a client."*
- ❓ Anything between 2019 and 2022 you'd like shown (optional)

### Projects (final list for v1)

| # | Project | Category | Status | Source |
|---|---|---|---|---|
| 1 | VSCC ERP | Freelance / Client | In development | VSCC ERP: Modules & Development Status doc |
| 2 | LogLens AI | Personal | Built (May 2026) | Résumé + brief |
| 3 | Vector Mind | Personal | Placeholder | ⬜ awaiting details |
| 4 | Times Black | Professional (Niveus) | Shipped | Résumé + brief |
| 5 | YEIDA | Professional (Niveus) | Shipped | Résumé + brief |
| 6 | Clusterix | Professional (Innoscripta) | Shipped | Résumé + brief |

- ✅ **Excluded:** Node.js Savings Account Application, Node.js Loan Workflow & Status Dashboard.
- ✅ CAP orchestration framework: shown inside Niveus experience and Times Black / YEIDA (Gowtham built the initial framework)

#### VSCC ERP: public-safe summary (from the status doc, 23 Nov 2026)

What it is: a construction-company ERP (modelled on an enterprise construction ERP's screens) for a group of companies, with web ERP + phone web app. API v1.2, web v1.0; UAT hosting on AWS (Mumbai) in progress.

**Built** (stamp each as Done / Testing / Partly done on the site):
- Foundation: login & sessions, multi-company/project scoping, role-based permission matrix (view/create/edit/delete/approve/export/import per module), full change history, one generic approval workflow (Draft → Submitted → Approved / Sent back, with recall) and a "My Approvals" inbox. **Done**
- Data protection: sensitive identity/bank fields encrypted at rest and masked on screen, unmasked only with a dedicated permission. **Done**
- Masters: units, materials, labour grades, plant/machines, parties, labourers, BoQ, HR setup lists, configurable extra employee fields without code changes. **Done**
- Excel import engine: upload any layout, auto-suggested column matching with known aliases, reusable templates, row-level preview (OK / warning / error), atomic import with logs. **Done**
- HR / Employment: employee master, documents with expiry tracking, transfers and change requests applied on approval. **Testing**
- Attendance & leave: calendars, shifts, leave types and balances, approvals, monthly registers. **Testing**
- Payroll: salary structures with arrears, monthly run, payslips, loans, reimbursements, income-tax declarations/TDS, statutory files, exit & full-and-final. **Testing**
- Mobile web app (installable, no app store): PIN login with lockout, daily check-in/out with live camera photo + GPS, queues offline and syncs later, daily-report tab. **Testing**
- Daily Progress Report: one report per site per day from phone or ERP; quantities typed on site, amounts calculated server-side (work done vs BoQ, labour, machine rent, diesel stock); photos; approval flow. **Partly done**
- Client billing (RA bills): contracts, variations, applications and certificates for payment, debit/credit notes, receipts, printable bills, retention and ageing reports. **Testing**

**Planned** (shown in a separate "Roadmap" block, never as delivered): subcontracting, procurement, inventory/stores, plant, project cost (budget/CVR), accounts with GST & TDS, fixed assets; later appraisal/KPI, e-invoicing, reports/BI, warehouse, trading, rentals, production, framework contracts, letters of credit.

**Engineering notes candidates** (terminal-window section): generic approval workflow reused by every document type · alias-aware Excel column matcher with saved templates · field-level encryption + permission-gated unmasking · offline-tolerant phone check-in · server-side calculation so site staff only type quantities · data-driven generic master screens.

**Kept off the site** (client-confidential): staff counts, salary/statutory details, site names, client staff roles, bank names, internal open questions, the reference ERP vendor's name.

- ⬜ Confirm VSCC is happy to be **named** publicly (otherwise "Construction ERP for a regional construction group")
- ⬜ Confirm your role: solo developer? (default shown: "Solo full-stack developer")
- ⬜ Screenshots approved for public use (with dummy data)
- ❓ Stack shown: React, TypeScript, Node.js, Express, PostgreSQL, Docker, AWS (from brief + doc). Add or remove anything?

#### LogLens AI
- ✅ Features (from résumé): log severity classification, issue summarisation, troubleshooting recommendations, all via the OpenAI API; analysis runs as background jobs (Redis + BullMQ) outside the request lifecycle. No performance figure shown.
- ✅ Stack confirmed by the new résumé: React.js, Node.js, PostgreSQL, Redis, BullMQ, OpenAI API, Docker.
- ⬜ GitHub / demo links · ⬜ screenshots

#### Times Black / YEIDA / Clusterix
- ✅ Times Black: co-owned end-to-end backend; APIs and business workflows on the CAP architecture
- ❓ OK to name the clients/products publicly? Any approved screenshots?
- ✅ YEIDA: eligible users view approved loan amounts and submit loan requests for downstream bank processing

#### Vector Mind
- ⬜ Everything (renders as a clearly labelled placeholder until provided)

### Skills
- ✅ From the full-stack résumé: JavaScript, SQL, Node.js, Express.js, REST APIs, microservices, OpenAPI/Swagger, JWT, React.js, HTML, CSS/LESS, MySQL, GCP, Jenkins, CI/CD, Mocha, Chai, Sinon, unit & integration testing, Git, Linux (Ubuntu), Apigee
- ✅ Added from projects: TypeScript, Docker, BullMQ, OpenAI API, AWS (VSCC UAT)
- ✅ Certifications: removed from the new résumé, so omitted from the site.

### Fun Zone
- ✅ Quotes: 7 short sourced quotes + 7 original KVG lines (`src/data/quotes.ts`); swap in favourites any time
- ✅ Secret chapter: original 8-panel story drafted (`src/pages/Playground/SecretPage.tsx`); edit freely

### Deployment
- ⬜ Hosting (Cloudflare Pages / Vercel / Netlify)
- ⬜ Custom domain (for canonical URLs, sitemap, OG tags)
- ⬜ Contact form: email-app fallback for now (default), or Formspree / Web3Forms

---

## 10. Next: Phase 3 (Foundation)

On approval: scaffold Vite + React Router v7 (prerender), strict TS, tokens.css, fonts, layout shell with BottomNav / HudRail / MenuSheet, Seo component, typed data files seeded from the résumé with `needsInput` flags, mascot sprite, lint + test setup, and a placeholder route for every page. Then Phase 4 builds the Home page.
