import type { Component } from 'solid-js';

import { createSignal } from 'solid-js';
import { ParallaxMountainScene } from './parallaxMountains';
import { Card } from './card';
import { DayNightScene } from './scene/dayNightScene';
import { ThemeToggle } from './scene/themeToggle';

export const Main: Component = () => {

  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });

  function handleMouseMove(event: MouseEvent) {
    setMousePosition({
      x: event.clientX,
      y: event.clientY
    })
  }

  return (
    <DayNightScene>
      <div class="min-h-screen" onMouseMove={handleMouseMove}>
        <Card />
        <ParallaxMountainScene position={mousePosition()} />
        <ThemeToggle />
      </div>
    </DayNightScene>
  )
}
