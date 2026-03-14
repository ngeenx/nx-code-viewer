import { CodeViewer } from '@ngeenx/nx-react-code-viewer';
import { useTheme } from '../hooks/useTheme';

const angularCode = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<h1>Hello World</h1>',
})
export class AppComponent {
  title = 'my-app';
  count = 0;

  increment() {
    this.count++;
  }
}`;

const collapsedCode = `import { Component, signal } from '@angular/core';
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

const collapsedWithHighlightsCode = `import { Component, signal } from '@angular/core';
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

export default function LineHighlightingPage() {
  const { theme, getResolvedShikiTheme } = useTheme();

  return (
    <div className={`page-container ${theme}`}>
      <header className="page-header">
        <h1 className="page-title">Line Highlighting</h1>
        <p className="page-description">
          Draw attention to specific lines of code using highlighting, focus, and collapse features.
        </p>
      </header>

      <section className="demo-section">
        <h2 className="demo-section-title">Highlighted Lines</h2>
        <p className="demo-section-description">
          Lines 3, 7-9, and 12 are pre-configured to be highlighted with a background color.
        </p>
        <CodeViewer
          code={angularCode}
          language="typescript"
          theme={theme}
          shikiTheme={getResolvedShikiTheme()}
          title="Highlighted Lines Demo"
          fileExtension=".ts"
          highlightedLines={[3, [7, 9], 12]}
        />
      </section>

      <section className="demo-section">
        <h2 className="demo-section-title">Focused Lines</h2>
        <p className="demo-section-description">
          Lines 3-6 and 12 are focused. All other lines are blurred to draw attention to the focused area.
        </p>
        <CodeViewer
          code={angularCode}
          language="typescript"
          theme={theme}
          shikiTheme={getResolvedShikiTheme()}
          title="Focused Lines Demo"
          fileExtension=".ts"
          focusedLines={[[3, 6], 12]}
        />
      </section>

      <section className="demo-section">
        <h2 className="demo-section-title">Focused and Highlighted Lines Combined</h2>
        <p className="demo-section-description">
          Lines 3-13 are focused (rest blurred). Lines 4, 5, and 11 are highlighted within the focused area.
        </p>
        <CodeViewer
          code={angularCode}
          language="typescript"
          theme={theme}
          shikiTheme={getResolvedShikiTheme()}
          title="Combined Demo"
          fileExtension=".ts"
          focusedLines={[[3, 13]]}
          highlightedLines={[4, 5, 11]}
        />
      </section>

      <section className="demo-section">
        <h2 className="demo-section-title">Collapsed Lines</h2>
        <p className="demo-section-description">
          Lines 4-8 and 15-20 are collapsed. Click the expand icon in the line number column or the "... N lines" indicator to expand.
        </p>
        <CodeViewer
          code={collapsedCode}
          language="typescript"
          theme={theme}
          shikiTheme={getResolvedShikiTheme()}
          title="Collapsed Lines Demo"
          fileExtension=".ts"
          collapsedLines={[[4, 8], [15, 20]]}
        />
      </section>

      <section className="demo-section">
        <h2 className="demo-section-title">Collapsed Lines with Highlights</h2>
        <p className="demo-section-description">
          Lines 4-8 are collapsed. Lines 10, 11, 22, and 23 are highlighted. Collapsed lines can be combined with other line features.
        </p>
        <CodeViewer
          code={collapsedWithHighlightsCode}
          language="typescript"
          theme={theme}
          shikiTheme={getResolvedShikiTheme()}
          title="Collapsed with Highlights"
          fileExtension=".ts"
          collapsedLines={[[4, 8]]}
          highlightedLines={[10, 11, 22, 23]}
        />
      </section>
    </div>
  );
}
