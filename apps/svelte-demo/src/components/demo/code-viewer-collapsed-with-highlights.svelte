<script lang="ts">
  import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type {
    CodeViewerLanguage,
    CollapsedLinesInput,
    HighlightedLinesInput,
  } from '@ngeenx/nx-code-viewer-utils';
  import { useDemoOptions } from './_shared/useDemoOptions.svelte';

  const options = useDemoOptions();

  const language: CodeViewerLanguage = 'typescript';
  const collapsedLines: CollapsedLinesInput = [[4, 8]];
  const highlightedLines: HighlightedLinesInput = [10, 11, 22, 23];

  const sample = `import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ExampleComponent demonstrates the collapsed lines feature.
 * This comment block is initially collapsed.
 * Click the expand icon to reveal it.
 */
@Component({
  selector: 'app-example',
  template: '<h1>{{ title() }}</h1>',
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
}`;
</script>

<div class="stage {options.codeViewerThemeClass}">
  <CodeViewer
    code={sample}
    {language}
    theme={options.theme}
    shikiTheme={options.shikiTheme}
    {collapsedLines}
    {highlightedLines}
    title="Collapsed + Highlights"
    fileExtension="ts"
  />
</div>

<style>
  .stage {
    width: 600px;
  }
  .stage :global(.nx-code-viewer) {
    width: 100%;
  }
</style>
