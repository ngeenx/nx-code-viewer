---
title: Multi Column Viewer
description: Display multiple code or diff blocks side by side in a columnar layout.
sidebar:
  group: Advanced
  icon: columns-2
  order: 2
  badge:
    text: "\U0001F9EA"
    variant: warning
---

# Multi Column Viewer

:::warning{title="Experimental"}
The column viewer's API is still under active development. The
`ColumnItem` shape and `borderStyle` defaults may change before the
1.0 release. Pin the package version if you rely on this component in
production.
:::

`nx-column-code-viewer` arranges multiple snippets horizontally in a
shared chrome. Each column can be either a **code** snapshot or a
**diff**, the same mixed `ColumnItem[]` shape used by
`nx-multi-code-viewer`. Useful for cross-framework comparisons and for
showing source-of-truth next to a proposed change.

The layout is purely visual each column is an independent
`nx-code-viewer` / `nx-diff-viewer` inside one card.

## Framework comparison

Same counter component implemented three times. The viewer doesn't care
that the languages differ; each column keeps its own header, fence, and
syntax highlighting.

:::demo{name="code-columns-frameworks" height="600" centered}

```ts angular
import { Component } from '@angular/core';
import {
  ColumnCodeViewerComponent,
  type ColumnItem,
} from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-columns-frameworks-demo',
  standalone: true,
  imports: [ColumnCodeViewerComponent],
  template: `
    <nx-column-code-viewer [columns]="columns" borderStyle="classic" />
  `,
})
export class ColumnsFrameworksDemoComponent {
  protected readonly columns: ColumnItem[] = [
    {
      id: 'angular',
      type: 'code',
      title: 'Angular',
      fileExtension: '.ts',
      language: 'typescript',
      code: `...`,
    },
    {
      id: 'react',
      type: 'code',
      title: 'React',
      fileExtension: '.tsx',
      language: 'tsx',
      code: `...`,
    },
    {
      id: 'vue',
      type: 'code',
      title: 'Vue',
      fileExtension: '.vue',
      language: 'vue',
      code: `...`,
    },
  ];
}
```

:::

## Code + Diff side by side

The columns array can mix `code` and `diff` types freely. Below: current
source on the left, the proposed change as a diff on the right. Reviewers
read top-down on each side without scrolling back and forth.

:::demo{name="code-columns-code-diff" height="600" centered}

```ts angular
import { Component } from '@angular/core';
import {
  ColumnCodeViewerComponent,
  type ColumnItem,
} from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-columns-code-diff-demo',
  standalone: true,
  imports: [ColumnCodeViewerComponent],
  template: `
    <nx-column-code-viewer [columns]="columns" borderStyle="classic" />
  `,
})
export class ColumnsCodeDiffDemoComponent {
  protected readonly columns: ColumnItem[] = [
    {
      id: 'code',
      type: 'code',
      title: 'api.service.ts',
      fileExtension: '.ts',
      language: 'typescript',
      code: `...`,
    },
    {
      id: 'diff',
      type: 'diff',
      title: 'Proposed Changes',
      fileExtension: '.ts',
      language: 'typescript',
      oldCode: `...`,
      newCode: `...`,
    },
  ];
}
```

:::

## Border styles

`borderStyle` accepts the same four values as the other viewers:
`classic`, `grid-cross`, `corner-intersection`, and `none`. The setting
applies to the outer chrome; each column shares the same treatment.

## Inputs

| Input         | Type                    | Notes                                                                         |
| ------------- | ----------------------- | ----------------------------------------------------------------------------- |
| `columns`     | `ColumnItem[]`          | Mixed `type: 'code'` and `type: 'diff'` entries. Column order is array order. |
| `borderStyle` | `CodeViewerBorderStyle` | `'classic' \| 'grid-cross' \| 'corner-intersection' \| 'none'`.               |
| `theme`       | `'light' \| 'dark'`     | Mirrors the host page theme.                                                  |
| `shikiTheme`  | `ShikiThemeName`        | Single theme. Use `shikiThemes` for a light/dark pair.                        |

### `ColumnItem` shape

- `id` — stable string used as the column key.
- `type` — `'code'` or `'diff'`.
- `title`, `fileExtension`, `language` — passed through to the column's
  inner code or diff viewer.
- For `code` columns: `code`.
- For `diff` columns: `oldCode`, `newCode` (plus optional diff inputs
  like `viewMode`, `collapsedLines`).
