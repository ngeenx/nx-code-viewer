---
title: Line Highlighting
description: Draw attention to specific lines with highlighting, focus, and collapse.
sidebar:
  group: Basic Examples
  icon: spotlight
  order: 3
---

# Line Highlighting

`nx-code-viewer` ships three independent line-level features that can be
combined in any order: **`highlightedLines`** paints a background color on
specific lines, **`focusedLines`** blurs everything except the chosen
range, and **`collapsedLines`** hides a block behind an inline
"... N lines" indicator the user can expand on demand.

All three accept the same shape: a list of line numbers or `[from, to]`
inclusive ranges (1-indexed).

## Highlighted Lines

Lines 3, 7-9, and 12 are tinted to draw the eye to a step-by-step
walk-through. Useful for tutorials that reference specific lines from a
broader snippet without splitting the file.

:::demo{name="code-viewer-highlighted-lines" height="450" centered}

```ts angular
import { Component } from '@angular/core';
import {
  CodeViewerComponent,
  type HighlightedLinesInput,
} from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-highlighted-lines-demo',
  standalone: true,
  imports: [CodeViewerComponent],
  template: `
    <nx-code-viewer
      [code]="sample"
      language="typescript"
      [highlightedLines]="highlightedLines"
      title="Highlighted Lines"
      fileExtension="ts" />
  `,
})
export class HighlightedLinesDemoComponent {
  protected readonly highlightedLines: HighlightedLinesInput = [3, [7, 9], 12];
  protected readonly sample = `import { Component } from '@angular/core';
...`;
}
```

```vue vue
<template>
  <CodeViewer
    :code="sample"
    language="typescript"
    :highlightedLines="highlightedLines"
    title="Highlighted Lines"
    fileExtension="ts"
  />
</template>

<script setup lang="ts">
import {
  CodeViewer,
  type HighlightedLinesInput,
} from '@ngeenx/nx-vue-code-viewer';

const highlightedLines: HighlightedLinesInput = [3, [7, 9], 12];
const sample = `import { Component } from '@angular/core';
...`;
</script>
```

```svelte svelte
<CodeViewer
  code={sample}
  language="typescript"
  {highlightedLines}
  title="Highlighted Lines"
  fileExtension="ts"
/>

<script lang="ts">
  import {
    CodeViewer,
    type HighlightedLinesInput,
  } from '@ngeenx/nx-svelte-code-viewer';

  const highlightedLines: HighlightedLinesInput = [3, [7, 9], 12];
  const sample = `import { Component } from '@angular/core';
...`;
</script>
```

```tsx react
import {
  CodeViewer,
  type HighlightedLinesInput,
} from '@ngeenx/nx-react-code-viewer';

const highlightedLines: HighlightedLinesInput = [3, [7, 9], 12];

const sample = `import { Component } from '@angular/core';
...`;

export default function Snippet() {
  return (
    <CodeViewer
      code={sample}
      language="typescript"
      highlightedLines={highlightedLines}
      title="Highlighted Lines"
      fileExtension="ts"
    />
  );
}
```

:::

## Focused Lines

Lines 3-6 and 12 are sharp; everything else is blurred. The contrast pulls
the reader's attention without removing surrounding context the way a
truncated snippet would.

:::demo{name="code-viewer-focused-lines" height="450" centered}

```ts angular
import { Component } from '@angular/core';
import {
  CodeViewerComponent,
  type FocusedLinesInput,
} from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-focused-lines-demo',
  standalone: true,
  imports: [CodeViewerComponent],
  template: `
    <nx-code-viewer
      [code]="sample"
      language="typescript"
      [focusedLines]="focusedLines"
      title="Focused Lines"
      fileExtension="ts" />
  `,
})
export class FocusedLinesDemoComponent {
  protected readonly focusedLines: FocusedLinesInput = [[3, 6], 12];
  protected readonly sample = `...`;
}
```

```vue vue
<template>
  <CodeViewer
    :code="sample"
    language="typescript"
    :focusedLines="focusedLines"
    title="Focused Lines"
    fileExtension="ts"
  />
</template>

<script setup lang="ts">
import { CodeViewer, type FocusedLinesInput } from '@ngeenx/nx-vue-code-viewer';

const focusedLines: FocusedLinesInput = [[3, 6], 12];
const sample = `...`;
</script>
```

```svelte svelte
<CodeViewer
  code={sample}
  language="typescript"
  {focusedLines}
  title="Focused Lines"
  fileExtension="ts"
/>

<script lang="ts">
  import { CodeViewer, type FocusedLinesInput } from '@ngeenx/nx-svelte-code-viewer';

  const focusedLines: FocusedLinesInput = [[3, 6], 12];
  const sample = `...`;
</script>
```

