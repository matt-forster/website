import type { Component } from 'solid-js';
import { useTheme } from '../../context/theme';

export const ThemeToggle: Component = () => {
  const { mode, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      class={`
        fixed bottom-3 right-3 z-50
        w-3 h-3 rounded-full
        opacity-[0.15] hover:opacity-40
        focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#81a1c1] focus-visible:outline-offset-2
        transition-opacity duration-300
        cursor-pointer
      `}
      style={{
        'background-color': mode() === 'light' ? '#4c566a' : '#d8dee9',
      }}
    />
  );
};
