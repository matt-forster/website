import type { Component } from 'solid-js';
import { createSignal, onMount, createEffect, For } from 'solid-js';
import { Deer } from '../scene/deer';

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
let treeDeciduousSvg = '';
let treePineSvg = '';
let tuftBushSvg = '';

type GroundElement = {
  src: () => string;
  left: number;
  height: number;
  isTree?: boolean;
  scale?: number;
  rotation?: number;
  flipX?: boolean;
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

  // Helper: generate a left position with mild left bias (spread across 200–1500px range)
  const biasedLeft = () => Math.floor(rand() * 1400) + 200;

  // Helper: wider spread for taller elements like trees (250–1600px range, avoids left edge cutoff)
  const spreadLeft = () => Math.floor(rand() * 1400) + 250;

  // Helper: guarantee near-left placement for mobile visibility (20–300px range)
  const nearLeft = () => Math.floor(rand() * 280) + 20;

  // Rocks cluster (1–2) — first one placed left for mobile visibility
  const rockCount = rand() > 0.5 ? 2 : 1;
  for (let i = 0; i < rockCount; i++) {
    elements.push({ src: () => rocksSvg, left: i === 0 ? nearLeft() : biasedLeft(), height: 24 + Math.floor(rand() * 8) });
  }

  // Small rocks (1–3) — first one placed left for mobile visibility
  const smallRockCount = 1 + Math.floor(rand() * 3);
  for (let i = 0; i < smallRockCount; i++) {
    elements.push({ src: () => rockSmallSvg, left: i === 0 ? nearLeft() : biasedLeft(), height: 16 + Math.floor(rand() * 8) });
  }

  // Grass tufts (5–8) — first one placed left for mobile visibility
  const grassCount = 5 + Math.floor(rand() * 4);
  for (let i = 0; i < grassCount; i++) {
    elements.push({ src: () => grassTuftSvg, left: i === 0 ? nearLeft() : biasedLeft(), height: 16 + Math.floor(rand() * 8) });
  }

  // Wildflowers (1–3) — first one placed left for mobile visibility
  const flowerCount = 1 + Math.floor(rand() * 3);
  for (let i = 0; i < flowerCount; i++) {
    elements.push({ src: () => wildflowersSvg, left: i === 0 ? nearLeft() : biasedLeft(), height: 30 + Math.floor(rand() * 12) });
  }

  // Wild rose bushes (1–2) — first one placed left for mobile visibility
  const shrubCount = 1 + Math.floor(rand() * 2);
  for (let i = 0; i < shrubCount; i++) {
    elements.push({ src: () => shrubSvg, left: i === 0 ? nearLeft() : biasedLeft(), height: 28 + Math.floor(rand() * 8) });
  }

  // Dandelions (4–8) — first one placed left for mobile visibility
  const dandelionCount = 4 + Math.floor(rand() * 5);
  for (let i = 0; i < dandelionCount; i++) {
    elements.push({ src: () => dandelionSvg, left: i === 0 ? nearLeft() : biasedLeft(), height: 40 + Math.floor(rand() * 16) });
  }

  // Deciduous trees (2–4) — first one placed left for mobile visibility
  const deciduousCount = 2 + Math.floor(rand() * 3);
  for (let i = 0; i < deciduousCount; i++) {
    elements.push({
      src: () => treeDeciduousSvg,
      left: i === 0 ? 60 + Math.floor(rand() * 120) : spreadLeft(),
      height: 120 + Math.floor(rand() * 40),
      isTree: true,
      scale: 0.85 + rand() * 0.3,
      rotation: (rand() - 0.5) * 6,
      flipX: rand() > 0.5,
    });
  }

  // Pine trees (2–3) — first one placed left for mobile visibility, offset from deciduous
  const pineCount = 2 + Math.floor(rand() * 2);
  for (let i = 0; i < pineCount; i++) {
    elements.push({
      src: () => treePineSvg,
      left: i === 0 ? 220 + Math.floor(rand() * 120) : spreadLeft(),
      height: 100 + Math.floor(rand() * 40),
      isTree: true,
      scale: 0.85 + rand() * 0.3,
      rotation: (rand() - 0.5) * 6,
      flipX: rand() > 0.5,
    });
  }

  // Tuft bushes (2–4) — first one placed left for mobile visibility
  const tuftBushCount = 2 + Math.floor(rand() * 3);
  for (let i = 0; i < tuftBushCount; i++) {
    elements.push({ src: () => tuftBushSvg, left: i === 0 ? nearLeft() : biasedLeft(), height: 22 + Math.floor(rand() * 10) });
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
    treeDeciduousSvg = (await import('./treeDeciduous.svg')).default;
    treePineSvg = (await import('./treePine.svg')).default;
    tuftBushSvg = (await import('./tuftBush.svg')).default;
    
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

          {/* Deer — appears occasionally, rendered before grass so it sits behind */}
          <Deer />
          
          {/* Trees — rendered before grass so they appear behind it */}
          <For each={groundElements().filter(el => el.isTree)}>{(el) =>
            <img class="absolute bottom-[2px] max-w-none"
              style={`left: ${el.left}px; height: ${el.height}px; translate: ${translateValues().ground}; transform-origin: bottom center; transform: scale(${el.scale ?? 1}) rotate(${el.rotation ?? 0}deg)${el.flipX ? ' scaleX(-1)' : ''};`}
              src={el.src()}
              alt='' />
          }</For>

          <img class="absolute bottom-0 -left-12 h-[750px] max-w-none"
            style={`translate: ${translateValues().grass}; transform-origin: bottom center; animation: grass-sway 8s ease-in-out infinite;`}
            src={grass}
            alt='Grass' />

          {/* Ground-level vegetation — rendered after grass so they appear in front */}
          <For each={groundElements().filter(el => !el.isTree)}>{(el) =>
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
