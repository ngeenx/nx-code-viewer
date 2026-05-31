<script lang="ts">
  import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type {
    SvelteLineWidgetsInput,
    SvelteLineWidgetClickEvent,
  } from '@ngeenx/nx-svelte-code-viewer';
  import type { CodeViewerLanguage } from '@ngeenx/nx-code-viewer-utils';
  import { useDemoOptions } from './_shared/useDemoOptions.svelte';
  import BookmarkWidget from '../BookmarkWidget.svelte';
  import CommentWidget from '../CommentWidget.svelte';
  import CommentForm from '../CommentForm.svelte';

  const options = useDemoOptions();

  const language: CodeViewerLanguage = 'typescript';

  const lineWidgets: SvelteLineWidgetsInput = [
    {
      position: 'left',
      display: 'hover',
      lineComponent: BookmarkWidget,
    },
    {
      position: 'right',
      display: 'hover',
      lineComponent: CommentWidget,
      insertComponent: CommentForm,
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

  function onLineWidgetClick(event: SvelteLineWidgetClickEvent): void {
    console.log('Line widget clicked:', event);
  }
</script>

<div class="stage {options.codeViewerThemeClass}">
  <CodeViewer
    code={sample}
    {language}
    theme={options.theme}
    shikiTheme={options.shikiTheme}
    {lineWidgets}
    title="line-widgets.ts"
    fileExtension="ts"
    {onLineWidgetClick}
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
