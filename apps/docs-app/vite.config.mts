/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { resolve } from 'node:path';
import { existsSync, createReadStream } from 'node:fs';
import type { Plugin } from 'vite';

/**
 * `@analogjs/vite-plugin-angular` bundles an `analogjs-router-optimization`
 * sub-plugin that walks Angular's compiled FESM bundles to inline routes.
 * In this docs app, that plugin trips on commonjs-proxy virtual module ids
 * (null-byte paths) when crossing @angular/core's CJS interop. Strip it
 * since we don't use Analog's file-system router.
 */
function stripAnalogRouterOptimization(plugins: Plugin[]): Plugin[] {
  return plugins.filter(p => p.name !== 'analogjs-router-optimization');
}

/**
 * Live-demo iframes load URLs like `/demos/border-styles/angular/csr/`
 * (trailing slash, no `index.html`). Vite's static middleware does not
 * auto-resolve directory requests to `index.html`, so the URL falls
 * through to the SPA fallback which serves docs-app's own `index.html`.
 * Angular Router then tries to match `/demos/...` as an app route and
 * emits NG04002.
 *
 * This middleware intercepts the dev request and serves the matching
 * `public/demos/.../index.html` directly, before Vite's SPA handler
 * runs.
 */
function serveDemoIndexHtml(): Plugin {
  return {
    name: 'docs-app:serve-demo-index-html',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? '';
        if (!url.startsWith('/demos/')) return next();
        const cleanPath = url.split('?')[0].split('#')[0];
        if (!cleanPath.endsWith('/')) return next();
        const indexPath = resolve(
          __dirname,
          'public',
          cleanPath.replace(/^\//, '') + 'index.html'
        );
        if (!existsSync(indexPath)) return next();
        res.setHeader('Content-Type', 'text/html');
        createReadStream(indexPath).pipe(res);
      });
    },
  };
}

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/docs-app',
  publicDir: 'public',
  build: {
    outDir: '../../dist/apps/docs-app',
    emptyOutDir: true,
    target: 'es2022',
  },
  server: {
    port: 4200,
    fs: { allow: [resolve(__dirname, '../..')] },
    // Iframes load their own bundles via `<iframe src="...">`, so the
    // host page never imports anything under `public/demos/`. Excluding
    // that subtree from Vite's chokidar watcher prevents every
    // live-demo rebuild from triggering a full page reload + Angular
    // AOT recompile of the host - the leak that drove the dev-server
    // OOM after ~5 minutes of editing.
    watch: {
      ignored: [
        '**/apps/docs-app/public/demos/**',
        '**/apps/docs-app/public/demos/.staging/**',
      ],
    },
  },
  plugins: [
    serveDemoIndexHtml(),
    ...stripAnalogRouterOptimization(angular() as Plugin[]),
  ],
  resolve: {
    alias: [
      // tsconfig.base.json maps `@docs-app/demo-components` ->
      // apps/angular-demo/src/app/components/demo/index.ts, but we
      // dropped `nxViteTsPaths` from this Vite pipeline, so Rollup
      // needs the alias directly. Keeping it scoped narrow so it does
      // not accidentally intercept other `@docs-app/*` paths.
      {
        find: '@docs-app/demo-components',
        replacement: resolve(
          __dirname,
          '../angular-demo/src/app/components/demo/index.ts'
        ),
      },
    ],
    // Singleton libraries that must not be duplicated across the host
    // and the Crylith Angular FESM bundles.
    dedupe: [
      '@lucide/angular',
      '@angular/core',
      '@angular/common',
      '@angular/router',
      '@angular/platform-browser',
      '@angular/compiler',
      '@crylith/shell-core',
      'rxjs',
      'nanostores',
    ],
  },
  optimizeDeps: {
    include: [
      '@angular/common',
      '@angular/core',
      '@angular/router',
      '@angular/platform-browser',
      '@angular/common/http',
      '@lucide/angular',
      'rxjs',
      'rxjs/operators',
      'fuse.js',
      'mermaid',
      'nanostores',
      'shiki',
      // Crylith's Angular libs ship as ng-packagr "partial AOT" FESM
      // bundles (`ɵɵngDeclareInjectable` & friends). The Angular Linker
      // that resolves those declarations into full AOT code lives
      // inside `@analogjs/vite-plugin-angular`'s `optimizeDeps`
      // esbuildOptions, so the libs MUST be pre-bundled to get linker
      // processing. The plugin's `transform` hook explicitly skips
      // `node_modules`, so without this include they get served raw,
      // hit `ɵɵngDeclareFactory` at module load, and fall back to
      // JIT - failing with "needs the JIT compiler".
      '@crylith/ui-angular',
      '@crylith/shell-angular',
    ],
  },
  assetsInclude: ['**/*.md'],
  test: {
    name: 'docs-app',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/docs-app',
      provider: 'v8' as const,
    },
  },
}));
