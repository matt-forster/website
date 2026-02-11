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
   - Renders a wider panel (same hand-drawn card style as the redesigned card — see §3) populated with experience data from `getProfile()`.
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

**Goal:** Rethink the card so it feels like a natural part of the landscape, matching the hand-made/hand-drawn aesthetic of the existing SVGs rather than a sterile UI element floating on top.

**Design direction:** The SVGs (mountains, clouds, grass) were hand-drawn and use organic, imperfect paths with soft Nord palette strokes (`#d8dee9`, `#3f5787`, `#5e81ac`). The card should feel like it belongs in this world — like a hand-written note or a wooden sign post in the scene — not like a glass panel or a material-design card.

**Approach — Organic / Hand-Drawn Card:**

- Keep the white/off-white background (`#eceff4` or `#fff`) to stay consistent with the illustration palette — do **not** use transparency, blur, or glassmorphic effects.
- Replace the hard `rounded-lg` + `shadow-md` with a softer, sketchier border treatment:
  - Use an SVG border/frame around the card that mimics the hand-drawn stroke style of the existing artwork (irregular lines, slight wobble, Nord stroke colors like `#d8dee9` or `#3f5787`).
  - Alternatively, use a CSS `border` with a slightly heavier weight (`2–3px`) in a muted Nord color (`#d8dee9`) and keep the simple `rounded-lg`, relying on the color palette to tie it visually to the scene rather than adding drawn-stroke SVG framing.
- Typography: consider a slightly more casual or humanist font pairing to complement the hand-drawn aesthetic, while remaining highly legible. If adding a new font feels heavy, simply adjusting weight/spacing of the existing sans-serif is sufficient.
- Reduce the heavy positioning margins; let the card sit more naturally:
  - Keep the responsive breakpoint positions but consider whether the strict `absolute` pinned layout could be softened.
- The card should feel like a note, sign, or label placed in the scene — **not** a frosted glass overlay or a material card.

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
| `src/components/card/index.tsx` | Modified — hand-drawn card style, icon-only links with hover reveal |

---

## 4. Dark Mode with Day/Night Transition

**Goal:** Transition the scene between day and night using a pinwheel/rotation effect. The toggle should be nearly invisible, and the initial theme should follow the user's system/browser preference.

### 4a. Theme Context with System Preference Detection

**Approach:**

1. **Create `src/context/theme.tsx`** — A SolidJS context provider that exposes:
   - `mode()` signal — `'light' | 'dark'`
   - `toggle()` function
   - **Initialize from `prefers-color-scheme`:** On mount, read `window.matchMedia('(prefers-color-scheme: dark)')` to set the default mode. Also listen for changes to the media query (e.g., user changes OS theme while the page is open) and update the signal accordingly.
   - Store the user's explicit override (if they use the toggle) in `localStorage` so it persists across visits. On init: check `localStorage` first → fall back to system preference.
2. **Wrap the app** in `<ThemeProvider>` in `src/App.tsx`.

### 4b. Very Subtle Toggle

**Goal:** The toggle should be _very_ subtle — almost hard to find. It is not a prominent UI button; it is a discoverable Easter-egg-style interaction for users who want to manually switch.

**Approach — Near-Invisible Toggle:**

- Render as a tiny, nearly transparent element (e.g., a small dot or a faint star/moon icon, ~`w-3 h-3`, `opacity: 0.15`).
- Position it in an unobtrusive corner (e.g., bottom-right or top-right, flush with the edge).
- On hover, it gains slightly more opacity (`opacity: 0.4`) and shows a subtle cursor change — but still remains very understated.
- On click, it triggers `toggle()` to switch the theme.
- No tooltip, no label, no visible text. Just a near-invisible clickable element.
- **Accessibility:** The element should be a `<button>` with a descriptive `aria-label` (e.g., "Toggle dark mode") so screen readers can discover it. On keyboard focus (`:focus-visible`), show a clear focus ring at full opacity so keyboard users can find and activate it. The visual subtlety is intentional for sighted mouse users, but the control must remain fully accessible via keyboard and assistive technology.
- **Create `src/components/scene/themeToggle.tsx`** for this component.

### 4c. Pinwheel / Rotation Transition with Evening & Morning Phases

**Goal:** Instead of a vertical sun rise/set, the transition between day and night should feel like a **pinwheel rotation** — the entire scene rotates to reveal the opposite side (day ↔ night). The transition should pass through **evening** and **morning** intermediate phases with warm sunset/sunrise hues, rather than cutting directly between bright day and dark night.

