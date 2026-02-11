# 2. CV / Resume Page with Similar Design

**Goal:** Add a second page for work experience/CV that shares the visual language of the landing page (card overlay on top of the parallax mountain scene).

**Data source:** CV data (experience, roles, descriptions) comes from the same `getProfile()` / API endpoint as the landing-page profile data (see [§1 — Data Layer](./01-data-layer.md)). No separate CV API.

## Approach — Client-Side Routing

1. **Install `@solidjs/router`** — Add the SolidJS router package.
2. **Update `src/App.tsx`** — Wrap the app in `<Router>` and define two `<Route>` entries:
   - `/` → renders the existing `<Main />` component (landing page with `<Card />`).
   - `/cv` → renders a new `<CVPage />` component.
3. **Create `src/components/cv/index.tsx`** — A `<CVPage />` component that:
   - Reuses the same parallax mountain background and overall layout from `<Main />`.
   - Renders a wider panel (same hand-drawn card style as the redesigned card — see [§3 — Card Redesign](./03-card-redesign.md)) populated with experience data from `getProfile()`.
   - Includes a "← Back" link to `/` using the router's `<A>` component.
4. **Update `<Card />`** — Add a subtle CV link that routes to `/cv` using `<A href="/cv">`.
5. **Shared layout** — Extract the parallax-scene + mouse-tracking wrapper from `<Main />` into a shared layout component (or use the router's `root` prop) so both pages share the same background scene.

## Files Affected

| File | Change |
|---|---|
| `package.json` | Modified — add `@solidjs/router` dependency |
| `src/App.tsx` | Modified — add `<Router>` and route definitions |
| `src/components/index.tsx` | Modified — extract shared layout logic |
| `src/components/cv/index.tsx` | New — CV page component |
| `src/components/card/index.tsx` | Modified — add subtle CV navigation link |
