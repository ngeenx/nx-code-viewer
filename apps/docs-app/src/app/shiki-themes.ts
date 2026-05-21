import type { BundledTheme } from 'shiki';

/**
 * Sidebar-select option type matching the shape `crylith.config.ts` expects.
 */
export interface ShikiThemeOption {
  value: BundledTheme;
  label: string;
}

/**
 * Per-theme metadata: which mode the theme is designed for, plus the
 * counterpart to swap to when the chrome flips dark/light.
 *
 * `pair` is `null` for themes with no defined complement (Monokai, Nord,
 * Snazzy Light, etc.) - the resolver leaves those alone instead of
 * inventing a pair.
 */
export interface ShikiThemeMeta {
  mode: 'light' | 'dark';
  pair: BundledTheme | null;
}

export const SHIKI_THEME_META: Record<BundledTheme, ShikiThemeMeta> = {
  // Standalone darks.
  andromeeda: { mode: 'dark', pair: null },
  'aurora-x': { mode: 'dark', pair: null },
  houston: { mode: 'dark', pair: null },
  laserwave: { mode: 'dark', pair: null },
  monokai: { mode: 'dark', pair: null },
  nord: { mode: 'dark', pair: null },
  plastic: { mode: 'dark', pair: null },
  poimandres: { mode: 'dark', pair: null },
  red: { mode: 'dark', pair: null },
  'synthwave-84': { mode: 'dark', pair: null },
  'tokyo-night': { mode: 'dark', pair: null },
  vesper: { mode: 'dark', pair: null },

  // Standalone light.
  'snazzy-light': { mode: 'light', pair: null },

  // Ayu.
  'ayu-dark': { mode: 'dark', pair: 'ayu-light' },
  'ayu-mirage': { mode: 'dark', pair: 'ayu-light' },
  'ayu-light': { mode: 'light', pair: 'ayu-dark' },

  // Catppuccin: latte is the only light flavour; the three dark flavours
  // all pair back to latte. Use mocha as the dark pair from latte
  // because it's the highest-contrast variant.
  'catppuccin-latte': { mode: 'light', pair: 'catppuccin-mocha' },
  'catppuccin-frappe': { mode: 'dark', pair: 'catppuccin-latte' },
  'catppuccin-macchiato': { mode: 'dark', pair: 'catppuccin-latte' },
  'catppuccin-mocha': { mode: 'dark', pair: 'catppuccin-latte' },

  // VS Code defaults.
  'dark-plus': { mode: 'dark', pair: 'light-plus' },
  'light-plus': { mode: 'light', pair: 'dark-plus' },

  // Dracula.
  dracula: { mode: 'dark', pair: null },
  'dracula-soft': { mode: 'dark', pair: null },

  // Everforest.
  'everforest-dark': { mode: 'dark', pair: 'everforest-light' },
  'everforest-light': { mode: 'light', pair: 'everforest-dark' },

  // GitHub family.
  'github-dark': { mode: 'dark', pair: 'github-light' },
  'github-light': { mode: 'light', pair: 'github-dark' },
  'github-dark-default': { mode: 'dark', pair: 'github-light-default' },
  'github-light-default': { mode: 'light', pair: 'github-dark-default' },
  'github-dark-high-contrast': {
    mode: 'dark',
    pair: 'github-light-high-contrast',
  },
  'github-light-high-contrast': {
    mode: 'light',
    pair: 'github-dark-high-contrast',
  },
  'github-dark-dimmed': { mode: 'dark', pair: 'github-light' },

  // Gruvbox: pair each contrast level.
  'gruvbox-dark-hard': { mode: 'dark', pair: 'gruvbox-light-hard' },
  'gruvbox-dark-medium': { mode: 'dark', pair: 'gruvbox-light-medium' },
  'gruvbox-dark-soft': { mode: 'dark', pair: 'gruvbox-light-soft' },
  'gruvbox-light-hard': { mode: 'light', pair: 'gruvbox-dark-hard' },
  'gruvbox-light-medium': { mode: 'light', pair: 'gruvbox-dark-medium' },
  'gruvbox-light-soft': { mode: 'light', pair: 'gruvbox-dark-soft' },

  // Horizon.
  horizon: { mode: 'dark', pair: 'horizon-bright' },
  'horizon-bright': { mode: 'light', pair: 'horizon' },

  // Kanagawa.
  'kanagawa-wave': { mode: 'dark', pair: 'kanagawa-lotus' },
  'kanagawa-dragon': { mode: 'dark', pair: 'kanagawa-lotus' },
  'kanagawa-lotus': { mode: 'light', pair: 'kanagawa-wave' },

  // Material.
  'material-theme': { mode: 'dark', pair: 'material-theme-lighter' },
  'material-theme-darker': { mode: 'dark', pair: 'material-theme-lighter' },
  'material-theme-ocean': { mode: 'dark', pair: 'material-theme-lighter' },
  'material-theme-palenight': { mode: 'dark', pair: 'material-theme-lighter' },
  'material-theme-lighter': { mode: 'light', pair: 'material-theme' },

  // Min.
  'min-dark': { mode: 'dark', pair: 'min-light' },
  'min-light': { mode: 'light', pair: 'min-dark' },

  // Night Owl.
  'night-owl': { mode: 'dark', pair: 'night-owl-light' },
  'night-owl-light': { mode: 'light', pair: 'night-owl' },

  // One.
  'one-dark-pro': { mode: 'dark', pair: 'one-light' },
  'one-light': { mode: 'light', pair: 'one-dark-pro' },

  // Rose Pine.
  'rose-pine': { mode: 'dark', pair: 'rose-pine-dawn' },
  'rose-pine-moon': { mode: 'dark', pair: 'rose-pine-dawn' },
  'rose-pine-dawn': { mode: 'light', pair: 'rose-pine' },

  // Slack.
  'slack-dark': { mode: 'dark', pair: 'slack-ochin' },
  'slack-ochin': { mode: 'light', pair: 'slack-dark' },

  // Solarized.
  'solarized-dark': { mode: 'dark', pair: 'solarized-light' },
  'solarized-light': { mode: 'light', pair: 'solarized-dark' },

  // Vitesse.
  'vitesse-dark': { mode: 'dark', pair: 'vitesse-light' },
  'vitesse-black': { mode: 'dark', pair: 'vitesse-light' },
  'vitesse-light': { mode: 'light', pair: 'vitesse-dark' },
};

