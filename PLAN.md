# Website Enhancement Plan

This document outlines the approach for five planned enhancements to the portfolio site. Each section covers the goal, design approach, files affected, and implementation steps.

---

## 1. Get Personal Information from an API (Profile + CV Unified)

**Goal:** Decouple hardcoded personal data (name, title, skills, links, **and CV/experience**) from the Card component so it can later be fetched from a single API endpoint.

**Approach — Unified Data Layer with Static Fallback:**

1. **Create `src/data/profile.ts`** — Define TypeScript interfaces (`ProfileData`, `Link`, `Experience`) and export a `getProfile()` function that currently returns a static object containing **all** data: identity, links, and work experience. Both the landing card and the CV page consume the same data source.
2. **Update `<Card />`** — Import and call `getProfile()` instead of using inline constants. Render links from the data array using `<For>`.
3. **Future API swap** — When the API is ready, change `getProfile()` to an async fetch call. Wrap consumers in a SolidJS `<Suspense>` / `createResource` pattern. One endpoint returns everything (profile + CV), so both views stay in sync.

**Files affected:**
| File | Change |
|---|---|
| `src/data/profile.ts` | New — unified data types & static getter (profile + experience + links) |
| `src/components/card/index.tsx` | Modified — consume data layer instead of inline constants |

---

## 2. CV / Resume Page with Similar Design

**Goal:** Add a second page for work experience/CV that shares the visual language of the landing page (card overlay on top of the parallax mountain scene).

**Data source:** CV data (experience, roles, descriptions) comes from the same `getProfile()` / API endpoint as the landing-page profile data (see §1). No separate CV API.

**Approach — Client-Side Routing:**

1. **Install `@solidjs/router`** — Add the SolidJS router package.
2. **Update `src/App.tsx`** — Wrap the app in `<Router>` and define two `<Route>` entries:
   - `/` → renders the existing `<Main />` component (landing page with `<Card />`).
   - `/cv` → renders a new `<CVPage />` component.
3. **Create `src/components/cv/index.tsx`** — A `<CVPage />` component that:
   - Reuses the same parallax mountain background and overall layout from `<Main />`.
   - Renders a wider panel (same glassmorphic style as the redesigned card — see §3) populated with experience data from `getProfile()`.
   - Includes a "← Back" link to `/` using the router's `<A>` component.
