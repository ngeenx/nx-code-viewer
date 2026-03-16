# @ngeenx/nx-angular-code-viewer

A powerful Angular library for displaying syntax-highlighted code and code diffs. Built with [Shiki](https://shiki.style/) for accurate, VS Code-quality syntax highlighting.

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
- Responsive and accessible

## Installation

```bash
npm install @ngeenx/nx-angular-code-viewer
# or
pnpm add @ngeenx/nx-angular-code-viewer
```

## Usage

### CodeViewerComponent

Import the component in your Angular module or standalone component:

```typescript
import { CodeViewerComponent } from '@ngeenx/nx-angular-code-viewer';

@Component({
  imports: [CodeViewerComponent],
  // ...
})
export class MyComponent {}
```

#### Basic Usage

```html
<nx-code-viewer [code]="sourceCode" language="typescript" theme="dark" />
```

#### Full Example

```html
<nx-code-viewer
  [code]="sourceCode"
  [language]="'typescript'"
  [theme]="'dark'"
  [title]="'example.ts'"
  [fileExtension]="'.ts'"
  [showLineNumbers]="true"
  [showCopyButton]="true"
  [showHeader]="true"
  [maxHeight]="'400px'"
  [wordWrap]="false"
  [borderStyle]="'classic'"
  (codeCopied)="onCodeCopied()" />
```

#### Code as Array

You can pass code as an array of strings (each element becomes a line):

```html
<nx-code-viewer
  [code]="['const a = 1;', 'const b = 2;', 'console.log(a + b);']"
  language="javascript" />
```

### DiffViewerComponent

Import the component:

```typescript
import { DiffViewerComponent } from '@ngeenx/nx-angular-code-viewer';

@Component({
  imports: [DiffViewerComponent],
  // ...
})
export class MyComponent {}
```

#### Using Old/New Code

```html
<nx-diff-viewer
  [oldCode]="originalCode"
  [newCode]="modifiedCode"
  [language]="'typescript'"
  [theme]="'dark'"
  [viewMode]="'unified'" />
```

#### Using Unified Diff String

```html
<nx-diff-viewer
  [diff]="gitDiffOutput"
  [language]="'typescript'"
  [theme]="'dark'"
  [viewMode]="'split'" />
```

#### Full Example

```html
<nx-diff-viewer
  [oldCode]="originalCode"
  [newCode]="modifiedCode"
  [language]="'typescript'"
  [theme]="'dark'"
  [viewMode]="'unified'"
  [showLineNumbers]="true"
  [showHeader]="true"
  [maxHeight]="'500px'"
  [oldFileName]="'user.ts'"
  [newFileName]="'user.ts'"
  [fileExtension]="'.ts'"
  [borderStyle]="'classic'" />
```

### MultiCodeViewerComponent

A tabbed interface for displaying multiple code files or diffs:

```typescript
import { MultiCodeViewerComponent } from '@ngeenx/nx-angular-code-viewer';

@Component({
  imports: [MultiCodeViewerComponent],
  // ...
})
export class MyComponent {}
```

#### Basic Usage

```html
<nx-multi-code-viewer
  [tabs]="tabs"
  [theme]="'dark'"
  [borderStyle]="'classic'"
  (activeTabChange)="onTabChange($event)"
  (codeCopied)="onCodeCopied($event)" />
```

#### Tab Configuration

```typescript
import { MultiCodeViewerTabItem } from '@ngeenx/nx-angular-code-viewer';

const tabs: MultiCodeViewerTabItem[] = [
  {
    id: 'component',
    type: 'code',
    fileName: 'app.component.ts',
    fileExtension: '.ts',
    language: 'typescript',
    code: `@Component({...})
export class AppComponent {}`,
  },
  {
    id: 'template',
    type: 'code',
    fileName: 'app.component.html',
    fileExtension: '.html',
    language: 'html',
    code: '<div>Hello World</div>',
  },
  {
    id: 'changes',
    type: 'diff',
    fileName: 'service.ts',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: 'const x = 1;',
    newCode: 'const x = 2;',
  },
];
```

### ColumnCodeViewerComponent

Displays multiple code blocks and/or diff viewers side by side in a columnar layout. Useful for comparing implementations across frameworks, reviewing changes alongside source code, or showing multi-file examples simultaneously.

```typescript
import { ColumnCodeViewerComponent } from '@ngeenx/nx-angular-code-viewer';

@Component({
  imports: [ColumnCodeViewerComponent],
  // ...
})
export class MyComponent {}
```

#### Basic Usage — Code Columns

```html
<nx-column-code-viewer
  [columns]="columns"
  [theme]="'dark'"
  [borderStyle]="'classic'"
  (codeCopied)="onCodeCopied($event)" />
```

```typescript
import { ColumnCodeItem } from '@ngeenx/nx-angular-code-viewer';

const columns: ColumnCodeItem[] = [
  {
    id: 'angular',
    type: 'code',
    title: 'Angular',
    fileExtension: '.ts',
    language: 'typescript',
    code: `@Component({ selector: 'app-counter' })
export class CounterComponent {
  readonly count = signal(0);
  increment() { this.count.update(v => v + 1); }
}`,
  },
  {
    id: 'react',
    type: 'code',
    title: 'React',
    fileExtension: '.tsx',
    language: 'tsx',
    code: `export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}`,
  },
  {
    id: 'vue',
    type: 'code',
    title: 'Vue',
    fileExtension: '.vue',
    language: 'vue',
    code: `<script setup>