/**
 * Pretty-print a kebab-case theme name (`'github-dark-default'`) as the
 * dropdown label (`'Github Dark Default'`). Single source of truth for
 * label generation so adding new themes doesn't require hand-editing
 * the option list.
 */
function titleCase(value: string): string {
  return value
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export const SHIKI_THEME_OPTIONS: ShikiThemeOption[] = (
  Object.keys(SHIKI_THEME_META) as BundledTheme[]
)
  .sort()
  .map(value => ({ value, label: titleCase(value) }));

/**
 * Resolve the effective Shiki theme based on the user's selection and
 * the chrome's current dark/light mode.
 *
 * Behaviour:
 *  - Theme matches the mode → use it verbatim.
 *  - Theme has a paired counterpart for the other mode → swap to the
 *    pair so light/dark stays consistent across the iframe.
 *  - Theme has no pair (e.g. Monokai, Nord) → leave it as-is, the user
 *    explicitly opted into a single-mode theme.
 *
 * Override this with your own logic if you want different defaults
 * (e.g. always force `github-dark` in dark mode no matter what the
 * user picked). The function is exported so `app.ts` can call it and
 * so downstream consumers can swap it without touching the bridge.
 */
export function resolveShikiTheme(
  selected: BundledTheme,
  mode: 'light' | 'dark'
): BundledTheme {
  const meta = SHIKI_THEME_META[selected];
  if (!meta) return selected;
  if (meta.mode === mode) return selected;
  return meta.pair ?? selected;
}
