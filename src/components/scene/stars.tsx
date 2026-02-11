import type { Component } from 'solid-js';
import { For } from 'solid-js';

interface Star {
  x: number;
  y: number;
  size: number;
  delay: number;
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

export const Stars: Component<{ visible: boolean }> = (props) => {
  return (
    <div
      class="absolute inset-0 pointer-events-none z-[1]"
      style={{
        opacity: props.visible ? '1' : '0',
        transition: 'opacity 1.5s ease',
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
    </div>
  );
};
