import type { Component } from 'solid-js';
import { createSignal, onMount, onCleanup, Show } from 'solid-js';

interface SatellitePass {
  id: number;
  y: number;
  duration: number;
  direction: 'ltr' | 'rtl';
}

let satelliteId = 0;

export const Satellite: Component<{ visible: boolean }> = (props) => {
  const [satellite, setSatellite] = createSignal<SatellitePass | null>(null);

  onMount(() => {
    const trySpawn = () => {
      if (!props.visible || satellite()) return;
      // ~10% chance every 15 seconds — very rare
      if (Math.random() > 0.1) return;

      const pass: SatellitePass = {
        id: satelliteId++,
        y: 8 + Math.random() * 35,
        duration: 15 + Math.random() * 10,
        direction: Math.random() > 0.5 ? 'ltr' : 'rtl',
      };
      setSatellite(pass);

      setTimeout(() => {
        setSatellite((prev) => (prev?.id === pass.id ? null : prev));
      }, pass.duration * 1000);
    };

    const interval = setInterval(trySpawn, 15000);
    onCleanup(() => clearInterval(interval));
  });

  return (
    <Show when={satellite()}>
      {(sat) => (
        <div
          class="absolute rounded-full bg-white pointer-events-none"
          style={{
            top: `${sat().y}%`,
            width: '2px',
            height: '2px',
            opacity: '0.85',
            'box-shadow': '0 0 3px 1px rgba(255, 255, 255, 0.6)',
            animation: `satellite-pass-${sat().direction} ${sat().duration}s linear forwards`,
          }}
        />
      )}
    </Show>
  );
};
