import type { Component, JSX } from 'solid-js';
import { createSignal, createEffect, onMount, onCleanup } from 'solid-js';
import { useTheme } from '../../context/theme';
import { Stars } from './stars';
import { CelestialBody } from './celestialBody';

const EVENING_COLORS = ['#eceff4', '#d4956a', '#3b4252', '#2e3440'];
const MORNING_COLORS = ['#2e3440', '#3b4252', '#d08770', '#eceff4'];
const NIGHT_FILTER = 'brightness(0.5) hue-rotate(20deg) saturate(0.7)';

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
      setSvgFilter(NIGHT_FILTER);
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

    // Set the SVG filter target immediately — CSS transition handles the smooth interpolation
    setSvgFilter(toNight ? NIGHT_FILTER : 'none');

    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;
    let step = 0;

    const colors = toNight ? EVENING_COLORS : MORNING_COLORS;

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

      if (step >= steps) {
        clearInterval(timer);
        setSkyColor(toNight ? '#2e3440' : '#eceff4');
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
      <div style={{
        filter: svgFilter(),
        transition: initialized() ? 'filter 2s ease-in-out' : 'none',
      }}>
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
