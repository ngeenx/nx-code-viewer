import {
  CodeViewer,
  type CollapsedLinesInput,
  type HighlightedLinesInput,
} from '@ngeenx/nx-react-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const collapsedLines: CollapsedLinesInput = [[4, 8]];
const highlightedLines: HighlightedLinesInput = [10, 11, 22, 23];

const sample = `import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ExampleComponent demonstrates the collapsed lines feature.
 * This comment block is initially collapsed.
 * Click the expand icon to reveal it.
 */
@Component({
  selector: 'app-example',
  template: '<h1>{{ title() }}</h1>',
  imports: [CommonModule],
})
export class ExampleComponent {
  readonly title = signal('Hello, World!');
  readonly count = signal(0);

  increment(): void {
    this.count.update(n => n + 1);
  }

  decrement(): void {
    this.count.update(n => n - 1);
  }
}`;

export default function CodeViewerCollapsedWithHighlightsDemo() {
  const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();
  return (
    <div className={`crylith-demo-stage ${codeViewerThemeClass}`} style={{ width: 600 }}>
      <CodeViewer
        code={sample}
        language="typescript"
        theme={theme}
        shikiTheme={shikiTheme}
        collapsedLines={collapsedLines}
        highlightedLines={highlightedLines}
        title="Collapsed + Highlights"
        fileExtension="ts"
      />
    </div>
  );
}
