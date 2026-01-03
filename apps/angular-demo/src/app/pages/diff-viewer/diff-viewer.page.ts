import { Component, inject, signal } from '@angular/core';
import {
  DiffViewerComponent,
  DiffViewMode,
  CodeViewerLanguage,
  CodeViewerBorderStyle,
  DiffCollapsedLinesInput,
} from '@ngeenx/nx-angular-code-viewer';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-diff-viewer',
  standalone: true,
  imports: [DiffViewerComponent],
  templateUrl: './diff-viewer.page.html',
  styleUrls: ['../page.css'],
})
export class DiffViewerPage {
  protected readonly themeService = inject(ThemeService);
  protected readonly theme = this.themeService.theme;
  protected readonly diffViewMode = signal<DiffViewMode>('unified');

  protected readonly borderStyles: CodeViewerBorderStyle[] = [
    'classic',
    'grid-cross',
    'corner-intersection',
    'none',
  ];

  protected readonly diffExamples: {
    title: string;
    oldCode: string;
    newCode: string;
    language: CodeViewerLanguage;
    fileExtension: string;
    oldFileName: string;
    newFileName: string;
    showLineNumbers: boolean;
  }[] = [
    {
      title: 'TypeScript',
      language: 'typescript',
      fileExtension: '.ts',
      oldFileName: 'user.ts',
      newFileName: 'user.ts',
      showLineNumbers: true,
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
  createdAt: Date;
}

function getUser(id: number): User | null {
  if (id <= 0) return null;
  return {
    id,
    name: 'John',
    email: 'john@example.com',
    createdAt: new Date()
  };
}`,
    },
    {
      title: 'HTML',
      language: 'html',
      fileExtension: '.html',
      oldFileName: 'index.html',
      newFileName: 'index.html',
      showLineNumbers: true,
      oldCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My App</title>
</head>
<body>
  <header>
    <h1>Welcome</h1>
  </header>
  <main>
    <p>Hello, World!</p>
  </main>
</body>
</html>`,
      newCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App - Enhanced</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="site-header">
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
    <h1>Welcome</h1>
  </header>
  <main class="content">
    <section>
      <p>Hello, World!</p>
      <button id="cta">Get Started</button>
    </section>
  </main>
  <footer>
    <p>&copy; 2024 My App</p>
  </footer>
</body>
</html>`,
    },
    {
      title: 'Plaintext',
      language: 'plaintext',
      fileExtension: '.txt',
      oldFileName: 'notes.txt',
      newFileName: 'notes.txt',
      showLineNumbers: false,
      oldCode: `Project Notes
=============

Current Status:
- Basic implementation complete
- Testing in progress

TODO:
- Fix bug in login module
- Update documentation

Team Members:
- Alice (Lead)
- Bob (Developer)`,
      newCode: `Project Notes
=============

Current Status:
- Basic implementation complete
- Testing completed successfully
- Ready for code review

TODO:
- Update documentation
- Prepare release notes
- Schedule deployment

Team Members:
- Alice (Lead)
- Bob (Developer)
- Charlie (QA)`,
    },
  ];

  protected readonly diffCollapsedLinesExample: {
    oldCode: string;
    newCode: string;
    language: CodeViewerLanguage;
    collapsedLines: DiffCollapsedLinesInput;
  } = {
    language: 'typescript',
    collapsedLines: [
      { startIndex: 2, endIndex: 5 },
      { startIndex: 10, endIndex: 13 },
    ],
    oldCode: `import { Component } from '@angular/core';

/**
 * UserComponent displays user information.
 * This is a multi-line comment block.
 */
@Component({
  selector: 'app-user',
  template: '<div>{{ name }}</div>',
})
export class UserComponent {
  name = 'John Doe';
  email = 'john@example.com';
}`,
    newCode: `import { Component, signal } from '@angular/core';

/**
 * UserComponent displays user information.
 * This is a multi-line comment block.
 * Updated with signals support.
 */
@Component({
  selector: 'app-user',
  template: '<div>{{ name() }}</div>',
  standalone: true,
})
export class UserComponent {
  readonly name = signal('John Doe');
  readonly email = signal('john@example.com');
  readonly isActive = signal(true);
}`,
  };

  protected toggleDiffViewMode(): void {
    this.diffViewMode.update(current =>
      current === 'unified' ? 'split' : 'unified'
    );
  }
}
