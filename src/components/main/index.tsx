import type { Component } from 'solid-js';

import { createSignal } from 'solid-js';
import { Card, ParallaxMountainScene } from '..'

export const Main: Component = () => {

  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });

  function handleMouseMove(event: MouseEvent) {
    setMousePosition({
      x: event.clientX,
      y: event.clientY
    })
  }

  return (
    <div class="bg-[#eceff4] min-h-screen min-w-screen w-100 max-w-none" onMouseMove={handleMouseMove}>
      <Card />
      <ParallaxMountainScene position={mousePosition()} />
    </div>
  )
}
