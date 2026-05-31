'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type {
  CodeViewerTheme,
  ShikiThemeName,
} from '@ngeenx/nx-react-code-viewer';

/**
 * Shared light/dark chrome state for the showcase.
 *
 * SSR-safe: the static export always renders `light` (no `window` /
 * `localStorage` access during the build pass), then the client
 * reconciles to the stored or system preference after hydration and
 * toggles `<html>.dark` so the code-viewer theme variables flip. The
 * React counterpart of nuxt-demo's `useChromeTheme` composable.
 */
interface ChromeThemeValue {
  theme: CodeViewerTheme;
  shikiTheme: ShikiThemeName;
  toggle: () => void;
}

const ChromeThemeContext = createContext<ChromeThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<CodeViewerTheme>('light');

  // Reconcile to the stored / system preference after hydration.
  useEffect(() => {
    const stored = localStorage.getItem('chrome-theme');
    const prefersDark =
      window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    setTheme(
      stored === 'light' || stored === 'dark'
        ? stored
        : prefersDark
          ? 'dark'
          : 'light'
    );
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('chrome-theme', theme);
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    []
  );

  const shikiTheme: ShikiThemeName =
    theme === 'dark' ? 'github-dark' : 'github-light';

  return (
    <ChromeThemeContext.Provider value={{ theme, shikiTheme, toggle }}>
      {children}
    </ChromeThemeContext.Provider>
  );
}

export function useChromeTheme(): ChromeThemeValue {
  const ctx = useContext(ChromeThemeContext);
  if (!ctx) {
    throw new Error('useChromeTheme must be used within a ThemeProvider');
  }
  return ctx;
}
