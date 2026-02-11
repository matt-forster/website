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
        class="absolute inset-0"
        style={{
          transform: `rotate(${rotation()}deg) translateY(${mode() === 'dark' ? transitions.celestialTranslateY : '0px'})`,
          opacity: mode() === 'dark' ? '0' : '1',
          transition: celestialTransition(),
        }}
      >
        <div
          class="absolute inset-0 rounded-full"
          style={{
            'box-shadow': `0 0 20px 8px ${palette.sunGlow}`,
            animation: 'celestial-pulse 4s ease-in-out infinite',
          }}
        />
        <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
          <circle cx="24" cy="24" r="22" fill={palette.sunColor} />
          {/* Hand-drawn texture lines */}
          <path d="M14 18 Q18 16 22 18" stroke={palette.sunTexture} stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.5" />
          <path d="M26 30 Q30 28 34 30" stroke={palette.sunTexture} stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.4" />
          <path d="M18 28 Q20 26 23 27" stroke={palette.sunTexture} stroke-width="1" stroke-linecap="round" fill="none" opacity="0.35" />
          <path d="M28 17 Q31 15 33 17" stroke={palette.sunTexture} stroke-width="1" stroke-linecap="round" fill="none" opacity="0.35" />
        </svg>
      </div>
      {/* Moon */}
      <div
        class="absolute"
        style={{
          width: '40px',
          height: '40px',
          left: '4px',
          top: '4px',
          transform: `rotate(${rotation()}deg) translateY(${mode() === 'dark' ? '0px' : `-${transitions.celestialTranslateY}`})`,
          opacity: mode() === 'dark' ? '1' : '0',
          transition: celestialTransition(),
        }}
      >
        <div
          class="absolute inset-0 rounded-full"
          style={{
            'box-shadow': `0 0 12px 4px ${palette.moonGlow}`,
            animation: 'celestial-pulse 5s ease-in-out infinite',
          }}
        />
        <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
          <circle cx="20" cy="20" r="18" fill={palette.moonColor} />
          {/* Hand-drawn craters */}
          <circle cx="14" cy="15" r="3" fill="none" stroke={palette.moonCrater} stroke-width="1.5" stroke-linecap="round" opacity="0.5" />
          <circle cx="24" cy="12" r="2" fill="none" stroke={palette.moonCrater} stroke-width="1" stroke-linecap="round" opacity="0.4" />
          <circle cx="22" cy="26" r="3.5" fill="none" stroke={palette.moonCrater} stroke-width="1.5" stroke-linecap="round" opacity="0.45" />
          <circle cx="12" cy="25" r="1.5" fill="none" stroke={palette.moonCrater} stroke-width="1" stroke-linecap="round" opacity="0.35" />
          <circle cx="28" cy="20" r="2" fill="none" stroke={palette.moonCrater} stroke-width="1" stroke-linecap="round" opacity="0.3" />
        </svg>
      </div>
    </div>
  );
};
