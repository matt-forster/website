# Architecture Audit & Agent Instructions

## Project Overview

This is a personal portfolio/landing page for Matt Forster, a Software Engineer. It is a single-page application built with SolidJS and styled with Tailwind CSS. The site features an interactive parallax mountain scene that responds to mouse movement, overlaid with a contact/info card.

**Live hosting:** Cloudflare Pages with Cloudflare Workers

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Language | TypeScript | ^5.8.3 |
| UI Framework | SolidJS | ^1.4.7 |
| Meta Tags | solid-meta | ^0.27.5 |
| Build Tool | Vite | ^6.3.2 |
| CSS Framework | Tailwind CSS | ^3.1.6 |
| PostCSS | autoprefixer, postcss | ^8.4.14 |
| Test Runner | Jest | ^28.1.3 |
| Test Utilities | @solidjs/testing-library | ^0.8.10 |
| Transpiler | Babel (with solid preset) | ^7.18.6 |
| Node.js | >=23.11.0 (Volta pinned) | 23.11.0 |

---

## Directory Structure

```
website/
├── index.html                  # Entry HTML (Vite SPA entry point)
├── package.json                # Dependencies, scripts, engine constraints
├── vite.config.ts              # Vite config: SolidJS plugin, port 3000, ESNext target
├── tsconfig.json               # TypeScript config: ESNext, SolidJS JSX
├── tailwind.config.js          # Tailwind: scans index.html + src/**/*
├── postcss.config.js           # PostCSS: tailwindcss + autoprefixer
├── babel.config.js             # Babel: env, typescript, solid, jest presets
├── jest.config.js              # Jest: solid-jest preset, JSDOM, mocks
├── jest-setup.ts               # Jest setup: testing-library, window mocks
├── __mocks__/                  # Jest mocks
│   ├── fileMock.js             #   Static file stub
│   ├── styleMock.js            #   CSS module stub
│   └── svgMock.js              #   SVG import stub
└── src/
    ├── index.tsx               # App entry: renders <App /> into #root
    ├── index.css               # Global CSS: Tailwind directives only
    ├── App.tsx                  # Root component: MetaProvider + <Main />
    ├── assets/
    │   └── favicon.ico         # Site favicon
    └── components/
        ├── index.tsx            # <Main />: layout, mouse tracking, composition
        ├── card/
        │   └── index.tsx        # <Card />: contact card with name, title, links
        └── parallaxMountains/
            ├── index.tsx        # <ParallaxMountainScene />: parallax effect
            ├── mountainBackground.svg
            ├── mountainForeground.svg
            ├── grass.svg
            └── cloud{One..Six}.svg   # Six cloud layers
```

---

## Architecture Description

### Rendering Pipeline

1. **`index.html`** — Minimal HTML shell with a `#root` div and module script pointing to `src/index.tsx`.
2. **`src/index.tsx`** — Calls SolidJS `render()` to mount `<App />` into the root element.
3. **`src/App.tsx`** — Wraps the app in `<MetaProvider>` from `solid-meta` for `<head>` tag management (title, charset, viewport, theme-color). Renders `<Main />`.
4. **`src/components/index.tsx` (`<Main />`)** — The layout shell. Tracks mouse position via `createSignal` and `onMouseMove`. Passes coordinates to `<ParallaxMountainScene />`. Renders `<Card />`.

### Key Components

#### `<Card />` (`src/components/card/index.tsx`)
- Renders a positioned info card with name, title, description, skills, and social links (GitHub, email).
- Uses SolidJS `<Portal>` to render outside the normal DOM hierarchy.
- Styled entirely with inline Tailwind classes. Responsive breakpoints for positioning (`left-4 top-4` → `md:left-20 md:top-20` → `lg:left-48 lg:top-48`).
- Contains inline SVG icons (GitHub, Inbox) as small SolidJS components.

#### `<ParallaxMountainScene />` (`src/components/parallaxMountains/index.tsx`)
- Receives `{ x, y }` mouse position as props.
- Dynamically imports 9 SVG assets on mount (`onMount` + async `import()`).
- Tracks window size with a resize listener.
- Uses `createEffect` to recalculate CSS `translate` values for each layer based on mouse position and configurable speed multipliers.
- Renders 9 `<img>` elements absolutely positioned to create a layered parallax depth effect (mountains, clouds, grass).

