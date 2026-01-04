import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ShikiThemeName } from '@ngeenx/nx-angular-code-viewer';
import { CustomTheme, ThemeService } from '../services/theme.service';

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  private readonly themeService = inject(ThemeService);
  protected readonly theme = this.themeService.theme;
  protected readonly customTheme = this.themeService.customTheme;
  protected readonly customThemeOptions = this.themeService.customThemeOptions;
  protected readonly shikiTheme = this.themeService.shikiTheme;
  protected readonly shikiThemeOptions = this.themeService.shikiThemeOptions;

  protected readonly navSections: NavSection[] = [
    {
      title: 'Getting Started',
      items: [{ label: 'Basic Examples', route: '/basic-examples' }],
    },
    {
      title: 'Code Viewer',
      items: [
        { label: 'Display Options', route: '/display-options' },
        { label: 'Line Highlighting', route: '/line-highlighting' },
        { label: 'Interactive Features', route: '/interactive-features' },
        { label: 'Border Styles', route: '/border-styles' },
      ],
    },
    {
      title: 'Advanced',
      items: [
        { label: 'Diff Viewer', route: '/diff-viewer' },
        { label: 'Multi-Code Viewer', route: '/multi-code-viewer' },
      ],
    },
  ];

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected onCustomThemeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.themeService.setCustomTheme(select.value as CustomTheme);
  }

  protected onShikiThemeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.themeService.setShikiTheme(
      select.value as ShikiThemeName | 'auto'
    );
  }
}
