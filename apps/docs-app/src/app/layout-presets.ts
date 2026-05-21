import { LAYOUT_PRESETS } from '@crylith/shell-core';

const classic = LAYOUT_PRESETS['docs-classic'];

LAYOUT_PRESETS['docs-classic'] = {
  ...classic,
  preset: 'docs-classic',
  navbar: {
    ...classic.navbar,
    variant: 'tab',
    showSecondaryRow: false,
    secondaryHeight: 0,
    height: 48,
  },
  sidebar: {
    ...classic.sidebar,
    width: 240,
    showSelector: true,
  },
  content: {
    ...classic.content,
    maxWidth: '880px',
  },
};
