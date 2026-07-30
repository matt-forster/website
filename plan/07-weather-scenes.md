# Weather-Integrated Scene System

## Overview

Transform the website to dynamically display seasonal and weather-appropriate scenes based on real-time weather data from Lethbridge, Alberta. The system will rotate through base seasonal scenes (winter, spring, summer, fall) while overlaying current weather conditions (snow, rain, wind, sun).

---

## Core Concepts

### 1. Scene Composition
- **Base Layer**: Seasonal scene (winter/spring/summer/fall)
- **Weather Layer**: Current condition overlay (snow/rain/wind/sun)
- **Data-Driven**: Both layers controlled by weather API data

### 2. Season Selection
Two potential approaches:
- **A) Calendar-based with weather influence**: Use date to determine base season, but allow weather to "push" into adjacent season if extreme (e.g., June snowstorm shows winter elements)
- **B) Pure average weather**: Use historical average weather for the date in Alberta

### 3. Weather Data
- **Source**: Weather API (OpenWeatherMap, Weather.gov, Environment Canada, etc.)
- **Frequency**: Poll every 15-30 minutes to balance freshness vs. API costs
- **Fallback**: Static data for offline/error states

---

## Implementation Questions

### Data Source & Frequency

**Q1: Weather API Choice**
- Option A: **OpenWeatherMap** (free tier: 1000 calls/day, current + forecast)
- Option B: **WeatherAPI.com** (free tier: 1M calls/month, more generous)
- Option C: **Environment Canada** (government data, reliable for Canadian locations, free)
- Option D: **Open-Meteo** (completely free, no API key required, FOSS)

**Q2: Update Frequency**
- Every 15 minutes (96 requests/day per visitor)?
- Every 30 minutes (48 requests/day per visitor)?
- Every hour (24 requests/day per visitor)?
- On page load only (1 request per session)?

**Q3: Server-Side vs Client-Side**
- **Server-side (Cloudflare Worker)**: Cache weather data, all clients share same data, rate limit protection
- **Client-side**: Direct API calls from browser, simpler but exposed API key
- **Hybrid**: Server-side with long cache (1-2 hours), client-side for immediate updates

### Scene Behavior

**Q4: Season Determination**
- **Fixed Calendar**: Dec-Feb = Winter, Mar-May = Spring, Jun-Aug = Summer, Sep-Nov = Fall
- **Weather-Influenced**: Calendar base + temperature thresholds (e.g., snow => force winter elements)
- **Historical Average**: Use 30-year climate normals for Lethbridge for the current date
- **Hybrid**: Calendar base, but extreme weather (>10°C deviation) can override

**Q5: Weather Condition Mapping**
Given API weather codes, how should we map to our 4 conditions?
```
Snow: Heavy snow, blizzard, snow showers
Rain: Light/heavy rain, drizzle, thunderstorms
Wind: High wind speed (>30 km/h?), dust storms
Sun: Clear skies, partly cloudy (default when no precipitation/wind)
```

**Q6: Multiple Simultaneous Conditions**
If it's rainy AND windy, which takes precedence?
- Priority order (snow > rain > wind > sun)?
- Blend effects (show both)?
- Use most severe condition only?

### Asset Management

**Q7: Scene Variants**
How many distinct visual variants per season?
- **Minimal**: 1 scene per season (4 total) + 4 weather overlays
- **Rich**: Multiple variants per season (2-3 each = 8-12 base scenes)
- **Generated**: Same base mountains, swap colors/vegetation programmatically

**Q8: New SVG Assets Needed**
For weather conditions:
```
Snow:     Snowflakes (falling), snow-covered mountains, bare trees
Rain:     Raindrops (falling), puddles, darker colors
Wind:     Cloud movement (faster), bent grass/trees, tumbleweeds
Sun:      Clear sky, bright colors (already mostly implemented)
```

For seasons:
```
Winter:   Snow-covered ground, bare deciduous trees, evergreens, darker mountains
Spring:   New growth, flowers, lighter greens, muddy patches
Summer:   Full foliage, bright sun, dry grass (current scene is summer-like)
Fall:     Orange/red leaves, fallen leaves on ground, harvest colors
```

Do you want hand-drawn SVGs for all of these, or should we reuse/recolor existing assets?

**Q9: Transition Animation**
- **Instant**: Scene snaps to new season/weather when data updates
- **Crossfade**: Fade between scenes over 2-3 seconds
- **Gradual**: Elements fade in/out individually (clouds drift in, snow starts falling)
- **Time-lapse**: Accelerated transitions mimicking natural progression

### Technical Architecture

**Q10: Data Storage**
Where should we cache weather data?
- **LocalStorage**: Persist across page reloads, stale if user leaves tab open
- **Memory only**: Fresh on every page load
- **Cloudflare KV**: Server-side cache shared across all visitors
- **Both**: Server-side cache + client-side localStorage

