import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import type { StorybookConfig } from '@storybook/svelte-vite';
import { UserConfig, mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|ts)'],
  addons: [],
  framework: {
    name: '@storybook/svelte-vite',
    options: {},
  },
  async viteFinal(config: UserConfig) {
    const { default: tailwindcss } = await import('@tailwindcss/vite');

    return mergeConfig(config, {
      plugins: [nxViteTsPaths(), tailwindcss()],
    });
  },
};

export default config;
