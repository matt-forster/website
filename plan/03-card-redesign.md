# 3. Card Redesign + Subtle Links

## 3a. Card Redesign — Flow with the Scene

**Goal:** Rethink the card so it feels like a natural part of the landscape, matching the hand-made/hand-drawn aesthetic of the existing SVGs rather than a sterile UI element floating on top.

**Design direction:** The SVGs (mountains, clouds, grass) were hand-drawn and use organic, imperfect paths with soft Nord palette strokes (`#d8dee9`, `#3f5787`, `#5e81ac`). The card should feel like it belongs in this world — like a hand-written note or a wooden sign post in the scene — not like a glass panel or a material-design card.

### Approach — Organic / Hand-Drawn Card

- Keep the white/off-white background (`#eceff4` or `#fff`) to stay consistent with the illustration palette — do **not** use transparency, blur, or glassmorphic effects.
- Replace the hard `rounded-lg` + `shadow-md` with a softer, sketchier border treatment:
  - Use an SVG border/frame around the card that mimics the hand-drawn stroke style of the existing artwork (irregular lines, slight wobble, Nord stroke colors like `#d8dee9` or `#3f5787`).
  - Alternatively, use a CSS `border` with a slightly heavier weight (`2–3px`) in a muted Nord color (`#d8dee9`) and keep the simple `rounded-lg`, relying on the color palette to tie it visually to the scene rather than adding drawn-stroke SVG framing.
- Typography: consider a slightly more casual or humanist font pairing to complement the hand-drawn aesthetic, while remaining highly legible. If adding a new font feels heavy, simply adjusting weight/spacing of the existing sans-serif is sufficient.
- Reduce the heavy positioning margins; let the card sit more naturally:
  - Keep the responsive breakpoint positions but consider whether the strict `absolute` pinned layout could be softened.
- The card should feel like a note, sign, or label placed in the scene — **not** a frosted glass overlay or a material card.

## 3b. Subtle Links

**Goal:** Links should be understated — visible but not attention-grabbing. They should be discoverable on hover rather than loudly labelled.

### Approach — Icon-Only with Hover Reveal

1. **Default state:** Render links as a row of small, muted-color icons (e.g., `text-[#4c566a]/60`, ~`w-5 h-5`). No visible text labels by default.
2. **Hover state:** On hover, the icon lifts slightly (`transform: translateY(-2px)`), its color intensifies to the Nord accent (`#81a1c1`), and a small tooltip or label fades in below/above the icon showing the link text (e.g., "GitHub", "Posts").
3. **Spacing:** Icons are evenly spaced in a compact row with `gap-3`, sitting below a subtle 1px divider line.
4. **Links to include** (from data layer):
   - GitHub → `https://www.github.com/matt-forster`
   - Email → `mailto:hey@mattforster.ca`
   - LinkedIn → `https://www.linkedin.com/in/matt-forster`
   - Posts → `https://posts.mattforster.ca`
   - CV → internal route `/cv`

### Approach — Data-Driven Rendering

1. **Extend the `Link` type** in `src/data/profile.ts` with an `icon` discriminator field (e.g., `'github' | 'email' | 'linkedin' | 'posts'`). Additional types like `'web'` can be added later as needed.
2. **Create `src/components/icons/index.tsx`** — Extract the existing `GithubIcon` and `InboxIcon` SVG components from `<Card />` into a shared icons file. Add new icon components: `LinkedInIcon`, `PostsIcon`, `DocumentIcon`.
3. **Build an icon map** — `Record<Link['icon'], Component>` that maps the discriminator to the correct icon component.
4. **Update `<Card />`** — Replace the hardcoded link markup with a `<For each={profile.links}>` loop. Each link renders as a small icon with hover tooltip via `aria-label` and a CSS tooltip/label.

## Files Affected

| File | Change |
|---|---|
| `src/data/profile.ts` | Modified — add posts + linkedin links, add `icon` field to `Link` type |
| `src/components/icons/index.tsx` | New — shared icon components (smaller, muted) |
| `src/components/card/index.tsx` | Modified — hand-drawn card style, icon-only links with hover reveal |
