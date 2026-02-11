import { createContext, createSignal, useContext, onMount, onCleanup } from 'solid-js';
import type { Component, JSX } from 'solid-js';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: () => ThemeMode;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>();

const STORAGE_KEY = 'theme-mode';

export const ThemeProvider: Component<{ children: JSX.Element }> = (props) => {
  const [mode, setMode] = createSignal<ThemeMode>('light');

  onMount(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark') {
      setMode(stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
      localStorage.removeItem(STORAGE_KEY);
    };
    mediaQuery.addEventListener('change', handleChange);
    onCleanup(() => mediaQuery.removeEventListener('change', handleChange));
  });

  const toggle = () => {
    const next = mode() === 'light' ? 'dark' : 'light';
    setMode(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
