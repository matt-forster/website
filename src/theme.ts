// Nord color palette — https://www.nordtheme.com/
// Centralized theme constants to avoid inline color codes throughout components.

export const colors = {
  // Polar Night (dark backgrounds)
  nord0: '#2e3440',
  nord1: '#3b4252',
  nord2: '#434c5e',
  nord3: '#4c566a',

  // Snow Storm (light backgrounds / text)
  nord4: '#d8dee9',
  nord5: '#e5e9f0',
  nord6: '#eceff4',

  // Frost (accents / links)
  nord7: '#8fbcbb',
  nord8: '#88c0d0',
  nord9: '#81a1c1',
  nord10: '#5e81ac',

  // Aurora (highlights)
  nord11: '#bf616a',
  nord12: '#d08770',
  nord13: '#ebcb8b',
  nord14: '#a3be8c',
  nord15: '#b48ead',
} as const;

// Semantic color aliases for readability
export const palette = {
  // Backgrounds
  daySky: colors.nord6,
  nightSky: colors.nord0,
  dayCardBg: colors.nord6,
  nightCardBg: colors.nord1,

  // Borders
  dayBorder: colors.nord4,
  nightBorder: colors.nord3,

  // Text
  dayText: colors.nord0,
  nightText: colors.nord6,
  daySecondaryText: colors.nord3,
  nightSecondaryText: colors.nord4,
  dayMutedText: colors.nord3,
  nightMutedText: colors.nord9,

  // Links
  linkAccent: colors.nord9,
  dayLinkColor: `rgba(76, 86, 106, 0.6)`, // nord3 @ 60%
  nightLinkColor: colors.nord4,

  // Celestial
  sunColor: colors.nord13,
  sunGlow: 'rgba(235, 203, 139, 0.4)',
  sunTexture: '#d9b263',
  moonColor: colors.nord4,
  moonGlow: 'rgba(216, 222, 233, 0.3)',
  moonCrater: '#c2c9d6',

  // Toggle
  dayToggle: colors.nord3,
  nightToggle: colors.nord4,

  // Transition sky colors (warm sunset/sunrise phases)
  sunsetWarm: '#d4956a',
  sunriseWarm: colors.nord12,
} as const;

// SVG filter applied to mountain/cloud layers in dark mode
export const NIGHT_FILTER = 'brightness(0.5) hue-rotate(20deg) saturate(0.7)';

// Transition timings
export const transitions = {
  skyDuration: 2000,
  skySteps: 50,
  filterCss: 'filter 2s ease-in-out',
  celestialTransform: 'transform 3s ease-in-out',
  celestialOpacity: 'opacity 2s ease',
  celestialTranslateY: '140px',
  cardColors: 'duration-700',
  starsFade: 'opacity 1.5s ease',
} as const;

// Sky color sequences for day/night transitions
export const EVENING_COLORS = [palette.daySky, palette.sunsetWarm, colors.nord1, palette.nightSky];
export const MORNING_COLORS = [palette.nightSky, colors.nord1, palette.sunriseWarm, palette.daySky];
