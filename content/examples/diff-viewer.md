---
title: Diff Viewer
description: Compare two code snapshots with unified or split view.
sidebar:
  group: Basic Examples
  icon: git-compare
  order: 4
---

# Diff Viewer

`nx-diff-viewer` compares two versions of a snippet and highlights the
added, removed, and modified lines. It accepts the same theming and
chrome props as `nx-code-viewer` plus three diff-specific inputs:
`oldCode`, `newCode`, and `viewMode` (`'unified'` or `'split'`).

Click the **Switch to ... View** button above any demo to flip the layout.

## Basic Diff

A small TypeScript change. Toggle between unified (one column, +/-
markers) and split (side-by-side) to see how the same diff renders in
both modes.

:::demo{name="code-diff-basic" height="650" centered}

```ts angular
import { Component, signal } from '@angular/core';
import {
  DiffViewerComponent,
  type DiffViewMode,
} from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-diff-basic-demo',
  standalone: true,
  imports: [DiffViewerComponent],
  template: `
    <button (click)="toggleViewMode()">
      Switch to {{ viewMode() === 'unified' ? 'Split' : 'Unified' }} View
    </button>
    <nx-diff-viewer
      [oldCode]="oldCode"
      [newCode]="newCode"
      language="typescript"
      [viewMode]="viewMode()"
      fileExtension="ts"
      oldFileName="user.ts"
      newFileName="user.ts" />
  `,
})
export class DiffBasicDemoComponent {
  protected readonly viewMode = signal<DiffViewMode>('unified');
  protected readonly oldCode = `...`;
  protected readonly newCode = `...`;

  toggleViewMode() {
    this.viewMode.update(v => (v === 'unified' ? 'split' : 'unified'));
  }
}
```

```vue vue
<template>
  <button @click="toggleViewMode">
    Switch to {{ viewMode === 'unified' ? 'Split' : 'Unified' }} View
  </button>
  <DiffViewer
    :oldCode="oldCode"
    :newCode="newCode"
    language="typescript"
    :viewMode="viewMode"
    fileExtension="ts"
    oldFileName="user.ts"
    newFileName="user.ts"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DiffViewer, type DiffViewMode } from '@ngeenx/nx-vue-code-viewer';

const viewMode = ref<DiffViewMode>('unified');
const oldCode = `...`;
const newCode = `...`;

function toggleViewMode() {
  viewMode.value = viewMode.value === 'unified' ? 'split' : 'unified';
}
</script>
```

```svelte svelte
<button onclick={toggleViewMode}>
  Switch to {viewMode === 'unified' ? 'Split' : 'Unified'} View
</button>
<DiffViewer
  {oldCode}
  {newCode}
  language="typescript"
  {viewMode}
  fileExtension="ts"
  oldFileName="user.ts"
  newFileName="user.ts"
/>

<script lang="ts">
  import { DiffViewer, type DiffViewMode } from '@ngeenx/nx-svelte-code-viewer';

  let viewMode = $state<DiffViewMode>('unified');
  const oldCode = `...`;
  const newCode = `...`;

  function toggleViewMode() {
    viewMode = viewMode === 'unified' ? 'split' : 'unified';
  }
</script>
```

:::

## Diff with Collapsed Lines

`collapsedLines` accepts a list of `{ startIndex, endIndex }` ranges
(0-based global indices across the unified diff). Useful for hiding
unchanged context blocks (license headers, imports) so reviewers see the
actual changes first. Click any "... N lines" indicator to expand.

:::demo{name="code-diff-collapsed" height="620" centered}

```ts angular
import { Component, signal } from '@angular/core';
import {
  DiffViewerComponent,
  type DiffCollapsedLinesInput,
  type DiffViewMode,
} from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-diff-collapsed-demo',
  standalone: true,
  imports: [DiffViewerComponent],
  template: `
    <nx-diff-viewer
      [oldCode]="oldCode"
      [newCode]="newCode"
      language="typescript"
      [viewMode]="viewMode()"
      [collapsedLines]="collapsedLines"
      fileExtension="ts"
      oldFileName="user.component.ts"
      newFileName="user.component.ts" />
  `,
})
export class DiffCollapsedDemoComponent {
  protected readonly viewMode = signal<DiffViewMode>('unified');
  protected readonly collapsedLines: DiffCollapsedLinesInput = [
    { startIndex: 2, endIndex: 5 },
    { startIndex: 10, endIndex: 13 },
  ];
  protected readonly oldCode = `...`;
  protected readonly newCode = `...`;
}
```

