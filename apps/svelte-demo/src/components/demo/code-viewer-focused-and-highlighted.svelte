<script lang="ts">
  import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type {
    CodeViewerLanguage,
    FocusedLinesInput,
    HighlightedLinesInput,
  } from '@ngeenx/nx-code-viewer-utils';
  import { useDemoOptions } from './_shared/useDemoOptions.svelte';

  const options = useDemoOptions();

  const language: CodeViewerLanguage = 'typescript';
  const focusedLines: FocusedLinesInput = [[3, 13]];
  const highlightedLines: HighlightedLinesInput = [4, 5, 11];

  const sample = `import { Component } from '@angular/core';

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
}`;
</script>

<div class="stage {options.codeViewerThemeClass}">
  <CodeViewer
    code={sample}
    {language}
    theme={options.theme}
    shikiTheme={options.shikiTheme}
    {focusedLines}
    {highlightedLines}
    title="Focused + Highlighted"
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
