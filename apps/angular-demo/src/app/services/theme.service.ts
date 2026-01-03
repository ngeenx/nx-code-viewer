import { Injectable, effect, signal } from '@angular/core';
import { CodeViewerTheme } from '@ngeenx/nx-angular-code-viewer';

const THEME_STORAGE_KEY = 'code-viewer-theme';
const CUSTOM_THEME_STORAGE_KEY = 'code-viewer-custom-theme';

export type CustomTheme =
  | 'default'
  | 'cyberpunk'
  | 'minimal'
  | 'high-contrast'
  | 'github'
  | 'dracula';

export interface CustomThemeOption {
  value: CustomTheme;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly theme = signal<CodeViewerTheme>(this.getStoredTheme());
  readonly customTheme = signal<CustomTheme>(this.getStoredCustomTheme());

  readonly customThemeOptions: CustomThemeOption[] = [
    { value: 'default', label: 'Default' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'high-contrast', label: 'High Contrast' },
    { value: 'github', label: 'GitHub' },
    { value: 'dracula', label: 'Dracula' },
  ];

  constructor() {
    effect(() => {
      localStorage.setItem(THEME_STORAGE_KEY, this.theme());
    });

    effect(() => {
      localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, this.customTheme());
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
    ];
    return validThemes.includes(stored as CustomTheme)
      ? (stored as CustomTheme)
      : 'default';
  }

  toggleTheme(): void {
    this.theme.update(current => (current === 'dark' ? 'light' : 'dark'));
  }

  setCustomTheme(theme: CustomTheme): void {
    this.customTheme.set(theme);
  }

  getCustomThemeClass(): string {
    const theme = this.customTheme();
    return theme === 'default' ? '' : `theme-${theme}`;
  }
}
