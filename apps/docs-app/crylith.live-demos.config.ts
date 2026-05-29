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
      modes: ['csr', 'ssg'],
    },
    vue: {
      source: 'vue-demo#src/components/demo/border-styles.vue',
      modes: ['csr', 'ssg'],
    },
  },
  'code-viewer-basic': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-viewer-basic-demo.component.ts',
      modes: ['csr', 'ssg'],
    },
    vue: {
      source: 'vue-demo#src/components/demo/code-viewer-basic.vue',
      modes: ['csr', 'ssg'],
    },
  },
  'code-viewer-with-title': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-viewer-with-title-demo.component.ts',
      modes: ['csr', 'ssg'],
    },
    vue: {
      source: 'vue-demo#src/components/demo/code-viewer-with-title.vue',
      modes: ['csr', 'ssg'],
    },
  },
  'code-viewer-compact': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-viewer-compact-demo.component.ts',
      modes: ['csr', 'ssg'],
    },
    vue: {
      source: 'vue-demo#src/components/demo/code-viewer-compact.vue',
      modes: ['csr', 'ssg'],
    },
  },
  'code-viewer-scrollable': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-viewer-scrollable-demo.component.ts',
      modes: ['csr', 'ssg'],
    },
    vue: {
      source: 'vue-demo#src/components/demo/code-viewer-scrollable.vue',
      modes: ['csr', 'ssg'],
    },
  },
  'code-viewer-highlighted-lines': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-viewer-highlighted-lines-demo.component.ts',
      modes: ['csr', 'ssg'],
    },
    vue: {
      source: 'vue-demo#src/components/demo/code-viewer-highlighted-lines.vue',
      modes: ['csr', 'ssg'],
    },
  },
  'code-viewer-focused-lines': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-viewer-focused-lines-demo.component.ts',
      modes: ['csr', 'ssg'],
    },
    vue: {
      source: 'vue-demo#src/components/demo/code-viewer-focused-lines.vue',
      modes: ['csr', 'ssg'],
    },
  },
  'code-viewer-focused-and-highlighted': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-viewer-focused-and-highlighted-demo.component.ts',
      modes: ['csr', 'ssg'],
    },
    vue: {
      source: 'vue-demo#src/components/demo/code-viewer-focused-and-highlighted.vue',
      modes: ['csr', 'ssg'],
    },
  },
  'code-viewer-collapsed-lines': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-viewer-collapsed-lines-demo.component.ts',
      modes: ['csr', 'ssg'],
    },
    vue: {
      source: 'vue-demo#src/components/demo/code-viewer-collapsed-lines.vue',
      modes: ['csr', 'ssg'],
    },
  },
  'code-viewer-collapsed-with-highlights': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-viewer-collapsed-with-highlights-demo.component.ts',
      modes: ['csr', 'ssg'],
    },
    vue: {
      source: 'vue-demo#src/components/demo/code-viewer-collapsed-with-highlights.vue',
      modes: ['csr', 'ssg'],
    },
  },
  'code-viewer-reference-links': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-viewer-reference-links-demo.component.ts',
      modes: ['csr', 'ssg'],
    },
    vue: {
      source: 'vue-demo#src/components/demo/code-viewer-reference-links.vue',
      modes: ['csr', 'ssg'],
    },
  },
  'code-viewer-line-widgets': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-viewer-line-widgets-demo.component.ts',
      modes: ['csr', 'ssg'],
    },
    vue: {
      source: 'vue-demo#src/components/demo/code-viewer-line-widgets.vue',
      modes: ['csr', 'ssg'],
    },
  },
  'code-diff-basic': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-diff-basic-demo.component.ts',
      modes: ['csr', 'ssg'],
    },
    vue: {
      source: 'vue-demo#src/components/demo/code-diff-basic.vue',
      modes: ['csr', 'ssg'],
    },
  },
  'code-diff-collapsed': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-diff-collapsed-demo.component.ts',
      modes: ['csr', 'ssg'],
    },
    vue: {
      source: 'vue-demo#src/components/demo/code-diff-collapsed.vue',
      modes: ['csr', 'ssg'],
    },
  },
  'code-diff-scrollable': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-diff-scrollable-demo.component.ts',
      modes: ['csr', 'ssg'],
    },
    vue: {
      source: 'vue-demo#src/components/demo/code-diff-scrollable.vue',
      modes: ['csr', 'ssg'],
    },
  },
  'code-multi-viewer': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-multi-viewer-demo.component.ts',
      modes: ['csr', 'ssg'],
    },
    vue: {
      source: 'vue-demo#src/components/demo/code-multi-viewer.vue',
      modes: ['csr', 'ssg'],
    },
  },
  'code-columns-frameworks': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-columns-frameworks-demo.component.ts',
      modes: ['csr', 'ssg'],
    },
    vue: {
      source: 'vue-demo#src/components/demo/code-columns-frameworks.vue',
      modes: ['csr', 'ssg'],
    },
  },
  'code-columns-code-diff': {
    angular: {
      source:
        'angular-demo#src/app/components/demo/code-columns-code-diff-demo.component.ts',
      modes: ['csr', 'ssg'],
    },
    vue: {
      source: 'vue-demo#src/components/demo/code-columns-code-diff.vue',
      modes: ['csr', 'ssg'],
    },
  },
});

export default defineContentConfig({
  brand: { title: 'nx-code-viewer Docs', href: '/' },
  basePath: '/',
  content: { root: '../../content', versioned: true, extensions: ['.md'] },
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
      'vue-demo': {
        type: 'workspace',
        project: 'apps/vue-demo',
        framework: 'vue',
        exposes: 'src/components/demo',
        globalStyles: ['src/styles.css'],
      },
    },
    registry: demos,
  }),
});
