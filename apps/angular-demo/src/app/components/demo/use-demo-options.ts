import { DestroyRef, inject, signal, type Signal } from '@angular/core';

/**
 * Subscribe to the host-side "demo options" channel set up by Crylith's
 * iframe bridge. The bridge stashes each pushed payload on
 * `window.__crylithDemoOptions` and emits a `crylith:demo-options`
 * CustomEvent every time the parent calls `updateDemoOptions(...)`.
 *
 * This helper:
 *  - seeds with whatever's already on `window.__crylithDemoOptions`
 *    (covers the case where the bridge replies before the component
 *    constructor runs, e.g. on a fast SSR rehydration);
 *  - re-reads on every event;
 *  - auto-unsubscribes via Angular's `DestroyRef`.
 *
 * Returns an Angular signal so the component template binds it directly
 * to a code viewer's `shikiTheme` (or any other input).
 */
export function useDemoOption<T>(key: string, fallback: T): Signal<T> {
  const initial = readWindowOption(key, fallback);
  const sig = signal<T>(initial);

  const onMessage = (event: Event) => {
    const detail = (event as CustomEvent).detail as
      | Record<string, unknown>
      | undefined;
    const value = detail?.[key];
    if (value !== undefined) sig.set(value as T);
  };
  window.addEventListener('crylith:demo-options', onMessage);

  // Lifetime: tied to the component that called the helper.
  inject(DestroyRef).onDestroy(() => {
    window.removeEventListener('crylith:demo-options', onMessage);
  });

  return sig.asReadonly();
}

function readWindowOption<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const bag = (window as { __crylithDemoOptions?: Record<string, unknown> })
    .__crylithDemoOptions;
  if (!bag) return fallback;
  const value = bag[key];
  return value === undefined ? fallback : (value as T);
}
