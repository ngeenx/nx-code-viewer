import { CodeViewer, type ReactLineWidgetsInput, type ReactLineWidgetClickEvent, type ReferenceConfig } from '@ngeenx/nx-react-code-viewer';
import { useTheme } from '../hooks/useTheme';
import { BookmarkWidget } from '../components/bookmark-widget';
import { CommentWidget } from '../components/comment-widget';
import { CommentForm } from '../components/comment-form';
import { TodoInfo } from '../components/todo-info';

const referenceCode = `import { Component, signal } from '@angular/core';
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
}`;

const references: ReferenceConfig[] = [
  {
    textMatch: /@angular\/core/g,
    type: ['link', 'info'],
    link: 'https://angular.dev/api#angular_core',
    target: '_blank',
    content: 'Core Angular library - Component, signal, and more',
  },
  {
    textMatch: /@angular\/common/g,
    type: ['link', 'info'],
    link: 'https://angular.dev/api#angular_common',
    target: '_blank',
    content: 'Common Angular directives like @if, @for etc',
  },
  {
    textMatch: /@angular\/router/g,
    type: ['link', 'info'],
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
];

const lineWidgetsCode = `import { Component, signal } from '@angular/core';

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

const lineWidgets: ReactLineWidgetsInput = [
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

export default function InteractiveFeaturesPage() {
  const { theme, getResolvedShikiTheme } = useTheme();

  const onLineWidgetClick = (event: ReactLineWidgetClickEvent) => {
    console.log('Line widget clicked:', event);
  };

  return (
    <div className={`page-container ${theme}`}>
      <header className="page-header">
        <h1 className="page-title">Interactive Features</h1>
        <p className="page-description">
          Add interactivity to your code with reference links and line widgets.
        </p>
      </header>

      <section className="demo-section">
        <h2 className="demo-section-title">Reference Links</h2>
        <p className="demo-section-description">
          Interactive references in code: hover over highlighted text to see info popovers,
          or click links to navigate to documentation. Try hovering over @angular imports,
          @Component decorator, or the TODO comment (which uses a custom React component for rich content).
        </p>
        <CodeViewer
          code={referenceCode}
          language="typescript"
          theme={theme}
          shikiTheme={getResolvedShikiTheme()}
          title="reference-links.ts"
          fileExtension=".ts"
          references={references}
        />
      </section>

      <section className="demo-section">
        <h2 className="demo-section-title">Line Widgets</h2>
        <p className="demo-section-description">
          Hover over any line to see custom widgets. Left side shows a bookmark button,
          right side shows a comment button. Click the comment button to open a comment form below the line.
        </p>
        <CodeViewer
          code={lineWidgetsCode}
          language="typescript"
          theme={theme}
          shikiTheme={getResolvedShikiTheme()}
          title="line-widgets-demo.ts"
          fileExtension=".ts"
          lineWidgets={lineWidgets}
          onLineWidgetClick={onLineWidgetClick}
        />
      </section>
    </div>
  );
}
