<script lang="ts">
  import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type {
    CodeViewerLanguage,
    ReferenceConfig,
  } from '@ngeenx/nx-code-viewer-utils';
  import { useDemoOptions } from './_shared/useDemoOptions.svelte';
  import TodoInfo from '../TodoInfo.svelte';

  const options = useDemoOptions();

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
      content: TodoInfo,
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

<div class="stage {options.codeViewerThemeClass}">
  <CodeViewer
    code={sample}
    {language}
    theme={options.theme}
    shikiTheme={options.shikiTheme}
    {references}
    title="reference-links.ts"
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
