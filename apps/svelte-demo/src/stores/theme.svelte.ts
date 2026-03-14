import type { CodeViewerTheme, ShikiThemeName } from '@ngeenx/nx-code-viewer-utils';

export type CustomTheme = 'default' | 'cyberpunk' | 'minimal' | 'high-contrast' | 'github' | 'dracula' | 'handwritten';

export interface CustomThemeOption { value: CustomTheme; label: string; }
export interface ShikiThemeOption { value: ShikiThemeName | 'auto'; label: string; }

const THEME_KEY = 'code-viewer-theme';
const CUSTOM_THEME_KEY = 'code-viewer-custom-theme';
const SHIKI_THEME_KEY = 'code-viewer-shiki-theme';

function getStoredTheme(): CodeViewerTheme {
  if (typeof localStorage === 'undefined') return 'dark';
  const s = localStorage.getItem(THEME_KEY);
  return s === 'light' || s === 'dark' ? s : 'dark';
}

function getStoredCustomTheme(): CustomTheme {
  if (typeof localStorage === 'undefined') return 'default';
  const s = localStorage.getItem(CUSTOM_THEME_KEY);
  const valid: CustomTheme[] = ['default','cyberpunk','minimal','high-contrast','github','dracula','handwritten'];
  return valid.includes(s as CustomTheme) ? (s as CustomTheme) : 'default';
}

function getStoredShikiTheme(): ShikiThemeName | 'auto' {
  if (typeof localStorage === 'undefined') return 'auto';
  const s = localStorage.getItem(SHIKI_THEME_KEY);
  return (!s || s === 'auto') ? 'auto' : s as ShikiThemeName;
}

export const customThemeOptions: CustomThemeOption[] = [
  { value: 'default', label: 'Default' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'high-contrast', label: 'High Contrast' },
  { value: 'github', label: 'GitHub' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'handwritten', label: 'Handwritten' },
];

export const shikiThemeOptions: ShikiThemeOption[] = [
  { value: 'auto', label: 'Auto (based on theme)' },
  { value: 'github-dark', label: 'GitHub Dark' },
  { value: 'github-light', label: 'GitHub Light' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'dracula-soft', label: 'Dracula Soft' },
  { value: 'monokai', label: 'Monokai' },
  { value: 'nord', label: 'Nord' },
  { value: 'one-dark-pro', label: 'One Dark Pro' },
  { value: 'vitesse-dark', label: 'Vitesse Dark' },
  { value: 'vitesse-light', label: 'Vitesse Light' },
  { value: 'slack-dark', label: 'Slack Dark' },
  { value: 'slack-ochin', label: 'Slack Ochin' },
  { value: 'min-dark', label: 'Min Dark' },
  { value: 'min-light', label: 'Min Light' },
  { value: 'rose-pine', label: 'Rose Pine' },
  { value: 'rose-pine-dawn', label: 'Rose Pine Dawn' },
  { value: 'rose-pine-moon', label: 'Rose Pine Moon' },
  { value: 'catppuccin-frappe', label: 'Catppuccin Frappé' },
  { value: 'catppuccin-latte', label: 'Catppuccin Latte' },
  { value: 'catppuccin-macchiato', label: 'Catppuccin Macchiato' },
  { value: 'catppuccin-mocha', label: 'Catppuccin Mocha' },
  { value: 'night-owl', label: 'Night Owl' },
  { value: 'material-theme', label: 'Material Theme' },
  { value: 'material-theme-darker', label: 'Material Theme Darker' },
  { value: 'material-theme-ocean', label: 'Material Theme Ocean' },
  { value: 'material-theme-palenight', label: 'Material Theme Palenight' },
  { value: 'solarized-dark', label: 'Solarized Dark' },
  { value: 'solarized-light', label: 'Solarized Light' },
];

// Module-level reactive state
let _theme = $state<CodeViewerTheme>(getStoredTheme());
let _customTheme = $state<CustomTheme>(getStoredCustomTheme());
let _shikiTheme = $state<ShikiThemeName | 'auto'>(getStoredShikiTheme());

export function useTheme() {
  function toggleTheme() {
    _theme = _theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, _theme);
  }

  function setCustomTheme(t: CustomTheme) {
    _customTheme = t;
    localStorage.setItem(CUSTOM_THEME_KEY, t);
  }

  function setShikiTheme(t: ShikiThemeName | 'auto') {
    _shikiTheme = t;
    localStorage.setItem(SHIKI_THEME_KEY, t);
  }

  function getResolvedShikiTheme(): ShikiThemeName | undefined {
    return _shikiTheme === 'auto' ? undefined : _shikiTheme as ShikiThemeName;
  }

  function getCustomThemeClass(): string {
    return _customTheme === 'default' ? '' : `theme-${_customTheme}`;
  }

  return {
    get theme() { return _theme; },
    get customTheme() { return _customTheme; },
    get shikiTheme() { return _shikiTheme; },
    customThemeOptions,
    shikiThemeOptions,
    toggleTheme,
    setCustomTheme,
    setShikiTheme,
    getResolvedShikiTheme,
    getCustomThemeClass,
  };
}
