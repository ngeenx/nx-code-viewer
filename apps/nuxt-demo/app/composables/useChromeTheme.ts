/**
 * Shared light/dark chrome state for the showcase.
 *
 * SSR-safe: the server always renders `light` (no `window`/`localStorage`
 * access during render), then the client reconciles to the stored or
 * system preference after mount and toggles `<html>.dark` so the
 * code-viewer theme variables flip. Returning a shared `useState` keeps
 * every component on the same value across the app.
 */
export type ChromeTheme = 'light' | 'dark';

export function useChromeTheme() {
  const theme = useState<ChromeTheme>('chrome-theme', () => 'light');

  function apply(next: ChromeTheme): void {
    theme.value = next;
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', next === 'dark');
      localStorage.setItem('chrome-theme', next);
    }
  }

  function toggle(): void {
    apply(theme.value === 'dark' ? 'light' : 'dark');
  }

  // Reconcile on the client after hydration.
  onMounted(() => {
    const stored = localStorage.getItem('chrome-theme') as ChromeTheme | null;
    const prefersDark =
      window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    apply(stored ?? (prefersDark ? 'dark' : 'light'));
  });

  return { theme, toggle, apply };
}
