import type { Component } from 'solid-js';
import { Portal } from 'solid-js/web'
import { styled, css } from 'solid-styled-components';

import mountainForegroundSvg from './MountainForeground.svg';
import mountainBackgroundSvg from './MountainBackground.svg';

export const ParallaxMountainScene: Component<{ position: { x: number, y: number } }> = (props) => {
  const Container = styled('div')`
    position: absolute;
    right: 0;
    bottom: 0;
    
    display: inline-block;
    overflow: hidden;

    width: 100vw;
    height: 500px;
    
    img {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 1000px;
    }

    #background {
      z-index: 0;
    }

    #foreground {
      z-index: 1;
    }
  `

  // Learning: make sure to access props in a tracking context
  const setBackgroundTranslate = (speed: number) => css`
    translate: ${(window.innerWidth - props.position.x) / window.innerWidth * speed * 6}px;
  `;

  return (
    <Portal>
      <Container>
        <img id="foreground" src={mountainForegroundSvg} class={setBackgroundTranslate(1)} alt='Mountain Foreground' />
        <img id="background" src={mountainBackgroundSvg} class={setBackgroundTranslate(-6)} alt='Mountain Background' />
      </Container>
    </Portal>
  )
}
