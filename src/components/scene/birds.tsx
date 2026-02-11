import type { Component } from 'solid-js';
import { createSignal, onMount, onCleanup, For } from 'solid-js';
import { useTheme } from '../../context/theme';
import { palette } from '../../theme';

interface Bird {
  id: number;
  y: number;
  speed: number;
  size: number;
  flapSpeed: number;
}

let nextId = 0;

export const Birds: Component = () => {
  const { mode } = useTheme();
  const [birds, setBirds] = createSignal<Bird[]>([]);

  onMount(() => {
    const spawn = () => {
      if (mode() === 'dark') return;
      const bird: Bird = {
        id: nextId++,
        y: 40 + Math.random() * 25,
        speed: 30 + Math.random() * 25,
        size: 16 + Math.random() * 12,
        flapSpeed: 0.4 + Math.random() * 0.3,
      };
      setBirds((prev) => [...prev, bird]);

      // Remove bird after its flight completes
      setTimeout(() => {
        setBirds((prev) => prev.filter((b) => b.id !== bird.id));
      }, bird.speed * 1000);
    };

    const spawnInterval = setInterval(spawn, 8000 + Math.random() * 10000);

    onCleanup(() => {
      clearInterval(spawnInterval);
    });
  });

  return (
    <div class="absolute inset-0 pointer-events-none z-[3] overflow-hidden">
      <For each={birds()}>
        {(bird) => {
          const strokeColor = () => mode() === 'dark' ? palette.nightSecondaryText : palette.dayText;
          return (
            <svg
              class="absolute"
              style={{
                top: `${bird.y}%`,
                width: `${bird.size}px`,
                height: `${bird.size * 0.6}px`,
                animation: `bird-fly ${bird.speed}s linear forwards`,
              }}
              viewBox="0 0 20 10"
              fill="none"
            >
              {/* Left wing */}
              <path
                d="M10 5 Q6 2 2 3"
                stroke={strokeColor()}
                stroke-width="1.5"
                stroke-linecap="round"
                fill="none"
                style={{
                  'transform-origin': '10px 5px',
                  animation: `bird-flap-left ${bird.flapSpeed}s ease-in-out infinite`,
                }}
              />
              {/* Right wing */}
              <path
                d="M10 5 Q14 2 18 3"
                stroke={strokeColor()}
                stroke-width="1.5"
                stroke-linecap="round"
                fill="none"
                style={{
                  'transform-origin': '10px 5px',
                  animation: `bird-flap-right ${bird.flapSpeed}s ease-in-out infinite`,
                }}
              />
            </svg>
          );
        }}
      </For>
    </div>
  );
};
