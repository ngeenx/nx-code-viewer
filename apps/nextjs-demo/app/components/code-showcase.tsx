'use client';

import {
  CodeViewer,
  DiffViewer,
  MultiCodeViewer,
  type CodeViewerLanguage,
  type HighlightedLinesInput,
  type MultiCodeViewerTabItem,
} from '@ngeenx/nx-react-code-viewer';
import { useChromeTheme } from '../theme-provider';

const tsLanguage: CodeViewerLanguage = 'typescript';

const basic = `export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('Next.js'));`;

const highlighted = `import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount((c) => c + 1);
  return <button onClick={increment}>Count: {count}</button>;
}`;

const highlightedLines: HighlightedLinesInput = [4, [5, 6]];

const diffOld = `interface User {
  id: number;
  name: string;
}`;

const diffNew = `interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}`;

const tabs: MultiCodeViewerTabItem[] = [
  {
    id: 'component',
    type: 'code',
    fileName: 'Counter.tsx',
    fileExtension: '.tsx',
    language: 'tsx',
    code: `import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}`,
  },
  {
    id: 'usage',
    type: 'code',
    fileName: 'app.tsx',
    fileExtension: '.tsx',
    language: 'tsx',
    code: `import { createRoot } from 'react-dom/client';
import { Counter } from './Counter';

createRoot(document.getElementById('app')!).render(<Counter />);`,
  },
];

export function CodeShowcase() {
  const { theme, shikiTheme } = useChromeTheme();
  return (
    <div className="showcase">
      <section className="example">
        <h3 className="example-title">Basic viewer</h3>
        <CodeViewer
          code={basic}
          language={tsLanguage}
          theme={theme}
          shikiTheme={shikiTheme}
          title="greet.ts"
          fileExtension="ts"
        />
      </section>

      <section className="example">
        <h3 className="example-title">Highlighted lines</h3>
        <CodeViewer
          code={highlighted}
          language={tsLanguage}
          theme={theme}
          shikiTheme={shikiTheme}
          highlightedLines={highlightedLines}
          title="counter.tsx"
          fileExtension="tsx"
        />
      </section>

      <section className="example">
        <h3 className="example-title">Diff viewer</h3>
        <DiffViewer
          oldCode={diffOld}
          newCode={diffNew}
          language={tsLanguage}
          theme={theme}
          shikiTheme={shikiTheme}
          showLineNumbers={true}
          fileExtension="ts"
          oldFileName="user.ts"
          newFileName="user.ts"
        />
      </section>

      <section className="example">
        <h3 className="example-title">Multi-tab viewer</h3>
        <MultiCodeViewer
          tabs={tabs}
          theme={theme}
          shikiTheme={shikiTheme}
          borderStyle="classic"
        />
      </section>
    </div>
  );
}
