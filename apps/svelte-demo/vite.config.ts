import { svelte } from '@sveltejs/vite-plugin-svelte';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { defineConfig } from 'vite';
import * as path from 'node:path';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/svelte-demo',
  plugins: [svelte(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  resolve: {
    alias: {
      '@ngeenx/nx-demo-app-theme': path.resolve(__dirname, '../../packages/styles/nx-demo-app-theme/src/index.css'),
    },
  },
  optimizeDeps: {
    exclude: ['svelte-spa-router', '@lucide/svelte'],
  },
  build: {
    outDir: '../../dist/apps/svelte-demo',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/svelte-demo',
      provider: 'v8',
    },
  },
});
