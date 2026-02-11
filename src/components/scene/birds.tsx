import type { Component } from 'solid-js';
import { createSignal, onMount, onCleanup, For } from 'solid-js';
import { useTheme } from '../../context/theme';
import { palette } from '../../theme';

interface Bird {
  id: number;
  y: number;
  speed: number;
  size: number;
}

let nextId = 0;

export const Birds: Component = () => {
  const { mode } = useTheme();
  const [birds, setBirds] = createSignal<Bird[]>([]);

  onMount(() => {
    const spawn = () => {
      const bird: Bird = {
        id: nextId++,
        y: 5 + Math.random() * 35,
        speed: 12 + Math.random() * 16,
        size: 16 + Math.random() * 12,
      };
      setBirds((prev) => [...prev, bird]);

      // Remove bird after its flight completes
      setTimeout(() => {
        setBirds((prev) => prev.filter((b) => b.id !== bird.id));
      }, bird.speed * 1000);
    };

    const spawnInterval = setInterval(spawn, 4000 + Math.random() * 6000);

    onCleanup(() => {
      clearInterval(spawnInterval);
    });
  });

  return (
    <div class="absolute inset-0 pointer-events-none z-[3] overflow-hidden">
      <For each={birds()}>
        {(bird) => (
          <svg
            class="absolute"
            style={{
              top: `${bird.y}%`,
              width: `${bird.size}px`,
              height: `${bird.size * 0.5}px`,
              animation: `bird-fly ${bird.speed}s linear forwards`,
            }}
            viewBox="0 0 20 8"
            fill="none"
          >
            <path
              d="M0 4 Q5 0 10 4 Q15 0 20 4"
              stroke={mode() === 'dark' ? palette.nightSecondaryText : palette.dayText}
              stroke-width="1.5"
              fill="none"
              style={{ animation: `bird-flap 0.6s ease-in-out infinite` }}
            />
          </svg>
        )}
      </For>
    </div>
  );
};
