import type { Component } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { useTheme } from '../../context/theme';
import { palette, transitions } from '../../theme';

export const CelestialBody: Component = () => {
  const { mode } = useTheme();
  const [initialized, setInitialized] = createSignal(false);

  onMount(() => setInitialized(true));

  // Rotation: 0deg = sun visible (day), 180deg = moon visible (night)
  const rotation = () => mode() === 'dark' ? 180 : 0;
  const celestialTransition = () => initialized()
    ? `${transitions.celestialTransform}, ${transitions.celestialOpacity}`
    : 'none';

  return (
    <div
      class="absolute pointer-events-none z-[2]"
      style={{
        top: '4%',
        right: '12%',
        width: '48px',
        height: '48px',
      }}
    >
      {/* Sun */}
      <div
        class="absolute inset-0 rounded-full"
        style={{
          'background-color': palette.sunColor,
          'box-shadow': `0 0 20px 8px ${palette.sunGlow}`,
          transform: `rotate(${rotation()}deg) translateY(${mode() === 'dark' ? transitions.celestialTranslateY : '0px'})`,
          opacity: mode() === 'dark' ? '0' : '1',
          transition: celestialTransition(),
        }}
      />
      {/* Moon */}
      <div
        class="absolute rounded-full"
        style={{
          width: '40px',
          height: '40px',
          left: '4px',
          top: '4px',
          'background-color': palette.moonColor,
          'box-shadow': `0 0 12px 4px ${palette.moonGlow}`,
          transform: `rotate(${rotation()}deg) translateY(${mode() === 'dark' ? '0px' : `-${transitions.celestialTranslateY}`})`,
          opacity: mode() === 'dark' ? '1' : '0',
          transition: celestialTransition(),
        }}
      />
    </div>
  );
};
