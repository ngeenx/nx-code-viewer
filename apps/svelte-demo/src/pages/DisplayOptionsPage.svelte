<script lang="ts">
  import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type { CodeViewerLanguage } from '@ngeenx/nx-code-viewer-utils';
  import { useTheme } from '../stores/theme.svelte';

  const { theme, getResolvedShikiTheme } = useTheme();

  const wordWrapExample = [
    'This is a very long line of text that should wrap when word wrap is enabled. It contains multiple sentences to demonstrate the wrapping behavior of the code viewer component.',
    'This is another line to show how the wrapping works with multiple lines of content. This is another line to show how the wrapping works with multiple lines of content.',
  ];

  const longCodeExample = {
    title: 'knex-util.ts',
    language: 'typescript' as CodeViewerLanguage,
    fileExtension: '.ts',
    code: `/**
 * Utility class for generating PostgreSQL ENUM type SQL statements for Knex migrations.
 */
export default class KnexEnumFieldGenerator {
  /**
   * Generates a PostgreSQL CREATE TYPE statement for an ENUM field.
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
   */
  public static generateEnumFieldDrop(
    tableName: string,
    fieldName: string
  ): string {
    return \`DROP TYPE IF EXISTS \${tableName}_\${fieldName};\`;
  }

  /**
   * Returns a random value from an ENUM object.
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
}`,
  };
</script>

<div class="page-container {theme}">
  <header class="page-header">
    <h1 class="page-title">Display Options</h1>
    <p class="page-description">
      Customize how code is displayed with various configuration options like headers,
      line numbers, max height, and word wrapping.
    </p>
  </header>

  <section class="demo-section">
    <h2 class="demo-section-title">Without Header</h2>
    <p class="demo-section-description">Display code without the header bar for a minimal look.</p>
    <CodeViewer
      code="const simple = true;"
      language="typescript"
      {theme}
      shikiTheme={getResolvedShikiTheme()}
      showHeader={false}
      showLineNumbers={true}
    />
  </section>

  <section class="demo-section">
    <h2 class="demo-section-title">Without Line Numbers</h2>
    <p class="demo-section-description">Hide line numbers for cleaner code display when line references aren't needed.</p>
    <CodeViewer
      code="echo 'Hello, World!'"
      language="bash"
      {theme}
      shikiTheme={getResolvedShikiTheme()}
      title="Bash"
      showLineNumbers={false}
      showCopyButton={true}
    />
  </section>

  <section class="demo-section">
    <h2 class="demo-section-title">With Max Height (Scrollable)</h2>
    <p class="demo-section-description">Set a maximum height for longer code snippets. Content will scroll when it exceeds the limit.</p>
    <CodeViewer
      code={longCodeExample.code}
      language={longCodeExample.language}
      {theme}
      shikiTheme={getResolvedShikiTheme()}
      title={longCodeExample.title}
      fileExtension={longCodeExample.fileExtension}
      showLineNumbers={true}
      maxHeight="300px"
    />
  </section>

  <section class="demo-section">
    <h2 class="demo-section-title">With Word Wrap</h2>
    <p class="demo-section-description">Enable word wrap to prevent horizontal scrolling for long lines of text.</p>
    <CodeViewer
      code={wordWrapExample}
      language="plaintext"
      {theme}
      shikiTheme={getResolvedShikiTheme()}
      title="Word Wrap Demo"
      wordWrap={true}
    />
  </section>
</div>
