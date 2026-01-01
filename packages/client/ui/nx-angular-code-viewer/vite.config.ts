/// <reference types="vitest" />

import angular from '@analogjs/vite-plugin-angular';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

import { defineConfig } from 'vite';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    plugins: [
      angular({
        tsconfig: path.join(__dirname, 'tsconfig.spec.json'),
      }),
      nxViteTsPaths(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
      server: {
        deps: {
          inline: [/^@angular/, /^@ngeenx/, /^rxjs/, 'tslib'],
        },
      },
      browser: {
        enabled: false,
        name: 'chromium',
      },
      coverage: {
        provider: 'v8',
      },
      pool: 'threads',
      poolOptions: {
        threads: {
          singleThread: false,
          minThreads: 4,
          maxThreads: 8,
        },
      },
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
    resolve: {
      conditions: ['default', 'module', 'browser'],
    },
  };
});
