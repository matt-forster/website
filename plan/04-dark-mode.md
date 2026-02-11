# 4. Dark Mode with Day/Night Transition

**Goal:** Transition the scene between day and night using a pinwheel/rotation effect. The toggle should be nearly invisible, and the initial theme should follow the user's system/browser preference.

## 4a. Theme Context with System Preference Detection

### Approach

1. **Create `src/context/theme.tsx`** — A SolidJS context provider that exposes:
   - `mode()` signal — `'light' | 'dark'`
   - `toggle()` function
   - **Initialize from `prefers-color-scheme`:** On mount, read `window.matchMedia('(prefers-color-scheme: dark)')` to set the default mode. Also listen for changes to the media query (e.g., user changes OS theme while the page is open) and update the signal accordingly.
   - Store the user's explicit override (if they use the toggle) in `localStorage` so it persists across visits. On init: check `localStorage` first → fall back to system preference.
2. **Wrap the app** in `<ThemeProvider>` in `src/App.tsx`.

## 4b. Very Subtle Toggle

**Goal:** The toggle should be _very_ subtle — almost hard to find. It is not a prominent UI button; it is a discoverable Easter-egg-style interaction for users who want to manually switch.

### Approach — Near-Invisible Toggle

- Render as a tiny, nearly transparent element (e.g., a small dot or a faint star/moon icon, ~`w-3 h-3`, `opacity: 0.15`).
- Position it in an unobtrusive corner (e.g., bottom-right or top-right, flush with the edge).
- On hover, it gains slightly more opacity (`opacity: 0.4`) and shows a subtle cursor change — but still remains very understated.
- On click, it triggers `toggle()` to switch the theme.
- No tooltip, no label, no visible text. Just a near-invisible clickable element.
- **Accessibility:** The element should be a `<button>` with a descriptive `aria-label` (e.g., "Toggle dark mode") so screen readers can discover it. On keyboard focus (`:focus-visible`), show a clear focus ring at full opacity so keyboard users can find and activate it. The visual subtlety is intentional for sighted mouse users, but the control must remain fully accessible via keyboard and assistive technology.
- **Create `src/components/scene/themeToggle.tsx`** for this component.

## 4c. Pinwheel / Rotation Transition with Evening & Morning Phases

**Goal:** Instead of a vertical sun rise/set, the transition between day and night should feel like a **pinwheel rotation** — the entire scene rotates to reveal the opposite side (day ↔ night). The transition should pass through **evening** and **morning** intermediate phases with warm sunset/sunrise hues, rather than cutting directly between bright day and dark night.

### Approach — Dual-Scene Background with CSS Rotation + Intermediate Color Phases

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

## 4d. Card and Content Dark Mode

- **Update `<Card />` and `<CVPage />`** — Transition card background from the off-white/white Nord palette to a dark Nord variant (`#3b4252`) and text from dark to light. Keep the hand-drawn border/stroke style but shift stroke colors to lighter Nord tones for night visibility.
- Card color transitions should happen smoothly with CSS `transition` on `background-color` and `color`, coordinated with but independent of the pinwheel scene rotation.
- During the evening/morning transition, the card background can pass through a subtle warm intermediate (e.g., a muted parchment/amber tone) before reaching its final day or night color, reinforcing the sunset/sunrise feel across the entire UI.

## 4e. CSS Animations

- **Add CSS animations** to `src/index.css`:
  - `@keyframes twinkle` — opacity oscillation for stars.
  - `@keyframes shooting-star` — diagonal translate + fade for shooting stars.
  - `@keyframes pinwheel-rotate` (if using keyframes rather than a simple transition for the rotation).
  - `@keyframes sky-evening` — multi-stop background-color animation through warm sunset hues (day → golden → pink-orange → twilight → night). Applied during day-to-night transition.
  - `@keyframes sky-morning` — multi-stop background-color animation through warm sunrise hues (night → pre-dawn → coral → golden → day). Applied during night-to-day transition.
  - `@keyframes svg-evening-filter` / `@keyframes svg-morning-filter` — multi-stop CSS `filter` animations for the mountain/cloud SVGs that shift through warm tints during the transition.

## Files Affected

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
