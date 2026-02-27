import type { Component } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { useTheme } from '../../context/theme';
import { palette, transitions } from '../../theme';

const SUN_SIZE = 48;
const MOON_SIZE = 40;
const BODY_CENTER = SUN_SIZE / 2;
const MOON_INSET = (SUN_SIZE - MOON_SIZE) / 2;
// Orbit radius in vh — controls the arc from sky to horizon.
// Pivot at 36 % from top ± 30 vh gives: sun ≈ 6 %, moon ≈ 66 %.
const ORBIT_VH = 30;

export const CelestialBody: Component = () => {
  const { mode, toggle } = useTheme();
  const [initialized, setInitialized] = createSignal(false);
  const [totalRotation, setTotalRotation] = createSignal(0);

  onMount(() => {
    if (mode() === 'dark') setTotalRotation(180);
    setInitialized(true);
  });

  const handleToggle = () => {
    setTotalRotation((r) => r + 180);
    toggle();
  };

  const orbitTransition = () => initialized()
    ? transitions.celestialTransform
    : 'none';

  const bodyTransition = () => initialized()
    ? `${transitions.celestialTransform}, ${transitions.celestialOpacity}`
    : 'none';

  const buttonClass = `cursor-pointer border-none bg-transparent p-0
    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
    focus-visible:outline-sky-400/70 rounded-full`;

  return (
    <div
      class="absolute z-[1] pointer-events-none"
      style={{
        // Pivot point of the orbit — positioned at the horizon line.
        // Sun = pivot − ORBIT_VH ≈ 6 % from top; Moon = pivot + ORBIT_VH ≈ 66 %.
        top: `calc(36% - ${BODY_CENTER}px)`,
        right: `calc(12% - ${BODY_CENTER}px)`,
        width: `${SUN_SIZE}px`,
        height: `${SUN_SIZE}px`,
      }}
    >
      {/* Orbit track — always rotates clockwise so bodies arc east→west */}
      <div
        class="absolute"
        style={{
          left: '0',
          top: '0',
          width: `${SUN_SIZE}px`,
          height: `${SUN_SIZE}px`,
          'transform-origin': 'center center',
          transform: `rotate(${totalRotation()}deg)`,
          transition: orbitTransition(),
        }}
      >
        {/* Sun — top of orbit (high in sky during day) */}
        <button
          onClick={handleToggle}
          aria-label="Switch to dark mode"
          class={`absolute ${buttonClass}`}
          style={{
            left: '0',
            top: `calc(-${ORBIT_VH}vh)`,
            width: `${SUN_SIZE}px`,
            height: `${SUN_SIZE}px`,
            transform: `rotate(-${totalRotation()}deg)`,
            opacity: mode() === 'dark' ? '0' : '1',
            'pointer-events': mode() === 'dark' ? 'none' : 'auto',
            transition: bodyTransition(),
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
        </button>
        {/* Moon — bottom of orbit (below horizon, diametrically opposite sun) */}
        <button
          onClick={handleToggle}
          aria-label="Switch to light mode"
          class={`absolute ${buttonClass}`}
          style={{
            left: `${MOON_INSET}px`,
            top: `calc(${ORBIT_VH}vh + ${MOON_INSET}px)`,
            width: `${MOON_SIZE}px`,
            height: `${MOON_SIZE}px`,
            transform: `rotate(-${totalRotation()}deg)`,
            opacity: mode() === 'dark' ? '1' : '0',
            'pointer-events': mode() === 'dark' ? 'auto' : 'none',
            transition: bodyTransition(),
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
        </button>
      </div>
    </div>
  );
};
