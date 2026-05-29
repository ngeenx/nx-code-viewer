<template>
  <div class="stage">
    <CodeViewer
      :class="codeViewerThemeClass"
      :code="sample"
      :language="language"
      :theme="theme"
      :shikiTheme="shikiTheme"
      :collapsedLines="collapsedLines"
      :highlightedLines="highlightedLines"
      title="Collapsed + Highlights"
      fileExtension="ts"
    />
  </div>
</template>

<script setup lang="ts">
import {
  CodeViewer,
  type CodeViewerLanguage,
  type CollapsedLinesInput,
  type HighlightedLinesInput,
} from '@ngeenx/nx-vue-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();

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

<style scoped>
.stage {
  width: 600px;
}
.stage > :deep(*) {
  width: 100%;
}
</style>
