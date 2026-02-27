import type { Component } from 'solid-js';

import { createSignal, createEffect, onMount, onCleanup } from 'solid-js';
import { ParallaxMountainScene } from './parallaxMountains';
import { Card } from './card';
import { DayNightScene } from './scene/dayNightScene';
import { Birds } from './scene/birds';
import { useDeviceOrientation } from '../hooks/useDeviceOrientation';

export const Main: Component = () => {

  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });
  
  // Use device orientation for mobile tilt-based parallax
  const { position: devicePosition, isActive: deviceOrientationActive } = useDeviceOrientation();

  // Document-level mouse tracking so the content layer can be pointer-events-none
  // (allows celestial body clicks to pass through the mountain overlay)
  onMount(() => {
    const handler = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    document.addEventListener('mousemove', handler);
    onCleanup(() => document.removeEventListener('mousemove', handler));
  });

  // Merge device orientation with mouse position
  // Device orientation takes precedence when active
  createEffect(() => {
    if (deviceOrientationActive()) {
      setMousePosition(devicePosition());
    }
  });

  return (
    <DayNightScene>
      <div class="min-h-[100svh]">
        <Card />
        <Birds />
        <ParallaxMountainScene position={mousePosition()} />
      </div>
    </DayNightScene>
  )
}
