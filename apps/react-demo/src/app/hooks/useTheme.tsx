import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import type { CodeViewerTheme, ShikiThemeName } from '@ngeenx/nx-react-code-viewer';

const THEME_STORAGE_KEY = 'code-viewer-theme';
const CUSTOM_THEME_STORAGE_KEY = 'code-viewer-custom-theme';
const SHIKI_THEME_STORAGE_KEY = 'code-viewer-shiki-theme';

export type CustomTheme =
  | 'default'
  | 'cyberpunk'
  | 'minimal'
  | 'high-contrast'
  | 'github'
  | 'dracula'
  | 'handwritten';

export interface CustomThemeOption {
  value: CustomTheme;
  label: string;
}

export interface ShikiThemeOption {
  value: ShikiThemeName | 'auto';
  label: string;
}

interface ThemeContextValue {
  theme: CodeViewerTheme;
  customTheme: CustomTheme;
  shikiTheme: ShikiThemeName | 'auto';
  customThemeOptions: CustomThemeOption[];
  shikiThemeOptions: ShikiThemeOption[];
  toggleTheme: () => void;
  setCustomTheme: (theme: CustomTheme) => void;
  setShikiTheme: (theme: ShikiThemeName | 'auto') => void;
  getCustomThemeClass: () => string;
  getResolvedShikiTheme: () => ShikiThemeName | undefined;
}

const customThemeOptions: CustomThemeOption[] = [
  { value: 'default', label: 'Default' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'high-contrast', label: 'High Contrast' },
  { value: 'github', label: 'GitHub' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'handwritten', label: 'Handwritten' },
];

const shikiThemeOptions: ShikiThemeOption[] = [
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

const validCustomThemes: CustomTheme[] = [
  'default', 'cyberpunk', 'minimal', 'high-contrast', 'github', 'dracula', 'handwritten',
];

function getStoredTheme(): CodeViewerTheme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'dark';
}

function getStoredCustomTheme(): CustomTheme {
  const stored = localStorage.getItem(CUSTOM_THEME_STORAGE_KEY);
  return validCustomThemes.includes(stored as CustomTheme)
    ? (stored as CustomTheme)
    : 'default';
}

function getStoredShikiTheme(): ShikiThemeName | 'auto' {
  const stored = localStorage.getItem(SHIKI_THEME_STORAGE_KEY);
  if (!stored || stored === 'auto') return 'auto';
  return stored as ShikiThemeName;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<CodeViewerTheme>(getStoredTheme);
  const [customThemeState, setCustomThemeState] = useState<CustomTheme>(getStoredCustomTheme);
  const [shikiThemeState, setShikiThemeState] = useState<ShikiThemeName | 'auto'>(getStoredShikiTheme);

  useEffect(() => { localStorage.setItem(THEME_STORAGE_KEY, theme); }, [theme]);
  useEffect(() => { localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, customThemeState); }, [customThemeState]);
  useEffect(() => { localStorage.setItem(SHIKI_THEME_STORAGE_KEY, shikiThemeState); }, [shikiThemeState]);

  const toggleTheme = useCallback(() => {
    setTheme(current => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const setCustomTheme = useCallback((t: CustomTheme) => setCustomThemeState(t), []);
  const setShikiTheme = useCallback((t: ShikiThemeName | 'auto') => setShikiThemeState(t), []);

  const getCustomThemeClass = useCallback(() => {
    return customThemeState === 'default' ? '' : `theme-${customThemeState}`;
  }, [customThemeState]);

  const getResolvedShikiTheme = useCallback((): ShikiThemeName | undefined => {
    return shikiThemeState === 'auto' ? undefined : shikiThemeState;
  }, [shikiThemeState]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    customTheme: customThemeState,
    shikiTheme: shikiThemeState,
    customThemeOptions,
    shikiThemeOptions,
    toggleTheme,
    setCustomTheme,
    setShikiTheme,
    getCustomThemeClass,
    getResolvedShikiTheme,
  }), [theme, customThemeState, shikiThemeState, toggleTheme, setCustomTheme, setShikiTheme, getCustomThemeClass, getResolvedShikiTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