```tsx react
import { CodeViewer, type FocusedLinesInput } from '@ngeenx/nx-react-code-viewer';

const focusedLines: FocusedLinesInput = [[3, 6], 12];

const sample = `...`;

export default function Snippet() {
  return (
    <CodeViewer
      code={sample}
      language="typescript"
      focusedLines={focusedLines}
      title="Focused Lines"
      fileExtension="ts"
    />
  );
}
```

:::

## Focused and Highlighted Combined

Stack the two: focus on lines 3-13 to set the scene, then highlight 4, 5,
and 11 inside that focused region for the lines the prose actually
discusses.

:::demo{name="code-viewer-focused-and-highlighted" height="450" centered}

```ts angular
import { Component } from '@angular/core';
import {
  CodeViewerComponent,
  type FocusedLinesInput,
  type HighlightedLinesInput,
} from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-focused-and-highlighted-demo',
  standalone: true,
  imports: [CodeViewerComponent],
  template: `
    <nx-code-viewer
      [code]="sample"
      language="typescript"
      [focusedLines]="focusedLines"
      [highlightedLines]="highlightedLines"
      title="Focused + Highlighted"
      fileExtension="ts" />
  `,
})
export class FocusedAndHighlightedDemoComponent {
  protected readonly focusedLines: FocusedLinesInput = [[3, 13]];
  protected readonly highlightedLines: HighlightedLinesInput = [4, 5, 11];
  protected readonly sample = `...`;
}
```

```vue vue
<template>
  <CodeViewer
    :code="sample"
    language="typescript"
    :focusedLines="focusedLines"
    :highlightedLines="highlightedLines"
    title="Focused + Highlighted"
    fileExtension="ts"
  />
</template>

<script setup lang="ts">
import {
  CodeViewer,
  type FocusedLinesInput,
  type HighlightedLinesInput,
} from '@ngeenx/nx-vue-code-viewer';

const focusedLines: FocusedLinesInput = [[3, 13]];
const highlightedLines: HighlightedLinesInput = [4, 5, 11];
const sample = `...`;
</script>
```

```svelte svelte
<CodeViewer
  code={sample}
  language="typescript"
  {focusedLines}
  {highlightedLines}
  title="Focused + Highlighted"
  fileExtension="ts"
/>

<script lang="ts">
  import {
    CodeViewer,
    type FocusedLinesInput,
    type HighlightedLinesInput,
  } from '@ngeenx/nx-svelte-code-viewer';

  const focusedLines: FocusedLinesInput = [[3, 13]];
  const highlightedLines: HighlightedLinesInput = [4, 5, 11];
  const sample = `...`;
</script>
```

```tsx react
import {
  CodeViewer,
  type FocusedLinesInput,
  type HighlightedLinesInput,
} from '@ngeenx/nx-react-code-viewer';

const focusedLines: FocusedLinesInput = [[3, 13]];
const highlightedLines: HighlightedLinesInput = [4, 5, 11];

const sample = `...`;

export default function Snippet() {
  return (
    <CodeViewer
      code={sample}
      language="typescript"
      focusedLines={focusedLines}
      highlightedLines={highlightedLines}
      title="Focused + Highlighted"
      fileExtension="ts"
    />
  );
}
```

:::

## Collapsed Lines

Lines 4-8 and 15-20 are hidden behind an inline "... N lines" indicator.
Click the chevron in the gutter or the indicator itself to expand. Useful
for long files where boilerplate imports or JSDoc blocks would otherwise
push the meaningful code below the fold.

:::demo{name="code-viewer-collapsed-lines" height="570" centered}

```ts angular
import { Component } from '@angular/core';
import {
  CodeViewerComponent,
  type CollapsedLinesInput,
} from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-collapsed-lines-demo',
  standalone: true,
  imports: [CodeViewerComponent],
  template: `
    <nx-code-viewer
      [code]="sample"
      language="typescript"
      [collapsedLines]="collapsedLines"
      title="Collapsed Lines"
      fileExtension="ts" />
  `,
})
export class CollapsedLinesDemoComponent {
  protected readonly collapsedLines: CollapsedLinesInput = [
    [4, 8],
    [15, 20],
  ];
  protected readonly sample = `...`;
}
```

```vue vue
<template>
  <CodeViewer
    :code="sample"
    language="typescript"
    :collapsedLines="collapsedLines"
    title="Collapsed Lines"
    fileExtension="ts"
  />
</template>

<script setup lang="ts">
import {
  CodeViewer,
  type CollapsedLinesInput,
} from '@ngeenx/nx-vue-code-viewer';

const collapsedLines: CollapsedLinesInput = [
  [4, 8],
  [15, 20],
];
const sample = `...`;
</script>
```

