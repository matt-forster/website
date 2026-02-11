import type { Component } from 'solid-js';
import { useTheme } from '../../context/theme';

export const CelestialBody: Component = () => {
  const { mode } = useTheme();

  return (
    <div
      class="absolute pointer-events-none z-[2]"
      style={{
        top: '8%',
        right: '12%',
      }}
    >
      {/* Sun */}
      <div
        class="rounded-full"
        style={{
          width: '48px',
          height: '48px',
          'background-color': mode() === 'dark' ? '#d8dee9' : '#ebcb8b',
          'box-shadow': mode() === 'dark'
            ? '0 0 12px 4px rgba(216, 222, 233, 0.3)'
            : '0 0 20px 8px rgba(235, 203, 139, 0.4)',
          opacity: '1',
          transition: 'background-color 2s ease, box-shadow 2s ease',
        }}
      />
    </div>
  );
};
