# 5. Animated Scene Elements (Birds, Shooting Stars, Movement)

**Goal:** Add life to the scene with autonomous animations that are independent of mouse movement.

## 5a. Birds

1. **Create `src/components/scene/birds.tsx`** — A `<Birds />` component:
   - Uses `setInterval` (spawned in `onMount`, cleaned up in `onCleanup`) to periodically create bird objects with random y-position, speed, and size.
   - Each bird is an SVG `<path>` shaped like a simple "V" / gull silhouette.
   - Birds fly across the screen using a CSS `bird-fly` animation (`left: -5% → 105%`).
   - A nested `bird-flap` animation oscillates the path's shape to simulate wing flapping.
   - Birds are removed from state after their animation completes.
   - In dark mode, bird color changes to match the night palette.

## 5b. Shooting Stars (Night Only)

1. **Extend `src/components/scene/stars.tsx`** with a `<ShootingStars />` component:
   - Active only in dark mode (visibility tied to theme context).
   - Periodically spawns a bright streak at a random position in the sky.
   - Each streak uses a CSS animation that translates diagonally and fades out over ~0.5–1s.
   - Spawned with 30% probability every ~2s for a natural feel.

## 5c. Cloud Drift

1. **Update `src/components/parallaxMountains/index.tsx`** — Add a slow, continuous CSS `translateX` animation to each cloud `<img>`, independent of the mouse parallax. This gives clouds a gentle autonomous drift even when the mouse is still. Implemented by adding a secondary `animation` style property alongside the existing mouse-driven `translate`.

## 5d. Composition

1. **Add `<Birds />`, `<Stars />`, `<ShootingStars />`** to the main layout component in `src/components/index.tsx`, layered via `z-index` between the background and the card. (The day/night scene rotation from [§4 — Dark Mode](./04-dark-mode.md) handles sun/moon and the overall scene transition.)

## Files Affected

| File | Change |
|---|---|
| `src/components/scene/birds.tsx` | New — flying birds animation |
| `src/components/scene/stars.tsx` | Modified — add `<ShootingStars />` component |
| `src/index.css` | Modified — add `bird-fly`, `bird-flap`, `shooting-star`, `cloud-drift` keyframes |
| `src/components/parallaxMountains/index.tsx` | Modified — add autonomous cloud drift animation |
| `src/components/index.tsx` | Modified — compose new scene elements into layout |