**Approach — Dual-Scene Background with CSS Rotation + Intermediate Color Phases:**

The core idea is to treat the background as a single element (or a wrapper) that has **both** the day scene and the night scene composed together, and the transition between them is a **rotation** (like flipping a coin or spinning a pinwheel). During the rotation, the sky and scene pass through warm transitional color stages.

1. **Create a scene wrapper** (`src/components/scene/dayNightScene.tsx` or integrate into the main layout):
   - Contains two layers: the **day scene** (current parallax mountains, bright sky `#eceff4`) and a **night scene** (same mountains but darker palette, dark sky `#2e3440`, with stars overlaid).
   - Both layers are stacked and the wrapper is a single rotatable container.

2. **Rotation mechanism:**
   - The wrapper uses a CSS `transform: rotate()` transition. When toggling day → night, it rotates 180° (like a pinwheel). The night scene is positioned on the "back" of the rotation (using `backface-visibility` or an offset rotation).
   - Alternatively, use a **clip-path / radial wipe** that expands from the toggle point outward in a spiral/pinwheel pattern, revealing the night scene underneath. This avoids literal 3D rotation while still giving the pinwheel feel.
   - The transition duration should be ~2.5–3s with a smooth easing curve to allow the intermediate phases to be visible.

3. **Evening / Morning color phases:**
   The transition should not just be a binary flip. As the pinwheel rotates, the sky and scene colors should pass through warm intermediate stages that evoke a sunset (day → night) or sunrise (night → day).

   **Day → Night (evening transition):**
   - **0–30%:** Sky shifts from day blue-white (`#eceff4`) to warm golden/amber (`#e8c47c` / `#d4956a`). Mountain SVGs gain a warm `filter: sepia(0.3) brightness(0.9)` tint.
   - **30–60%:** Sky deepens to sunset pink-orange (`#bf616a` / `#a3546d`). SVG filter shifts toward `brightness(0.7) hue-rotate(10deg)`.
   - **60–100%:** Sky transitions to deep twilight blue (`#3b4252`) and then dark night (`#2e3440`). SVG filter reaches full night values (`brightness(0.5) hue-rotate(20deg) saturate(0.7)`). Stars begin fading in around the 70% mark.

   **Night → Day (morning transition):**
   - **0–30%:** Sky lightens from dark (`#2e3440`) to pre-dawn deep blue (`#434c5e`). Stars fade out.
   - **30–60%:** Sky warms to sunrise pink/coral (`#bf616a` / `#d08770`). SVG filters gain warmth (`sepia(0.2) brightness(0.8)`).
   - **60–100%:** Sky brightens through golden (`#ebcb8b`) to full day (`#eceff4`). SVG filters return to default (no filter).

   **Implementation options:**
   - **CSS `@keyframes` with color stops:** Define a keyframe animation for the sky `background-color` that passes through the intermediate hues over the transition duration. The rotation and the color shift happen simultaneously.
   - **CSS `transition` with `@property`:** Use a CSS custom property (e.g., `--sky-phase`) that transitions from `0` to `1`, and use it to interpolate between color stages via a JavaScript `createEffect` that updates the sky color based on the progress.
   - **Multi-step `background` transition:** Use a CSS `animation` with multiple keyframe stops for the background-color and SVG filter values. This is the simplest approach: one keyframe animation that handles both the sky color and the SVG filter transitions.

   The evening/morning colors should reference the **Nord Aurora** palette (`#bf616a` red, `#d08770` orange, `#ebcb8b` yellow) for warm tones, keeping the overall aesthetic consistent with the existing Nord color scheme.

4. **Scene variants:**
   - **Day scene:** The existing parallax mountains + clouds with the `#eceff4` sky background. Sun element visible.
   - **Night scene:** The same mountain/cloud SVGs but with shifted colors (darker fills, lighter strokes for visibility), `#2e3440` sky, stars scattered in the upper portion, moon element instead of sun.
   - **Transitional state:** During the rotation, the SVGs are tinted via CSS `filter` through warm intermediate values (see §4c.3 above). This avoids needing separate "sunset" SVGs — the same hand-drawn assets are recolored dynamically.
   - Since the hand-drawn SVGs are the same shapes, the night variant can be achieved by applying CSS `filter` adjustments (e.g., `brightness(0.5) hue-rotate(20deg)`) or by having a second set of SVGs with night-palette colors. Using CSS filters is simpler and avoids duplicating SVG assets.

