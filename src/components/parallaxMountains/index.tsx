import type { Component } from 'solid-js';

import mountainForegroundSvg from './MountainForeground.svg';
import mountainBackgroundSvg from './MountainBackground.svg';

export const ParallaxMountainScene: Component<{ position: { x: number, y: number } }> = (props) => {

  // Learning: make sure to access props in a tracking context
  const setBackgroundTranslate = (xSpeed: number, ySpeed: number = 0) => `
    ${(window.innerWidth - props.position.x) / window.innerWidth * xSpeed * 6}px ${(window.innerHeight - props.position.y) / window.innerHeight * ySpeed * 6}px;
  `;

  return (
      <div class = "absolute inline-block right-0 bottom-0  w-screen h-[500px] z-0">
        <img class = "absolute bottom-0 left-0 h-[1000px] max-w-none z-0" 
             style = {`translate: ${setBackgroundTranslate(3)}`} 
             id = "background" 
             src = {mountainBackgroundSvg}  
             alt = 'Mountain Background' />
        <img class = "absolute bottom-0 left-0 h-[1000px] max-w-none z-0" 
             style={`translate: ${setBackgroundTranslate(1)}`} 
             id = "foreground" 
             src = {mountainForegroundSvg}  
             alt = 'Mountain Foreground' />
      </div>
  )
}


// class={setBackgroundTranslate(0.5)}
