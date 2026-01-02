import { Component, effect, signal } from '@angular/core';
import {
  CodeViewerBorderStyle,
  CodeViewerComponent,
  CodeViewerLanguage,
  CodeViewerTheme,
  DiffViewerComponent,
  DiffViewMode,
  FocusedLinesInput,
  HighlightedLinesInput,
  MultiCodeViewerComponent,
  MultiCodeViewerTabItem,
  ReferenceConfig,
} from '@ngeenx/nx-angular-code-viewer';
import { TodoInfoComponent } from './components/todo-info.component';

const THEME_STORAGE_KEY = 'code-viewer-theme';

@Component({
  imports: [CodeViewerComponent, DiffViewerComponent, MultiCodeViewerComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly theme = signal<CodeViewerTheme>(this.getStoredTheme());

  constructor() {
    effect(() => {
      localStorage.setItem(THEME_STORAGE_KEY, this.theme());
    });
  }

  private getStoredTheme(): CodeViewerTheme {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'dark';
  }

  protected readonly examples: {
    title: string;
    code: string;
    language: CodeViewerLanguage;
    fileExtension?: string;
  }[] = [
    {
      title: 'TypeScript',
      language: 'typescript',
      fileExtension: '.ts',
      code: `interface User {
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

console.log(greetUser(user));`,
    },
    {
      title: 'JavaScript',
      language: 'javascript',
      fileExtension: '.js',
      code: `const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

fetchData('https://api.example.com/users')
  .then(users => console.log(users));`,
    },
    {
      title: 'HTML',
      language: 'html',
      fileExtension: '.html',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demo Page</title>
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
    },
    {
      title: 'CSS',
      language: 'css',
      fileExtension: '.css',
      code: `.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
}

.button {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: #2563eb;
}`,
    },
    {
      title: 'JSON',
      language: 'json',
      fileExtension: '.json',
      code: `{
  "name": "nx-code-viewer",
  "version": "1.0.0",
  "description": "A syntax highlighting code viewer component",
  "keywords": ["angular", "code", "viewer", "syntax-highlighting"],
  "dependencies": {
    "@angular/core": "^19.0.0",
    "shiki": "^1.0.0"
  }
}`,
    },
  ];

  protected readonly longCodeExample: {
    title: string;
    code: string;
    language: CodeViewerLanguage;
    fileExtension?: string;
  } = {
    title: 'knex-util.ts',
    language: 'typescript',
    fileExtension: '.ts',
    code: `/**
 * Utility class for generating PostgreSQL ENUM type SQL statements for Knex migrations.
 * This class provides helper methods to create, drop, and work with custom ENUM types
 * in PostgreSQL databases when using MikroORM with Knex as the query builder.
 */
export default class KnexEnumFieldGenerator {
  /**
   * Generates a PostgreSQL CREATE TYPE statement for an ENUM field.
   *
   * Use Case:
   * - When defining a new ENUM column in a Knex migration, PostgreSQL requires
   *   the ENUM type to be created separately before it can be used as a column type.
   * - This method constructs the SQL statement needed to create that custom ENUM type.
   *
   * Why this method exists:
   * - Knex does not natively support PostgreSQL ENUM types, so raw SQL is required.
   * - Centralizes ENUM type naming convention (\`{tableName}_{fieldName}\`) for consistency.
   * - Ensures enum values are properly quoted and formatted for PostgreSQL syntax.
   *
   * @param tableName - The name of the table the ENUM field belongs to
   * @param fieldName - The name of the ENUM field/column
   * @param _enum - A Record object containing the enum key-value pairs
   * @returns A PostgreSQL CREATE TYPE statement string
   *
   * @example
   * // Given enum: { ACTIVE: 'active', INACTIVE: 'inactive' }
   * // Returns: "CREATE TYPE users_status AS ENUM ('active', 'inactive');"
   */
  public static generateEnumType(
    tableName: string,
    fieldName: string,
    _enum: Record<string, string>
  ): string {
    const importSources = Object.values(_enum)
      .map(key => \`'\${key}'\`)
      .join(', ');

    return \`CREATE TYPE \${tableName}_\${fieldName} AS ENUM (\${importSources});\`;
  }

  /**
   * Generates a PostgreSQL DROP TYPE statement for an ENUM field.
   *
   * Use Case:
   * - When rolling back a migration that created an ENUM column, the associated
   *   ENUM type must also be dropped to fully revert the schema changes.
   * - Used in the \`down()\` method of Knex migrations.
   *
   * Why this method exists:
   * - Ensures consistent naming convention when dropping ENUM types.
   * - Uses \`IF EXISTS\` to prevent errors if the type was already dropped or never created.
   * - Pairs with \`generateEnumType()\` for complete migration lifecycle support.
   *
   * @param tableName - The name of the table the ENUM field belongs to
   * @param fieldName - The name of the ENUM field/column
   * @returns A PostgreSQL DROP TYPE statement string
   *
   * @example
   * // Returns: "DROP TYPE IF EXISTS users_status;"
   */
  public static generateEnumFieldDrop(
    tableName: string,
    fieldName: string
  ): string {
    return \`DROP TYPE IF EXISTS \${tableName}_\${fieldName};\`;
  }

  /**
   * Returns a random value from an ENUM object, optionally excluding a specific value.
   *
   * Use Case:
   * - Useful in seeding scripts or test factories where random ENUM values are needed.
   * - The exclude parameter allows avoiding specific values (e.g., excluding 'deleted'
   *   status when creating active test records).
   *
   * Why this method exists:
   * - Provides a convenient utility for generating test/seed data with valid ENUM values.
   * - Centralizes random ENUM selection logic to avoid code duplication across seeders.
   * - Supports filtering out unwanted values for more controlled randomization.
   *
   * @param _enum - A Record object containing the enum key-value pairs
   * @param exclude - Optional value to exclude from random selection
   * @returns A random enum value string
   *
   * @example
   * // Given enum: { ACTIVE: 'active', INACTIVE: 'inactive', DELETED: 'deleted' }
   * // getRandomEnumValue(StatusEnum) might return 'active', 'inactive', or 'deleted'
   * // getRandomEnumValue(StatusEnum, 'deleted') will only return 'active' or 'inactive'
   */
  public static getRandomEnumValue(
    _enum: Record<string, string>,
    exclude?: string
  ): string {
    const values = exclude
      ? Object.values(_enum).filter(value => value !== exclude)
      : Object.values(_enum);

    return values[Math.floor(Math.random() * values.length)];
  }
}
`,
  };

  // Border style examples
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

  // Highlighted lines example
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

  // Focused lines example (blurs unfocused lines)
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

  // Combined focused and highlighted lines example
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

  // Diff viewer examples
  protected readonly diffViewMode = signal<DiffViewMode>('unified');

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

  // Reference links example
  protected readonly referenceLinksExample = {
    code: `import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-example',
  template: '<h1>{{ title() }}</h1>',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ExampleComponent {
  // TODO: Add more features here
  readonly title = signal('Hello, World!');
}`,
    language: 'typescript' as CodeViewerLanguage,
    references: [
      {
        textMatch: /@angular\/core/g,
        type: ['link', 'info'] as const,
        link: 'https://angular.dev/api#angular_core',
        target: '_blank',
        content: 'Core Angular library - Component, signal, and more',
      },
      {
        textMatch: /@angular\/common/g,
        type: ['link', 'info'] as const,
        link: 'https://angular.dev/api#angular_common',
        target: '_blank',
        content: 'Common Angular directives like @if, @for etc',
      },
      {
        textMatch: /@angular\/router/g,
        type: ['link', 'info'] as const,
        link: 'https://angular.dev/api#angular_router',
        target: '_blank',
        content: 'Angular Router for navigation and routing',
      },
      {
        textMatch: /TODO:.*/g,
        type: 'info',
        content: TodoInfoComponent,
      },
      {
        textMatch: /@Component/g,
        type: 'info',
        content:
          'Decorator that marks a class as an Angular component and provides configuration metadata that determines how the component should be processed, instantiated, and used at runtime.',
      },
    ] as ReferenceConfig[],
  };

  // Multi-code viewer example
  protected readonly multiCodeViewerTabs: MultiCodeViewerTabItem[] = [
    {
      id: 'component',
      type: 'code',
      fileName: 'user.component.ts',
      fileExtension: '.ts',
      language: 'typescript',
      code: `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  readonly name = signal('John Doe');
  readonly email = signal('john@example.com');
}`,
    },
    {
      id: 'template',
      type: 'code',
      fileName: 'user.component.html',
      fileExtension: '.html',
      language: 'html',
      code: `<div class="user-card">
  <h2>{{ name() }}</h2>
  <p>{{ email() }}</p>
  <button (click)="edit()">Edit Profile</button>
</div>`,
    },
    {
      id: 'styles',
      type: 'code',
      fileName: 'user.component.css',
      fileExtension: '.css',
      language: 'css',
      code: `.user-card {
  padding: 1rem;
  border-radius: 0.5rem;
  background: var(--card-bg);
}

.user-card h2 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}`,
    },
    {
      id: 'changes',
      type: 'diff',
      fileName: 'user.service.ts',
      fileExtension: '.ts',
      language: 'typescript',
      oldCode: `export class UserService {
  getUser(id: number) {
    return this.http.get('/api/users/' + id);
  }
}`,
      newCode: `export class UserService {
  getUser(id: number) {
    return this.http.get<User>(\`/api/users/\${id}\`);
  }

  updateUser(id: number, data: Partial<User>) {
    return this.http.patch<User>(\`/api/users/\${id}\`, data);
  }
}`,
    },
  ];

  protected toggleTheme(): void {
    this.theme.update(current => (current === 'dark' ? 'light' : 'dark'));
  }

  protected toggleDiffViewMode(): void {
    this.diffViewMode.update(current =>
      current === 'unified' ? 'split' : 'unified'
    );
  }

  protected onCodeCopied(title: string): void {
    console.log(`Code copied from: ${title}`);
  }
}
