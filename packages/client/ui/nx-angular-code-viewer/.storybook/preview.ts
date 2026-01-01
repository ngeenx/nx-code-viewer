import type { Preview } from '@analogjs/storybook-angular';

const storybookDarkThemeBackgroundColor = 'oklch(14.1% 0.005 285.823)';
const storybookLightThemeBackgroundColor = 'oklch(1 0 0)';

const stroybookThemeOptions = {
  dark: { name: 'dark', value: storybookDarkThemeBackgroundColor },
  light: { name: 'light', value: storybookLightThemeBackgroundColor },
};

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: stroybookThemeOptions,
    },
  },
  initialGlobals: {
    backgrounds: { value: 'light' },
  },
};

export default preview;
