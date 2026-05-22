---
title: Quick Start
description: Render your first code snippet in five minutes.
sidebar:
  group: Basics
  icon: play
  order: 2
---

# Quick Start

This page walks through the smallest possible end-to-end setup:
install one package, import one component, render one snippet. Five
minutes from clone to a syntax-highlighted block on screen.

The content tracks the **Framework** picker in the sidebar. Switch
it to follow along in your stack.

::::::steps

:::::step

### Install the framework package

:::if{framework="angular"}

```bash
pnpm add @ngeenx/nx-angular-code-viewer @ngeenx/nx-code-viewer-utils shiki
```

:::

:::if{framework="react"}

```bash
pnpm add @ngeenx/nx-react-code-viewer @ngeenx/nx-code-viewer-utils shiki
```

:::

:::if{framework="vue"}

```bash
pnpm add @ngeenx/nx-vue-code-viewer @ngeenx/nx-code-viewer-utils shiki
```

:::

:::if{framework="svelte"}

```bash
pnpm add @ngeenx/nx-svelte-code-viewer @ngeenx/nx-code-viewer-utils shiki
```

:::

That covers the framework binding, the shared runtime, and the
Shiki syntax highlighter. No peer-dep surprises. For an opt-in
tippy.js popover layer and the curated theme pack, see
[Installation](/docs/v1/installation).

:::::

:::::step

### Import the chrome stylesheet

Add this once at the root of your app's stylesheet so the viewer
inherits the default `--nx-*` CSS variables (borders, header strip,
copy button, scrollbar). Omit it and the chrome renders without any
background or border.

```css
@import '@ngeenx/nx-code-viewer-theme';
```

:::::

:::::step

### Render your first snippet

:::if{framework="angular"}

```ts
import { Component } from '@angular/core';
import { NxAngularCodeViewerComponent } from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-snippet',
  standalone: true,
  imports: [NxAngularCodeViewerComponent],
  template: `
    <nx-code-viewer
      [code]="sample"
      language="typescript"
      title="hello.ts"
      theme="dark" />
  `,
})
export class SnippetComponent {
  protected readonly sample = `function hello(name: string) {
  return \`Hello, \${name}!\`;
}`;
}
```

:::

:::if{framework="react"}

```tsx
import { NxCodeViewer } from '@ngeenx/nx-react-code-viewer';

const sample = `function hello(name) {
  return \`Hello, \${name}!\`;
}`;

export function Snippet() {
  return (
    <NxCodeViewer
      code={sample}
      language="typescript"
      title="hello.ts"
      theme="dark"
    />
  );
}
```

:::

:::if{framework="vue"}

```vue
<script setup lang="ts">
import { NxCodeViewer } from '@ngeenx/nx-vue-code-viewer';

const sample = `function hello(name: string) {
  return \`Hello, \${name}!\`;
}`;
</script>

<template>
  <NxCodeViewer
    :code="sample"
    language="typescript"
    title="hello.ts"
    theme="dark" />
</template>
```

:::

:::if{framework="svelte"}

```svelte
<script lang="ts">
  import { NxCodeViewer } from '@ngeenx/nx-svelte-code-viewer';

  const sample = `function hello(name: string) {
    return \`Hello, \${name}!\`;
  }`;
</script>

<NxCodeViewer
  code={sample}
  language="typescript"
  title="hello.ts"
  theme="dark" />
```

:::

Mount the component anywhere in your app. You should see a syntax
highlighted snippet with a header strip, line numbers, and a copy
button.

:::::

:::::step

### Tweak the basics

Three inputs cover most cases:

- `theme` flips the chrome between `'light'` and `'dark'`.
- `language` accepts any
  [Shiki bundled grammar](https://shiki.style/languages) string.
- `showLineNumbers` / `showCopyButton` / `showHeader` toggle the
  visible chrome.

Every other input lives in the
[Configuration reference](/docs/v1/configuration).

:::::

::::::

## What's next

| If you want to...                                                   | Go to                                                                         |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| See every visual feature side by side                               | [Examples](/examples/basic-usage)                                             |
| Match the viewer to your design system                              | [Theming](/docs/v1/theming) or [Custom Themes](/docs/v1/theming/custom-theme) |
| Use it with Angular Universal, Nuxt, SvelteKit or Next.js           | [Framework Integration](/docs/v1/framework-integration)                       |
| Copy-paste ready patterns (terminal output, multi-file viewer, ...) | [Recipes](/docs/v1/recipes)                                                   |
| Diagnose a problem                                                  | [Troubleshooting](/docs/v1/troubleshooting)                                   |
