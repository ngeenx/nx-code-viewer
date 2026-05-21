/**
 * Live-demos configuration consumed only by `crylith build-live-demos`.
 *
 * Kept separate from `crylith.config.ts` because `@crylith/live-demos`'
 * bare import pulls in node-only deps (`esbuild`, `tty`, `worker_threads`)
 * that would crash a browser bundle. Only the `crylith.config.ts` is
 * imported by app code; the CLI loads this file via `--config`.
 *
 * Inlined (no relative imports) because the @crylith/cli TS loader
 * uses Node's ESM resolver, which won't add extensions for relative
 * specifiers and won't perform TS's `.js` -> `.ts` rewrite either.
 * Cross-file imports relative to this config silently fail.
 */
import { defineContentConfig } from '@crylith/config';
import { defineLiveDemosConfig, defineDemoRegistry } from '@crylith/live-demos';

const demos = defineDemoRegistry({
  'border-styles': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/border-styles-demo.component.ts',
      modes: ['csr', 'ssg', 'ssr'],
    },
  },
  'code-viewer-basic': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-viewer-basic-demo.component.ts',
      modes: ['csr', 'ssg', 'ssr'],
    },
  },
  'code-viewer-with-title': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-viewer-with-title-demo.component.ts',
      modes: ['csr', 'ssg', 'ssr'],
    },
  },
  'code-viewer-compact': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-viewer-compact-demo.component.ts',
      modes: ['csr', 'ssg', 'ssr'],
    },
  },
  'code-viewer-scrollable': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-viewer-scrollable-demo.component.ts',
      modes: ['csr', 'ssg', 'ssr'],
    },
  },
});

export default defineContentConfig({
  brand: { title: 'nx-code-viewer Docs', href: '/' },
  basePath: '/',
  content: { root: './content', versioned: true, extensions: ['.md'] },
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
      defaultSlug: 'introduction',
    },
    examples: {
      label: 'Examples',
      baseRoute: '/examples',
      layout: 'docs-classic',
      versioned: false,
      defaultSlug: 'basic-usage',
    },
  },
  sidebar: { '/docs/': 'auto', '/examples/': 'auto' },
  liveDemos: defineLiveDemosConfig({
    sources: {
      'angular-demo': {
        type: 'workspace',
        project: 'apps/angular-demo',
        framework: 'angular',
        exposes: 'src/app/components/demo',
      },
    },
    registry: demos,
  }),
});
