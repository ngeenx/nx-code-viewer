import { Component, signal } from '@angular/core';
import {
  CodeViewerComponent,
  CodeViewerLanguage,
  CodeViewerTheme,
} from '@ngeenx/nx-angular-code-viewer';

@Component({
  imports: [CodeViewerComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly theme = signal<CodeViewerTheme>('dark');

  protected readonly examples: {
    title: string;
    code: string;
    language: CodeViewerLanguage;
  }[] = [
    {
      title: 'TypeScript',
      language: 'typescript',
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
  } = {
    title: 'knex-util.ts',
    language: 'typescript',
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

  protected toggleTheme(): void {
    this.theme.update(current => (current === 'dark' ? 'light' : 'dark'));
  }

  protected onCodeCopied(title: string): void {
    console.log(`Code copied from: ${title}`);
  }
}
