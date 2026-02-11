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
      // ~25% chance every 10 seconds
      if (Math.random() > 0.25) return;

      const pass: SatellitePass = {
        id: satelliteId++,
        y: 8 + Math.random() * 35,
        duration: 25 + Math.random() * 15,
        direction: Math.random() > 0.5 ? 'ltr' : 'rtl',
      };
      setSatellite(pass);

      setTimeout(() => {
        setSatellite((prev) => (prev?.id === pass.id ? null : prev));
      }, pass.duration * 1000);
    };

    const interval = setInterval(trySpawn, 10000);
    onCleanup(() => clearInterval(interval));
  });

  return (
    <Show when={satellite()}>
      {(sat) => (
        <div
          class="absolute rounded-full pointer-events-none"
          style={{
            top: `${sat().y}%`,
            width: '2.5px',
            height: '2.5px',
            background: '#fffaf0',
            'box-shadow': '0 0 4px 2px rgba(255, 248, 230, 0.7), 0 0 8px 3px rgba(235, 203, 139, 0.3)',
            animation: `satellite-pass-${sat().direction} ${sat().duration}s linear forwards, satellite-glint 3s ease-in-out infinite`,
          }}
        />
      )}
    </Show>
  );
};
