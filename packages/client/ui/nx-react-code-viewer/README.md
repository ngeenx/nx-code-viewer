# @ngeenx/nx-react-code-viewer

A powerful React library for displaying syntax-highlighted code and code diffs. Built with [Shiki](https://shiki.style/) for accurate, VS Code-quality syntax highlighting.

## Features

- Syntax highlighting for 200+ programming languages
- Dark and light theme support
- Code viewer with line numbers and copy functionality
- Diff viewer with unified and split view modes
- **Multi-code viewer** with tabbed interface for multiple files
- **Column code viewer** for side-by-side code and diff comparison
- Line highlighting on hover
- **Focused lines** - blur unfocused lines to draw attention (hover to reveal)
- **Reference links** - interactive code references with clickable links and info popovers
- **Border style variants** - classic, grid-cross, corner-intersection, or none
- File type icons based on extension
- React 19 with memoized components

## Installation

```bash
npm install @ngeenx/nx-react-code-viewer
# or
pnpm add @ngeenx/nx-react-code-viewer
```

## Usage

### CodeViewer

```tsx
import { CodeViewer } from '@ngeenx/nx-react-code-viewer';

const code = `import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}`;

function App() {
  return (
    <CodeViewer
      code={code}
      language="tsx"
      theme="dark"
      title="Counter.tsx"
      fileExtension=".tsx"
      showLineNumbers={true}
      showCopyButton={true}
      showHeader={true}
      maxHeight="400px"
      borderStyle="classic"
      highlightedLines={[[3, 6]]}
      onCodeCopied={() => console.log('Copied!')}
    />
  );
}
```

### DiffViewer

```tsx
import { DiffViewer } from '@ngeenx/nx-react-code-viewer';

function App() {
  return (
    <DiffViewer
      oldCode={oldCode}
      newCode={newCode}
      language="typescript"
      theme="dark"
      viewMode="split"
      oldFileName="math.js"
      newFileName="math.ts"
    />
  );
}
```

### MultiCodeViewer

```tsx
import {
  MultiCodeViewer,
  type MultiCodeViewerTabItem,
} from '@ngeenx/nx-react-code-viewer';

const tabs: MultiCodeViewerTabItem[] = [
  {
    id: 'component',
    type: 'code',
    fileName: 'App.tsx',
    fileExtension: '.tsx',
    language: 'tsx',
    code: appCode,
  },
  {
    id: 'hook',
    type: 'code',
    fileName: 'useCounter.ts',
    fileExtension: '.ts',
    language: 'typescript',
    code: hookCode,
  },
  {
    id: 'changes',
    type: 'diff',
    fileName: 'service.ts',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: v1,
    newCode: v2,
  },
];

function App() {
  return (
    <MultiCodeViewer
      tabs={tabs}
      theme="dark"
      borderStyle="classic"
      onActiveTabChange={event => console.log(event)}
      onCodeCopied={tabId => console.log(tabId)}
    />
  );
}
```

### ColumnCodeViewer

```tsx
import {
  ColumnCodeViewer,
  type ColumnItem,
} from '@ngeenx/nx-react-code-viewer';

const columns: ColumnItem[] = [
  {
    id: 'angular',
    type: 'code',
    title: 'Angular',
    language: 'typescript',
    fileExtension: '.ts',
    code: angularCode,
  },
  {
    id: 'react',
    type: 'code',
    title: 'React',
    language: 'tsx',
    fileExtension: '.tsx',
    code: reactCode,
  },
  {
    id: 'vue',
    type: 'code',
    title: 'Vue',
    language: 'vue',
    fileExtension: '.vue',
    code: vueCode,
  },
];

function App() {
  return (
    <ColumnCodeViewer columns={columns} theme="dark" borderStyle="classic" />
  );
}
```

#### Mixed Code + Diff Columns

```tsx
const reviewColumns: ColumnItem[] = [
  {
    id: 'src',
    type: 'code',
    title: 'Source',
    language: 'typescript',
    code: sourceCode,
  },
  {
    id: 'diff',
    type: 'diff',
    title: 'Changes',
    language: 'typescript',
    oldCode: sourceCode,
    newCode: updatedCode,
  },
];

<ColumnCodeViewer
  columns={reviewColumns}
  theme="dark"
  onCodeCopied={id => console.log(id)}
/>;
```

## API Reference

### CodeViewer Props