```svelte svelte
<CodeViewer
  code={sample}
  language="typescript"
  {collapsedLines}
  title="Collapsed Lines"
  fileExtension="ts"
/>

<script lang="ts">
  import {
    CodeViewer,
    type CollapsedLinesInput,
  } from '@ngeenx/nx-svelte-code-viewer';

  const collapsedLines: CollapsedLinesInput = [
    [4, 8],
    [15, 20],
  ];
  const sample = `...`;
</script>
```

```tsx react
import {
  CodeViewer,
  type CollapsedLinesInput,
} from '@ngeenx/nx-react-code-viewer';

const collapsedLines: CollapsedLinesInput = [
  [4, 8],
  [15, 20],
];

const sample = `...`;

export default function Snippet() {
  return (
    <CodeViewer
      code={sample}
      language="typescript"
      collapsedLines={collapsedLines}
      title="Collapsed Lines"
      fileExtension="ts"
    />
  );
}
```

:::

## Collapsed Lines with Highlights

Collapsing composes with highlighting (and focusing). Here lines 4-8 are
collapsed to hide the JSDoc header, while lines 10, 11, 22, and 23 are
highlighted in the visible portion.

:::demo{name="code-viewer-collapsed-with-highlights" height="650" centered}

```ts angular
import { Component } from '@angular/core';
import {
  CodeViewerComponent,
  type CollapsedLinesInput,
  type HighlightedLinesInput,
} from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-collapsed-with-highlights-demo',
  standalone: true,
  imports: [CodeViewerComponent],
  template: `
    <nx-code-viewer
      [code]="sample"
      language="typescript"
      [collapsedLines]="collapsedLines"
      [highlightedLines]="highlightedLines"
      title="Collapsed + Highlights"
      fileExtension="ts" />
  `,
})
export class CollapsedWithHighlightsDemoComponent {
  protected readonly collapsedLines: CollapsedLinesInput = [[4, 8]];
  protected readonly highlightedLines: HighlightedLinesInput = [10, 11, 22, 23];
  protected readonly sample = `...`;
}
```

```vue vue
<template>
  <CodeViewer
    :code="sample"
    language="typescript"
    :collapsedLines="collapsedLines"
    :highlightedLines="highlightedLines"
    title="Collapsed + Highlights"
    fileExtension="ts"
  />
</template>

<script setup lang="ts">
import {
  CodeViewer,
  type CollapsedLinesInput,
  type HighlightedLinesInput,
} from '@ngeenx/nx-vue-code-viewer';

const collapsedLines: CollapsedLinesInput = [[4, 8]];
const highlightedLines: HighlightedLinesInput = [10, 11, 22, 23];
const sample = `...`;
</script>
```

```svelte svelte
<CodeViewer
  code={sample}
  language="typescript"
  {collapsedLines}
  {highlightedLines}
  title="Collapsed + Highlights"
  fileExtension="ts"
/>

<script lang="ts">
  import {
    CodeViewer,
    type CollapsedLinesInput,
    type HighlightedLinesInput,
  } from '@ngeenx/nx-svelte-code-viewer';

  const collapsedLines: CollapsedLinesInput = [[4, 8]];
  const highlightedLines: HighlightedLinesInput = [10, 11, 22, 23];
  const sample = `...`;
</script>
```

```tsx react
import {
  CodeViewer,
  type CollapsedLinesInput,
  type HighlightedLinesInput,
} from '@ngeenx/nx-react-code-viewer';

const collapsedLines: CollapsedLinesInput = [[4, 8]];
const highlightedLines: HighlightedLinesInput = [10, 11, 22, 23];

const sample = `...`;

export default function Snippet() {
  return (
    <CodeViewer
      code={sample}
      language="typescript"
      collapsedLines={collapsedLines}
      highlightedLines={highlightedLines}
      title="Collapsed + Highlights"
      fileExtension="ts"
    />
  );
}
```

:::

## Inputs

| Input              | Type                    | Notes                                                           |
| ------------------ | ----------------------- | --------------------------------------------------------------- |
| `highlightedLines` | `HighlightedLinesInput` | Numbers or `[from, to]` ranges. 1-indexed, inclusive.           |
| `focusedLines`     | `FocusedLinesInput`     | Same shape. Lines outside the set are visually blurred.         |
| `collapsedLines`   | `CollapsedLinesInput`   | Same shape. Each range collapses into one expandable indicator. |