### State Management
- **Minimal and local**: All state is component-local using SolidJS `createSignal`.
- **Signals used**: `mousePosition` (Main), `windowSize`, `translateValues`, `assetsLoaded` (ParallaxMountainScene).
- No global state management, stores, or context providers needed for this single-page site.

### Styling Approach
- **Tailwind CSS** via PostCSS, with utility classes applied as template literal strings or inline `class` attributes.
- Multiline template literal strings are used to organize long class lists (e.g., `boxStyle`, `style` constants).
- **Nord color palette** references: `#eceff4` (bg), `#2e3440` (text), `#4c566a` (secondary), `#81a1c1`/`#5e81ac` (link hover).
- No custom Tailwind theme extensions or plugins configured.

### Build & Dev

| Command | Action |
|---|---|
| `npm run dev` | Start Vite dev server on port 3000 |
| `npm run build` | Production build (ESNext target) |
| `npm run serve` | Preview production build |
| `npm run test` | Run Jest tests (currently `--passWithNoTests`) |

### Testing Infrastructure
- Jest with `solid-jest/preset/browser` and JSDOM environment.
- Babel transpilation for SolidJS components in tests.
- Module mocks for SVGs, static files, and CSS.
- `jest-setup.ts` mocks `window.innerWidth`/`innerHeight` for consistent test results.
- **No test files currently exist** — the test script uses `--passWithNoTests`.

---

## Identified Improvement Opportunities

### High Priority

1. **Add unit tests**: No tests exist. At minimum, test that `<Card />` renders expected content and that `<ParallaxMountainScene />` calculates translations correctly.

2. **Fix duplicate `id="foreground"`**: In `ParallaxMountainScene`, 7 of 9 `<img>` elements share `id="foreground"`. HTML IDs must be unique. Replace with descriptive IDs or remove them (they aren't referenced anywhere).

3. **Add CI/CD workflow**: No GitHub Actions workflow exists. Add a workflow for build verification and test execution on PRs and pushes.

### Medium Priority

4. **Extract constants and configuration**: The `<Card />` component has hardcoded personal data (`name`, `title`, `description`, `skills`). Consider extracting to a shared config file for easier updates.

5. **Type the parallax speed configuration**: The parallax layer speeds are magic numbers passed inline to `calculateTranslate()`. Extract into a typed configuration object for clarity and maintainability.

6. **Use static SVG imports where possible**: The `ParallaxMountainScene` dynamically imports SVGs in `onMount`. Since this is a client-only SPA (not SSR), static imports at the top of the file would be simpler and enable better build-time optimization. The dynamic import pattern would only be needed for SSR.

7. **Add `<head>` element to `index.html`**: The HTML file is missing `<head>` and instead has content directly in `<body>`. While browsers auto-correct this, an explicit `<head>` tag is best practice.

### Low Priority

8. **Tailwind class organization**: Multiline template literal strings for class lists work but don't benefit from Tailwind IntelliSense or sorting plugins. Consider `clsx` or Tailwind's `@apply` directive for complex class combinations.

9. **Accessibility improvements**: Add `aria-label` attributes to social links, ensure proper heading hierarchy, and consider `prefers-reduced-motion` for the parallax effect.

10. **Update dependencies**: Several dependencies are on older major versions (Jest 28, Tailwind 3). Evaluate upgrading to latest stable versions.

11. **Add ESLint/Prettier**: No linting or formatting tools are configured. Adding these would improve code consistency.

---

## Agent Guidelines

When working on this codebase:

- **Framework**: This is a **SolidJS** project, not React. SolidJS uses fine-grained reactivity — components run once, and JSX expressions are compiled to real DOM operations. Do not use React patterns (e.g., `useState`, `useEffect`, virtual DOM assumptions).
- **Signals**: Use `createSignal` for state, `createEffect` for side effects, `createMemo` for derived values. Signals return `[getter, setter]` — call the getter as a function (`count()`, not `count`).
- **Build tool**: Vite with `vite-plugin-solid`. Run `npm run dev` for development, `npm run build` for production.
- **Styling**: Use Tailwind CSS utility classes. Follow the existing pattern of multiline template literal strings for organizing long class lists.
- **Testing**: Jest with `solid-jest` preset. Mock SVGs and static assets using the `__mocks__/` directory. Tests should use `@solidjs/testing-library`.
- **Node version**: Requires Node.js >=23.11.0 (Volta-pinned).
- **No routing**: Single-page site with no client-side routing.
- **No SSR**: Client-side rendering only. The `index.html` is served directly.
- **Deployment**: Cloudflare Pages. Build output goes to `dist/`.