const count = ref(0);
</script>
<template>
  <button @click="count++">Count: {{ count }}</button>
</template>`,
  },
];
```

#### Mixed Code + Diff Columns

Combine code viewers and diff viewers side by side — useful for code review workflows:

```typescript
import { ColumnItem } from '@ngeenx/nx-angular-code-viewer';

const columns: ColumnItem[] = [
  {
    id: 'source',
    type: 'code',
    title: 'Current Code',
    fileExtension: '.ts',
    language: 'typescript',
    code: `export class ApiService {
  get<T>(url: string) {
    return this.http.get<T>(url);
  }
}`,
  },
  {
    id: 'changes',
    type: 'diff',
    title: 'Proposed Changes',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: `export class ApiService {
  get<T>(url: string) {
    return this.http.get<T>(url);
  }
}`,
    newCode: `export class ApiService {
  get<T>(url: string) {
    return this.http.get<T>(url).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
}`,
  },
];
```

```html
<nx-column-code-viewer
  [columns]="columns"
  [theme]="'dark'"
  [borderStyle]="'classic'" />
```

#### Diff-Only Columns

Compare changes across multiple files at once:

```typescript
import { ColumnDiffItem } from '@ngeenx/nx-angular-code-viewer';

const diffColumns: ColumnDiffItem[] = [
  {
    id: 'service',
    type: 'diff',
    title: 'user.service.ts',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: 'getUser(id) { ... }',
    newCode: 'getUser(id: number): User { ... }',
  },
  {
    id: 'model',
    type: 'diff',
    title: 'user.model.ts',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: 'interface User { id: number; name: string; }',
    newCode: 'interface User { id: number; name: string; email: string; role: Role; }',
  },
];
```

#### Column Configuration Options

```html
<!-- Without column headers -->
<nx-column-code-viewer
  [columns]="columns"
  [showColumnHeaders]="false" />

<!-- With max height (scrollable columns) -->
<nx-column-code-viewer
  [columns]="columns"
  [maxHeight]="'300px'" />

<!-- Disable line hover -->
<nx-column-code-viewer
  [columns]="columns"
  [enableLineHover]="false" />

<!-- With highlighted lines per column -->
<nx-column-code-viewer
  [columns]="[
    { id: 'a', type: 'code', code: codeA, language: 'typescript', title: 'Before', highlightedLines: [[3, 5]] },
    { id: 'b', type: 'code', code: codeB, language: 'typescript', title: 'After', highlightedLines: [[3, 8]] }
  ]" />
```

## API Reference

### CodeViewerComponent

#### Inputs

| Input              | Type                    | Default       | Description                                                       |
| ------------------ | ----------------------- | ------------- | ----------------------------------------------------------------- |
| `code`             | `string \| string[]`    | **required**  | Source code to display. Can be a string or array of lines.        |
| `language`         | `CodeViewerLanguage`    | `'plaintext'` | Programming language for syntax highlighting.                     |
| `theme`            | `CodeViewerTheme`       | `'dark'`      | Color theme (`'dark'` or `'light'`).                              |
| `title`            | `string`                | `''`          | Optional title displayed in the header.                           |
| `fileExtension`    | `string`                | `''`          | File extension for icon display (e.g., `'.ts'`, `'.js'`).         |
| `showLineNumbers`  | `boolean`               | `true`        | Whether to show line numbers.                                     |
| `showCopyButton`   | `boolean`               | `true`        | Whether to show the copy button.                                  |
| `showHeader`       | `boolean`               | `true`        | Whether to show the header section.                               |
| `maxHeight`        | `string`                | `''`          | Maximum height with scrolling (e.g., `'300px'`).                  |
| `wordWrap`         | `boolean`               | `false`       | Enable word wrapping for long lines.                              |
| `highlightedLines` | `HighlightedLinesInput` | `undefined`   | Pre-configured lines to highlight. See below for format.          |
| `focusedLines`     | `FocusedLinesInput`     | `undefined`   | Lines to focus (others are blurred). Hover to reveal. See format. |
| `borderStyle`      | `CodeViewerBorderStyle` | `'classic'`   | Border style variant. See below for options.                      |
| `references`       | `ReferenceConfig[]`     | `[]`          | Reference configurations for interactive links/info elements.     |

#### Outputs

| Output           | Type                  | Description                                    |
| ---------------- | --------------------- | ---------------------------------------------- |
| `codeCopied`     | `void`                | Emitted when code is copied to clipboard.      |
| `referenceClick` | `ProcessedReference`  | Emitted when a reference link is clicked.      |
| `referenceHover` | `ReferenceHoverEvent` | Emitted when a reference is hovered.           |

### DiffViewerComponent

#### Inputs

| Input             | Type                    | Default       | Description                                   |
| ----------------- | ----------------------- | ------------- | --------------------------------------------- |
| `diff`            | `string`                | `''`          | Unified diff string (git diff format).        |
| `oldCode`         | `string`                | `''`          | Original code for computing diff.             |
| `newCode`         | `string`                | `''`          | Modified code for computing diff.             |
| `language`        | `CodeViewerLanguage`    | `'plaintext'` | Programming language for syntax highlighting. |
| `theme`           | `CodeViewerTheme`       | `'dark'`      | Color theme (`'dark'` or `'light'`).          |
| `viewMode`        | `DiffViewMode`          | `'unified'`   | Display mode (`'unified'` or `'split'`).      |
| `showLineNumbers` | `boolean`               | `true`        | Whether to show line numbers.                 |
| `showHeader`      | `boolean`               | `true`        | Whether to show the header section.           |
| `maxHeight`       | `string`                | `''`          | Maximum height with scrolling.                |
| `oldFileName`     | `string`                | `''`          | Old file name for header display.             |
| `newFileName`     | `string`                | `''`          | New file name for header display.             |
| `fileExtension`   | `string`                | `''`          | File extension for icon display.              |
| `borderStyle`     | `CodeViewerBorderStyle` | `'classic'`   | Border style variant. See below for options.  |

### MultiCodeViewerComponent

#### Inputs

| Input                | Type                           | Default       | Description                                     |
| -------------------- | ------------------------------ | ------------- | ----------------------------------------------- |
| `tabs`               | `MultiCodeViewerTabItem[]`     | **required**  | Array of tab items (code or diff).              |
| `theme`              | `CodeViewerTheme`              | `'dark'`      | Color theme (`'dark'` or `'light'`).            |
| `borderStyle`        | `CodeViewerBorderStyle`        | `'classic'`   | Border style variant.                           |
| `showContentHeader`  | `boolean`                      | `false`       | Whether to show headers inside tab content.     |
| `initialActiveTabId` | `string`                       | `''`          | Initial active tab ID (defaults to first tab).  |

#### Outputs

| Output            | Type             | Description                          |
| ----------------- | ---------------- | ------------------------------------ |
| `activeTabChange` | `TabChangeEvent` | Emitted when the active tab changes. |
| `codeCopied`      | `string`         | Emitted with tab ID when code is copied. |

### ColumnCodeViewerComponent

#### Inputs

| Input               | Type                    | Default     | Description                                           |
| ------------------- | ----------------------- | ----------- | ----------------------------------------------------- |
| `columns`           | `ColumnItem[]`          | **required**| Array of column items (code or diff) to display.      |
| `theme`             | `CodeViewerTheme`       | `'dark'`    | Color theme (`'dark'` or `'light'`).                  |
| `shikiTheme`        | `ShikiThemeName`        | `undefined` | Custom Shiki theme override.                          |
| `borderStyle`       | `CodeViewerBorderStyle` | `'classic'` | Border style variant.                                 |
| `showColumnHeaders` | `boolean`               | `true`      | Whether to show individual column headers.            |
| `maxHeight`         | `string`                | `''`        | Maximum height with scrolling (applied per column).   |
| `enableLineHover`   | `boolean`               | `true`      | Enable line hover highlighting.                       |

#### Outputs

| Output       | Type     | Description                                     |
| ------------ | -------- | ----------------------------------------------- |
| `codeCopied` | `string` | Emitted with column ID when code is copied.     |

### Column Types

```typescript
type ColumnItem = ColumnCodeItem | ColumnDiffItem;

interface ColumnCodeItem {
  id: string;
  type: 'code';
  title?: string;
  fileExtension?: string;
  code: string | string[];
  language?: CodeViewerLanguage;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  wordWrap?: boolean;
  highlightedLines?: HighlightedLinesInput;
}

interface ColumnDiffItem {
  id: string;
  type: 'diff';
  title?: string;
  fileExtension?: string;
  diff?: string;
  oldCode?: string;
  newCode?: string;
  language?: CodeViewerLanguage;
  viewMode?: DiffViewMode;
  showLineNumbers?: boolean;
  oldFileName?: string;
  newFileName?: string;
}
```

## Types

### CodeViewerTheme

```typescript
type CodeViewerTheme = 'dark' | 'light';
```

### CodeViewerBorderStyle

```typescript
type CodeViewerBorderStyle = 'classic' | 'grid-cross' | 'corner-intersection' | 'none';
```

- `'classic'`: Standard rounded border (default)
- `'grid-cross'`: Grid borders with corner cross marks extending outside
- `'corner-intersection'`: Long grid borders extending beyond corners
- `'none'`: No border styling

### CodeViewerLanguage

Supports all [Shiki bundled languages](https://shiki.style/languages) plus `'plaintext'`.

Common languages: `'typescript'`, `'javascript'`, `'html'`, `'css'`, `'json'`, `'python'`, `'java'`, `'go'`, `'rust'`, `'bash'`, `'sql'`, `'yaml'`, `'markdown'`, etc.

### DiffViewMode

```typescript
type DiffViewMode = 'unified' | 'split';
```

- `'unified'`: Single column with +/- prefixes (like `git diff`)
- `'split'`: Side-by-side old/new comparison

### HighlightedLinesInput

Flexible type for specifying which lines to highlight:

```typescript
type LineRange = readonly [number, number];
type HighlightedLinesInput = number | readonly (number | LineRange)[];
```

**Formats supported:**

- Single line: `5` - highlights line 5
- Multiple lines: `[1, 3, 5]` - highlights lines 1, 3, and 5
- Range: `[[1, 5]]` - highlights lines 1 through 5
- Multiple ranges: `[[1, 5], [10, 15]]` - highlights lines 1-5 and 10-15
- Mixed: `[1, [3, 5], 8, [10, 12]]` - highlights line 1, lines 3-5, line 8, and lines 10-12

### FocusedLinesInput

Same format as `HighlightedLinesInput`. When specified, all lines NOT in this set will be blurred. Hover over blurred lines to reveal their content.

```typescript
type FocusedLinesInput = HighlightedLinesInput;
```

### ReferenceConfig

Configuration for creating interactive reference elements in code:

```typescript
type ReferenceType = 'link' | 'info';
type ReferenceTypeSpec = ReferenceType | readonly [ReferenceType, ReferenceType];
type ReferenceLinkTarget = '_blank' | '_self' | '_parent' | '_top';

interface ReferenceConfig {
  /** Regex pattern to match text in the code */
  readonly textMatch: RegExp;
  /** Optional regex for extracting capture groups (defaults to textMatch) */
  readonly linkMatch?: RegExp;
  /** Reference type: 'link', 'info', or both ['link', 'info'] */
  readonly type: ReferenceTypeSpec;
  /** URL template for links. Use $1, $2 for capture groups */
  readonly link?: string;
  /** Link target attribute */
  readonly target?: ReferenceLinkTarget;
  /** Content for info popover: string or Angular component class */
  readonly content?: string | Type<unknown>;
  /** Additional CSS class for the reference element */
  readonly cssClass?: string;
}
```

### ProcessedReference

Processed reference data emitted in events:

```typescript
interface ProcessedReference {
  readonly id: string;
  readonly matchedText: string;
  readonly captureGroups: readonly string[];
  readonly resolvedLink?: string;
  readonly target: ReferenceLinkTarget;
  readonly types: readonly ReferenceType[];
  readonly content?: string | Type<unknown>;
  readonly cssClass?: string;
  readonly lineNumber: number;
}
```

### ReferenceHoverEvent

Event emitted when hovering over a reference:

```typescript
interface ReferenceHoverEvent {
  readonly reference: ProcessedReference;
  readonly element: HTMLElement;
  readonly show: boolean;
}
```

### MultiCodeViewerTabItem

Union type for tab items:

```typescript
type MultiCodeViewerTabItem = CodeTabItem | DiffTabItem;

interface CodeTabItem {
  id: string;
  type: 'code';
  fileName: string;
  fileExtension?: string;
  code: string | string[];
  language?: CodeViewerLanguage;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  maxHeight?: string;
  wordWrap?: boolean;
  highlightedLines?: HighlightedLinesInput;
}

interface DiffTabItem {
  id: string;
  type: 'diff';
  fileName: string;
  fileExtension?: string;
  diff?: string;
  oldCode?: string;
  newCode?: string;
  language?: CodeViewerLanguage;
  viewMode?: DiffViewMode;
  showLineNumbers?: boolean;
  maxHeight?: string;
  oldFileName?: string;
  newFileName?: string;
}
```

### TabChangeEvent

```typescript
interface TabChangeEvent {
  previousTabId: string | null;
  currentTabId: string;
  currentIndex: number;
}
```

## Examples

### TypeScript Code

```typescript
const code = `interface User {
  id: number;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}!\`;
}`;
```

```html
<nx-code-viewer
  [code]="code"
  language="typescript"
  theme="dark"
  title="user.ts"
  fileExtension=".ts" />
```

### Diff Example

```typescript
const oldCode = `function add(a, b) {
  return a + b;
}`;

const newCode = `function add(a: number, b: number): number {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Invalid arguments');
  }
  return a + b;
}`;
```

```html
<nx-diff-viewer
  [oldCode]="oldCode"
  [newCode]="newCode"
  language="typescript"
  theme="dark"
  viewMode="split"
  oldFileName="math.js"
  newFileName="math.ts" />
```

### Highlighted Lines

```html
<!-- Highlight line 3, lines 7-9, and line 12 -->
<nx-code-viewer
  [code]="code"
  language="typescript"
  theme="dark"
  [highlightedLines]="[3, [7, 9], 12]" />

<!-- Highlight a single line -->
<nx-code-viewer [code]="code" language="typescript" [highlightedLines]="5" />

<!-- Highlight a range -->
<nx-code-viewer
  [code]="code"
  language="typescript"
  [highlightedLines]="[[1, 10]]" />
```

### Focused Lines

Blur all lines except the focused ones. Hover over blurred lines to reveal them.

```html
<!-- Focus on lines 3-6 and line 12, blur the rest -->
<nx-code-viewer
  [code]="code"
  language="typescript"
  theme="dark"
  [focusedLines]="[[3, 6], 12]" />

<!-- Combine focused and highlighted lines -->
<nx-code-viewer
  [code]="code"
  language="typescript"
  theme="dark"
  [focusedLines]="[[3, 13]]"
  [highlightedLines]="[4, 5, 11]" />
```

### Border Styles

```html
<!-- Classic rounded border (default) -->
<nx-code-viewer [code]="code" language="typescript" borderStyle="classic" />

<!-- Grid with corner crosses -->
<nx-code-viewer [code]="code" language="typescript" borderStyle="grid-cross" />

<!-- Corner intersection style -->
<nx-code-viewer [code]="code" language="typescript" borderStyle="corner-intersection" />

<!-- No border -->
<nx-code-viewer [code]="code" language="typescript" borderStyle="none" />
```

### Reference Links

Add interactive references to code that link to documentation or show info popovers on hover.

```typescript
const code = `import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example',
  template: '<h1>{{ title() }}</h1>',
  imports: [CommonModule],
})
export class ExampleComponent {
  // TODO: Add more features
  readonly title = signal('Hello, World!');
}`;

// Reference configurations
const references: ReferenceConfig[] = [
  // Link type: clickable external link
  {
    textMatch: /@angular\/core/g,
    type: 'link',
    link: 'https://angular.dev/api#angular_core',
    target: '_blank',
  },
  // Link + Info type: clickable link with hover popover
  {
    textMatch: /@angular\/common/g,
    type: ['link', 'info'],
    link: 'https://angular.dev/api#angular_common',
    target: '_blank',
    content: 'Common Angular directives like @if, @for etc',
  },
  // Info type with string content
  {
    textMatch: /@Component/g,
    type: 'info',
    content: 'Angular decorator that defines a component class',
  },
  // Info type with custom Angular component
  {
    textMatch: /TODO:.*/g,
    type: 'info',
    content: TodoInfoComponent, // Your custom component
  },
  // Using capture groups in link URL
  {
    textMatch: /@angular\/(\w+)/g,
    linkMatch: /@angular\/(\w+)/g,
    type: 'link',
    link: 'https://angular.dev/api#angular_$1', // $1 = capture group
    target: '_blank',
  },
];
```

```html
<nx-code-viewer
  [code]="code"
  language="typescript"
  theme="dark"
  [references]="references"
  (referenceClick)="onReferenceClick($event)"
  (referenceHover)="onReferenceHover($event)" />
```

#### Custom Info Component

Create a component to display rich content in the info popover:

```typescript
@Component({
  selector: 'app-todo-info',
  template: `
    <div class="todo-info">
      <strong>TODO Item</strong>
      <p>{{ matchedText() }}</p>
      <p>Found on line {{ lineNumber() }}</p>
    </div>
  `,
})
export class TodoInfoComponent {
  // These inputs are automatically provided by the code viewer
  readonly matchedText = input<string>('');
  readonly captureGroups = input<readonly string[]>([]);
  readonly lineNumber = input<number>(0);
}
```

### Multi-Code Viewer

```typescript
const tabs: MultiCodeViewerTabItem[] = [
  {
    id: 'component',
    type: 'code',
    fileName: 'user.component.ts',
    fileExtension: '.ts',
    language: 'typescript',
    code: `@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent {
  name = signal('John');
}`,
  },
  {
    id: 'template',
    type: 'code',
    fileName: 'user.component.html',
    fileExtension: '.html',
    language: 'html',
    code: '<div>{{ name() }}</div>',
  },
  {
    id: 'changes',
    type: 'diff',
    fileName: 'user.service.ts',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: 'getUser(id) { ... }',
    newCode: 'getUser(id: number): User { ... }',
  },
];
```

```html
<nx-multi-code-viewer
  [tabs]="tabs"
  theme="dark"
  borderStyle="classic"
  (activeTabChange)="onTabChange($event)" />
```

### Column Code Viewer — Framework Comparison

```typescript
const frameworkColumns: ColumnItem[] = [
  {
    id: 'angular',
    type: 'code',
    title: 'Angular',
    fileExtension: '.ts',
    language: 'typescript',
    code: `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: '<button (click)="increment()">{{ count() }}</button>',
})
export class CounterComponent {
  readonly count = signal(0);
  increment() { this.count.update(v => v + 1); }
}`,
  },
  {
    id: 'react',
    type: 'code',
    title: 'React',
    fileExtension: '.tsx',
    language: 'tsx',
    code: `import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}`,
  },
  {
    id: 'vue',
    type: 'code',
    title: 'Vue',
    fileExtension: '.vue',
    language: 'vue',
    code: `<script setup>
import { ref } from 'vue';
const count = ref(0);
</script>
<template>
  <button @click="count++">Count: {{ count }}</button>
</template>`,
  },
];
```

```html
<nx-column-code-viewer
  [columns]="frameworkColumns"
  theme="dark"
  borderStyle="classic" />
```

### Column Code Viewer — Code Review

```typescript
const reviewColumns: ColumnItem[] = [
  {
    id: 'current',
    type: 'code',
    title: 'api.service.ts',
    language: 'typescript',
    code: currentCode,
    highlightedLines: [[5, 7]],
  },
  {
    id: 'proposed',
    type: 'diff',
    title: 'Proposed Changes',
    language: 'typescript',
    oldCode: currentCode,
    newCode: proposedCode,
  },
];
```

```html
<nx-column-code-viewer
  [columns]="reviewColumns"
  theme="dark"
  borderStyle="classic"
  (codeCopied)="onCopied($event)" />
```

### Dynamic Theme Toggle

```typescript
@Component({
  template: `
    <button (click)="toggleTheme()">Toggle Theme</button>
    <nx-code-viewer [code]="code" language="typescript" [theme]="theme()" />
  `,
})
export class MyComponent {
  theme = signal<CodeViewerTheme>('dark');

  toggleTheme() {
    this.theme.update(t => (t === 'dark' ? 'light' : 'dark'));
  }
}
```

## Styling

The components use Tailwind CSS internally. The syntax highlighting colors are provided by Shiki themes:

- Dark theme: `github-dark`
- Light theme: `github-light`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
