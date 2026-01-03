import { Injectable, effect, signal } from '@angular/core';
import { CodeViewerTheme } from '@ngeenx/nx-angular-code-viewer';

const THEME_STORAGE_KEY = 'code-viewer-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly theme = signal<CodeViewerTheme>(this.getStoredTheme());

  constructor() {
    effect(() => {
      localStorage.setItem(THEME_STORAGE_KEY, this.theme());
    });
  }

  private getStoredTheme(): CodeViewerTheme {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'dark';
  }

  toggleTheme(): void {
    this.theme.update(current => (current === 'dark' ? 'light' : 'dark'));
  }
}
