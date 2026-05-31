<script lang="ts">
  import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type {
    CodeViewerBorderStyle,
    CodeViewerLanguage,
  } from '@ngeenx/nx-code-viewer-utils';
  import { useDemoOptions } from './_shared/useDemoOptions.svelte';

  const options = useDemoOptions();

  const language: CodeViewerLanguage = 'typescript';
  const borderStyles: CodeViewerBorderStyle[] = [
    'classic',
    'grid-cross',
    'corner-intersection',
    'none',
  ];

  const sample = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`;
</script>

<div class="border-styles-demo {options.codeViewerThemeClass}" data-theme={options.theme}>
  {#each borderStyles as borderStyle}
    <figure class="item">
      <figcaption class="caption">{borderStyle}</figcaption>

      <CodeViewer
        code={sample}
        {language}
        theme={options.theme}
        shikiTheme={options.shikiTheme}
        {borderStyle}
        showHeader={false}
        showLineNumbers={false}
      />
    </figure>
  {/each}
</div>

<style>
  .border-styles-demo {
    margin: 5rem;
    display: grid;
    gap: 1.25rem;
  }

  .item {
    margin: 0;
  }

  .caption {
    margin-bottom: 0.5rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
    font-size: 1rem;
    text-align: center;
    font-weight: 600;
    text-transform: uppercase;
    line-height: 1;
    letter-spacing: 0.04em;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    color: color-mix(in oklab, currentColor 65%, transparent);
  }
</style>
