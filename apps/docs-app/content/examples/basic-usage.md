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
    <nx-code-viewer
      [code]="sample"
      language="typescript">
    </nx-code-viewer>
  `,
})
export class CodeViewerBasicDemoComponent {
  protected readonly sample = `const greet = (name: string): string =>
  \`Hello, \${name}!\`;`;
}
```

:::