| Prop               | Type                                   | Default       | Description              |
| ------------------ | -------------------------------------- | ------------- | ------------------------ |
| `code`             | `string \| string[]`                   | **required**  | Source code to display   |
| `language`         | `CodeViewerLanguage`                   | `'plaintext'` | Programming language     |
| `theme`            | `CodeViewerTheme`                      | `'dark'`      | Color theme              |
| `title`            | `string`                               | `''`          | Header title             |
| `fileExtension`    | `string`                               | `''`          | File extension for icon  |
| `showLineNumbers`  | `boolean`                              | `true`        | Show line numbers        |
| `showCopyButton`   | `boolean`                              | `true`        | Show copy button         |
| `showHeader`       | `boolean`                              | `true`        | Show header              |
| `maxHeight`        | `string`                               | `''`          | Max height with scroll   |
| `wordWrap`         | `boolean`                              | `false`       | Enable word wrap         |
| `highlightedLines` | `HighlightedLinesInput`                |               | Lines to highlight       |
| `focusedLines`     | `FocusedLinesInput`                    |               | Lines to focus           |
| `collapsedLines`   | `CollapsedLinesInput`                  |               | Ranges to collapse       |
| `borderStyle`      | `CodeViewerBorderStyle`                | `'classic'`   | Border style             |
| `references`       | `ReferenceConfig[]`                    | `[]`          | Interactive references   |
| `onCodeCopied`     | `() => void`                           |               | Copy callback            |
| `onReferenceClick` | `(ref: ProcessedReference) => void`    |               | Reference click callback |
| `onReferenceHover` | `(event: ReferenceHoverEvent) => void` |               | Reference hover callback |

### DiffViewer Props

| Prop              | Type                    | Default       | Description              |
| ----------------- | ----------------------- | ------------- | ------------------------ |
| `diff`            | `string`                | `''`          | Unified diff string      |
| `oldCode`         | `string`                | `''`          | Original code            |
| `newCode`         | `string`                | `''`          | Modified code            |
| `language`        | `CodeViewerLanguage`    | `'plaintext'` | Programming language     |
| `theme`           | `CodeViewerTheme`       | `'dark'`      | Color theme              |
| `viewMode`        | `DiffViewMode`          | `'unified'`   | `'unified'` or `'split'` |
| `showLineNumbers` | `boolean`               | `true`        | Show line numbers        |
| `showHeader`      | `boolean`               | `true`        | Show header              |
| `maxHeight`       | `string`                | `''`          | Max height               |
| `borderStyle`     | `CodeViewerBorderStyle` | `'classic'`   | Border style             |

### MultiCodeViewer Props

| Prop                 | Type                              | Default      | Description          |
| -------------------- | --------------------------------- | ------------ | -------------------- |
| `tabs`               | `MultiCodeViewerTabItem[]`        | **required** | Tab items            |
| `theme`              | `CodeViewerTheme`                 | `'dark'`     | Color theme          |
| `borderStyle`        | `CodeViewerBorderStyle`           | `'classic'`  | Border style         |
| `showContentHeader`  | `boolean`                         | `false`      | Show headers in tabs |
| `initialActiveTabId` | `string`                          | `''`         | Initial active tab   |
| `onActiveTabChange`  | `(event: TabChangeEvent) => void` |              | Tab change callback  |
| `onCodeCopied`       | `(tabId: string) => void`         |              | Copy callback        |

### ColumnCodeViewer Props

| Prop                | Type                         | Default      | Description                 |
| ------------------- | ---------------------------- | ------------ | --------------------------- |
| `columns`           | `ColumnItem[]`               | **required** | Column items (code or diff) |
| `theme`             | `CodeViewerTheme`            | `'dark'`     | Color theme                 |
| `shikiTheme`        | `ShikiThemeName`             |              | Custom Shiki theme          |
| `borderStyle`       | `CodeViewerBorderStyle`      | `'classic'`  | Border style                |
| `showColumnHeaders` | `boolean`                    | `true`       | Show column headers         |
| `maxHeight`         | `string`                     | `''`         | Max height per column       |
| `enableLineHover`   | `boolean`                    | `true`       | Line hover highlighting     |
| `onCodeCopied`      | `(columnId: string) => void` |              | Copy callback               |

## Types

```typescript
type CodeViewerTheme = 'dark' | 'light';
type CodeViewerBorderStyle =
  | 'classic'
  | 'grid-cross'
  | 'corner-intersection'
  | 'none';
type DiffViewMode = 'unified' | 'split';
type ColumnItem = ColumnCodeItem | ColumnDiffItem;
```

## License

MIT
