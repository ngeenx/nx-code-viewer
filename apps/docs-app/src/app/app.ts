import {
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterOutlet,
  NavigationEnd,
} from '@angular/router';
import { filter } from 'rxjs';
import {
  ShellService,
  FuseSearchProvider,
  createAngularRouterAdapter,
} from '@crylith/shell-angular';
import {
  $paginationPrev,
  $paginationNext,
  $activeSidebarData,
} from '@crylith/shell-core';
import { applyContentConfig, buildSearchableContent } from '@crylith/config';

import './layout-presets';

import contentConfig from '../../crylith.config';
import { contentIndex } from './content-index.generated';
import {
  startDemoOptionsBridge,
  updateDemoOptions,
} from './demo-options-bridge';
import { resolveIcon } from './icons';
import { resolveShikiTheme } from './shiki-themes';
import type { BundledTheme } from 'shiki';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
export class App {
  private readonly shell = inject(ShellService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  constructor() {
    const searchProvider = new FuseSearchProvider();
    searchProvider.index(buildSearchableContent(contentIndex, contentConfig));

    applyContentConfig(this.shell, contentConfig, {
      contentIndex,
      searchProvider,
      iconResolver: resolveIcon,
    });

    this.shell.setRouter(
      createAngularRouterAdapter({
        router: this.router,
        activatedRoute: this.activatedRoute,
      })
    );

    this.updateActiveCategory(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.updateActiveCategory(e.urlAfterRedirects));

    this.setupSubtitleFromSelect();
    this.bindSelectsToBodyAttrs();
    startDemoOptionsBridge();
  }

  /**
   * Mirror `codeViewerTheme` and `shikiTheme` sidebar select values onto
   * `<body>` as `data-*` attributes so CSS can switch on them via
   * `[data-code-viewer-theme="cyberpunk"]` selectors. Cheap, reversible,
   * and avoids adding API surface on the shell side until we settle on
   * the final widget shape.
   */
  private bindSelectsToBodyAttrs(): void {
    const KEYS = ['codeViewerTheme', 'shikiTheme'] as const;
    const ATTRS: Record<(typeof KEYS)[number], string> = {
      codeViewerTheme: 'data-code-viewer-theme',
      shikiTheme: 'data-shiki-theme',
    };
    // Track the chrome's resolved light/dark mode as a signal so the
    // payload effect re-fires when the user toggles the floating
    // theme button (or the system preference changes). `<html>.dark`
    // is what `@crylith/theme-default` mutates on toggle, so a
    // MutationObserver on its class is the cheapest authoritative
    // source.
    const chromeMode = signal<'light' | 'dark'>(
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
    const classObserver = new MutationObserver(() => {
      chromeMode.set(
        document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      );
    });
    classObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    inject(DestroyRef).onDestroy(() => classObserver.disconnect());

    effect(() => {
      const values = this.shell.sidebarSelectValues() as Record<
        string,
        string | undefined
      >;
      const mode = chromeMode();
      const optionPayload: Record<string, string> = {};
      for (const key of KEYS) {
        const value = values[key];
        if (value) {
          document.body.setAttribute(ATTRS[key], value);
          optionPayload[key] = value;
        } else {
          document.body.removeAttribute(ATTRS[key]);
        }
      }
      // `shikiTheme` flows through the resolver so picking
      // `github-light` while the chrome is dark ships `github-dark` to
      // the iframe (and vice versa). Themes with no pair fall through
      // untouched.
      if (optionPayload['shikiTheme']) {
        optionPayload['shikiTheme'] = resolveShikiTheme(
          optionPayload['shikiTheme'] as BundledTheme,
          mode
        );
      }
      // Mirror the same payload across the iframe boundary so live-demo
      // components can react (e.g. swap a code viewer's shikiTheme).
      updateDemoOptions(optionPayload);
    });
  }

  /**
   * Mirror the active sidebar-select value into the navbar brand
   * subtitle, honoring contentConfig.brand.subtitleFrom (e.g.
   * `'select:framework'`). Reads navbarData via `untracked` so the
   * setNavbarData write does not re-enter the effect.
   */
  private setupSubtitleFromSelect(): void {
    const from = contentConfig.brand.subtitleFrom;
    if (!from?.startsWith('select:')) return;
    const key = from.slice('select:'.length);
    const select = contentConfig.selects?.find(s => s.key === key);
    if (!select) return;

    effect(() => {
      const values = this.shell.sidebarSelectValues() as Record<
        string,
        string | undefined
      >;
      const value = values[key] ?? select.default;
      const label = select.options.find(o => o.value === value)?.label ?? null;

      const data = untracked(() => this.shell.navbarData());
      if (!data) return;
      this.shell.setNavbarData({
        ...data,
        brand: { ...data.brand, subtitle: label ?? undefined },
      });
    });
  }

  private updateActiveCategory(url: string): void {
    if (url.startsWith('/examples')) {
      this.shell.setActiveCategory('examples');
    } else if (url.startsWith('/docs')) {
      this.shell.setActiveCategory('docs');
    } else {
      this.shell.setActiveCategory(null);
    }
    this.updatePagination(url);
  }

  private updatePagination(url: string): void {
    const data = $activeSidebarData.get();
    if (!data) {
      $paginationPrev.set(null);
      $paginationNext.set(null);
      return;
    }

    const flat: { label: string; href: string }[] = [];
    for (const section of data.sections) {
      for (const item of section.items) {
        if (item.href) flat.push({ label: item.label, href: item.href });
        for (const child of item.children ?? []) {
          if (child.href) flat.push({ label: child.label, href: child.href });
        }
      }
    }

    const idx = flat.findIndex(item => url === item.href);
    $paginationPrev.set(idx > 0 ? flat[idx - 1] : null);
    $paginationNext.set(
      idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null
    );
  }
}
