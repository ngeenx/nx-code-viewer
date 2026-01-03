import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from '../services/theme.service';

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
}
