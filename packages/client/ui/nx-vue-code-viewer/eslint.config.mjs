import pluginVue from 'eslint-plugin-vue';
import baseConfig from '../../../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
];
