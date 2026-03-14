<script lang="ts">
  import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type { CodeViewerLanguage, ReferenceConfig } from '@ngeenx/nx-code-viewer-utils';
  import { useTheme } from '../stores/theme.svelte';
  import TodoInfo from '../components/TodoInfo.svelte';

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
        content: TodoInfo,
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

  const lineWidgetsExample = {
    language: 'typescript' as CodeViewerLanguage,
    code: `import { Component, signal } from '@angular/core';

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
}`,
  };
</script>

<div class="page-container" class:dark={theme === 'dark'} class:light={theme === 'light'}>
  <header class="page-header">
    <h1 class="page-title">Interactive Features</h1>
    <p class="page-description">
      Add interactivity to your code with reference links and line widgets.
    </p>
  </header>

  <section class="demo-section">
    <h2 class="demo-section-title">Reference Links</h2>
    <p class="demo-section-description">
      Interactive references in code: hover over highlighted text to see info popovers,
      or click links to navigate to documentation. Try hovering over @angular imports,
      @Component decorator, or the TODO comment (which uses a custom Svelte component for rich content).
    </p>
    <CodeViewer
      code={referenceLinksExample.code}
      language={referenceLinksExample.language}
      {theme}
      shikiTheme={getResolvedShikiTheme()}
      title="reference-links.ts"
      fileExtension=".ts"
      references={referenceLinksExample.references}
    />
  </section>

  <section class="demo-section">
    <h2 class="demo-section-title">Line Widgets</h2>
    <p class="demo-section-description">
      Hover over any line to see custom widgets. Left side shows a bookmark button,
      right side shows a comment button. Click the comment button to open a comment form below the line.
      <em>(Line widget components are not yet ported to Svelte — this section shows the code only.)</em>
    </p>
    <CodeViewer
      code={lineWidgetsExample.code}
      language={lineWidgetsExample.language}
      {theme}
      shikiTheme={getResolvedShikiTheme()}
      title="line-widgets-demo.ts"
      fileExtension=".ts"
    />
  </section>
</div>
