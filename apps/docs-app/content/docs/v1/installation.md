---
title: Installation
description: Install the nx-code-viewer package for your framework.
sidebar:
  group: Basics
  icon: download
  order: 3
---

# Installation

The content below tracks the **Framework** picker in the sidebar. Switch
it to see the install commands for that specific framework.

::::::steps

:::::step

### Install the framework package

::::if{framework="angular"}

```bash
pnpm add @ngeenx/nx-angular-code-viewer
```

::::

::::if{framework="react"}

```bash
pnpm add @ngeenx/nx-react-code-viewer
```

::::

::::if{framework="vue"}

```bash
pnpm add @ngeenx/nx-vue-code-viewer
```

::::

::::if{framework="svelte"}

```bash
pnpm add @ngeenx/nx-svelte-code-viewer
```

::::

:::::

:::::step

### Install the runtime peer dependencies

The code viewer relies on **Shiki** for syntax highlighting:

```bash
pnpm add shiki
```

`tippy.js` is an **optional** peer used only by the
[Interactive Features](/examples/interactive-features) (reference
popovers). Skip it for now if you only need basic snippet rendering;
the docs for that page walk through the extra install.

:::::

:::::step

### Import the theme stylesheet

Add the bundled theme to your application's global stylesheet so the
code viewer picks up its colors, spacing, and dark-mode tokens.

```css
@import '@ngeenx/nx-code-viewer-theme';
```

:::::

:::::step

### Use the component

::::if{framework="angular"}

```ts
import { CodeViewerComponent } from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-root',
  imports: [CodeViewerComponent],
  template: `<nx-code-viewer [code]="sample" language="typescript" />`,
})
export class AppComponent {
  protected readonly sample = `const x = 1;`;
}
```

::::

::::if{framework="react"}

```tsx
import { CodeViewer } from '@ngeenx/nx-react-code-viewer';

export function App() {
  return <CodeViewer code="const x = 1;" language="typescript" />;
}
```

::::

::::if{framework="vue"}

```vue
<script setup lang="ts">
import { CodeViewer } from '@ngeenx/nx-vue-code-viewer';

const sample = `const x = 1;`;
</script>

<template>
  <CodeViewer :code="sample" language="typescript" />
</template>
```

::::

::::if{framework="svelte"}

```svelte
<script lang="ts">
  import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';

  const sample = `const x = 1;`;
</script>

<CodeViewer code={sample} language="typescript" />
```

::::

:::::

::::::

## Shared utilities

The `@ngeenx/nx-code-viewer-utils` package ships the shared types,
language tokens, and helpers used by every framework binding. It is
already pulled in as a peer dependency of the framework package you
installed above; install it explicitly only if you need to import its
symbols directly in your own code.

```bash
pnpm add @ngeenx/nx-code-viewer-utils
```
