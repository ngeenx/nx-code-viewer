<template>
  <div class="stage">
    <CodeViewer
      :class="codeViewerThemeClass"
      :code="sample"
      :language="language"
      :theme="theme"
      :shikiTheme="shikiTheme"
      :references="references"
      title="reference-links.ts"
      fileExtension="ts"
    />
  </div>
</template>

<script setup lang="ts">
import {
  CodeViewer,
  type CodeViewerLanguage,
  type ReferenceConfig,
} from '@ngeenx/nx-vue-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';
import TodoInfoWidget from '../widgets/TodoInfoWidget.vue';

const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();

const language: CodeViewerLanguage = 'typescript';

const sample = `import { Component, signal } from '@angular/core';
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
}`;

const references: ReferenceConfig[] = [
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
      'Decorator that marks a class as an Angular component and provides configuration metadata.',
  },
  {
    textMatch: /signal\(/g,
    type: 'info',
    content: 'Creates a reactive signal that can be read and updated',
  },
];
</script>

<style scoped>
.stage {
  width: 600px;
}
.stage > :deep(*) {
  width: 100%;
}
</style>
