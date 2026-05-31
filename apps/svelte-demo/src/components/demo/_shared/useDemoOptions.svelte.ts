// Bundles the svelte-demo app's full stylesheet into every demo's
// styles.css (the Svelte live-demo adapter doesn't process the source's
// `globalStyles`, just like the Vue adapter). This pulls in the same
// chain the standalone app uses, Tailwind + @ngeenx/nx-code-viewer-theme
// + @ngeenx/nx-demo-app-theme, so the docs `codeViewerTheme` palette
// classes (theme-cyberpunk, ...) and tippy popover styles are present.
// Compiled by the Tailwind PostCSS pipeline in `../postcss.config.mjs`.
import '../../../app.css';

import type { ShikiThemeName } from '@ngeenx/nx-code-viewer-utils';

/**
 * Shared helpers for Svelte demo components that live inside a Crylith
 * live-demo iframe. They read and subscribe to the host-pushed "demo
 * options" channel set up by the docs-app's `demo-options-bridge.ts`
 * and the iframe-side `theme-bridge` script (which lives in
 * `@crylith/live-demos`).
 *
 * This is the Svelte counterpart of the Vue demos' shared
 * `useDemoOptions.ts` and the Angular demos' `demo-options.ts`. It is
 * deliberately separate from the standalone app's localStorage-backed
 * `stores/theme.svelte.ts`: inside the docs iframe the chrome mode and
 * palette are driven entirely by the host, never by local storage.
 *
 * Data flow on a Crylith docs page:
 *   1. The docs-app shell posts `crylith:demo-options/v1` into every
 *      live-demo iframe with the resolved sidebar selections.
 *   2. The iframe bridge stashes the bag on `window.__crylithDemoOptions`
 *      and dispatches a `crylith:demo-options` `CustomEvent`.
 *   3. This module wraps that channel in Svelte 5 runes so demo
 *      components stay terse.
 *
 * The Svelte live-demo adapter builds each entry with a Vite library
 * build rooted at the entry's directory, so this shared module (and its
 * `app.css` import) is bundled into every demo that imports it. No
 * inlining needed.
 *
 * Standalone usage: every read is SSR-safe (it bails when
 * `window`/`document` are unavailable), so demos prerender cleanly in
 * the SSG pass and just see the fallback values until hydration. The
 * `$effect` only runs in the browser, so the server pass is a no-op.
 */

const DEMO_OPTIONS_EVENT = 'crylith:demo-options';

interface DemoOptionsBag {
  readonly [key: string]: unknown;
}

/**
 * Read the most-recent payload value the host pushed for `key`, with a
 * typed fallback for the first paint (before any messages arrive) and
 * for the SSR/SSG pass.
 */
export function readDemoOption<T>(key: string, fallback: T): T {
  if (typeof globalThis === 'undefined') return fallback;
  const win = (globalThis as { window?: Window }).window;
  if (!win) return fallback;
  const bag = (win as Window & { __crylithDemoOptions?: DemoOptionsBag })
    .__crylithDemoOptions;
  if (!bag) return fallback;
  const value = bag[key];
  return value === undefined ? fallback : (value as T);
}

/**
 * Read the iframe's current chrome mode (`'light'` or `'dark'`) by
 * inspecting `<html>.classList.contains('dark')`. The bridge's
 * `crylith:theme/v1` handler flips that class, so this stays in sync
 * without the demo listening separately. Returns `'light'` during
 * SSR/SSG when `document` isn't available.
 */
export function readInitialChromeTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * Reactive view of the docs-app demo options for a single demo.
 *
 * - `theme` follows `<html>.dark` via a `MutationObserver`.
 * - `shikiTheme` and `codeViewerTheme` follow the `crylith:demo-options`
 *   `CustomEvent` channel.
 * - `codeViewerThemeClass` maps the active palette to the theme class
 *   the CSS expects (`theme-<name>`, empty for the default palette).
 *
 * Returns getters (not plain values) so callers keep reactivity. Access
 * them in markup as `options.theme`, never destructure, or the read
 * detaches from the underlying `$state`.
 */
export interface DemoOptions {
  readonly theme: 'light' | 'dark';
  readonly shikiTheme: ShikiThemeName;
  readonly codeViewerTheme: string;
  readonly codeViewerThemeClass: string;
}

export function useDemoOptions(): DemoOptions {
  let theme = $state<'light' | 'dark'>(readInitialChromeTheme());
  let shikiTheme = $state<ShikiThemeName>(
    readDemoOption<ShikiThemeName>('shikiTheme', 'github-light')
  );
  let codeViewerTheme = $state<string>(
    readDemoOption('codeViewerTheme', 'default')
  );

  const codeViewerThemeClass = $derived(
    codeViewerTheme === 'default' ? '' : `theme-${codeViewerTheme}`
  );

  $effect(() => {
    const applyTheme = () => {
      theme = document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light';
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
        shikiTheme = nextShiki as ShikiThemeName;
      }
      const nextPalette = detail['codeViewerTheme'];
      if (typeof nextPalette === 'string') {
        codeViewerTheme = nextPalette;
      }
    };
    window.addEventListener(DEMO_OPTIONS_EVENT, onOptions);

    return () => {
      observer.disconnect();
      window.removeEventListener(DEMO_OPTIONS_EVENT, onOptions);
    };
  });

  return {
    get theme() {
      return theme;
    },
    get shikiTheme() {
      return shikiTheme;
    },
    get codeViewerTheme() {
      return codeViewerTheme;
    },
    get codeViewerThemeClass() {
      return codeViewerThemeClass;
    },
  };
}
