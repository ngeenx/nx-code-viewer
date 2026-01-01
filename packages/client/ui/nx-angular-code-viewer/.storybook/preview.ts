import type { Preview } from '@analogjs/storybook-angular';
import { stroybookThemeOptions } from '@ngeenx/ngn-core-utils';

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
