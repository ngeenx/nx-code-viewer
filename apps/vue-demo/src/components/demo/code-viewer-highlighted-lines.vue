<template>
  <div class="stage">
    <CodeViewer
      :class="codeViewerThemeClass"
      :code="sample"
      :language="language"
      :theme="theme"
      :shikiTheme="shikiTheme"
      :highlightedLines="highlightedLines"
      title="Highlighted Lines"
      fileExtension="ts"
    />
  </div>
</template>

<script setup lang="ts">
import {
  CodeViewer,
  type CodeViewerLanguage,
  type HighlightedLinesInput,
} from '@ngeenx/nx-vue-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();

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

<style scoped>
.stage {
  width: 600px;
}
.stage > :deep(*) {
  width: 100%;
}
</style>