4. **Update `<Card />`** — Add a subtle CV link that routes to `/cv` using `<A href="/cv">`.
5. **Shared layout** — Extract the parallax-scene + mouse-tracking wrapper from `<Main />` into a shared layout component (or use the router's `root` prop) so both pages share the same background scene.

**Files affected:**
| File | Change |
|---|---|
| `package.json` | Modified — add `@solidjs/router` dependency |
| `src/App.tsx` | Modified — add `<Router>` and route definitions |
| `src/components/index.tsx` | Modified — extract shared layout logic |
| `src/components/cv/index.tsx` | New — CV page component |
| `src/components/card/index.tsx` | Modified — add subtle CV navigation link |

---

## 3. Card Redesign + Subtle Links

### 3a. Card Redesign — Flow with the Scene

**Goal:** Rethink the card so it feels like a natural part of the landscape rather than a separate opaque box floating on top.

**Approach — Glassmorphic / Semi-Transparent Card:**

- Replace the solid white `bg-white` background with a semi-transparent frosted-glass style:
  - `background: rgba(255, 255, 255, 0.65)` (light mode) or `rgba(59, 66, 82, 0.7)` (dark mode).
  - `backdrop-filter: blur(12px)` to create a frosted effect that lets the mountain scene bleed through.
  - Softer shadow: `shadow-lg shadow-black/10` instead of `shadow-md`.
  - Slightly more rounded corners: `rounded-2xl`.
- Reduce the heavy positioning margins; let the card sit more naturally:
  - Keep the responsive breakpoint positions but loosen the strict `absolute` layout so it doesn't feel pinned.
- Typography: slightly increase letter spacing on the name, use lighter weight for description/skills to feel airy.
- The card should feel like a translucent sign sitting in the scene rather than a modal overlay.

### 3b. Subtle Links

**Goal:** Links should be understated — visible but not attention-grabbing. They should be discoverable on hover rather than loudly labelled.

**Approach — Icon-Only with Hover Reveal:**

1. **Default state:** Render links as a row of small, muted-color icons (e.g., `text-[#4c566a]/60`, ~`w-5 h-5`). No visible text labels by default.
2. **Hover state:** On hover, the icon lifts slightly (`transform: translateY(-2px)`), its color intensifies to the Nord accent (`#81a1c1`), and a small tooltip or label fades in below/above the icon showing the link text (e.g., "GitHub", "Posts").
3. **Spacing:** Icons are evenly spaced in a compact row with `gap-3`, sitting below a subtle 1px divider line.
4. **Links to include** (from data layer):
   - GitHub → `https://www.github.com/matt-forster`
   - Email → `mailto:hey@mattforster.ca`
   - LinkedIn → `https://www.linkedin.com/in/matt-forster`
   - Posts → `https://posts.mattforster.ca`
   - CV → internal route `/cv`

**Approach — Data-Driven Rendering:**

1. **Extend the `Link` type** in `src/data/profile.ts` with an `icon` discriminator field (e.g., `'github' | 'email' | 'linkedin' | 'posts'`). Additional types like `'web'` can be added later as needed.
2. **Create `src/components/icons/index.tsx`** — Extract the existing `GithubIcon` and `InboxIcon` SVG components from `<Card />` into a shared icons file. Add new icon components: `LinkedInIcon`, `PostsIcon`, `DocumentIcon`.
3. **Build an icon map** — `Record<Link['icon'], Component>` that maps the discriminator to the correct icon component.
4. **Update `<Card />`** — Replace the hardcoded link markup with a `<For each={profile.links}>` loop. Each link renders as a small icon with hover tooltip via `aria-label` and a CSS tooltip/label.

**Files affected:**
| File | Change |
|---|---|
| `src/data/profile.ts` | Modified — add posts + linkedin links, add `icon` field to `Link` type |
| `src/components/icons/index.tsx` | New — shared icon components (smaller, muted) |
| `src/components/card/index.tsx` | Modified — glassmorphic card, icon-only links with hover reveal |

---

## 4. Dark Mode with Day/Night Transition

**Goal:** Add a toggle that transitions the scene between day and night. The sun should set, stars should appear, and colors should shift.

**Approach — Theme Context + CSS Transitions:**

1. **Create `src/context/theme.tsx`** — A SolidJS context provider that exposes:
   - `mode()` signal — `'light' | 'dark'`
   - `toggle()` function
2. **Wrap the app** in `<ThemeProvider>` in `src/App.tsx`.
3. **Create `src/components/scene/themeToggle.tsx`** — A fixed-position button (top-right corner) that calls `toggle()`. Shows a sun icon in dark mode, moon icon in light mode.
4. **Create `src/components/scene/sun.tsx`** — A `<Sun />` component:
   - Renders a radial-gradient circle positioned in the sky.
   - On dark mode, animates downward (CSS `top` transition, ~2s ease) to simulate setting. Opacity fades.
   - On light mode, animates back up.
5. **Create `src/components/scene/stars.tsx`** — A `<Stars />` component:
   - Generates ~80 small white dots at random positions in the upper 60% of the viewport.
   - Each star has a CSS `twinkle` animation (opacity oscillation with random delay/duration).
   - The entire layer fades in (`opacity: 0 → 1`, 2s transition) when dark mode activates.
6. **Update background colors** — In `<Main />` (`src/components/index.tsx`):
   - Transition `bg-[#eceff4]` to a dark sky color (e.g., `#2e3440`) using inline `style` with a CSS `transition: background 1.5s ease`.
7. **Update `<Card />` and `<CVPage />`** — Transition card background from white to Nord dark (`#3b4252`) and text from dark to light.
8. **Add CSS animations** to `src/index.css`:
   - `@keyframes twinkle` — opacity oscillation for stars.
   - `@keyframes shooting-star` — diagonal translate + fade for shooting stars.

**Files affected:**
| File | Change |
|---|---|
| `src/context/theme.tsx` | New — theme context provider |
| `src/components/scene/sun.tsx` | New — animated sun element |
| `src/components/scene/stars.tsx` | New — stars + shooting stars |
| `src/components/scene/themeToggle.tsx` | New — dark mode toggle button |
| `src/components/icons/index.tsx` | Modified — add `SunIcon`, `MoonIcon` |
| `src/index.css` | Modified — add keyframe animations |
| `src/App.tsx` | Modified — wrap in `<ThemeProvider>` |
| `src/components/index.tsx` | Modified — dynamic background color |
| `src/components/card/index.tsx` | Modified — dark mode card styling |
| `src/components/cv/index.tsx` | Modified — dark mode CV styling |

---

## 5. Animated Scene Elements (Birds, Shooting Stars, Movement)

**Goal:** Add life to the scene with autonomous animations that are independent of mouse movement.

**Approach — SolidJS Component Animations:**

### 5a. Birds
1. **Create `src/components/scene/birds.tsx`** — A `<Birds />` component:
   - Uses `setInterval` (spawned in `onMount`, cleaned up in `onCleanup`) to periodically create bird objects with random y-position, speed, and size.
   - Each bird is an SVG `<path>` shaped like a simple "V" / gull silhouette.
   - Birds fly across the screen using a CSS `bird-fly` animation (`left: -5% → 105%`).
   - A nested `bird-flap` animation oscillates the path's shape to simulate wing flapping.
   - Birds are removed from state after their animation completes.
   - In dark mode, bird color changes to match the night palette.

### 5b. Shooting Stars (Night Only)
1. **Extend `src/components/scene/stars.tsx`** with a `<ShootingStars />` component:
   - Active only in dark mode (visibility tied to theme context).
   - Periodically spawns a bright streak at a random position in the sky.
   - Each streak uses a CSS animation that translates diagonally and fades out over ~0.5–1s.
   - Spawned with 30% probability every ~2s for a natural feel.

### 5c. Cloud Drift
1. **Update `src/components/parallaxMountains/index.tsx`** — Add a slow, continuous CSS `translateX` animation to each cloud `<img>`, independent of the mouse parallax. This gives clouds a gentle autonomous drift even when the mouse is still. Implemented by adding a secondary `animation` style property alongside the existing mouse-driven `translate`.

### 5d. Composition
1. **Add `<Birds />`, `<Stars />`, `<ShootingStars />`, and `<Sun />`** to the main layout component in `src/components/index.tsx`, layered via `z-index` between the background and the card.

**Files affected:**
| File | Change |
|---|---|
| `src/components/scene/birds.tsx` | New — flying birds animation |
| `src/components/scene/stars.tsx` | Modified — add `<ShootingStars />` component |
| `src/index.css` | Modified — add `bird-fly`, `bird-flap`, `shooting-star`, `cloud-drift` keyframes |
| `src/components/parallaxMountains/index.tsx` | Modified — add autonomous cloud drift animation |
| `src/components/index.tsx` | Modified — compose new scene elements into layout |

---

## Implementation Order

The recommended order minimizes conflicts and builds incrementally:

1. **Unified data layer** (#1) — foundational; includes both profile and CV data. No visual change yet.
2. **Icons extraction, subtle links & card redesign** (#3) — refactor icons into shared file, redesign card to glassmorphic style, make links icon-only with hover reveal. Add posts link.
3. **Routing & CV page** (#2) — depends on data layer and icons. CV reads from same data source.
4. **Dark mode** (#4) — theme context, sun, stars, toggle, color transitions (glassmorphic card adapts).
5. **Animated elements** (#5) — birds, shooting stars, cloud drift, composition.

Each step should be followed by a build verification (`npm run build`) and visual check.

---

## New Directory Structure (After All Changes)

```
src/
├── index.tsx
├── index.css                          # + keyframe animations
├── App.tsx                            # + Router, ThemeProvider
├── assets/
│   └── favicon.ico
├── context/
│   └── theme.tsx                      # NEW — dark/light mode context
├── data/
│   └── profile.ts                     # NEW — unified profile + CV data & types
└── components/
    ├── index.tsx                       # Shared layout + scene composition
    ├── icons/
    │   └── index.tsx                   # NEW — shared SVG icon components (muted, small)
    ├── card/
    │   └── index.tsx                   # Updated — glassmorphic, icon-only links
    ├── cv/
    │   └── index.tsx                   # NEW — CV/resume page (reads same data)
    ├── scene/
    │   ├── sun.tsx                     # NEW — animated sun
    │   ├── stars.tsx                   # NEW — stars + shooting stars
    │   ├── birds.tsx                   # NEW — flying birds
    │   └── themeToggle.tsx             # NEW — dark mode toggle button
    └── parallaxMountains/
        ├── index.tsx                   # Updated — cloud drift animation
        └── *.svg
```

## Dependencies

| Package | Purpose | Required By |
|---|---|---|
| `@solidjs/router` | Client-side routing for `/` and `/cv` | Step #2 |

No other new dependencies are needed. All animations use CSS keyframes and SolidJS signals/effects.
