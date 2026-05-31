import {
  CodeViewer,
  type ReactLineWidgetsInput,
  type ReactLineWidgetClickEvent,
} from '@ngeenx/nx-react-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';
import { BookmarkWidget } from '../app/components/bookmark-widget';
import { CommentWidget } from '../app/components/comment-widget';
import { CommentForm } from '../app/components/comment-form';

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

export default function CodeViewerLineWidgetsDemo() {
  const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();

  const onLineWidgetClick = (event: ReactLineWidgetClickEvent) => {
    console.log('Line widget clicked:', event);
  };

  return (
    <div className={`crylith-demo-stage ${codeViewerThemeClass}`} style={{ width: 600 }}>
      <CodeViewer
        code={sample}
        language="typescript"
        theme={theme}
        shikiTheme={shikiTheme}
        lineWidgets={lineWidgets}
        title="line-widgets.ts"
        fileExtension="ts"
        onLineWidgetClick={onLineWidgetClick}
      />
    </div>
  );
}
