import { Injectable, effect, signal } from '@angular/core';
import { CodeViewerTheme, ShikiThemeName } from '@ngeenx/nx-angular-code-viewer';

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

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly theme = signal<CodeViewerTheme>(this.getStoredTheme());
  readonly customTheme = signal<CustomTheme>(this.getStoredCustomTheme());
  readonly shikiTheme = signal<ShikiThemeName | 'auto'>(
    this.getStoredShikiTheme()
  );

  readonly customThemeOptions: CustomThemeOption[] = [
    { value: 'default', label: 'Default' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'high-contrast', label: 'High Contrast' },
    { value: 'github', label: 'GitHub' },
    { value: 'dracula', label: 'Dracula' },
    { value: 'handwritten', label: 'Handwritten' },
  ];

  readonly shikiThemeOptions: ShikiThemeOption[] = [
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

  constructor() {
    effect(() => {
      localStorage.setItem(THEME_STORAGE_KEY, this.theme());
    });

    effect(() => {
      localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, this.customTheme());
    });

    effect(() => {
      localStorage.setItem(SHIKI_THEME_STORAGE_KEY, this.shikiTheme());
    });
  }

  private getStoredTheme(): CodeViewerTheme {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'dark';
  }

  private getStoredCustomTheme(): CustomTheme {
    const stored = localStorage.getItem(CUSTOM_THEME_STORAGE_KEY);
    const validThemes: CustomTheme[] = [
      'default',
      'cyberpunk',
      'minimal',
      'high-contrast',
      'github',
      'dracula',
      'handwritten',
    ];
    return validThemes.includes(stored as CustomTheme)
      ? (stored as CustomTheme)
      : 'default';
  }

  private getStoredShikiTheme(): ShikiThemeName | 'auto' {
    const stored = localStorage.getItem(SHIKI_THEME_STORAGE_KEY);
    if (!stored || stored === 'auto') {
      return 'auto';
    }
    // Return the stored value as ShikiThemeName (Shiki validates at runtime)
    return stored as ShikiThemeName;
  }

  toggleTheme(): void {
    this.theme.update(current => (current === 'dark' ? 'light' : 'dark'));
  }

  setCustomTheme(theme: CustomTheme): void {
    this.customTheme.set(theme);
  }

  setShikiTheme(theme: ShikiThemeName | 'auto'): void {
    this.shikiTheme.set(theme);
  }

  getCustomThemeClass(): string {
    const theme = this.customTheme();
    return theme === 'default' ? '' : `theme-${theme}`;
  }

  /**
   * Gets the resolved Shiki theme name
   * Returns undefined when 'auto' to use default theme-based mapping
   */
  getResolvedShikiTheme(): ShikiThemeName | undefined {
    const theme = this.shikiTheme();
    return theme === 'auto' ? undefined : theme;
  }
}
