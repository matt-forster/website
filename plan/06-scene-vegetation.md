# 6. Scene Vegetation & Landscape Elements

**Goal:** Enrich the parallax mountain scene with additional hand-drawn SVG elements — trees, plants, bushes, flowers, rocks, and other natural features — to make the landscape feel fuller and more alive.

## Design Principles

All new elements must match the **existing hand-drawn aesthetic**:

- **Hand-drawn paths:** Organic, slightly imperfect lines — not geometric or machine-precise. Match the stroke style of the existing mountains, clouds, and grass SVGs.
- **Nord palette:** Use the same colors as the existing artwork:
  - Fills: `#eceff4` (snow white), `#81a1c1` (mountain blue), `#5e81ac` (darker blue)
  - Strokes: `#d8dee9` (soft grey), `#3f5787` (dark blue), `#5e81ac` (accent blue)
  - Greens for vegetation: draw from Nord's frost/aurora tones — e.g., `#8fbcbb`, `#a3be8c` (aurora green), or muted custom greens that harmonize with the existing grass SVG.
- **No raster images.** All elements are inline SVGs or SVG files.
- **Consistent scale.** Elements should feel proportional to the existing mountains and grass — the scene has a stylized, slightly miniature/illustrated quality.

## Planned Elements

### 6a. Trees

- **Improve existing trees:** The current mountain foreground SVG includes simple tree-like marks (lines representing trunks/evergreens on the hillside). These should be refined — add fuller canopy shapes, more detail, and better integration with the landscape. The existing strokes can serve as a starting point for richer, more recognizable tree forms while keeping the hand-drawn style.
- **Evergreen / pine trees:** Simple triangular shapes with slightly wobbly edges. 2–3 size variants (small, medium, large). Placed in clusters along the mountain base or hillside.
- **Deciduous trees:** Rounded, blob-like canopy shapes on a thin trunk. Again, hand-drawn imperfection in the outline. 1–2 variants.
- Each tree SVG should be a standalone file in `src/components/parallaxMountains/` (e.g., `pineSmall.svg`, `pineLarge.svg`, `deciduousOne.svg`).

### 6b. Bushes & Shrubs

- Small, rounded clusters of foliage — simpler and shorter than trees. Placed in the foreground near the grass layer to add depth.
- 2–3 shape variants to avoid repetition.

### 6c. Flowers & Small Plants

- Tiny accent elements — simple 3–5 petal shapes or small stems with dots. Scattered sparingly in the grass layer or foreground.
- These add subtle color variety (using Nord aurora tones: `#bf616a` red, `#d08770` orange, `#ebcb8b` yellow, `#a3be8c` green).

### 6d. Rocks & Boulders

- Simple rounded or angular shapes in grey Nord tones (`#d8dee9`, `#4c566a`). Placed at the mountain base or scattered in the foreground.
- 2–3 size variants.

## Parallax Integration

Each new element participates in the existing parallax system:

- **Background layer** (behind mountains): Distant trees, very slow parallax. Smaller scale.
- **Mid-ground layer** (between mountain layers): Medium-sized trees and bushes. Moderate parallax speed.
- **Foreground layer** (in front of mountains, near the grass): Larger trees, bushes, flowers, rocks. Faster parallax speed.

Implementation:
1. Add new SVG assets to `src/components/parallaxMountains/`.
2. Import them in `src/components/parallaxMountains/index.tsx` using the same dynamic `import()` pattern as existing SVGs.
3. Add `<img>` elements with `absolute` positioning and `translate` driven by `calculateTranslate()` with appropriate speed multipliers.
4. Layer them via positioning (`bottom`, `left`) and DOM order relative to the existing mountain, cloud, and grass elements.

## Dark Mode Considerations

In dark mode (see [§4 — Dark Mode](./04-dark-mode.md)), vegetation elements will be tinted via the same CSS `filter` applied to the other SVGs during the day/night transition. No separate dark-mode SVG variants are needed — the filter chain (`brightness`, `hue-rotate`, `saturate`) will naturally shift greens to muted night tones.

## Files Affected

| File | Change |
|---|---|
| `src/components/parallaxMountains/*.svg` | New + modified — hand-drawn SVG files for trees, bushes, flowers, rocks; improved existing tree elements in mountain foreground |
| `src/components/parallaxMountains/index.tsx` | Modified — import new SVGs, add positioned `<img>` elements with parallax speeds |

## Notes

- **SVGs must be hand-drawn by the author** to maintain the existing aesthetic. These plan entries describe what to create; the actual SVG artwork is a manual illustration task.
- Start with a small set (2–3 trees, 1–2 bushes) and iterate. It's easier to add more later than to remove clutter.
- Consider the scene composition — elements should frame the card area (top-left) without obscuring it. Most vegetation should cluster in the right half and lower portion of the scene.
