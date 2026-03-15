/// <reference types="vitest" />

import { svelte } from '@sveltejs/vite-plugin-svelte';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  plugins: [svelte(), nxViteTsPaths()],
  resolve: {
    conditions: ['browser'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    server: {
      deps: {
        inline: [/@testing-library\/svelte/],
      },
    },
    coverage: {
      provider: 'v8',
    },
  },
});
