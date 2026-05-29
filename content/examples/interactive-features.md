---
title: Interactive Features
description: Add reference links and per-line widgets to your code viewer.
sidebar:
  group: Advanced
  icon: mouse-pointer-click
  order: 0
  badge:
    text: "\U0001F9EA"
    variant: warning
---

# Interactive Features

:::warning{title="Experimental"}
These features are still under active development. The `references` and
`lineWidgets` APIs may change in upcoming releases, and bugs are more
likely here than on the basic-usage paths. Use them in production with
care and pin the package version.
:::

## Install the tippy.js peer

Reference popovers are powered by [tippy.js](https://atomiks.github.io/tippyjs/),
a small floating-element library. It is declared as an **optional**
peer of the code viewer so projects that only render plain snippets
don't pay its bundle cost the import is lazy and won't pull tippy
into the main chunk until a reference popover actually opens.

If you plan to use this page's features, install the package and
import its base stylesheet:

```bash
pnpm add tippy.js
```

```ts
// In your app's global stylesheet or root entry point:
import 'tippy.js/dist/tippy.css';
```

Without these two pieces installed, the first reference popover that
tries to open will log a clear error in the console and gracefully
degrade the rest of the code viewer keeps working.

The code viewer can do more than render a snippet. Two inputs turn it into
an interactive surface: `references` attaches tooltips and links to
matched text patterns, and `lineWidgets` injects per-line UI (icons,
forms, anything Angular renders) that appears on hover.

## Reference Links

`references` takes a list of `ReferenceConfig` entries. Each entry has a
`textMatch` regex, a `type` (`'link'`, `'info'`, or both), and a `content`
that's either a plain string or an Angular component class. Hover over
matched text to see the popover; click to navigate when `link` is set.

Try hovering `@angular/...` imports, `@Component`, the `signal(` call, or
the `TODO` comment the TODO uses an Angular component as its popover
body, so it gets a custom layout with a priority badge.

:::demo{name="code-viewer-reference-links" height="500" centered}

```ts angular
import { Component, signal } from '@angular/core';
import {
  CodeViewerComponent,
  type ReferenceConfig,
} from '@ngeenx/nx-angular-code-viewer';
import { TodoInfoComponent } from './todo-info.component';

@Component({
  selector: 'app-reference-links-demo',
  standalone: true,
  imports: [CodeViewerComponent],
  template: `
    <nx-code-viewer
      [code]="sample"
      language="typescript"
      [references]="references"
      title="reference-links.ts"
      fileExtension="ts" />
  `,
})
export class ReferenceLinksDemoComponent {
  protected readonly references: ReferenceConfig[] = [
    {
      textMatch: /@angular\/core/g,
      type: ['link', 'info'] as const,
      link: 'https://angular.dev/api#angular_core',
      target: '_blank',
      content: 'Core Angular library component, signal, and more',
    },
    {
      textMatch: /TODO:.*/g,
      type: 'info',
      content: TodoInfoComponent,
    },
    {
      textMatch: /signal\(/g,
      type: 'info',
      content: 'Creates a reactive signal that can be read and updated',
    },
  ];
  protected readonly sample = `...`;
}
```

```vue vue
<template>
  <CodeViewer
    :code="sample"
    language="typescript"
    :references="references"
    title="reference-links.ts"
    fileExtension="ts"
  />
</template>

<script setup lang="ts">
import { CodeViewer, type ReferenceConfig } from '@ngeenx/nx-vue-code-viewer';
import TodoInfoWidget from './TodoInfoWidget.vue';

const references: ReferenceConfig[] = [
  {
    textMatch: /@angular\/core/g,
    type: ['link', 'info'] as const,
    link: 'https://angular.dev/api#angular_core',
    target: '_blank',
    content: 'Core Angular library component, signal, and more',
  },
  {
    textMatch: /TODO:.*/g,
    type: 'info',
    content: TodoInfoWidget,
  },
  {
    textMatch: /signal\(/g,
    type: 'info',
    content: 'Creates a reactive signal that can be read and updated',
  },
];

const sample = `...`;
</script>
```

:::

## Line Widgets

`lineWidgets` registers components that mount per-line. Each widget has a
`position` (`'left'` or `'right'` of the line), a `display` mode
(`'always'` or `'hover'`), and a `lineComponent`. Add `insertComponent` to
mount a panel below the line when the widget is clicked useful for
inline comment forms.

In the demo below, hover any line to reveal a bookmark button on the
left (click to toggle) and a comment button on the right (click to open a
comment form below the line).

:::demo{name="code-viewer-line-widgets" height="700" centered}

```ts angular
import { Component } from '@angular/core';
import {
  CodeViewerComponent,
  type LineWidgetsInput,
} from '@ngeenx/nx-angular-code-viewer';
import { BookmarkWidgetComponent } from './bookmark-widget.component';
import { CommentWidgetComponent } from './comment-widget.component';
import { CommentFormComponent } from './comment-form.component';

@Component({
  selector: 'app-line-widgets-demo',
  standalone: true,
  imports: [CodeViewerComponent],
  template: `
    <nx-code-viewer
      [code]="sample"
      language="typescript"
      [lineWidgets]="lineWidgets"
      title="line-widgets.ts"
      fileExtension="ts" />
  `,
})
export class LineWidgetsDemoComponent {
  protected readonly lineWidgets: LineWidgetsInput = [
    {
      position: 'left',
      display: 'hover',
      lineComponent: BookmarkWidgetComponent,
    },
    {
      position: 'right',
      display: 'hover',
      lineComponent: CommentWidgetComponent,
      insertComponent: CommentFormComponent,
    },
  ];
  protected readonly sample = `...`;
}
```

```vue vue
<template>
  <CodeViewer
    :code="sample"
    language="typescript"
    :lineWidgets="lineWidgets"
    title="line-widgets.ts"
    fileExtension="ts"
  />
</template>

<script setup lang="ts">
import {
  CodeViewer,
  type VueLineWidgetsInput,
} from '@ngeenx/nx-vue-code-viewer';
import BookmarkWidget from './BookmarkWidget.vue';
import CommentWidget from './CommentWidget.vue';
import CommentFormWidget from './CommentFormWidget.vue';

const lineWidgets: VueLineWidgetsInput = [
  {
    position: 'left',
    display: 'hover',
    lineComponent: BookmarkWidget,
  },
  {
    position: 'right',
    display: 'hover',
    lineComponent: CommentWidget,
    insertComponent: CommentFormWidget,
  },
];

const sample = `...`;
</script>
```

:::

### Widget context

Widget components can inject `LINE_WIDGET_CONTEXT` to read the active
line number, its raw text, and the current theme. `insertComponent`
implementations can also inject `LINE_WIDGET_CLOSE` (a `() => void`) to
dismiss themselves the comment form uses both to render its header and
clean up on Cancel / Submit.

## Inputs

| Input         | Type                | Notes                                                                                |
| ------------- | ------------------- | ------------------------------------------------------------------------------------ |
| `references`  | `ReferenceConfig[]` | Regex-driven tooltip/link annotations. Content can be a string or Angular component. |
| `lineWidgets` | `LineWidgetsInput`  | Per-line UI mounted at `left` / `right`, shown `always` or on `hover`.               |
