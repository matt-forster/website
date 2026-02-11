# 1. Data Layer — Profile + CV Unified

**Goal:** Decouple hardcoded personal data (name, title, skills, links, **and CV/experience**) from the Card component so it can later be fetched from a single API endpoint.

## Approach — Unified Data Layer with Static Fallback

1. **Create `src/data/profile.ts`** — Define TypeScript interfaces (`ProfileData`, `Link`, `Experience`) and export a `getProfile()` function that currently returns a static object containing **all** data: identity, links, and work experience. Both the landing card and the CV page consume the same data source.
2. **Update `<Card />`** — Import and call `getProfile()` instead of using inline constants. Render links from the data array using `<For>`.
3. **Future API swap** — When the API is ready, change `getProfile()` to an async fetch call. Wrap consumers in a SolidJS `<Suspense>` / `createResource` pattern. One endpoint returns everything (profile + CV), so both views stay in sync.

## Files Affected

| File | Change |
|---|---|
| `src/data/profile.ts` | New — unified data types & static getter (profile + experience + links) |
| `src/components/card/index.tsx` | Modified — consume data layer instead of inline constants |
