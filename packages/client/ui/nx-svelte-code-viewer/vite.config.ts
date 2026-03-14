/// <reference types="vitest" />

import { svelte } from '@sveltejs/vite-plugin-svelte';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  plugins: [svelte({ hot: false }), nxViteTsPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.spec.ts'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
    },
  },
});
