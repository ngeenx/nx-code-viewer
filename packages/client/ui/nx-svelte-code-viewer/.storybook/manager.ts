import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const customTheme = create({
  base: 'dark',
  brandTitle: 'NX Svelte Code Viewer',
});

addons.setConfig({
  theme: customTheme,
});
