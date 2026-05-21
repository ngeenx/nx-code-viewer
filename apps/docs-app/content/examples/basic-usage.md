---
title: Basic Usage
description: Render a syntax-highlighted snippet with the code viewer.
sidebar:
  icon: sparkle
  order: 0
---

# Basic Usage

The code viewer takes a snippet and a language and renders it with syntax
highlighting that matches the surrounding theme.

Try it live below: the same component rendered natively per framework.

:::demo{name="code-viewer-basic" centered}

```ts angular
import { Component } from '@angular/core';
import { CodeViewerComponent } from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-code-viewer-basic-demo',
  standalone: true,
  imports: [CodeViewerComponent],
  template: `
    <nx-code-viewer [code]="sample" language="typescript"> </nx-code-viewer>
  `,
})
export class CodeViewerBasicDemoComponent {
  protected readonly sample = `const greet = (name: string): string =>
  \`Hello, \${name}!\`;`;
}
```

:::

## With a title and file extension

Pass `title` and `fileExtension` to render a filename header above the
snippet. The extension drives the small file-type icon on the left of the
header bar.

:::demo{name="code-viewer-with-title" centered}

```ts angular
import { Component } from '@angular/core';
import { CodeViewerComponent } from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-code-viewer-with-title-demo',
  standalone: true,
  imports: [CodeViewerComponent],
  template: `
    <nx-code-viewer
      [code]="sample"
      language="typescript"
      title="greet.ts"
      fileExtension="ts" />
  `,
})
export class CodeViewerWithTitleDemoComponent {
  protected readonly sample = `export const greet = (name: string): string =>
  \`Hello, \${name}!\`;
`;
}
```

:::

## Compact (no header, no line numbers)

Set `showHeader="false"` and `showLineNumbers="false"` for an inline-looking
snippet that fits in narrow doc paragraphs without visual chrome.

:::demo{name="code-viewer-compact" centered}

```ts angular
import { Component } from '@angular/core';
import { CodeViewerComponent } from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-code-viewer-compact-demo',
  standalone: true,
  imports: [CodeViewerComponent],
  template: `
    <nx-code-viewer
      [code]="sample"
      language="bash"
      [showHeader]="false"
      [showLineNumbers]="false" />
  `,
})
export class CodeViewerCompactDemoComponent {
  protected readonly sample = `pnpm install @ngeenx/nx-angular-code-viewer`;
}
```

:::

## Scrollable with maxHeight

Long snippets stay bounded with a fixed `maxHeight`. The component takes care
of the internal scrollbar and keeps the header pinned.

:::demo{name="code-viewer-scrollable" centered}

```ts angular
import { Component } from '@angular/core';
import { CodeViewerComponent } from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-code-viewer-scrollable-demo',
  standalone: true,
  imports: [CodeViewerComponent],
  template: `
    <nx-code-viewer
      [code]="sample"
      language="typescript"
      title="long-sample.ts"
      maxHeight="180px" />
  `,
})
export class CodeViewerScrollableDemoComponent {
  protected readonly sample = `interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

function createUser(name: string, email: string): User {
  return {
    id: crypto.randomUUID(),
    name,
    email,
    createdAt: new Date(),
  };
}
// ...more sample lines...`;
}
```

:::
