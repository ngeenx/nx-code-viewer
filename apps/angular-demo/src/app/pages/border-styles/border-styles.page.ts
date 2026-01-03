import { Component, inject } from '@angular/core';
import {
  CodeViewerComponent,
  CodeViewerBorderStyle,
  CodeViewerLanguage,
} from '@ngeenx/nx-angular-code-viewer';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-border-styles',
  standalone: true,
  imports: [CodeViewerComponent],
  templateUrl: './border-styles.page.html',
  styleUrls: ['../page.css'],
})
export class BorderStylesPage {
  protected readonly themeService = inject(ThemeService);
  protected readonly theme = this.themeService.theme;

  protected readonly borderStyles: CodeViewerBorderStyle[] = [
    'classic',
    'grid-cross',
    'corner-intersection',
    'none',
  ];

  protected readonly borderStyleExample = {
    code: `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`,
    language: 'typescript' as CodeViewerLanguage,
  };
}