5. **Stars:** Begin fading in around 70% of the evening transition (as the sky darkens past twilight). Appear fully in the night scene layer. Generated as small white dots with `twinkle` animation (opacity oscillation with random delay/duration). During the morning transition, they fade out in the first 30%.

6. **Sun / Moon:** Rather than separate components that animate vertically, the sun is part of the day scene and the moon is part of the night scene. They rotate in/out as part of the pinwheel transition. During the evening transition, the sun's color can shift warmer (golden → orange → red) as it rotates away, mimicking a setting sun.

### 4d. Card and Content Dark Mode

- **Update `<Card />` and `<CVPage />`** — Transition card background from the off-white/white Nord palette to a dark Nord variant (`#3b4252`) and text from dark to light. Keep the hand-drawn border/stroke style but shift stroke colors to lighter Nord tones for night visibility.
- Card color transitions should happen smoothly with CSS `transition` on `background-color` and `color`, coordinated with but independent of the pinwheel scene rotation.
- During the evening/morning transition, the card background can pass through a subtle warm intermediate (e.g., a muted parchment/amber tone) before reaching its final day or night color, reinforcing the sunset/sunrise feel across the entire UI.

### 4e. CSS Animations

- **Add CSS animations** to `src/index.css`:
  - `@keyframes twinkle` — opacity oscillation for stars.
  - `@keyframes shooting-star` — diagonal translate + fade for shooting stars.
  - `@keyframes pinwheel-rotate` (if using keyframes rather than a simple transition for the rotation).
  - `@keyframes sky-evening` — multi-stop background-color animation through warm sunset hues (day → golden → pink-orange → twilight → night). Applied during day-to-night transition.
  - `@keyframes sky-morning` — multi-stop background-color animation through warm sunrise hues (night → pre-dawn → coral → golden → day). Applied during night-to-day transition.
  - `@keyframes svg-evening-filter` / `@keyframes svg-morning-filter` — multi-stop CSS `filter` animations for the mountain/cloud SVGs that shift through warm tints during the transition.

**Files affected:**
| File | Change |
|---|---|
| `src/context/theme.tsx` | New — theme context provider (system preference detection + localStorage) |
| `src/components/scene/dayNightScene.tsx` | New — dual day/night scene wrapper with pinwheel rotation |
| `src/components/scene/stars.tsx` | New — stars (night scene layer) |
| `src/components/scene/themeToggle.tsx` | New — near-invisible toggle element |
| `src/index.css` | Modified — add keyframe animations (twinkle, shooting-star, pinwheel, sky-evening, sky-morning, svg-filter transitions) |
| `src/App.tsx` | Modified — wrap in `<ThemeProvider>` |
| `src/components/index.tsx` | Modified — integrate day/night scene wrapper |
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
1. **Add `<Birds />`, `<Stars />`, `<ShootingStars />`** to the main layout component in `src/components/index.tsx`, layered via `z-index` between the background and the card. (The day/night scene rotation from §4 handles sun/moon and the overall scene transition.)

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
2. **Icons extraction, subtle links & card redesign** (#3) — refactor icons into shared file, redesign card to hand-drawn style, make links icon-only with hover reveal. Add posts link.
3. **Routing & CV page** (#2) — depends on data layer and icons. CV reads from same data source.
4. **Dark mode** (#4) — theme context (system preference + localStorage), near-invisible toggle, pinwheel day/night rotation, stars, card color transitions.
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
    │   └── index.tsx                   # Updated — hand-drawn style, icon-only links
    ├── cv/
    │   └── index.tsx                   # NEW — CV/resume page (reads same data)
    ├── scene/
    │   ├── dayNightScene.tsx           # NEW — dual day/night scene with pinwheel rotation
    │   ├── stars.tsx                   # NEW — stars + shooting stars
    │   ├── birds.tsx                   # NEW — flying birds
    │   └── themeToggle.tsx             # NEW — near-invisible dark mode toggle
    └── parallaxMountains/
        ├── index.tsx                   # Updated — cloud drift animation
        └── *.svg
```

## Dependencies

| Package | Purpose | Required By |
|---|---|---|
| `@solidjs/router` | Client-side routing for `/` and `/cv` | Step #2 |

No other new dependencies are needed. All animations use CSS keyframes and SolidJS signals/effects.
