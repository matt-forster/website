import { createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import { ParallaxMountainScene } from '..'

export const Main = () => {
  const Container = styled('div')`
    min-height: 100vh;
  `

  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });
  function handleMouseMove(event: MouseEvent) {
    setMousePosition({
      x: event.clientX,
      y: event.clientY
    })
  }

  return (
    <Container onMouseMove={handleMouseMove}>
      <ParallaxMountainScene position={mousePosition()} />
    </Container>
  )
}
