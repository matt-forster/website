import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';

import { ParallaxMountainScene } from './components'

const Container = styled('div')`
  min-height: 100vh;
`

const App: Component = () => {

  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });

  function handleMouseMove(event: MouseEvent) {
    setMousePosition({
      x: event.clientX,
      y: event.clientY
    })
  }

  return (
    <Container onMouseMove={handleMouseMove}>
      global mouse position: x: {mousePosition().x}, y: {mousePosition().y}
      <ParallaxMountainScene position={mousePosition()} />
    </Container>
  );
};


export default App
