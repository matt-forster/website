import type { Component } from 'solid-js';

import mountainForegroundSvg from './mountainForeground.svg';
import mountainBackgroundSvg from './mountainBackground.svg';
import grass from './grass.svg';
import cloudOne from './cloudOne.svg';
import cloudTwo from './cloudTwo.svg';
import cloudThree from './cloudThree.svg';
import cloudFour from './cloudFour.svg';
import cloudFive from './cloudFive.svg';
import cloudSix from './cloudSix.svg';

export const ParallaxMountainScene: Component<{ position: { x: number, y: number } }> = (props) => {

  // Learning: make sure to access props in a tracking context
  const setBackgroundTranslate = (xSpeed: number = 0, ySpeed: number = 0) => {
    const mx = 6;
    const xPosition = (window.innerWidth - props.position.x) / window.innerWidth * xSpeed * mx;
    const yPosition = (window.innerHeight - props.position.y) / window.innerHeight * ySpeed * mx;
    return `${xPosition}px ${yPosition}px;`;
  }

  const style = `
    absolute
    inline-block
    right-0
    bottom-0
    w-screen
    min-w-screen
    h-[500px]
    z-0
    overflow-hidden
  `;

  return (
    <div class={style}>

      <img class="absolute -bottom-6 -left-24 h-[1100px] max-w-none"
        style={`translate: ${setBackgroundTranslate(3)}`}
        id="background"
        src={mountainBackgroundSvg}
        alt='Mountain Background' />

      <img class="absolute bottom-[350px] left-[1500px] h-[100px] max-w-none"
        style={`translate: ${setBackgroundTranslate(10, 1)}`}
        id="foreground"
        src={cloudFive}
        alt='Cloud Five' />

      <img class="absolute bottom-[300px] left-[1100px] h-[100px] max-w-none"
        style={`translate: ${setBackgroundTranslate(20, 0.5)}`}
        id="foreground"
        src={cloudFour}
        alt='Cloud Four' />

      <img class="absolute bottom-[250px] left-[50px] h-[100px] max-w-none"
        style={`translate: ${setBackgroundTranslate(7, 1)}`}
        id="foreground"
        src={cloudThree}
        alt='Cloud Three' />

      <img class="absolute bottom-0 -left-12 h-[1100px] max-w-none"
        style={`translate: ${setBackgroundTranslate(1)}`}
        id="foreground"
        src={mountainForegroundSvg}
        alt='Mountain Foreground' />

      <img class="absolute bottom-[250px] left-[1900px] h-[100px] max-w-none"
        style={`translate: ${setBackgroundTranslate(7, 3)}`}
        id="foreground"
        src={cloudSix}
        alt='Cloud Six' />

      <img class="absolute bottom-[350px] left-[750px] h-[100px] max-w-none"
        style={`translate: ${setBackgroundTranslate(27, 2)}`}
        id="foreground"
        src={cloudTwo}
        alt='Cloud Two' />

      <img class="absolute bottom-[400px] left-[450px] h-[100px] max-w-none"
        style={`translate: ${setBackgroundTranslate(13, 3)}`}
        id="foreground"
        src={cloudOne}
        alt='Cloud One' />

      <img class="absolute bottom-0 -left-12 h-[750px] max-w-none"
        style={`translate: ${setBackgroundTranslate()}`}
        id="foreground"
        src={grass}
        alt='Grass' />

    </div>
  )
}
