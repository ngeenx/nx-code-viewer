import { computed, onBeforeUnmount, ref, type ComputedRef, type Ref } from 'vue';
import type { ShikiThemeName } from '@ngeenx/nx-code-viewer-utils';
// Bundles the vue-demo app's full stylesheet into every demo's styles.css
// (the Vue live-demo adapter doesn't process the source `globalStyles`,
// unlike Angular). This is the SAME chain the angular demos get via
// globalStyles auto-detection - Tailwind + @ngeenx/nx-code-viewer-theme +
// @ngeenx/nx-demo-app-theme - so the docs `codeViewerTheme` palette
// classes (theme-cyberpunk, ...) and tippy popover styles are present.
// Compiled by the Tailwind PostCSS pipeline in `../postcss.config.mjs`.
import '../../../styles.css';

/**
 * Shared helpers for Vue demo components that live inside a Crylith
 * live-demo iframe. They read and subscribe to the host-pushed
 * "demo options" channel set up by the docs-app's
 * `demo-options-bridge.ts` and the iframe-side `theme-bridge` script
 * (which lives in `@crylith/live-demos`).
 *
 * This is the Vue counterpart of the Angular demos'
 * `apps/angular-demo/src/app/components/utils/demo-options.ts`.
 *
 * Data flow on a Crylith docs page:
 *   1. The docs-app's shell computes a payload from the sidebar selects
 *      (codeViewerTheme, shikiTheme, etc.) plus the resolved chrome
 *      mode, and posts `crylith:demo-options/v1` into every live-demo
 *      iframe via the parent-side bridge.
 *   2. The iframe-side bridge stashes the bag on
 *      `window.__crylithDemoOptions` and dispatches a
 *      `crylith:demo-options` `CustomEvent` so demo components can
 *      subscribe with a plain `window.addEventListener`.
 *   3. This file wraps step 2 in Vue-flavored composables so demo
 *      components stay terse.
 *
 * Unlike the Angular adapter (which staged only the entry component
 * file), the `@crylith/client-vue` live-demo adapter builds the entry
 * with a Vite library build rooted at the entry's directory, so this
 * shared module is bundled into every demo that imports it. No inlining
 * needed.
 *
 * Standalone usage: every helper is SSR-safe (it bails when
 * `window`/`document` are unavailable), so demos prerender cleanly in
 * the SSG pass and just see the fallback values until hydration.
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
 * `crylith:theme/v1` handler is what flips that class, so this stays in
 * sync without the demo needing to listen separately.
 *
 * Returns `'light'` during SSR/SSG when `document` isn't available.
 */
export function readInitialChromeTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * Reactive view of the docs-app demo options for a single demo.
 *
 * - `theme` follows `<html>.dark` via a `MutationObserver` (the chrome
 *   mode propagates through the theme bridge's own class toggle, not the
 *   options channel).
 * - `shikiTheme` and `codeViewerTheme` follow the
 *   `crylith:demo-options` `CustomEvent` channel.
 * - `codeViewerThemeClass` maps the active palette to the theme class
 *   the CSS expects (`theme-<name>`, empty for the default palette),
 *   matching the Angular demos' `codeViewerThemeClass` computed.
 *
 * Both subscriptions auto-clean on component unmount. No-op on the
 * server pass, so it is safe to call from `<script setup>`.
 */
export interface DemoOptions {
  readonly theme: Ref<'light' | 'dark'>;
  readonly shikiTheme: Ref<ShikiThemeName>;
  readonly codeViewerTheme: Ref<string>;
  readonly codeViewerThemeClass: ComputedRef<string>;
}

export function useDemoOptions(): DemoOptions {
  const theme = ref<'light' | 'dark'>(readInitialChromeTheme());
  const shikiTheme = ref<ShikiThemeName>(
    readDemoOption<ShikiThemeName>('shikiTheme', 'github-light')
  );
  const codeViewerTheme = ref<string>(
    readDemoOption('codeViewerTheme', 'default')
  );

  const codeViewerThemeClass = computed(() =>
    codeViewerTheme.value === 'default' ? '' : `theme-${codeViewerTheme.value}`
  );

  if (typeof globalThis.window !== 'undefined' && typeof document !== 'undefined') {
    const applyTheme = () => {
      theme.value = document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light';
    };
    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const onOptions = (event: Event) => {
      const detail = (event as CustomEvent).detail as DemoOptionsBag | undefined;
      if (!detail) return;
      const nextShiki = detail['shikiTheme'];
      if (typeof nextShiki === 'string') {
        shikiTheme.value = nextShiki as ShikiThemeName;
      }
      const nextPalette = detail['codeViewerTheme'];
      if (typeof nextPalette === 'string') {
        codeViewerTheme.value = nextPalette;
      }
    };
    globalThis.addEventListener(DEMO_OPTIONS_EVENT, onOptions);

    onBeforeUnmount(() => {
      observer.disconnect();
      globalThis.removeEventListener(DEMO_OPTIONS_EVENT, onOptions);
    });
  }

  return { theme, shikiTheme, codeViewerTheme, codeViewerThemeClass };
}
