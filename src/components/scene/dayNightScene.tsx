import type { Component, JSX } from 'solid-js';
import { createSignal, createEffect, onMount, onCleanup } from 'solid-js';
import { useTheme } from '../../context/theme';
import { Stars } from './stars';

export const DayNightScene: Component<{ children: JSX.Element }> = (props) => {
  const { mode } = useTheme();
  const [skyColor, setSkyColor] = createSignal('#eceff4');
  const [svgFilter, setSvgFilter] = createSignal('none');
  const [initialized, setInitialized] = createSignal(false);

  onMount(() => {
    if (mode() === 'dark') {
      setSkyColor('#2e3440');
      setSvgFilter('brightness(0.5) hue-rotate(20deg) saturate(0.7)');
    }
    setInitialized(true);
  });

  createEffect(() => {
    const current = mode();
    if (!initialized()) return;

    const toNight = current === 'dark';

    const duration = 2500;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const eveningColors = ['#eceff4', '#e8c47c', '#d4956a', '#bf616a', '#a3546d', '#3b4252', '#2e3440'];
    const morningColors = ['#2e3440', '#434c5e', '#bf616a', '#d08770', '#ebcb8b', '#eceff4'];

    const eveningFilters = [
      'none',
      'sepia(0.3) brightness(0.9)',
      'sepia(0.2) brightness(0.7) hue-rotate(10deg)',
      'brightness(0.5) hue-rotate(20deg) saturate(0.7)',
    ];

    const morningFilters = [
      'brightness(0.5) hue-rotate(20deg) saturate(0.7)',
      'sepia(0.2) brightness(0.8)',
      'sepia(0.1) brightness(0.9)',
      'none',
    ];

    const colors = toNight ? eveningColors : morningColors;
    const filters = toNight ? eveningFilters : morningFilters;

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

      // Step through SVG filters
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
