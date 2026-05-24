/// <reference types='vitest' />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { resolve } from 'node:path';
import { existsSync, createReadStream, promises as fsp } from 'node:fs';
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
 * Live-demos are built into `dist/.crylith-demos/` at the workspace
 * root, not into the docs-app's `public/` directory. The reason is OOM
 * resilience: when `public/demos` lived under Vite's project root,
 * every demo rebuild flooded macOS fsevents and chokidar's queue,
 * eventually crashing the dev-server with a heap OOM. Putting the
 * output outside the watched tree (and under the universally-ignored
 * `dist/` directory) means fsevents never sees demo writes at all.
 *
 * Two consequences for Vite:
 *   1. Dev: a middleware maps every `/demos/*` request to the new disk
 *      path. Trailing-slash directory URLs (`/demos/x/csr/`) resolve to
 *      `index.html`; everything else is served as a file.
 *   2. Build: Vite no longer auto-copies the output via `publicDir`, so
 *      a `closeBundle` hook copies `dist/.crylith-demos/` ->
 *      `<outDir>/demos` during production builds.
 */
const DEMOS_DISK_ROOT = resolve(__dirname, '../../dist/.crylith-demos');

const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.map': 'application/json',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.wasm': 'application/wasm',
  '.txt': 'text/plain',
};

function mimeFor(filePath: string): string {
  const dot = filePath.lastIndexOf('.');
  if (dot === -1) return 'application/octet-stream';
  return MIME[filePath.slice(dot).toLowerCase()] ?? 'application/octet-stream';
}

function serveDemos(): Plugin {
  let isBuild = false;
  let viteOutDir = '';

  return {
    name: 'docs-app:serve-demos',
    config(_cfg, env) {
      isBuild = env.command === 'build';
    },
    configResolved(cfg) {
      viteOutDir = cfg.build.outDir;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? '';
        if (!url.startsWith('/demos/')) return next();
        const cleanPath = url.split('?')[0].split('#')[0];
        const rel = cleanPath.replace(/^\/demos\//, '');
        const filePath = cleanPath.endsWith('/')
          ? resolve(DEMOS_DISK_ROOT, rel + 'index.html')
          : resolve(DEMOS_DISK_ROOT, rel);
        if (!existsSync(filePath)) return next();
        res.setHeader('Content-Type', mimeFor(filePath));
        // Demos are rebuilt out-of-band by `crylith build-live-demos
        // --watch`. The manifest gets a new hash per demo on every
        // edit, and the iframe `src` changes with it. Without
        // `no-cache` the browser would serve the stale manifest and
        // the host element would resolve the previous hash, loading
        // the previous bundle even after a hard rebuild. Mirrors
        // Vite's own dev-server behavior for HMR-aware assets.
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        createReadStream(filePath).pipe(res);
      });
    },
    async closeBundle() {
      // Production build only - copy the built demos into the
      // shipped dist so the static deploy contains them. The output
      // location used to be `publicDir`, which Vite copies for free.
      // Since we moved demos out of the watched tree, we copy by hand.
      if (!isBuild) return;
      if (!existsSync(DEMOS_DISK_ROOT)) return;
      const destRoot = resolve(__dirname, viteOutDir, 'demos');
      await fsp.cp(DEMOS_DISK_ROOT, destRoot, { recursive: true });
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
    // Live-demo output is no longer under the Vite watched root - it
    // lives at `<workspaceRoot>/dist/.crylith-demos/` and is served via
    // the `serveDemos` plugin middleware. So we just preserve Vite's
    // default ignored subtrees. (Setting `ignored` replaces those
    // defaults, hence the explicit reapply.)
    watch: {
      ignored: (path: string) => {
        return path.includes('/node_modules/') || path.includes('/.git/');
      },
    },
  },
  plugins: [
    serveDemos(),
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
      // JIT failing with "needs the JIT compiler".
      '@crylith/ui-angular',
      '@crylith/shell-angular',
      // `@crylith/shell-core` ships the nanostore atoms (`$tocItems`,
      // `$sidebarSelectDefinitions`, etc.) the docs-app writes to and
      // shell-angular reads from. Without explicit pre-bundling, Vite
      // would resolve it from the raw `link:` symlink in app code AND
      // inline a second copy into `@crylith/shell-angular`'s pre-bundle.
      // Two atom instances = writes and reads talk past each other and
      // both the TOC and sidebar-select filtering silently stop working.
      // Including it here forces one shared pre-bundled instance.
      '@crylith/shell-core',
      // The `@ngeenx/nx-code-viewer-utils` package is a CJS workspace
      // build (`"type": "commonjs"`, `Object.defineProperty(exports,
      // ...)`). Linked via `link:dist/...` so Vite would otherwise
      // treat it as source and serve raw - but browsers can't parse
      // CJS as ESM, so an `.mjs` consumer (the angular code-viewer
      // FESM bundle) fails with "does not provide an export named X".
      // Adding to `optimizeDeps.include` forces esbuild to pre-bundle
      // it, performing the CJS->ESM conversion the browser needs.
      // Same reasoning for the framework code-viewer FESM bundles -
      // they reach into the utils through named imports, so the
      // pre-bundle has to flatten the whole chain in one step.
      '@ngeenx/nx-code-viewer-utils',
      '@ngeenx/nx-angular-code-viewer',
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
