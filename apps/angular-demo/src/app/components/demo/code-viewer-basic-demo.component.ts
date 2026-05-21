import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  CodeViewerComponent,
  type CodeViewerLanguage,
} from '@ngeenx/nx-angular-code-viewer';
import { BundledTheme } from 'shiki';

// Inlined because the live-demo adapter only stages the entry component
// file; adjacent helper files aren't carried over. Once the adapter
// supports multi-file stages, lift this into a shared workspace lib.
function readDemoOption<T>(key: string, fallback: T): T {
  if (globalThis.window === undefined) return fallback;
  const bag = (globalThis as { __crylithDemoOptions?: Record<string, unknown> })
    .__crylithDemoOptions;
  if (!bag) return fallback;
  const v = bag[key];
  return v === undefined ? fallback : (v as T);
}

@Component({
  selector: 'app-code-viewer-basic-demo',
  standalone: true,
  imports: [CodeViewerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nx-code-viewer
      [class]="codeViewerThemeClass()"
      [code]="sample"
      [language]="language"
      [theme]="theme()"
      [shikiTheme]="shikiTheme()" />
  `,
  // custom-theme.css already ships inside the iframe's bundled CSS via
  // the auto-detected globalStyles chain
  // (apps/angular-demo/src/styles.css -> @ngeenx/nx-demo-app-theme ->
  // custom-theme.css). Re-importing it here would break in the staged
  // adapter build because relative paths walk out of /tmp.
  styles: `
    nx-code-viewer {
      width: 500px;
    }
  `,
})
export default class CodeViewerBasicDemoComponent {
  // Track the iframe's <html>.dark class - the theme bridge toggles it
  // whenever the chrome's light/dark mode resolves - so the code-viewer
  // input swaps with the rest of the page. Guarded for SSR/SSG where
  // `document` is undefined on first evaluation.
  protected readonly theme = signal<'light' | 'dark'>(
    typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  );
  // Bridged from the sidebar's "Syntax Theme" select via the
  // `crylith:demo-options/v1` channel. Seeded from
  // `window.__crylithDemoOptions` (the bridge stashes the most recent
  // payload there) and updated on every subsequent broadcast.
  protected readonly shikiTheme = signal<BundledTheme>(
    readDemoOption('shikiTheme', 'github-light')
  );
  // Bridged from the sidebar's "Theme Style" select. Applied as a
  // `theme-<value>` class on the host code-viewer; the CSS rules ship
  // with the iframe via the `liveDemoIframeTheme` global styles
  // (custom-theme.css inside `@ngeenx/nx-demo-app-theme`).
  protected readonly codeViewerTheme = signal<string>(
    readDemoOption('codeViewerTheme', 'default')
  );
  protected readonly codeViewerThemeClass = computed(() => {
    const t = this.codeViewerTheme();
    return t === 'default' ? '' : `theme-${t}`;
  });

  constructor() {
    // Skip DOM wiring on the server pass; the bridge messages only
    // arrive in the live (CSR) iframe context anyway.
    if (globalThis.window === undefined || typeof document === 'undefined') {
      return;
    }
    const classObserver = new MutationObserver(() => {
      this.theme.set(
        document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      );
    });
    classObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    globalThis.addEventListener('crylith:demo-options', (event: Event) => {
      const detail = (event as CustomEvent).detail as
        | Record<string, unknown>
        | undefined;
      const shiki = detail?.['shikiTheme'] as BundledTheme;
      if (typeof shiki === 'string') this.shikiTheme.set(shiki);
      const ct = detail?.['codeViewerTheme'];
      if (typeof ct === 'string') this.codeViewerTheme.set(ct);
    });
  }

  protected readonly sample = `const greet = (name: string): string =>
    \`Hello, \${name}!\`;

console.log(greet('World'));`;

  protected readonly language: CodeViewerLanguage = 'typescript';
}
