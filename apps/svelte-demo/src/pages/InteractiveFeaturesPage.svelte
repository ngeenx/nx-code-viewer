<script lang="ts">
  import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type { CodeViewerLanguage, ReferenceConfig } from '@ngeenx/nx-code-viewer-utils';
  import { useTheme } from '../stores/theme.svelte';

  const { theme, getResolvedShikiTheme } = useTheme();

  const referenceLinksExample = {
    code: `import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-example',
  template: '<h1>{{ title() }}</h1>',
  standalone: true,
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
        textMatch: /@Component/g,
        type: 'info',
        content:
          'Decorator that marks a class as an Angular component and provides configuration metadata.',
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
</script>

<div class="page-container {theme}">
  <div class="page-header">
    <h1 class="page-title">Interactive Features</h1>
    <p class="page-description">
      Add reference links, popovers, and line widgets for rich interactive code documentation.
    </p>
  </div>

  <section class="demo-section">
    <h2 class="demo-section-title">Reference Links & Popovers</h2>
    <p class="demo-section-description">
      Hover over <code>@angular/core</code>, <code>@angular/common</code>, <code>@angular/router</code>,
      <code>@Component</code>, or <code>signal(</code> to see reference popovers and links.
    </p>
    <CodeViewer
      code={referenceLinksExample.code}
      language={referenceLinksExample.language}
      {theme}
      shikiTheme={getResolvedShikiTheme()}
      references={referenceLinksExample.references}
      showLineNumbers={true}
      showHeader={false}
    />
  </section>
</div>
