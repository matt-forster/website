# Website Enhancement Plan

Six planned enhancements for the portfolio site. Each is documented in its own file — read the one relevant to the work you're doing.

## Plan Files

| # | File | Summary | Read when… |
|---|---|---|---|
| 1 | [Data Layer](./01-data-layer.md) | Extract hardcoded profile data into a unified data module (`getProfile()`) that will later swap to an API fetch. Covers types, static fallback, and the future async migration path. | You are working on the data layer, the Card component's data source, or preparing for the API integration. |
| 2 | [CV Page](./02-cv-page.md) | Add a `/cv` route and page that shares the parallax scene background. Uses `@solidjs/router` and reads from the same `getProfile()` data source as the landing page. | You are adding routing, building the CV page, or extracting the shared layout. |
| 3 | [Card Redesign + Links](./03-card-redesign.md) | Redesign the card to match the hand-drawn SVG aesthetic (organic borders, no glassmorphism). Make links icon-only with subtle hover-reveal labels. Data-driven link rendering via `<For>`. | You are restyling the card, adding/changing links, or working on the icon components. |
| 4 | [Dark Mode](./04-dark-mode.md) | Day/night transition with a pinwheel rotation effect, evening/morning color phases, system preference detection, and a near-invisible toggle. Stars, sun/moon, and CSS filter tinting for the SVGs. | You are implementing dark mode, the theme context, the scene transition, or the toggle. |
| 5 | [Animated Elements](./05-animated-elements.md) | Add birds, shooting stars (night only), and autonomous cloud drift to bring the scene to life independently of mouse movement. | You are adding animations, scene elements, or working on the parallax cloud layer. |
| 6 | [Scene Vegetation](./06-scene-vegetation.md) | Add hand-drawn trees, bushes, flowers, and rocks to the parallax scene. Covers element types, Nord palette usage, parallax layer placement, and dark mode filter compatibility. | You are adding new landscape elements (trees, plants, rocks) to the scene, or creating new SVG assets for the environment. |

## Implementation Order

Build incrementally — each step depends on the ones before it:

1. ~~**Data layer**~~ ✅ → 2. ~~**Card redesign + links**~~ ✅ → 3. ~~**Dark mode**~~ ✅ → 4. **Animated elements** → 5. **Scene vegetation** → 6. **CV page + routing**

Each step should be followed by a build verification (`npm run build`) and visual check.

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
        ├── index.tsx                   # Updated — cloud drift animation + vegetation elements
        └── *.svg                       # Existing + new hand-drawn vegetation SVGs
```

## Dependencies

| Package | Purpose | Required By |
|---|---|---|
| `@solidjs/router` | Client-side routing for `/` and `/cv` | Step 6 (CV Page) |

No other new dependencies are needed. All animations use CSS keyframes and SolidJS signals/effects.
