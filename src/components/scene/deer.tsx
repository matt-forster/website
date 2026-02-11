import type { Component } from 'solid-js';
import { createSignal, onMount, onCleanup, Show } from 'solid-js';

export const Deer: Component = () => {
  const [visible, setVisible] = createSignal(false);
  const [eating, setEating] = createSignal(false);

  // Randomize position (capped for mobile visibility) and facing direction
  const leftPos = Math.floor(Math.random() * Math.random() * 300) + 20;
  const flipHorizontally = Math.random() > 0.5;

  onMount(() => {
    // Only appear ~40% of the time on page load
    if (Math.random() > 0.4) return;
    setVisible(true);

    // Periodically lower head to eat
    const startEating = () => {
      setEating(true);
      // Eat for 2–4 seconds
      const eatDuration = 2000 + Math.random() * 2000;
      setTimeout(() => {
        setEating(false);
      }, eatDuration);
    };

    // First eat after a longer delay
    const initialDelay = setTimeout(() => startEating(), 8000 + Math.random() * 7000);

    // Then eat at random intervals (15–30 seconds apart)
    let nextTimeout: ReturnType<typeof setTimeout>;
    const scheduleNextEat = () => {
      nextTimeout = setTimeout(() => {
        startEating();
        scheduleNextEat();
      }, 15000 + Math.random() * 15000);
    };
    scheduleNextEat();

    onCleanup(() => {
      clearTimeout(initialDelay);
      clearTimeout(nextTimeout);
    });
  });

  return (
    <Show when={visible()}>
      <div
        class="absolute bottom-0 pointer-events-none"
        style={{
          left: `${leftPos}px`,
          transform: flipHorizontally ? 'scaleX(-1)' : 'none',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 90 80"
          shape-rendering="geometricPrecision"
          style={{ width: '72px', height: '64px' }}
        >
          {/* Legs */}
          <path d="M24,54 L21,78" fill="none" stroke="#4c566a" stroke-width="2" stroke-linecap="round" />
          <path d="M32,56 L30,78" fill="none" stroke="#4c566a" stroke-width="2" stroke-linecap="round" />
          <path d="M52,56 L50,78" fill="none" stroke="#4c566a" stroke-width="2" stroke-linecap="round" />
          <path d="M58,54 L61,78" fill="none" stroke="#4c566a" stroke-width="2" stroke-linecap="round" />

          {/* Body */}
          <path
            d="M20,48 C18,40 22,34 30,32 C38,30 50,30 58,32 C64,34 66,40 64,48 C62,54 56,58 48,58 C40,58 28,56 20,48Z"
            fill="#d08770"
            stroke="#4c566a"
            stroke-width="2"
            stroke-linejoin="round"
          />

          {/* Tail */}
          <path d="M18,42 C14,38 12,40 13,44" fill="none" stroke="#d08770" stroke-width="2.5" stroke-linecap="round" />

          {/* Neck and head group — animated */}
          <g
            style={{
              'transform-origin': '62px 36px',
              transition: 'transform 1.5s ease-in-out',
              transform: eating() ? 'rotate(20deg)' : 'rotate(0deg)',
            }}
          >
            {/* Neck — filled shape */}
            <path d="M58,36 C59,34 60,32 61,30 L67,18 C68,20 68,22 67,24 L63,34 C62,36 60,37 58,36Z" fill="#d08770" stroke="#4c566a" stroke-width="1.5" stroke-linejoin="round" />

            {/* Head */}
            <ellipse cx="68" cy="16" rx="8" ry="6" fill="#d08770" stroke="#4c566a" stroke-width="1.5" />

            {/* Ears */}
            <path d="M72,12 C74,8 76,7 77,9" fill="#d08770" stroke="#4c566a" stroke-width="1.5" stroke-linecap="round" />
            <path d="M64,12 C62,8 61,7 62,10" fill="#d08770" stroke="#4c566a" stroke-width="1.5" stroke-linecap="round" />

            {/* Eye */}
            <circle cx="72" cy="15" r="1" fill="#2e3440" />

            {/* Nose */}
            <ellipse cx="76" cy="17" rx="1.5" ry="1" fill="#2e3440" />

            {/* Antlers */}
            {/* Left antler */}
            <path d="M66,10 C64,4 62,2 60,0" fill="none" stroke="#4c566a" stroke-width="1.8" stroke-linecap="round" />
            <path d="M63,4 C60,3 58,4" fill="none" stroke="#4c566a" stroke-width="1.5" stroke-linecap="round" />
            <path d="M64,6 C62,7 60,6" fill="none" stroke="#4c566a" stroke-width="1.3" stroke-linecap="round" />

            {/* Right antler */}
            <path d="M70,10 C72,4 74,2 76,0" fill="none" stroke="#4c566a" stroke-width="1.8" stroke-linecap="round" />
            <path d="M73,4 C76,3 78,4" fill="none" stroke="#4c566a" stroke-width="1.5" stroke-linecap="round" />
            <path d="M72,6 C74,7 76,6" fill="none" stroke="#4c566a" stroke-width="1.3" stroke-linecap="round" />
          </g>
        </svg>
      </div>
    </Show>
  );
};
