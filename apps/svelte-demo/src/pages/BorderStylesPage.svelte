<script lang="ts">
  import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type { CodeViewerBorderStyle, CodeViewerLanguage } from '@ngeenx/nx-code-viewer-utils';
  import { useTheme } from '../stores/theme.svelte';

  const { theme, getResolvedShikiTheme } = useTheme();

  const borderStyles: CodeViewerBorderStyle[] = [
    'classic',
    'grid-cross',
    'corner-intersection',
    'none',
  ];

  const borderStyleExample = {
    code: `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`,
    language: 'typescript' as CodeViewerLanguage,
  };
</script>

<div class="page-container" class:dark={theme === 'dark'} class:light={theme === 'light'}>
  <header class="page-header">
    <h1 class="page-title">Border Styles</h1>
    <p class="page-description">
      Choose from different border style variants to match your design aesthetic:
      classic, grid-cross, corner-intersection, and none.
    </p>
  </header>

  <section class="demo-section">
    <h2 class="demo-section-title">Available Border Styles</h2>
    {#each borderStyles as borderStyle}
      <div class="demo-item">
        <h3 class="demo-item-subtitle">{borderStyle}</h3>
        <CodeViewer
          code={borderStyleExample.code}
          language={borderStyleExample.language}
          {theme}
          shikiTheme={getResolvedShikiTheme()}
          {borderStyle}
          showHeader={false}
          showLineNumbers={false}
        />
      </div>
    {/each}
  </section>
</div>
