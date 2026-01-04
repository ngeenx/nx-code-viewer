import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ShikiThemeName } from '@ngeenx/nx-angular-code-viewer';
import { CustomTheme, ThemeService } from '../services/theme.service';
import {
  LucideAngularModule,
  Home,
  BookOpen,
  Settings2,
  Highlighter,
  MousePointer2,
  Frame,
  Palette,
  GitCompare,
  Layers,
  Play,
  LucideIconData,
} from 'lucide-angular';

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  route: string;
  icon: LucideIconData;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
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
      title: 'Overview',
      items: [{ label: 'Home', route: '/', icon: Home }],
    },
    {
      title: 'Getting Started',
      items: [
        { label: 'Basic Examples', route: '/basic-examples', icon: BookOpen },
      ],
    },
    {
      title: 'Code Viewer',
      items: [
        { label: 'Display Options', route: '/display-options', icon: Settings2 },
        {
          label: 'Line Highlighting',
          route: '/line-highlighting',
          icon: Highlighter,
        },
        {
          label: 'Interactive Features',
          route: '/interactive-features',
          icon: MousePointer2,
        },
        { label: 'Border Styles', route: '/border-styles', icon: Frame },
        { label: 'Theming', route: '/theming', icon: Palette },
      ],
    },
    {
      title: 'Advanced',
      items: [
        { label: 'Diff Viewer', route: '/diff-viewer', icon: GitCompare },
        { label: 'Multi-Code Viewer', route: '/multi-code-viewer', icon: Layers },
      ],
    },
    {
      title: 'Tools',
      items: [{ label: 'Playground', route: '/playground', icon: Play }],
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
