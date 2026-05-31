import { useState } from 'react';
import {
  DiffViewer,
  type DiffCollapsedLinesInput,
  type DiffViewMode,
} from '@ngeenx/nx-react-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const collapsedLines: DiffCollapsedLinesInput = [
  { startIndex: 2, endIndex: 5 },
  { startIndex: 10, endIndex: 13 },
];

const oldCode = `import { Component } from '@angular/core';

/**
 * UserComponent displays user information.
 * This is a multi-line comment block.
 */
@Component({
  selector: 'app-user',
  template: '<div>{{ name }}</div>',
})
export class UserComponent {
  name = 'John Doe';
  email = 'john@example.com';
}`;

const newCode = `import { Component, signal } from '@angular/core';

/**
 * UserComponent displays user information.
 * This is a multi-line comment block.
 * Updated with signals support.
 */
@Component({
  selector: 'app-user',
  template: '<div>{{ name() }}</div>',
})
export class UserComponent {
  readonly name = signal('John Doe');
  readonly email = signal('john@example.com');
  readonly isActive = signal(true);
}`;

export default function CodeDiffCollapsedDemo() {
  const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();
  const [viewMode] = useState<DiffViewMode>('unified');

  return (
    <div className={`crylith-demo-stage ${codeViewerThemeClass}`} style={{ width: 720 }}>
      <DiffViewer
        oldCode={oldCode}
        newCode={newCode}
        language="typescript"
        theme={theme}
        shikiTheme={shikiTheme}
        viewMode={viewMode}
        showLineNumbers={true}
        showHeader={true}
        collapsedLines={collapsedLines}
        fileExtension="ts"
        oldFileName="user.component.ts"
        newFileName="user.component.ts"
      />
    </div>
  );
}
