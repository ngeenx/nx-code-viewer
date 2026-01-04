import { Component, inject } from '@angular/core';
import {
  CodeViewerComponent,
  DiffViewerComponent,
  CodeViewerLanguage,
} from '@ngeenx/nx-angular-code-viewer';
import { ThemeService } from '../../services/theme.service';

interface ThemeExample {
  name: string;
  cssClass: string;
  description: string;
}

@Component({
  selector: 'app-theming',
  standalone: true,
  imports: [CodeViewerComponent, DiffViewerComponent],
  templateUrl: './theming.page.html',
  styleUrls: ['../page.css'],
})
export class ThemingPage {
  protected readonly themeService = inject(ThemeService);
  protected readonly theme = this.themeService.theme;
  protected readonly shikiTheme = this.themeService.getResolvedShikiTheme.bind(
    this.themeService
  );

  protected readonly themes: ThemeExample[] = [
    {
      name: 'Cyberpunk',
      cssClass: 'theme-cyberpunk',
      description: 'A neon-inspired theme with cyan/magenta accents',
    },
    {
      name: 'Minimal',
      cssClass: 'theme-minimal',
      description: 'A clean, subtle theme with reduced visual noise',
    },
    {
      name: 'High Contrast',
      cssClass: 'theme-high-contrast',
      description: 'Enhanced visibility with bolder colors',
    },
    {
      name: 'GitHub',
      cssClass: 'theme-github',
      description: "Inspired by GitHub's code viewing interface",
    },
    {
      name: 'Dracula',
      cssClass: 'theme-dracula',
      description: 'A dark theme with vibrant purple and pink accents',
    },
    {
      name: 'Handwritten',
      cssClass: 'theme-handwritten',
      description: 'A playful theme with the Borel handwritten font',
    },
  ];

  protected readonly codeExample = `interface User {
  id: number;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}!\`;
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
};

console.log(greetUser(user));`;

  protected readonly diffExample = {
    language: 'typescript' as CodeViewerLanguage,
    oldCode: `interface User {
  id: number;
  name: string;
}

function getUser(id: number): User {
  return { id, name: 'John' };
}`,
    newCode: `interface User {
  id: number;
  name: string;
  email: string;
}

function getUser(id: number): User | null {
  if (id <= 0) return null;
  return {
    id,
    name: 'John',
    email: 'john@example.com'
  };
}`,
  };
}
