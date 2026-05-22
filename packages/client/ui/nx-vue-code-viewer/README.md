# @ngeenx/nx-vue-code-viewer

A powerful Vue 3 library for displaying syntax-highlighted code and code diffs. Built with [Shiki](https://shiki.style/) for accurate, VS Code-quality syntax highlighting.

## Features

- Syntax highlighting for 200+ programming languages
- Dark and light theme support
- Code viewer with line numbers and copy functionality
- Diff viewer with unified and split view modes
- **Multi-code viewer** with tabbed interface for multiple files
- **Column code viewer** for side-by-side code and diff comparison
- Line highlighting on hover
- **Focused lines**: blur unfocused lines to draw attention (hover to reveal)
- **Reference links**: interactive code references with clickable links and info popovers
- **Border style variants**: classic, grid-cross, corner-intersection, or none
- File type icons based on extension
- Vue 3 Composition API with `<script setup>` support

## Installation

```bash
npm install @ngeenx/nx-vue-code-viewer
# or
pnpm add @ngeenx/nx-vue-code-viewer
```

## Usage

### CodeViewer

```vue
<script setup lang="ts">
import { CodeViewer } from '@ngeenx/nx-vue-code-viewer';

const code = `import { ref } from 'vue';

const count = ref(0);

function increment() {
  count.value++;
}`;
</script>

<template>
  <CodeViewer
    :code="code"
    language="typescript"
    theme="dark"
    title="counter.ts"
    fileExtension=".ts"
    :showLineNumbers="true"
    :showCopyButton="true"
    :showHeader="true"
    maxHeight="400px"
    borderStyle="classic"
    :highlightedLines="[[3, 6]]"
    @code-copied="onCodeCopied" />
</template>
```

### DiffViewer

```vue
<script setup lang="ts">
import { DiffViewer } from '@ngeenx/nx-vue-code-viewer';
</script>

<template>
  <DiffViewer
    :oldCode="oldCode"
    :newCode="newCode"
    language="typescript"
    theme="dark"
    viewMode="unified"
    oldFileName="math.js"
    newFileName="math.ts" />
</template>
```

### MultiCodeViewer

```vue
<script setup lang="ts">
import { MultiCodeViewer } from '@ngeenx/nx-vue-code-viewer';
import type { MultiCodeViewerTabItem } from '@ngeenx/nx-vue-code-viewer';

const tabs: MultiCodeViewerTabItem[] = [
  {
    id: 'vue',
    type: 'code',
    fileName: 'App.vue',
    fileExtension: '.vue',
    language: 'vue',
    code: '<template>...</template>',
  },
  {
    id: 'ts',
    type: 'code',
    fileName: 'useCounter.ts',
    fileExtension: '.ts',
    language: 'typescript',
    code: 'export function useCounter() {}',
  },
  {
    id: 'diff',
    type: 'diff',
    fileName: 'service.ts',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: 'v1',
    newCode: 'v2',
  },
];
</script>

<template>
  <MultiCodeViewer
    :tabs="tabs"
    theme="dark"
    borderStyle="classic"
    @active-tab-change="onTab" />
</template>
```

### ColumnCodeViewer

```vue
<script setup lang="ts">
import { ColumnCodeViewer } from '@ngeenx/nx-vue-code-viewer';
import type { ColumnItem } from '@ngeenx/nx-vue-code-viewer';

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
    id: 'vue',
    type: 'code',
    title: 'Vue',
    language: 'vue',
    fileExtension: '.vue',
    code: vueCode,
  },
  {
    id: 'react',
    type: 'code',
    title: 'React',
    language: 'tsx',
    fileExtension: '.tsx',
    code: reactCode,
  },
];
</script>

<template>
  <ColumnCodeViewer :columns="columns" theme="dark" borderStyle="classic" />
</template>
```

#### Mixed Code + Diff Columns

```vue
<template>
  <ColumnCodeViewer
    :columns="[
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
    ]"
    theme="dark" />
</template>
```

## API Reference

### CodeViewer Props

| Prop               | Type                    | Default       | Description             |
| ------------------ | ----------------------- | ------------- | ----------------------- |
| `code`             | `string \| string[]`    | **required**  | Source code to display  |
| `language`         | `CodeViewerLanguage`    | `'plaintext'` | Programming language    |
| `theme`            | `CodeViewerTheme`       | `'dark'`      | Color theme             |
| `title`            | `string`                | `''`          | Header title            |
| `fileExtension`    | `string`                | `''`          | File extension for icon |
| `showLineNumbers`  | `boolean`               | `true`        | Show line numbers       |
| `showCopyButton`   | `boolean`               | `true`        | Show copy button        |
| `showHeader`       | `boolean`               | `true`        | Show header             |
| `maxHeight`        | `string`                | `''`          | Max height with scroll  |
| `wordWrap`         | `boolean`               | `false`       | Enable word wrap        |
| `highlightedLines` | `HighlightedLinesInput` |               | Lines to highlight      |
| `focusedLines`     | `FocusedLinesInput`     |               | Lines to focus          |
| `collapsedLines`   | `CollapsedLinesInput`   |               | Ranges to collapse      |
| `borderStyle`      | `CodeViewerBorderStyle` | `'classic'`   | Border style            |
| `references`       | `ReferenceConfig[]`     | `[]`          | Interactive references  |

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

| Prop                 | Type                       | Default      | Description              |
| -------------------- | -------------------------- | ------------ | ------------------------ |
| `tabs`               | `MultiCodeViewerTabItem[]` | **required** | Tab items (code or diff) |
| `theme`              | `CodeViewerTheme`          | `'dark'`     | Color theme              |
| `borderStyle`        | `CodeViewerBorderStyle`    | `'classic'`  | Border style             |
| `showContentHeader`  | `boolean`                  | `false`      | Show headers in tabs     |
| `initialActiveTabId` | `string`                   | `''`         | Initial active tab       |

### ColumnCodeViewer Props

| Prop                | Type                    | Default      | Description                 |
| ------------------- | ----------------------- | ------------ | --------------------------- |
| `columns`           | `ColumnItem[]`          | **required** | Column items (code or diff) |
| `theme`             | `CodeViewerTheme`       | `'dark'`     | Color theme                 |
| `shikiTheme`        | `ShikiThemeName`        |              | Custom Shiki theme          |
| `borderStyle`       | `CodeViewerBorderStyle` | `'classic'`  | Border style                |
| `showColumnHeaders` | `boolean`               | `true`       | Show column headers         |
| `maxHeight`         | `string`                | `''`         | Max height per column       |
| `enableLineHover`   | `boolean`               | `true`       | Line hover highlighting     |

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
