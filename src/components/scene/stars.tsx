import type { Component } from 'solid-js';
import { createSignal, onMount, onCleanup, For } from 'solid-js';
import { transitions } from '../../theme';
import { Satellite } from './satellite';

interface Star {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  duration: number;
}

function generateStars(count: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * 100,
      y: Math.random() * 60,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
    });
  }
  return stars;
}

const stars = generateStars(80);

let shootingStarId = 0;

export const Stars: Component<{ visible: boolean }> = (props) => {
  return (
    <div
      class="absolute inset-0 pointer-events-none z-[-1]"
      style={{
        opacity: props.visible ? '1' : '0',
        transition: transitions.starsFade,
      }}
    >
      <For each={stars}>
        {(star) => (
          <div
            class="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            }}
          />
        )}
      </For>
      <ShootingStars visible={props.visible} />
      <Satellite visible={props.visible} />
    </div>
  );
};

const ShootingStars: Component<{ visible: boolean }> = (props) => {
  const [shootingStars, setShootingStars] = createSignal<ShootingStar[]>([]);

  onMount(() => {
    const interval = setInterval(() => {
      if (!props.visible) return;
      // 30% chance to spawn
      if (Math.random() > 0.3) return;

      const star: ShootingStar = {
        id: shootingStarId++,
        x: 10 + Math.random() * 70,
        y: 5 + Math.random() * 30,
        duration: 0.5 + Math.random() * 0.5,
      };
      setShootingStars((prev) => [...prev, star]);

      setTimeout(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== star.id));
      }, star.duration * 1000);
    }, 2000);

    onCleanup(() => clearInterval(interval));
  });

  return (
    <For each={shootingStars()}>
      {(star) => (
        <div
          class="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: '2px',
            height: '2px',
            'box-shadow': '0 0 4px 1px rgba(255, 255, 255, 0.8)',
            animation: `shooting-star ${star.duration}s linear forwards`,
          }}
        />
      )}
    </For>
  );
};
