import type { Component } from 'solid-js';

import { createSignal, createEffect } from 'solid-js';
import { ParallaxMountainScene } from './parallaxMountains';
import { Card } from './card';
import { DayNightScene } from './scene/dayNightScene';
import { Birds } from './scene/birds';
import { useDeviceOrientation } from '../hooks/useDeviceOrientation';

export const Main: Component = () => {

  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });
  
  // Use device orientation for mobile tilt-based parallax
  const { position: devicePosition } = useDeviceOrientation();

  function handleMouseMove(event: MouseEvent) {
    setMousePosition({
      x: event.clientX,
      y: event.clientY
    })
  }

  // Merge device orientation with mouse position
  // Device orientation takes precedence when available (non-zero values)
  createEffect(() => {
    const devPos = devicePosition();
    if (devPos.x !== 0 || devPos.y !== 0) {
      setMousePosition(devPos);
    }
  });

  return (
    <DayNightScene>
      <div class="min-h-[100svh]" onMouseMove={handleMouseMove}>
        <Card />
        <Birds />
        <ParallaxMountainScene position={mousePosition()} />
      </div>
    </DayNightScene>
  )
}
