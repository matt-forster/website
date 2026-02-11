import type { Component } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { useTheme } from '../../context/theme';

export const CelestialBody: Component = () => {
  const { mode } = useTheme();
  const [initialized, setInitialized] = createSignal(false);

  onMount(() => setInitialized(true));

  // Rotation: 0deg = sun visible (day), 180deg = moon visible (night)
  const rotation = () => mode() === 'dark' ? 180 : 0;
  const transitionStyle = () => initialized() ? 'transform 2s ease-in-out' : 'none';

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
          'background-color': '#ebcb8b',
          'box-shadow': '0 0 20px 8px rgba(235, 203, 139, 0.4)',
          transform: `rotate(${rotation()}deg) translateY(${mode() === 'dark' ? '140px' : '0px'})`,
          opacity: mode() === 'dark' ? '0' : '1',
          transition: transitionStyle() === 'none' ? 'none' : 'transform 3s ease-in-out, opacity 2s ease',
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
          'background-color': '#d8dee9',
          'box-shadow': '0 0 12px 4px rgba(216, 222, 233, 0.3)',
          transform: `rotate(${rotation()}deg) translateY(${mode() === 'dark' ? '0px' : '-140px'})`,
          opacity: mode() === 'dark' ? '1' : '0',
          transition: transitionStyle() === 'none' ? 'none' : 'transform 3s ease-in-out, opacity 2s ease',
        }}
      />
    </div>
  );
};
