// Pull the react-demo app stylesheet (Tailwind + nx-code-viewer-theme +
// nx-demo-app-theme) and the stage helper into every demo bundle. The
// Crylith react live-demo adapter compiles imported `.css` through the
// Tailwind v4 PostCSS pipeline, so the viewer's @apply/theme rules and
// the docs `codeViewerTheme` palette classes are present in the iframe.
import '../../styles.css';
import './demo.css';

import { useEffect, useState } from 'react';
import type { ShikiThemeName } from '@ngeenx/nx-react-code-viewer';

/**
 * Shared hook for React demo components that live inside a Crylith
 * live-demo iframe. It reads and subscribes to the host-pushed "demo
 * options" channel set up by the docs-app's `demo-options-bridge.ts`
 * and the iframe-side `theme-bridge` script.
 *
 * This is the React counterpart of the Vue and Svelte demos'
 * `useDemoOptions`, and is deliberately separate from the standalone
 * app's localStorage-backed `useTheme`: inside the docs iframe the
 * chrome mode and palette are driven entirely by the host.
 *
 * Data flow on a Crylith docs page:
 *   1. The docs-app shell posts `crylith:demo-options/v1` into every
 *      live-demo iframe with the resolved sidebar selections.
 *   2. The iframe bridge stashes the bag on `window.__crylithDemoOptions`
 *      and dispatches a `crylith:demo-options` `CustomEvent`.
 *   3. This hook wraps that channel in React state.
 *
 * Every read is SSR-safe (it bails when `window`/`document` are absent),
 * so demos prerender cleanly and the effect only runs in the browser.
 */

const DEMO_OPTIONS_EVENT = 'crylith:demo-options';

interface DemoOptionsBag {
  readonly [key: string]: unknown;
}

function readDemoOption<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const bag = (window as Window & { __crylithDemoOptions?: DemoOptionsBag })
    .__crylithDemoOptions;
  if (!bag) return fallback;
  const value = bag[key];
  return value === undefined ? fallback : (value as T);
}

function readInitialChromeTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export interface DemoOptions {
  readonly theme: 'light' | 'dark';
  readonly shikiTheme: ShikiThemeName;
  readonly codeViewerThemeClass: string;
}

export function useDemoOptions(): DemoOptions {
  const [theme, setTheme] = useState<'light' | 'dark'>(readInitialChromeTheme);
  const [shikiTheme, setShikiTheme] = useState<ShikiThemeName>(() =>
    readDemoOption<ShikiThemeName>('shikiTheme', 'github-light')
  );
  const [codeViewerTheme, setCodeViewerTheme] = useState<string>(() =>
    readDemoOption('codeViewerTheme', 'default')
  );

  useEffect(() => {
    const applyTheme = () => {
      setTheme(
        document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      );
    };
    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const onOptions = (event: Event) => {
      const detail = (event as CustomEvent).detail as
        | DemoOptionsBag
        | undefined;
      if (!detail) return;
      const nextShiki = detail['shikiTheme'];
      if (typeof nextShiki === 'string') {
        setShikiTheme(nextShiki as ShikiThemeName);
      }
      const nextPalette = detail['codeViewerTheme'];
      if (typeof nextPalette === 'string') {
        setCodeViewerTheme(nextPalette);
      }
    };
    window.addEventListener(DEMO_OPTIONS_EVENT, onOptions);

    return () => {
      observer.disconnect();
      window.removeEventListener(DEMO_OPTIONS_EVENT, onOptions);
    };
  }, []);

  const codeViewerThemeClass =
    codeViewerTheme === 'default' ? '' : `theme-${codeViewerTheme}`;

  return { theme, shikiTheme, codeViewerThemeClass };
}
