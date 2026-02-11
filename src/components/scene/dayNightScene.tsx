import type { Component, JSX } from 'solid-js';
import { createSignal, createEffect, onMount, onCleanup } from 'solid-js';
import { useTheme } from '../../context/theme';
import { Stars } from './stars';
import { CelestialBody } from './celestialBody';

const EVENING_COLORS = ['#eceff4', '#d4956a', '#3b4252', '#2e3440'];
const MORNING_COLORS = ['#2e3440', '#3b4252', '#d08770', '#eceff4'];

const EVENING_FILTERS = [
  'none',
  'sepia(0.2) brightness(0.8)',
  'brightness(0.5) hue-rotate(20deg) saturate(0.7)',
];

const MORNING_FILTERS = [
  'brightness(0.5) hue-rotate(20deg) saturate(0.7)',
  'sepia(0.1) brightness(0.9)',
  'none',
];

export const DayNightScene: Component<{ children: JSX.Element }> = (props) => {
  const { mode } = useTheme();
  const [skyColor, setSkyColor] = createSignal('#eceff4');
  const [svgFilter, setSvgFilter] = createSignal('none');
  const [initialized, setInitialized] = createSignal(false);
  // Track the last mode we've applied so the effect only runs on actual changes
  let lastAppliedMode: string | null = null;

  onMount(() => {
    const current = mode();
    if (current === 'dark') {
      setSkyColor('#2e3440');
      setSvgFilter('brightness(0.5) hue-rotate(20deg) saturate(0.7)');
    }
    lastAppliedMode = current;
    setInitialized(true);
  });

  createEffect(() => {
    const current = mode();
    if (!initialized()) return;
    // Skip if this is the same mode we already applied (e.g. on initial mount)
    if (current === lastAppliedMode) return;
    lastAppliedMode = current;

    const toNight = current === 'dark';

    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;
    let step = 0;

    const colors = toNight ? EVENING_COLORS : MORNING_COLORS;
    const filters = toNight ? EVENING_FILTERS : MORNING_FILTERS;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Interpolate sky color through warm phases
      const colorIndex = Math.min(Math.floor(eased * (colors.length - 1)), colors.length - 2);
      const colorProgress = (eased * (colors.length - 1)) - colorIndex;
      setSkyColor(interpolateColor(colors[colorIndex], colors[colorIndex + 1], colorProgress));

      // Interpolate SVG filters smoothly
      const filterIndex = Math.min(Math.floor(eased * (filters.length - 1)), filters.length - 2);
      setSvgFilter(eased < 0.5 ? filters[filterIndex] : filters[filterIndex + 1]);

      if (step >= steps) {
        clearInterval(timer);
        setSkyColor(toNight ? '#2e3440' : '#eceff4');
        setSvgFilter(toNight ? 'brightness(0.5) hue-rotate(20deg) saturate(0.7)' : 'none');
      }
    }, interval);

    onCleanup(() => clearInterval(timer));
  });

  return (
    <div
      class="relative min-h-screen min-w-screen w-100 max-w-none overflow-hidden"
      style={{ 'background-color': skyColor() }}
    >
      <Stars visible={mode() === 'dark'} />
      <CelestialBody />
      <div style={{ filter: svgFilter() }}>
        {props.children}
      </div>
    </div>
  );
};

function interpolateColor(color1: string, color2: string, t: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
