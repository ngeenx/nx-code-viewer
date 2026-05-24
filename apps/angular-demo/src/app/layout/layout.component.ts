import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ShikiThemeName } from '@ngeenx/nx-angular-code-viewer';
import { CustomTheme, ThemeService } from '../services/theme.service';
import {
  LucideDynamicIcon,
  LucideHome,
  LucideBookOpen,
  LucideSettings2,
  LucideHighlighter,
  LucideMousePointer2,
  LucideFrame,
  LucidePalette,
  LucideGitCompare,
  LucideLayers,
  LucideColumns3,
  LucidePlay,
  LucideSun,
  LucideMoon,
  type LucideIcon,
} from '@lucide/angular';

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  route: string;
  icon: LucideIcon;
}

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideDynamicIcon],
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

  protected readonly Sun = LucideSun;
  protected readonly Moon = LucideMoon;

  protected readonly navSections: NavSection[] = [
    {
      title: 'Overview',
      items: [{ label: 'Home', route: '/', icon: LucideHome }],
    },
    {
      title: 'Getting Started',
      items: [
        { label: 'Basic Examples', route: '/basic-examples', icon: LucideBookOpen },
      ],
    },
    {
      title: 'Code Viewer',
      items: [
        { label: 'Display Options', route: '/display-options', icon: LucideSettings2 },
        {
          label: 'Line Highlighting',
          route: '/line-highlighting',
          icon: LucideHighlighter,
        },
        {
          label: 'Interactive Features',
          route: '/interactive-features',
          icon: LucideMousePointer2,
        },
        { label: 'Border Styles', route: '/border-styles', icon: LucideFrame },
        { label: 'Theming', route: '/theming', icon: LucidePalette },
      ],
    },
    {
      title: 'Advanced',
      items: [
        { label: 'Diff Viewer', route: '/diff-viewer', icon: LucideGitCompare },
        { label: 'Multi-Code Viewer', route: '/multi-code-viewer', icon: LucideLayers },
        { label: 'Column Code Viewer', route: '/column-code-viewer', icon: LucideColumns3 },
      ],
    },
    {
      title: 'Tools',
      items: [{ label: 'Playground', route: '/playground', icon: LucidePlay }],
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
