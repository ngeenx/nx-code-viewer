---
title: Border Styles
description: Switch between the four built-in nx-code-viewer border styles.
sidebar:
  group: Basic Examples
  icon: square-stack
  order: 2
---

# Border Styles

`nx-code-viewer` ships four `borderStyle` variants you can pick to match the
surrounding design language: `classic`, `grid-cross`, `corner-intersection`,
and `none`.

## Demo

:::demo{name="border-styles" height="1100"}

```ts angular
import { Component } from '@angular/core';
import {
  CodeViewerComponent,
  type CodeViewerLanguage,
} from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-border-styles-demo',
  imports: [CodeViewerComponent],
  template: `
    <nx-code-viewer
      [code]="sample"
      [language]="'typescript'"
      [borderStyle]="'classic'"
      [showHeader]="false"
      [showLineNumbers]="false" />
  `,
})
export class BorderStylesDemoComponent {
  protected readonly language: CodeViewerLanguage = 'typescript';

  protected readonly sample = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`;
}
```

```vue vue
<template>
  <CodeViewer
    :code="sample"
    :language="language"
    borderStyle="classic"
    :showHeader="false"
    :showLineNumbers="false"
  />
</template>

<script setup lang="ts">
import { CodeViewer, type CodeViewerLanguage } from '@ngeenx/nx-vue-code-viewer';

const language: CodeViewerLanguage = 'typescript';

const sample = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`;
</script>
```

```svelte svelte
<CodeViewer
  code={sample}
  {language}
  borderStyle="classic"
  showHeader={false}
  showLineNumbers={false}
/>

<script lang="ts">
  import {
    CodeViewer,
    type CodeViewerLanguage,
  } from '@ngeenx/nx-svelte-code-viewer';

  const language: CodeViewerLanguage = 'typescript';

  const sample = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`;
</script>
```

:::

## Example

:::if{framework="angular"}

```typescript
import { Component } from '@angular/core';
import {
  CodeViewerComponent,
  type CodeViewerBorderStyle,
  type CodeViewerLanguage,
} from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-border-styles-demo',
  imports: [CodeViewerComponent],
  template: `
    @for (style of borderStyles; track style) {
      <nx-code-viewer
        [code]="sample"
        [language]="language"
        [borderStyle]="style"
        [showHeader]="false"
        [showLineNumbers]="false" />
    }
  `,
})
export class BorderStylesDemoComponent {
  protected readonly language: CodeViewerLanguage = 'typescript';

  protected readonly borderStyles: CodeViewerBorderStyle[] = [
    'classic',
    'grid-cross',
    'corner-intersection',
    'none',
  ];

  protected readonly sample = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`;
}
```

:::

:::if{framework="vue"}

```vue
<template>
  <CodeViewer
    v-for="style in borderStyles"
    :key="style"
    :code="sample"
    :language="language"
    :borderStyle="style"
    :showHeader="false"
    :showLineNumbers="false"
  />
</template>

<script setup lang="ts">
import {
  CodeViewer,
  type CodeViewerBorderStyle,
  type CodeViewerLanguage,
} from '@ngeenx/nx-vue-code-viewer';

const language: CodeViewerLanguage = 'typescript';

const borderStyles: CodeViewerBorderStyle[] = [
  'classic',
  'grid-cross',
  'corner-intersection',
  'none',
];

const sample = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`;
</script>
```

:::

:::if{framework="svelte"}

```svelte
{#each borderStyles as borderStyle (borderStyle)}
  <CodeViewer
    code={sample}
    {language}
    {borderStyle}
    showHeader={false}
    showLineNumbers={false}
  />
{/each}

<script lang="ts">
  import {
    CodeViewer,
    type CodeViewerBorderStyle,
    type CodeViewerLanguage,
  } from '@ngeenx/nx-svelte-code-viewer';

  const language: CodeViewerLanguage = 'typescript';

  const borderStyles: CodeViewerBorderStyle[] = [
    'classic',
    'grid-cross',
    'corner-intersection',
    'none',
  ];

  const sample = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`;
</script>
```

:::

## Inputs

| Input         | Type                                                           | Default              |
| ------------- | -------------------------------------------------------------- | -------------------- |
| `borderStyle` | `'classic' \| 'grid-cross' \| 'corner-intersection' \| 'none'` | `'classic'`          |
| `code`        | `string`                                                       | required             |
| `language`    | `CodeViewerLanguage`                                           | required             |
| `theme`       | `'light' \| 'dark'`                                            | inherits from host   |
| `shikiTheme`  | `string`                                                       | matches active theme |
