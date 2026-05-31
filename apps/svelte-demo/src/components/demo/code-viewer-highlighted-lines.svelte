<script lang="ts">
  import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type {
    CodeViewerLanguage,
    HighlightedLinesInput,
  } from '@ngeenx/nx-code-viewer-utils';
  import { useDemoOptions } from './_shared/useDemoOptions.svelte';

  const options = useDemoOptions();

  const language: CodeViewerLanguage = 'typescript';
  const highlightedLines: HighlightedLinesInput = [3, [7, 9], 12];

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
    {highlightedLines}
    title="Highlighted Lines"
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
