# Copilot Instructions for matt-forster/website

## Project Context

This is a personal portfolio/landing page built with **SolidJS** (not React), **TypeScript**, **Vite**, and **Tailwind CSS**. It is a single-page application featuring an interactive parallax mountain scene with a contact card overlay. Hosted on Cloudflare Pages.

## Key Conventions

### SolidJS (Not React)
- Components use `createSignal`, `createEffect`, and `createMemo` — not `useState` or `useEffect`.
- Signals return `[getter, setter]`. The getter is called as a function: `count()`, not `count`.
- Components run their function body **once**. Reactivity is tracked through signal access in JSX expressions.
- Use `import type { Component } from 'solid-js'` for component typing.
- Use `onMount` for client-side initialization and DOM-dependent logic.

### Styling
- Use **Tailwind CSS** utility classes exclusively. No custom CSS beyond Tailwind directives.
- Long class lists are organized as **multiline template literal strings** assigned to `const` variables (e.g., `const style = \`...\``).
- The project uses the **Nord color palette**: `#eceff4` (background), `#2e3440` (text), `#4c566a` (muted), `#81a1c1`/`#5e81ac` (accents).

### TypeScript
- Strict mode is enabled.
- Target: ESNext.
- JSX import source is `solid-js`.

### Build & Dev
- `npm run dev` — Vite dev server on port 3000.
- `npm run build` — Production build to `dist/`.
- `npm run test` — Jest tests (currently `--passWithNoTests`).
- Node.js >=23.11.0 required (Volta pinned).

### Testing
- Jest with `solid-jest/preset/browser` and JSDOM.
- SVG, file, and CSS mocks in `__mocks__/` directory.
- Use `@solidjs/testing-library` for component testing.

### Project Structure
- `src/index.tsx` — Entry point, renders `<App />`.
- `src/App.tsx` — Root component with `<MetaProvider>`.
- `src/components/index.tsx` — `<Main />` layout with mouse tracking.
- `src/components/card/` — Contact card component.
- `src/components/parallaxMountains/` — Parallax scene with SVG assets.

### Important Notes
- This is **not SSR** — client-side rendering only.
- No routing library — single page.
- Deployment target is **Cloudflare Pages**.
- SVG assets are imported as URLs by Vite (not inline).
