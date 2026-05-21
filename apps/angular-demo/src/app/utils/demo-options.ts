import { DestroyRef, inject } from '@angular/core';
import type { BundledTheme } from 'shiki';

/**
 * Shared helpers for Angular demo components that live inside a Crylith
 * live-demo iframe. They read and subscribe to the host-pushed
 * "demo options" channel set up by the docs-app's
 * `demo-options-bridge.ts` and the iframe-side `theme-bridge` script
 * (which lives in `@crylith/live-demos`).
 *
 * Data flow on a Crylith docs page:
 *   1. The docs-app's `App` computes a payload from the sidebar
 *      selects (codeViewerTheme, shikiTheme, etc.) plus the resolved
 *      chrome mode, and posts `crylith:demo-options/v1` into every
 *      live-demo iframe via the parent-side bridge.
 *   2. The iframe-side bridge stashes the bag on
 *      `window.__crylithDemoOptions` and dispatches a
 *      `crylith:demo-options` `CustomEvent` so demo components can
 *      subscribe with a plain `window.addEventListener`.
 *   3. This file wraps step 2 in Angular-flavoured helpers so demo
 *      components stay terse.
 *
 * Standalone usage: the helpers are SSR-safe (they bail when
 * `window`/`document` are unavailable) and don't require any specific
 * docs-app wiring. A demo rendered outside the live-demo iframe will
 * just see the fallback values.
 *
 * ## Live-demo staging caveat
 *
 * `@crylith/client-angular`'s live-demo adapter currently only stages
 * the entry component file into the iframe build's `/tmp` workspace.
 * Components that import from this util **will fail the live-demo
 * build** until the adapter learns to copy adjacent files referenced
 * via relative imports.
 *
 * Two workarounds depending on use case:
 *   - Author the components in this workspace's regular dev/build:
 *     relative imports just work, no staging involved.
 *   - For live-demo authoring, inline the helpers per-component until
 *     the upstream adapter supports multi-file stages (tracked
 *     against the original `inlined because the live-demo adapter
 *     only stages the entry component file` comment in
 *     `code-viewer-basic-demo.component.ts`).
 */

const DEMO_OPTIONS_EVENT = 'crylith:demo-options';

interface DemoOptionsBag {
  readonly [key: string]: unknown;
}

/**
 * Read the most-recent payload value the host pushed for `key`, with
 * a typed fallback for the first paint (before any messages arrive)
 * and for SSR/SSG passes.
 *
 * Pure, synchronous — call it during component construction to seed
 * a signal's initial value.
 */
export function readDemoOption<T>(key: string, fallback: T): T {
  if (typeof globalThis === 'undefined') return fallback;
  const win = (globalThis as { window?: Window }).window;
  if (!win) return fallback;
  const bag = (win as Window & { __crylithDemoOptions?: DemoOptionsBag })
    .__crylithDemoOptions;
  if (!bag) return fallback;
  const v = bag[key];
  return v === undefined ? fallback : (v as T);
}

/**
 * Read the iframe's current chrome mode (`'light'` or `'dark'`) by
 * inspecting `<html>.classList.contains('dark')`. The bridge's
 * `crylith:theme/v1` handler is what flips that class, so this stays
 * in sync without the demo needing to listen separately.
 *
 * Returns `'light'` during SSR/SSG when `document` isn't available.
 */
export function readInitialChromeTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * Per-key handler list for {@link bindDemoOptions}. All handlers are
 * optional - register only the keys the calling component cares about
 * and the helper short-circuits the rest of the work.
 *
 * `onTheme` follows `<html>.dark` (not `crylith:demo-options`) because
 * the chrome mode propagates via the theme bridge's own `class` toggle,
 * not the options channel.
 */
export interface DemoOptionsHandlers {
  onTheme?: (mode: 'light' | 'dark') => void;
  onShikiTheme?: (value: BundledTheme) => void;
  onCodeViewerTheme?: (value: string) => void;
}

/**
 * Wire up the iframe-side subscriptions for a demo component:
 *
 *   - `<html>.class` `MutationObserver` for `onTheme`
 *   - `window` `crylith:demo-options` listener for the option keys
 *     (`shikiTheme`, `codeViewerTheme`)
 *
 * Auto-cleans both subscriptions via `inject(DestroyRef)`, so this
 * MUST be called from an Angular injection context (constructor or
 * a factory the component owns). No-op on the server pass.
 *
 * @example
 * ```ts
 * constructor() {
 *   bindDemoOptions({
 *     onTheme: v => this.theme.set(v),
 *     onShikiTheme: v => this.shikiTheme.set(v),
 *     onCodeViewerTheme: v => this.codeViewerTheme.set(v),
 *   });
 * }
 * ```
 */
export function bindDemoOptions(handlers: DemoOptionsHandlers): void {
  if (globalThis.window === undefined || typeof document === 'undefined')
    return;

  const destroyRef = inject(DestroyRef);
  const { onTheme, onShikiTheme, onCodeViewerTheme } = handlers;

  if (onTheme) {
    const apply = () =>
      onTheme(
        document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      );
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    destroyRef.onDestroy(() => observer.disconnect());
  }

  if (onShikiTheme || onCodeViewerTheme) {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail as
        | DemoOptionsBag
        | undefined;
      if (!detail) return;
      if (onShikiTheme) {
        const v = detail['shikiTheme'];
        if (typeof v === 'string') onShikiTheme(v as BundledTheme);
      }
      if (onCodeViewerTheme) {
        const v = detail['codeViewerTheme'];
        if (typeof v === 'string') onCodeViewerTheme(v);
      }
    };
    globalThis.addEventListener(DEMO_OPTIONS_EVENT, handler);
    destroyRef.onDestroy(() =>
      globalThis.removeEventListener(DEMO_OPTIONS_EVENT, handler)
    );
  }
}
