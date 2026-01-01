# @ngeenx/nx-angular-code-viewer

A powerful Angular library for displaying syntax-highlighted code and code diffs. Built with [Shiki](https://shiki.style/) for accurate, VS Code-quality syntax highlighting.

## Features

- Syntax highlighting for 200+ programming languages
- Dark and light theme support
- Code viewer with line numbers and copy functionality
- Diff viewer with unified and split view modes
- Line highlighting on hover
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
<nx-code-viewer
  [code]="sourceCode"
  language="typescript"
  theme="dark"
/>
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
  (codeCopied)="onCodeCopied()"
/>
```

#### Code as Array

You can pass code as an array of strings (each element becomes a line):

```html
<nx-code-viewer
  [code]="['const a = 1;', 'const b = 2;', 'console.log(a + b);']"
  language="javascript"
/>
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
  [viewMode]="'unified'"
/>
```

#### Using Unified Diff String

```html
<nx-diff-viewer
  [diff]="gitDiffOutput"
  [language]="'typescript'"
  [theme]="'dark'"
  [viewMode]="'split'"
/>
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
/>
```

## API Reference

### CodeViewerComponent

#### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `code` | `string \| string[]` | **required** | Source code to display. Can be a string or array of lines. |
| `language` | `CodeViewerLanguage` | `'plaintext'` | Programming language for syntax highlighting. |
| `theme` | `CodeViewerTheme` | `'dark'` | Color theme (`'dark'` or `'light'`). |
| `title` | `string` | `''` | Optional title displayed in the header. |
| `fileExtension` | `string` | `''` | File extension for icon display (e.g., `'.ts'`, `'.js'`). |
| `showLineNumbers` | `boolean` | `true` | Whether to show line numbers. |
| `showCopyButton` | `boolean` | `true` | Whether to show the copy button. |
| `showHeader` | `boolean` | `true` | Whether to show the header section. |
| `maxHeight` | `string` | `''` | Maximum height with scrolling (e.g., `'300px'`). |
| `wordWrap` | `boolean` | `false` | Enable word wrapping for long lines. |
| `highlightedLines` | `HighlightedLinesInput` | `undefined` | Pre-configured lines to highlight. See below for format. |

#### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `codeCopied` | `void` | Emitted when code is copied to clipboard. |

### DiffViewerComponent

#### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `diff` | `string` | `''` | Unified diff string (git diff format). |
| `oldCode` | `string` | `''` | Original code for computing diff. |
| `newCode` | `string` | `''` | Modified code for computing diff. |
| `language` | `CodeViewerLanguage` | `'plaintext'` | Programming language for syntax highlighting. |
| `theme` | `CodeViewerTheme` | `'dark'` | Color theme (`'dark'` or `'light'`). |
| `viewMode` | `DiffViewMode` | `'unified'` | Display mode (`'unified'` or `'split'`). |
| `showLineNumbers` | `boolean` | `true` | Whether to show line numbers. |
| `showHeader` | `boolean` | `true` | Whether to show the header section. |
| `maxHeight` | `string` | `''` | Maximum height with scrolling. |
| `oldFileName` | `string` | `''` | Old file name for header display. |
| `newFileName` | `string` | `''` | New file name for header display. |
| `fileExtension` | `string` | `''` | File extension for icon display. |

## Types

### CodeViewerTheme

```typescript
type CodeViewerTheme = 'dark' | 'light';
```

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
- Range: `[1, 5]` - highlights lines 1 through 5 (when used as a tuple)
- Multiple ranges: `[[1, 5], [10, 15]]` - highlights lines 1-5 and 10-15
- Mixed: `[1, [3, 5], 8, [10, 12]]` - highlights line 1, lines 3-5, line 8, and lines 10-12

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
  fileExtension=".ts"
/>
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
  newFileName="math.ts"
/>
```

### Highlighted Lines

```html
<!-- Highlight line 3, lines 7-9, and line 12 -->
<nx-code-viewer
  [code]="code"
  language="typescript"
  theme="dark"
  [highlightedLines]="[3, [7, 9], 12]"
/>

<!-- Highlight a single line -->
<nx-code-viewer
  [code]="code"
  language="typescript"
  [highlightedLines]="5"
/>

<!-- Highlight a range -->
<nx-code-viewer
  [code]="code"
  language="typescript"
  [highlightedLines]="[[1, 10]]"
/>
```

### Dynamic Theme Toggle

```typescript
@Component({
  template: `
    <button (click)="toggleTheme()">Toggle Theme</button>
    <nx-code-viewer
      [code]="code"
      language="typescript"
      [theme]="theme()"
    />
  `
})
export class MyComponent {
  theme = signal<CodeViewerTheme>('dark');

  toggleTheme() {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
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
