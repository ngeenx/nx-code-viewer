import {
  CodeViewer,
  type CollapsedLinesInput,
} from '@ngeenx/nx-react-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const collapsedLines: CollapsedLinesInput = [
  [4, 8],
  [15, 20],
];

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
  /**
   * The title signal holds the display text.
   * This is another collapsed block.
   * Expand to see the full documentation.
   */
  readonly title = signal('Hello, World!');
  readonly count = signal(0);

  increment(): void {
    this.count.update(n => n + 1);
  }
}`;

export default function CodeViewerCollapsedLinesDemo() {
  const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();
  return (
    <div className={`crylith-demo-stage ${codeViewerThemeClass}`} style={{ width: 600 }}>
      <CodeViewer
        code={sample}
        language="typescript"
        theme={theme}
        shikiTheme={shikiTheme}
        collapsedLines={collapsedLines}
        title="Collapsed Lines"
        fileExtension="ts"
      />
    </div>
  );
}
