import {
  CodeViewer,
  type FocusedLinesInput,
  type HighlightedLinesInput,
} from '@ngeenx/nx-react-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const focusedLines: FocusedLinesInput = [[3, 13]];
const highlightedLines: HighlightedLinesInput = [4, 5, 11];

const sample = `import { Component } from '@angular/core';

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

export default function CodeViewerFocusedAndHighlightedDemo() {
  const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();
  return (
    <div className={`crylith-demo-stage ${codeViewerThemeClass}`} style={{ width: 600 }}>
      <CodeViewer
        code={sample}
        language="typescript"
        theme={theme}
        shikiTheme={shikiTheme}
        focusedLines={focusedLines}
        highlightedLines={highlightedLines}
        title="Focused + Highlighted"
        fileExtension="ts"
      />
    </div>
  );
}
