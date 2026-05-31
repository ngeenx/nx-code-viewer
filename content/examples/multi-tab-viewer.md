---
title: Multi Tab Viewer
description: Tabbed viewer for browsing multiple files and diffs in one chrome.
sidebar:
  group: Advanced
  icon: panels-top-left
  order: 1
---

# Multi Tab Viewer

`nx-multi-code-viewer` is a single chrome that hosts multiple files
behind a tab strip. Each tab can be either a **code** snapshot or a
**diff** between two snapshots, mixed freely. The active tab swaps in
place, so the viewer's height stays bounded by the largest tab rather
than scrolling through every file stacked vertically.

## Mixed tabs (code + diff)

Three regular files and one diff tab, all in one chrome. Click the tab
strip at the top of the demo to switch.

:::demo{name="code-multi-viewer" height="400" centered}

```ts angular
import { Component } from '@angular/core';
import {
  MultiCodeViewerComponent,
  type MultiCodeViewerTabItem,
} from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-multi-viewer-demo',
  standalone: true,
  imports: [MultiCodeViewerComponent],
  template: ` <nx-multi-code-viewer [tabs]="tabs" borderStyle="classic" /> `,
})
export class MultiViewerDemoComponent {
  protected readonly tabs: MultiCodeViewerTabItem[] = [
    {
      id: 'component',
      type: 'code',
      fileName: 'user.component.ts',
      fileExtension: '.ts',
      language: 'typescript',
      code: `...`,
    },
    {
      id: 'template',
      type: 'code',
      fileName: 'user.component.html',
      fileExtension: '.html',
      language: 'html',
      code: `...`,
    },
    {
      id: 'styles',
      type: 'code',
      fileName: 'user.component.css',
      fileExtension: '.css',
      language: 'css',
      code: `...`,
    },
    {
      id: 'changes',
      type: 'diff',
      fileName: 'user.service.ts',
      fileExtension: '.ts',
      language: 'typescript',
      oldCode: `...`,
      newCode: `...`,
    },
  ];
}
```

```vue vue
<template>
  <MultiCodeViewer :tabs="tabs" borderStyle="classic" />
</template>

<script setup lang="ts">
import {
  MultiCodeViewer,
  type MultiCodeViewerTabItem,
} from '@ngeenx/nx-vue-code-viewer';

const tabs: MultiCodeViewerTabItem[] = [
  {
    id: 'component',
    type: 'code',
    fileName: 'user.component.ts',
    fileExtension: '.ts',
    language: 'typescript',
    code: `...`,
  },
  {
    id: 'template',
    type: 'code',
    fileName: 'user.component.html',
    fileExtension: '.html',
    language: 'html',
    code: `...`,
  },
  {
    id: 'styles',
    type: 'code',
    fileName: 'user.component.css',
    fileExtension: '.css',
    language: 'css',
    code: `...`,
  },
  {
    id: 'changes',
    type: 'diff',
    fileName: 'user.service.ts',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: `...`,
    newCode: `...`,
  },
];
</script>
```

```svelte svelte
<MultiCodeViewer {tabs} borderStyle="classic" />

<script lang="ts">
  import {
    MultiCodeViewer,
    type MultiCodeViewerTabItem,
  } from '@ngeenx/nx-svelte-code-viewer';

  const tabs: MultiCodeViewerTabItem[] = [
    {
      id: 'component',
      type: 'code',
      fileName: 'user.component.ts',
      fileExtension: '.ts',
      language: 'typescript',
      code: `...`,
    },
    {
      id: 'template',
      type: 'code',
      fileName: 'user.component.html',
      fileExtension: '.html',
      language: 'html',
      code: `...`,
    },
    {
      id: 'styles',
      type: 'code',
      fileName: 'user.component.css',
      fileExtension: '.css',
      language: 'css',
      code: `...`,
    },
    {
      id: 'changes',
      type: 'diff',
      fileName: 'user.service.ts',
      fileExtension: '.ts',
      language: 'typescript',
      oldCode: `...`,
      newCode: `...`,
    },
  ];
</script>
```

```tsx react
import {
  MultiCodeViewer,
  type MultiCodeViewerTabItem,
} from '@ngeenx/nx-react-code-viewer';

const tabs: MultiCodeViewerTabItem[] = [
  {
    id: 'component',
    type: 'code',
    fileName: 'user.component.ts',
    fileExtension: '.ts',
    language: 'typescript',
    code: `...`,
  },
  {
    id: 'template',
    type: 'code',
    fileName: 'user.component.html',
    fileExtension: '.html',
    language: 'html',
    code: `...`,
  },
  {
    id: 'styles',
    type: 'code',
    fileName: 'user.component.css',
    fileExtension: '.css',
    language: 'css',
    code: `...`,
  },
  {
    id: 'changes',
    type: 'diff',
    fileName: 'user.service.ts',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: `...`,
    newCode: `...`,
  },
];

export default function Snippet() {
  return <MultiCodeViewer tabs={tabs} borderStyle="classic" />;
}
```

:::

## Border styles

`nx-multi-code-viewer` accepts the same `borderStyle` values as
`nx-code-viewer`: `classic`, `grid-cross`, `corner-intersection`, and
`none`. Swap one input to change the visual treatment of the chrome -
useful for matching the rest of your design system without restyling
the tabs.

## Inputs

| Input         | Type                       | Notes                                                                                  |
| ------------- | -------------------------- | -------------------------------------------------------------------------------------- |
| `tabs`        | `MultiCodeViewerTabItem[]` | Mixed `type: 'code'` and `type: 'diff'` entries. Tab order is array order.             |
| `borderStyle` | `CodeViewerBorderStyle`    | `'classic' \| 'grid-cross' \| 'corner-intersection' \| 'none'`. Defaults to `classic`. |
| `theme`       | `'light' \| 'dark'`        | Mirrors the host page theme.                                                           |
| `shikiTheme`  | `ShikiThemeName`           | Single theme. Use `shikiThemes` for a light/dark pair.                                 |

### `MultiCodeViewerTabItem` shape

- `id` stable string used as the tab key.
- `type` `'code'` or `'diff'`. Drives which sub-renderer the tab uses.
- `fileName`, `fileExtension`, `language` passed straight through to
  the underlying `nx-code-viewer` / `nx-diff-viewer`.
- For `code` tabs: `code`.
- For `diff` tabs: `oldCode`, `newCode` (and optionally `viewMode`,
  `collapsedLines`, etc., per the diff viewer inputs).
