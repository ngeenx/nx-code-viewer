import { defineContentConfig } from '@crylith/config';
import { SHIKI_THEME_OPTIONS } from './src/app/shiki-themes';

/**
 * Browser-safe content config. Live-demos config lives in
 * `crylith.live-demos.config.ts` and is consumed only by
 * `crylith build-live-demos`. See .crylith-link.md.
 */
export default defineContentConfig({
  brand: {
    logo: '/assets/logo/logo.svg',
    title: 'Code Viewer',
    href: '/',
  },

  basePath: '/',

  content: {
    root: '../../content',
    versioned: true,
    extensions: ['.md'],
  },

  versions: {
    current: 'v1',
    detectFromUrl: true,
    list: [{ id: 'v1', label: '1.x' }],
  },

  categories: {
    docs: {
      label: 'Documentation',
      baseRoute: '/docs',
      layout: 'docs-classic',
      defaultSlug: 'get-started',
    },
    examples: {
      label: 'Examples',
      baseRoute: '/examples',
      layout: 'docs-classic',
      versioned: false,
      defaultSlug: 'basic-usage',
    },
  },

  sidebar: {
    '/docs/': 'auto',
    '/examples/': 'auto',
  },

  navbar: {
    primary: [
      { id: 'docs', label: 'Docs', href: '/docs', icon: 'book-open' },
      { id: 'examples', label: 'Examples', href: '/examples', icon: 'play' },
      {
        id: 'theme-builder',
        label: 'Theme Builder',
        href: '/theme-builder',
        icon: 'palette',
      },
    ],
  },

  /**
   * Sidebar select definitions. The 'framework' key drives:
   *   - The brand subtitle (via `brand.subtitleFrom: 'select:framework'`)
   *   - Which framework variant `<crylith-live-demo>` mounts when a
   *     `:::demo{name="..."}` block is rendered.
   *   - Conditional markdown blocks (`:::if{framework="angular"} ... :::`).
   *
   * `persist: true` writes the active value to localStorage so the
   * choice survives reloads.
   */
  selects: [
    {
      key: 'framework',
      label: 'Framework',
      default: 'angular',
      persist: true,
      options: [
        {
          value: 'angular',
          label: 'Angular',
          icon: 'https://angular.dev/assets/images/press-kit/angular_icon_gradient.gif',
        },
        {
          value: 'vue',
          label: 'Vue',
          icon: 'https://cdn.simpleicons.org/vuedotjs',
        },
        {
          value: 'svelte',
          label: 'Svelte',
          icon: 'https://cdn.simpleicons.org/svelte',
        },
        {
          value: 'react',
          label: 'React',
          icon: 'https://cdn.simpleicons.org/react',
        },
      ],
    },
    {
      key: 'codeViewerTheme',
      label: 'Viewer Theme',
      default: 'default',
      persist: true,
      options: [
        { value: 'default', label: 'Default' },
        { value: 'cyberpunk', label: 'Cyberpunk' },
        { value: 'minimal', label: 'Minimal' },
        { value: 'high-contrast', label: 'High Contrast' },
        { value: 'github', label: 'GitHub' },
        { value: 'dracula', label: 'Dracula' },
        { value: 'handwritten', label: 'Handwritten' },
        { value: 'solarized', label: 'Solarized' },
        { value: 'monokai', label: 'Monokai' },
        { value: 'nord', label: 'Nord' },
        { value: 'tokyo-night', label: 'Tokyo Night' },
        { value: 'catppuccin', label: 'Catppuccin' },
        { value: 'sakura', label: 'Sakura' },
        { value: 'lavender-latte', label: 'Lavender Latte' },
      ],
    },
    {
      key: 'shikiTheme',
      label: 'Syntax Theme',
      // `github-light` is a safe default: it pairs with `github-dark`, so
      // toggling the chrome mode auto-swaps to the dark variant via
      // `resolveShikiTheme()` in `app.ts`.
      default: 'github-light',
      persist: true,
      options: SHIKI_THEME_OPTIONS,
    },
  ],

  /**
   * Per-theme palette posted into every `<crylith-live-demo>` iframe.
   * `createIframeThemeProvider(config)` (from `@crylith/live-demos/runtime`)
   * reads this block and produces the `themeProvider` callback for
   * `registerCrylithLiveDemo`. `background`/`foreground` map to the
   * `--crylith-demo-page-bg`/`--crylith-demo-page-fg` tokens the iframe
   * bridge consumes; entries under `tokens` are exposed verbatim as CSS
   * custom properties on the iframe's :root.
   */
  liveDemoIframeTheme: {
    light: {
      background: '#fafafa', // neutral-50
      foreground: '#171717', // neutral-900
    },
    dark: {
      background: '#0a0a0a', // neutral-950
      foreground: '#fafafa', // neutral-50
    },
  },
});