```vue vue
<template>
  <DiffViewer
    :oldCode="oldCode"
    :newCode="newCode"
    language="typescript"
    :viewMode="viewMode"
    :collapsedLines="collapsedLines"
    fileExtension="ts"
    oldFileName="user.component.ts"
    newFileName="user.component.ts"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  DiffViewer,
  type DiffCollapsedLinesInput,
  type DiffViewMode,
} from '@ngeenx/nx-vue-code-viewer';

const viewMode = ref<DiffViewMode>('unified');
const collapsedLines: DiffCollapsedLinesInput = [
  { startIndex: 2, endIndex: 5 },
  { startIndex: 10, endIndex: 13 },
];
const oldCode = `...`;
const newCode = `...`;
</script>
```

```svelte svelte
<DiffViewer
  {oldCode}
  {newCode}
  language="typescript"
  {viewMode}
  {collapsedLines}
  fileExtension="ts"
  oldFileName="user.component.ts"
  newFileName="user.component.ts"
/>

<script lang="ts">
  import {
    DiffViewer,
    type DiffCollapsedLinesInput,
    type DiffViewMode,
  } from '@ngeenx/nx-svelte-code-viewer';

  let viewMode = $state<DiffViewMode>('unified');
  const collapsedLines: DiffCollapsedLinesInput = [
    { startIndex: 2, endIndex: 5 },
    { startIndex: 10, endIndex: 13 },
  ];
  const oldCode = `...`;
  const newCode = `...`;
</script>
```

:::

## Long Diff with Fixed Height

`maxHeight` bounds the diff and adds an internal scrollbar. The chrome
header stays pinned while the diff body scrolls. Useful for long files
where you want the diff visible without taking over the entire page.

:::demo{name="code-diff-scrollable" height="600" centered}

```ts angular
import { Component, signal } from '@angular/core';
import {
  DiffViewerComponent,
  type DiffViewMode,
} from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-diff-scrollable-demo',
  standalone: true,
  imports: [DiffViewerComponent],
  template: `
    <nx-diff-viewer
      [oldCode]="oldCode"
      [newCode]="newCode"
      language="typescript"
      [viewMode]="viewMode()"
      maxHeight="400px"
      fileExtension="ts"
      oldFileName="user.service.ts"
      newFileName="user.service.ts" />
  `,
})
export class DiffScrollableDemoComponent {
  protected readonly viewMode = signal<DiffViewMode>('unified');
  protected readonly oldCode = `...`;
  protected readonly newCode = `...`;
}
```

```vue vue
<template>
  <DiffViewer
    :oldCode="oldCode"
    :newCode="newCode"
    language="typescript"
    :viewMode="viewMode"
    maxHeight="400px"
    fileExtension="ts"
    oldFileName="user.service.ts"
    newFileName="user.service.ts"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DiffViewer, type DiffViewMode } from '@ngeenx/nx-vue-code-viewer';

const viewMode = ref<DiffViewMode>('unified');
const oldCode = `...`;
const newCode = `...`;
</script>
```

```svelte svelte
<DiffViewer
  {oldCode}
  {newCode}
  language="typescript"
  {viewMode}
  maxHeight="400px"
  fileExtension="ts"
  oldFileName="user.service.ts"
  newFileName="user.service.ts"
/>

<script lang="ts">
  import { DiffViewer, type DiffViewMode } from '@ngeenx/nx-svelte-code-viewer';

  let viewMode = $state<DiffViewMode>('unified');
  const oldCode = `...`;
  const newCode = `...`;
</script>
```

:::

## Inputs

| Input            | Type                      | Notes                                                                                   |
| ---------------- | ------------------------- | --------------------------------------------------------------------------------------- |
| `oldCode`        | `string`                  | The "before" snapshot.                                                                  |
| `newCode`        | `string`                  | The "after" snapshot.                                                                   |
| `viewMode`       | `'unified' \| 'split'`    | `unified` is one column with `+` / `-` markers; `split` shows old and new side by side. |
| `collapsedLines` | `DiffCollapsedLinesInput` | `{ startIndex, endIndex }` ranges (0-based) to hide.                                    |
| `oldFileName`    | `string`                  | Filename label in the header for the old snapshot.                                      |
| `newFileName`    | `string`                  | Filename label for the new snapshot.                                                    |

All `nx-code-viewer` chrome inputs (`language`, `theme`, `shikiTheme`,
`maxHeight`, `showLineNumbers`, `showHeader`, `fileExtension`,
`borderStyle`) work on `nx-diff-viewer` too.
