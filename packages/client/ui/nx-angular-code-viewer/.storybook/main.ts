import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import type { StorybookConfig } from '@analogjs/storybook-angular';
import { UserConfig, mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../**/*.@(stories.@(js|ts))'],
  addons: [],
  framework: {
    name: '@analogjs/storybook-angular',
    options: {},
  },
  async viteFinal(config: UserConfig) {
    const { default: tailwindcss } = await import('@tailwindcss/postcss');
    const { default: postcssImport } = await import('postcss-import');

    return mergeConfig(config, {
      plugins: [nxViteTsPaths()],
      css: {
        postcss: {
          plugins: [postcssImport(), tailwindcss()],
        },
      },
    });
  },
};

export default config;
