import type { Component } from 'solid-js';
import { createSignal, onMount, createEffect } from 'solid-js';

// Declare the SVG imports to handle them carefully for SSR
let mountainForegroundSvg = '';
let mountainBackgroundSvg = '';
let grass = '';
let cloudOne = '';
let cloudTwo = '';
let cloudThree = '';
let cloudFour = '';
let cloudFive = '';
let cloudSix = '';
let pineSmallSvg = '';
let pineLargeSvg = '';
let deciduousOneSvg = '';
let bushOneSvg = '';
let bushTwoSvg = '';
let rocksSvg = '';

export const ParallaxMountainScene: Component<{ position: { x: number, y: number } }> = (props) => {
  // Initialize with default values that work on both server and client
  const [windowSize, setWindowSize] = createSignal({ width: 1024, height: 768 });
  const [translateValues, setTranslateValues] = createSignal<Record<string, string>>({});
  const [assetsLoaded, setAssetsLoaded] = createSignal(false);
  
  // Load all assets only on the client side
  onMount(async () => {
    // Dynamically import SVGs only on client side
    mountainForegroundSvg = (await import('./mountainForeground.svg')).default;
    mountainBackgroundSvg = (await import('./mountainBackground.svg')).default;
    grass = (await import('./grass.svg')).default;
    cloudOne = (await import('./cloudOne.svg')).default;
    cloudTwo = (await import('./cloudTwo.svg')).default;
    cloudThree = (await import('./cloudThree.svg')).default;
    cloudFour = (await import('./cloudFour.svg')).default;
    cloudFive = (await import('./cloudFive.svg')).default;
    cloudSix = (await import('./cloudSix.svg')).default;
    pineSmallSvg = (await import('./pineSmall.svg')).default;
    pineLargeSvg = (await import('./pineLarge.svg')).default;
    deciduousOneSvg = (await import('./deciduousOne.svg')).default;
    bushOneSvg = (await import('./bushOne.svg')).default;
    bushTwoSvg = (await import('./bushTwo.svg')).default;
    rocksSvg = (await import('./rocks.svg')).default;
    
    setAssetsLoaded(true);
    
    // Set window size after mounting
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });
  
  // Calculate translations based on mouse position and window size
  const calculateTranslate = (xSpeed: number = 0, ySpeed: number = 0) => {
    const mx = 6;
    const xPosition = (windowSize().width - props.position.x) / windowSize().width * xSpeed * mx;
    const yPosition = (windowSize().height - props.position.y) / windowSize().height * ySpeed * mx;
    return `${xPosition}px ${yPosition}px;`;
  }

  // Update all translation values whenever position or window size changes
  createEffect(() => {
    setTranslateValues({
      background: calculateTranslate(3),
      cloudFive: calculateTranslate(10, 1),
      cloudFour: calculateTranslate(20, 0.5),
      cloudThree: calculateTranslate(7, 1),
      foreground: calculateTranslate(1),
      cloudSix: calculateTranslate(7, 3),
      cloudTwo: calculateTranslate(27, 2),
      cloudOne: calculateTranslate(13, 3),
      grass: calculateTranslate(),
      // Vegetation layers — background (slow), mid-ground (moderate), foreground (faster)
      pineBack: calculateTranslate(2, 0.5),
      pineFore: calculateTranslate(0.8, 0.3),
      deciduous: calculateTranslate(0.6, 0.2),
      bushOne: calculateTranslate(0.4, 0.1),
      bushTwo: calculateTranslate(0.5, 0.2),
      rocks: calculateTranslate(0.3, 0.1),
    });
  });

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
      {assetsLoaded() && (
        <>
          <img class="absolute -bottom-6 -left-24 h-[1100px] max-w-none"
            style={`translate: ${translateValues().background}`}
            id="background"
            src={mountainBackgroundSvg}
            alt='Mountain Background' />

          <img class="absolute bottom-[350px] left-[1500px] h-[100px] max-w-none"
            style={`translate: ${translateValues().cloudFive} animation: cloud-drift 30s ease-in-out infinite;`}
            src={cloudFive}
            alt='Cloud Five' />

          <img class="absolute bottom-[300px] left-[1100px] h-[100px] max-w-none"
            style={`translate: ${translateValues().cloudFour} animation: cloud-drift 38s ease-in-out 5s infinite;`}
            src={cloudFour}
            alt='Cloud Four' />

          <img class="absolute bottom-[250px] left-[50px] h-[100px] max-w-none"
            style={`translate: ${translateValues().cloudThree} animation: cloud-drift 34s ease-in-out 2s infinite;`}
            src={cloudThree}
            alt='Cloud Three' />

          <img class="absolute bottom-0 -left-12 h-[1100px] max-w-none"
            style={`translate: ${translateValues().foreground}`}
            src={mountainForegroundSvg}
            alt='Mountain Foreground' />

          {/* Background vegetation — small pines on the distant hillside */}
          <img class="absolute bottom-[220px] left-[900px] h-[50px] max-w-none"
            style={`translate: ${translateValues().pineBack}`}
            src={pineSmallSvg}
            alt='' />
          <img class="absolute bottom-[240px] left-[1050px] h-[45px] max-w-none"
            style={`translate: ${translateValues().pineBack}`}
            src={pineSmallSvg}
            alt='' />
          <img class="absolute bottom-[230px] left-[1600px] h-[55px] max-w-none"
            style={`translate: ${translateValues().pineBack}`}
            src={pineLargeSvg}
            alt='' />

          {/* Mid-ground vegetation — trees between mountain layers */}
          <img class="absolute bottom-[120px] left-[1200px] h-[90px] max-w-none"
            style={`translate: ${translateValues().pineFore}`}
            src={pineLargeSvg}
            alt='' />
          <img class="absolute bottom-[110px] left-[1350px] h-[70px] max-w-none"
            style={`translate: ${translateValues().pineFore}`}
            src={pineSmallSvg}
            alt='' />
          <img class="absolute bottom-[105px] left-[1800px] h-[85px] max-w-none"
            style={`translate: ${translateValues().deciduous}`}
            src={deciduousOneSvg}
            alt='' />

          {/* Foreground vegetation — bushes, rocks near the grass */}
          <img class="absolute bottom-[55px] left-[800px] h-[35px] max-w-none"
            style={`translate: ${translateValues().bushOne}`}
            src={bushOneSvg}
            alt='' />
          <img class="absolute bottom-[50px] left-[1500px] h-[28px] max-w-none"
            style={`translate: ${translateValues().bushTwo}`}
            src={bushTwoSvg}
            alt='' />
          <img class="absolute bottom-[40px] left-[1100px] h-[32px] max-w-none"
            style={`translate: ${translateValues().rocks}`}
            src={rocksSvg}
            alt='' />

          <img class="absolute bottom-[250px] left-[1900px] h-[100px] max-w-none"
            style={`translate: ${translateValues().cloudSix} animation: cloud-drift 42s ease-in-out 8s infinite;`}
            src={cloudSix}
            alt='Cloud Six' />

          <img class="absolute bottom-[350px] left-[750px] h-[100px] max-w-none"
            style={`translate: ${translateValues().cloudTwo} animation: cloud-drift 26s ease-in-out 3s infinite;`}
            src={cloudTwo}
            alt='Cloud Two' />

          <img class="absolute bottom-[400px] left-[450px] h-[100px] max-w-none"
            style={`translate: ${translateValues().cloudOne} animation: cloud-drift 22s ease-in-out 6s infinite;`}
            src={cloudOne}
            alt='Cloud One' />

          <img class="absolute bottom-0 -left-12 h-[750px] max-w-none"
            style={`translate: ${translateValues().grass}`}
            src={grass}
            alt='Grass' />
        </>
      )}
    </div>
  )
}
