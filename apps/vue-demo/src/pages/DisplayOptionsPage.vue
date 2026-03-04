<template>
  <div class="page-container" :class="theme">
    <header class="page-header">
      <h1 class="page-title">Display Options</h1>
      <p class="page-description">
        Customize how code is displayed with various configuration options like headers,
        line numbers, max height, and word wrapping.
      </p>
    </header>

    <section class="demo-section">
      <h2 class="demo-section-title">Without Header</h2>
      <p class="demo-section-description">
        Display code without the header bar for a minimal look.
      </p>
      <CodeViewer
        code="const simple = true;"
        language="typescript"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        :showHeader="false"
        :showLineNumbers="true"
      />
    </section>

    <section class="demo-section">
      <h2 class="demo-section-title">Without Line Numbers</h2>
      <p class="demo-section-description">
        Hide line numbers for cleaner code display when line references aren't needed.
      </p>
      <CodeViewer
        code="echo 'Hello, World!'"
        language="bash"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        title="Bash"
        :showLineNumbers="false"
        :showCopyButton="true"
      />
    </section>

    <section class="demo-section">
      <h2 class="demo-section-title">With Max Height (Scrollable)</h2>
      <p class="demo-section-description">
        Set a maximum height for longer code snippets. Content will scroll when it exceeds the limit.
      </p>
      <CodeViewer
        :code="longCodeExample.code"
        :language="longCodeExample.language"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        :title="longCodeExample.title"
        :fileExtension="longCodeExample.fileExtension"
        :showLineNumbers="true"
        maxHeight="300px"
      />
    </section>

    <section class="demo-section">
      <h2 class="demo-section-title">With Word Wrap</h2>
      <p class="demo-section-description">
        Enable word wrap to prevent horizontal scrolling for long lines of text.
      </p>
      <CodeViewer
        :code="wordWrapExample"
        language="plaintext"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        title="Word Wrap Demo"
        :wordWrap="true"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { CodeViewer } from '@ngeenx/nx-vue-code-viewer';
import type { CodeViewerLanguage } from '@ngeenx/nx-vue-code-viewer';
import { useTheme } from '../composables/useTheme';

const { theme, getResolvedShikiTheme } = useTheme();

const wordWrapExample = [
  'This is a very long line of text that should wrap when word wrap is enabled. It contains multiple sentences to demonstrate the wrapping behavior of the code viewer component.',
  'This is another line to show how the wrapping works with multiple lines of content. This is another line to show how the wrapping works with multiple lines of content.',
];

const longCodeExample: {
  title: string;
  code: string;
  language: CodeViewerLanguage;
  fileExtension: string;
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
   * @param tableName - The name of the table the ENUM field belongs to
   * @param fieldName - The name of the ENUM field/column
   * @returns A PostgreSQL DROP TYPE statement string
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
   * @param _enum - A Record object containing the enum key-value pairs
   * @param exclude - Optional value to exclude from random selection
   * @returns A random enum value string
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
</script>
