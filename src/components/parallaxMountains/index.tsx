import type { Component } from 'solid-js';
import { createSignal, onMount, createEffect, For } from 'solid-js';

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
let rocksSvg = '';
let rockSmallSvg = '';
let grassTuftSvg = '';
let wildflowersSvg = '';
let shrubSvg = '';
let dandelionSvg = '';

type GroundElement = {
  src: () => string;
  left: number;
  height: number;
};

// Seed-based pseudo-random for consistent layout across renders
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateGroundElements(): GroundElement[] {
  const rand = seededRandom(7331);
  const elements: GroundElement[] = [];

  // Helper: generate a left position biased toward the left (0–1200px range most likely)
  const biasedLeft = () => Math.floor(rand() * rand() * 1400) + 100;

  // Rocks cluster (1–2)
  const rockCount = rand() > 0.5 ? 2 : 1;
  for (let i = 0; i < rockCount; i++) {
    elements.push({ src: () => rocksSvg, left: biasedLeft(), height: 24 + Math.floor(rand() * 8) });
  }

  // Small rocks (1–3)
  const smallRockCount = 1 + Math.floor(rand() * 3);
  for (let i = 0; i < smallRockCount; i++) {
    elements.push({ src: () => rockSmallSvg, left: biasedLeft(), height: 16 + Math.floor(rand() * 8) });
  }

  // Grass tufts (2–4)
  const grassCount = 2 + Math.floor(rand() * 3);
  for (let i = 0; i < grassCount; i++) {
    elements.push({ src: () => grassTuftSvg, left: biasedLeft(), height: 16 + Math.floor(rand() * 8) });
  }

  // Wildflowers (1–3)
  const flowerCount = 1 + Math.floor(rand() * 3);
  for (let i = 0; i < flowerCount; i++) {
    elements.push({ src: () => wildflowersSvg, left: biasedLeft(), height: 30 + Math.floor(rand() * 12) });
  }

  // Wild rose bushes (1–2)
  const shrubCount = 1 + Math.floor(rand() * 2);
  for (let i = 0; i < shrubCount; i++) {
    elements.push({ src: () => shrubSvg, left: biasedLeft(), height: 28 + Math.floor(rand() * 8) });
  }

  // Dandelions (4–8) — extracted from grass layer for independent parallax
  const dandelionCount = 4 + Math.floor(rand() * 5);
  for (let i = 0; i < dandelionCount; i++) {
    elements.push({ src: () => dandelionSvg, left: biasedLeft(), height: 40 + Math.floor(rand() * 16) });
  }

  return elements;
}

export const ParallaxMountainScene: Component<{ position: { x: number, y: number } }> = (props) => {
  // Initialize with default values that work on both server and client
  const [windowSize, setWindowSize] = createSignal({ width: 1024, height: 768 });
  const [translateValues, setTranslateValues] = createSignal<Record<string, string>>({});
  const [assetsLoaded, setAssetsLoaded] = createSignal(false);
  const [groundElements, setGroundElements] = createSignal<GroundElement[]>([]);
  
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
    rocksSvg = (await import('./rocks.svg')).default;
    rockSmallSvg = (await import('./rockSmall.svg')).default;
    grassTuftSvg = (await import('./grassTuft.svg')).default;
    wildflowersSvg = (await import('./wildflowers.svg')).default;
    shrubSvg = (await import('./shrub.svg')).default;
    dandelionSvg = (await import('./dandelion.svg')).default;
    
    setGroundElements(generateGroundElements());
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
      // Ground-level vegetation uses a single shared parallax speed
      ground: calculateTranslate(0.15, 0.05),
    });
  });

  const style = `
    absolute
    inline-block
    right-0
    bottom-0
    w-full
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

          {/* Ground-level vegetation — rendered after grass so they appear in front */}
          <For each={groundElements()}>{(el) =>
            <img class="absolute bottom-[2px] max-w-none"
              style={`left: ${el.left}px; height: ${el.height}px; translate: ${translateValues().ground}`}
              src={el.src()}
              alt='' />
          }</For>
        </>
      )}
    </div>
  )
}
