<template>
  <div class="stage">
    <CodeViewer
      :class="codeViewerThemeClass"
      :code="sample"
      :language="language"
      :theme="theme"
      :shikiTheme="shikiTheme"
      :lineWidgets="lineWidgets"
      title="line-widgets.ts"
      fileExtension="ts"
      @line-widget-click="onLineWidgetClick"
    />
  </div>
</template>

<script setup lang="ts">
import {
  CodeViewer,
  type CodeViewerLanguage,
  type VueLineWidgetsInput,
  type VueLineWidgetClickEvent,
} from '@ngeenx/nx-vue-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';
import BookmarkWidget from '../widgets/BookmarkWidget.vue';
import CommentWidget from '../widgets/CommentWidget.vue';
import CommentFormWidget from '../widgets/CommentFormWidget.vue';

const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();

const language: CodeViewerLanguage = 'typescript';

const lineWidgets: VueLineWidgetsInput = [
  {
    position: 'left',
    display: 'hover',
    lineComponent: BookmarkWidget,
  },
  {
    position: 'right',
    display: 'hover',
    lineComponent: CommentWidget,
    insertComponent: CommentFormWidget,
  },
];

const sample = `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <div class="counter">
      <h1>Count: {{ count() }}</h1>
      <button (click)="increment()">+</button>
      <button (click)="decrement()">-</button>
    </div>
  \`,
})
export class CounterComponent {
  readonly count = signal(0);

  increment(): void {
    this.count.update(n => n + 1);
  }

  decrement(): void {
    this.count.update(n => n - 1);
  }
}`;

function onLineWidgetClick(event: VueLineWidgetClickEvent): void {
  console.log('Line widget clicked:', event);
}
</script>

<style scoped>
.stage {
  width: 600px;
}
.stage > :deep(*) {
  width: 100%;
}
</style>
