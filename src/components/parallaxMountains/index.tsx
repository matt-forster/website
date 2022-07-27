import type { Component } from 'solid-js';

import mountainForegroundSvg from './MountainForeground.svg';
import mountainBackgroundSvg from './MountainBackground.svg';
import cloudOne from './CloudOne.svg';
import cloudTwo from './CloudTwo.svg';
import cloudThree from './CloudThree.svg';
import cloudFour from './CloudFour.svg';

export const ParallaxMountainScene: Component<{ position: { x: number, y: number } }> = (props) => {

  // Learning: make sure to access props in a tracking context
  const setBackgroundTranslate = (xSpeed: number, ySpeed: number = 0) => `
    ${(window.innerWidth - props.position.x) / window.innerWidth * xSpeed * 6}px ${(window.innerHeight - props.position.y) / window.innerHeight * ySpeed * 6}px;
  `;

  return (
      <div class = "absolute inline-block right-0 bottom-0  w-screen h-[500px] z-0">

        <img class = "absolute bottom-0 -left-10 h-[1000px] max-w-none" 
             style = {`translate: ${setBackgroundTranslate(3)}`} 
             id = "background" 
             src = {mountainBackgroundSvg}  
             alt = 'Mountain Background' />

        <img class = "absolute bottom-[175px] left-[50px] h-[100px] max-w-none" 
             style={`translate: ${setBackgroundTranslate(7)}`} 
             id = "foreground" 
             src = {cloudThree}  
             alt = 'Cloud Three' />

          <img class = "absolute bottom-[250px] left-[750px] h-[100px] max-w-none" 
             style={`translate: ${setBackgroundTranslate(27)}`} 
             id = "foreground" 
             src = {cloudTwo}  
             alt = 'Cloud Two' />

        <img class = "absolute bottom-0 left-0 h-[1000px] max-w-none" 
             style={`translate: ${setBackgroundTranslate(1)}`} 
             id = "foreground" 
             src = {mountainForegroundSvg}  
             alt = 'Mountain Foreground' />

        <img class = "absolute bottom-[300px] left-[450px] h-[100px] max-w-none" 
             style={`translate: ${setBackgroundTranslate(13)}`} 
             id = "foreground" 
             src = {cloudOne}  
             alt = 'Cloud One' />

        <img class = "absolute bottom-[200px] left-[1100px] h-[100px] max-w-none" 
             style={`translate: ${setBackgroundTranslate(20)}`} 
             id = "foreground" 
             src = {cloudFour}  
             alt = 'Cloud Four' />

      </div>
  )
}
