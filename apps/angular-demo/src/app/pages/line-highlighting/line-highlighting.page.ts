import { Component, inject } from '@angular/core';
import {
  CodeViewerComponent,
  CodeViewerLanguage,
  HighlightedLinesInput,
  FocusedLinesInput,
  CollapsedLinesInput,
} from '@ngeenx/nx-angular-code-viewer';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-line-highlighting',
  standalone: true,
  imports: [CodeViewerComponent],
  templateUrl: './line-highlighting.page.html',
  styleUrls: ['../page.css'],
})
export class LineHighlightingPage {
  protected readonly themeService = inject(ThemeService);
  protected readonly theme = this.themeService.theme;

  protected readonly highlightedLinesExample: {
    code: string;
    language: CodeViewerLanguage;
    highlightedLines: HighlightedLinesInput;
  } = {
    language: 'typescript',
    highlightedLines: [3, [7, 9], 12],
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<h1>Hello World</h1>',
})
export class AppComponent {
  title = 'my-app';
  count = 0;

  increment() {
    this.count++;
  }
}`,
  };

  protected readonly focusedLinesExample: {
    code: string;
    language: CodeViewerLanguage;
    focusedLines: FocusedLinesInput;
  } = {
    language: 'typescript',
    focusedLines: [[3, 6], 12],
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<h1>Hello World</h1>',
})
export class AppComponent {
  title = 'my-app';
  count = 0;

  increment() {
    this.count++;
  }
}`,
  };

  protected readonly focusedAndHighlightedExample: {
    code: string;
    language: CodeViewerLanguage;
    focusedLines: FocusedLinesInput;
    highlightedLines: HighlightedLinesInput;
  } = {
    language: 'typescript',
    focusedLines: [[3, 13]],
    highlightedLines: [4, 5, 11],
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<h1>Hello World</h1>',
})
export class AppComponent {
  title = 'my-app';
  count = 0;

  increment() {
    this.count++;
  }
}`,
  };

  protected readonly collapsedLinesExample: {
    code: string;
    language: CodeViewerLanguage;
    collapsedLines: CollapsedLinesInput;
  } = {
    language: 'typescript',
    collapsedLines: [
      [4, 8],
      [15, 20],
    ],
    code: `import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ExampleComponent demonstrates the collapsed lines feature.
 * This comment block is initially collapsed.
 * Click the expand icon to reveal it.
 */
@Component({
  selector: 'app-example',
  template: '<h1>{{ title() }}</h1>',
  standalone: true,
  imports: [CommonModule],
})
export class ExampleComponent {
  /**
   * The title signal holds the display text.
   * This is another collapsed block.
   * Expand to see the full documentation.
   */
  readonly title = signal('Hello, World!');
  readonly count = signal(0);

  increment(): void {
    this.count.update(n => n + 1);
  }
}`,
  };

  protected readonly collapsedWithHighlightsExample: {
    code: string;
    language: CodeViewerLanguage;
    collapsedLines: CollapsedLinesInput;
    highlightedLines: HighlightedLinesInput;
  } = {
    language: 'typescript',
    collapsedLines: [[4, 8]],
    highlightedLines: [10, 11, 22, 23],
    code: `import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ExampleComponent demonstrates the collapsed lines feature.
 * This comment block is initially collapsed.
 * Click the expand icon to reveal it.
 */
@Component({
  selector: 'app-example',
  template: '<h1>{{ title() }}</h1>',
  standalone: true,
  imports: [CommonModule],
})
export class ExampleComponent {
  readonly title = signal('Hello, World!');
  readonly count = signal(0);

  increment(): void {
    this.count.update(n => n + 1);
  }

  decrement(): void {
    this.count.update(n => n - 1);
  }
}`,
  };
}
