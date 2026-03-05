import { CodeViewer } from '@ngeenx/nx-react-code-viewer';
import { useTheme } from '../hooks/useTheme';

const longCodeExample = {
  title: 'knex-util.ts',
  language: 'typescript' as const,
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

export default function DisplayOptionsPage() {
  const { theme, getResolvedShikiTheme } = useTheme();

  return (
    <div className={`page-container ${theme}`}>
      <header className="page-header">
        <h1 className="page-title">Display Options</h1>
        <p className="page-description">
          Customize how code is displayed with various configuration options like headers,
          line numbers, max height, and word wrapping.
        </p>
      </header>

      <section className="demo-section">
        <h2 className="demo-section-title">Without Header</h2>
        <p className="demo-section-description">
          Display code without the header bar for a minimal look.
        </p>
        <CodeViewer
          code="const simple = true;"
          language="typescript"
          theme={theme}
          shikiTheme={getResolvedShikiTheme()}
          showHeader={false}
          showLineNumbers={true}
        />
      </section>

      <section className="demo-section">
        <h2 className="demo-section-title">Without Line Numbers</h2>
        <p className="demo-section-description">
          Hide line numbers for cleaner code display when line references aren't needed.
        </p>
        <CodeViewer
          code="echo 'Hello, World!'"
          language="bash"
          theme={theme}
          shikiTheme={getResolvedShikiTheme()}
          title="Bash"
          showLineNumbers={false}
          showCopyButton={true}
        />
      </section>

      <section className="demo-section">
        <h2 className="demo-section-title">With Max Height (Scrollable)</h2>
        <p className="demo-section-description">
          Set a maximum height for longer code snippets. Content will scroll when it exceeds the limit.
        </p>
        <CodeViewer
          code={longCodeExample.code}
          language={longCodeExample.language}
          theme={theme}
          shikiTheme={getResolvedShikiTheme()}
          title={longCodeExample.title}
          fileExtension={longCodeExample.fileExtension}
          showLineNumbers={true}
          maxHeight="300px"
        />
      </section>

      <section className="demo-section">
        <h2 className="demo-section-title">With Word Wrap</h2>
        <p className="demo-section-description">
          Enable word wrap to prevent horizontal scrolling for long lines of text.
        </p>
        <CodeViewer
          code={[
            'This is a very long line of text that should wrap when word wrap is enabled. It contains multiple sentences to demonstrate the wrapping behavior of the code viewer component.',
            'This is another line to show how the wrapping works with multiple lines of content. This is another line to show how the wrapping works with multiple lines of content.',
          ]}
          language="plaintext"
          theme={theme}
          shikiTheme={getResolvedShikiTheme()}
          title="Word Wrap Demo"
          wordWrap={true}
        />
      </section>
    </div>
  );
}