**Q11: Component Structure**
```
Current: <DayNightScene> → <ParallaxMountainScene>

Proposed Option A (Weather Context):
<DayNightScene> → <WeatherProvider> → <SeasonalScene> → <WeatherOverlay>

Proposed Option B (Unified Scene):
<DayNightScene> → <AdaptiveScene weather={data} season={season}>
```

Which structure feels cleaner to you?

**Q12: Fallback Strategy**
If weather API is down or rate-limited:
- Show default summer scene (current)?
- Show last known weather from localStorage?
- Cycle through all seasons randomly?
- Display error message to user?

### User Experience

**Q13: User Control**
Should visitors be able to:
- Manually override scene (season/weather selector)?
- Disable weather integration (show static scene)?
- See weather details (temp, conditions, forecast)?
- Change location (other than Lethbridge)?

**Q14: Loading State**
While fetching weather data:
- Show loading spinner?
- Show default summer scene immediately, swap when data loads?
- Show skeleton/placeholder?

**Q15: Mobile Considerations**
- Same asset quality or lighter assets for mobile?
- Reduce particle counts (snowflakes, raindrops) on mobile?
- Disable weather fetching on mobile to save battery/data?

---

## Proposed Phased Implementation

### Phase 1: Data Layer (Week 1)
- [ ] Choose weather API provider
- [ ] Set up Cloudflare Worker for weather proxy (if server-side)
- [ ] Create `src/services/weather.ts` service
- [ ] Create `src/types/weather.ts` types
- [ ] Implement caching strategy (localStorage + server-side)
- [ ] Add fallback/error handling

### Phase 2: Season System (Week 2)
- [ ] Implement season determination logic
- [ ] Create seasonal color palettes (extend current Nord palette)
- [ ] Create `src/components/scene/seasonalScene.tsx`
- [ ] Adapt existing vegetation to seasonal variants (colors, presence)
- [ ] Test season switching manually

### Phase 3: Base Season Assets (Week 3-4)
- [ ] Design/create winter SVG assets
- [ ] Design/create spring SVG assets
- [ ] Design/create fall SVG assets
- [ ] Adapt existing summer assets
- [ ] Implement seasonal asset loading

### Phase 4: Weather Overlays (Week 5-6)
- [ ] Create snow particle system (falling snowflakes)
- [ ] Create rain particle system (falling raindrops)
- [ ] Create wind effects (fast cloud movement, bent vegetation)
- [ ] Add weather-specific visual adjustments (darker skies, etc.)

### Phase 5: Integration & Polish (Week 7)
- [ ] Connect weather data to scene rendering
- [ ] Implement scene transition animations
- [ ] Add loading states
- [ ] Test all season + weather combinations (16 total)
- [ ] Performance optimization (particle counts, asset sizes)

### Phase 6: Optional Enhancements
- [ ] Weather details card/tooltip
- [ ] User controls (season override, weather toggle)
- [ ] Forecast integration (show tomorrow's weather)
- [ ] Time-of-day accuracy (current time in Lethbridge)

---

## Technical Considerations

### Performance
- **Asset preloading**: Preload seasonal assets based on likely next season
- **Particle limits**: Max 50-100 snowflakes/raindrops to maintain 60fps
- **Asset optimization**: Keep SVGs small (<50KB each), use SVGO
- **Lazy loading**: Only load weather overlay assets when needed

### Accessibility
- **Reduced motion**: Disable falling particles if user has `prefers-reduced-motion`
- **Alt text**: Describe current scene for screen readers
- **Color contrast**: Ensure text remains readable across all season/weather combinations

### API Costs & Sustainability
Assuming 1000 daily visitors, 30min polling:
- Requests: 1000 visitors × 48 requests/day = 48,000 requests/day
- With server-side caching (1 hour): ~24 requests/day (affordable)
- **Recommendation**: Server-side cache with 1-hour TTL

### Browser Compatibility
- All modern browsers support required features (CSS animations, LocalStorage, Fetch API)
- SVG support is universal
- Graceful degradation: Show static scene if weather fetch fails

---

## Open Questions for Discussion

1. **Artistic Direction**: Should scenes be realistic or stylized/whimsical?
2. **Detail Level**: How detailed should seasonal changes be (just colors, or full asset swaps)?
3. **Weather Severity**: Should we differentiate light rain vs. heavy rain vs. thunderstorm?
4. **Cloudflare Integration**: Do you have Cloudflare Workers set up already for this site?
5. **Asset Creation**: Will you create the SVG assets yourself, or should we use programmatic generation?
6. **Scope**: MVP with basic seasons + weather, or full system with all enhancements?

---

## Next Steps

1. **Review this plan** and answer the implementation questions
2. **Decide on scope**: MVP vs. full implementation
3. **Confirm API choice** and set up credentials
4. **Start Phase 1**: Weather data layer foundation
5. **Iterative development**: Build, test, and refine each phase

---

## Notes

- Current scene is already summer-like (green grass, full foliage)
- Day/night system already exists and works well
- Parallax system is solid foundation for weather overlays
- Nord color palette can be extended with seasonal variants
- Existing cloud animation can be accelerated for wind effect
