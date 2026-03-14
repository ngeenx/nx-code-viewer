<template>
  <div class="page-container" :class="theme">
    <div class="page-header">
      <h1 class="page-title">Interactive Features</h1>
      <p class="page-description">
        Add reference links, popovers, and line widgets for rich interactive code documentation.
      </p>
    </div>

    <div class="demo-section">
      <h2 class="demo-section-title">Reference Links & Popovers</h2>
      <p class="demo-section-description">
        Hover over <code>@angular/core</code>, <code>@angular/common</code>, <code>@angular/router</code>,
        <code>TODO:</code>, <code>@Component</code>, or <code>signal(</code> to see reference popovers and links.
      </p>
      <CodeViewer
        :code="referenceLinksExample.code"
        :language="referenceLinksExample.language"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        :references="referenceLinksExample.references"
        :showLineNumbers="true"
        :showHeader="false"
      />
    </div>

    <div class="demo-section">
      <h2 class="demo-section-title">Line Widgets</h2>
      <p class="demo-section-description">
        Hover over lines to see bookmark (left) and comment (right) widgets. Click the comment icon to open a comment form.
      </p>
      <CodeViewer
        :code="lineWidgetsExample.code"
        :language="lineWidgetsExample.language"
        :theme="theme"
        :shikiTheme="getResolvedShikiTheme()"
        :lineWidgets="lineWidgetsExample.lineWidgets"
        :showLineNumbers="true"
        :showHeader="false"
        @line-widget-click="onLineWidgetClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CodeViewer } from '@ngeenx/nx-vue-code-viewer';
import type { CodeViewerLanguage, VueLineWidgetsInput, VueLineWidgetClickEvent } from '@ngeenx/nx-vue-code-viewer';
import type { ReferenceConfig } from '@ngeenx/nx-code-viewer-utils';
import { useTheme } from '../composables/useTheme';
import BookmarkWidget from '../components/widgets/BookmarkWidget.vue';
import CommentWidget from '../components/widgets/CommentWidget.vue';
import CommentFormWidget from '../components/widgets/CommentFormWidget.vue';
import TodoInfoWidget from '../components/widgets/TodoInfoWidget.vue';

const { theme, getResolvedShikiTheme } = useTheme();

const referenceLinksExample = {
  code: `import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-example',
  template: '<h1>{{ title() }}</h1>',
  imports: [CommonModule, RouterModule],
})
export class ExampleComponent {
  // TODO: Add more features here
  readonly title = signal('Hello, World!');
}`,
  language: 'typescript' as CodeViewerLanguage,
  references: [
    {
      textMatch: /@angular\/core/g,
      type: ['link', 'info'] as const,
      link: 'https://angular.dev/api#angular_core',
      target: '_blank',
      content: 'Core Angular library - Component, signal, and more',
    },
    {
      textMatch: /@angular\/common/g,
      type: ['link', 'info'] as const,
      link: 'https://angular.dev/api#angular_common',
      target: '_blank',
      content: 'Common Angular directives like @if, @for etc',
    },
    {
      textMatch: /@angular\/router/g,
      type: ['link', 'info'] as const,
      link: 'https://angular.dev/api#angular_router',
      target: '_blank',
      content: 'Angular Router for navigation and routing',
    },
    {
      textMatch: /TODO:.*/g,
      type: 'info',
      content: TodoInfoWidget,
    },
    {
      textMatch: /@Component/g,
      type: 'info',
      content:
        'Decorator that marks a class as an Angular component and provides configuration metadata that determines how the component should be processed, instantiated, and used at runtime.',
    },
    {
      textMatch: /signal\(/g,
      type: 'info',
      content: 'Creates a reactive signal that can be read and updated',
      handle: (line: string) => {
        alert('Signal reference clicked! Line: ' + line);
      },
    },
  ] as ReferenceConfig[],
};

const lineWidgetsExample: {
  code: string;
  language: CodeViewerLanguage;
  lineWidgets: VueLineWidgetsInput;
} = {
  language: 'typescript',
  lineWidgets: [
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
  ],
  code: `import { ref } from 'vue';

const count = ref(0);

function increment(): void {
  count.value++;
}

function decrement(): void {
  count.value--;
}

export { count, increment, decrement };`,
};

function onLineWidgetClick(event: VueLineWidgetClickEvent): void {
  console.log('Line widget clicked:', event);
}
</script>
