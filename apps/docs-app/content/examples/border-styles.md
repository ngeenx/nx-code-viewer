---
title: Border Styles
description: Switch between the four built-in nx-code-viewer border styles.
sidebar:
  icon: square-stack
  order: 2
---

# Border Styles

`nx-code-viewer` ships four `borderStyle` variants you can pick to match the
surrounding design language: `classic`, `grid-cross`, `corner-intersection`,
and `none`.

## Demo

:::demo{name="border-styles" modes="csr"}
:::

## Source

```typescript
import { Component } from '@angular/core';
import {
  CodeViewerComponent,
  type CodeViewerBorderStyle,
  type CodeViewerLanguage,
} from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-border-styles-demo',
  standalone: true,
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
  protected readonly borderStyles: CodeViewerBorderStyle[] = [
    'classic',
    'grid-cross',
    'corner-intersection',
    'none',
  ];

  protected readonly sample = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}`;
  protected readonly language: CodeViewerLanguage = 'typescript';
}
```

## Inputs

| Input         | Type                                                                   | Default              |
| ------------- | ---------------------------------------------------------------------- | -------------------- |
| `borderStyle` | `'classic' \| 'grid-cross' \| 'corner-intersection' \| 'none'`         | `'classic'`          |
| `code`        | `string`                                                               | required             |
| `language`    | `CodeViewerLanguage`                                                   | required             |
| `theme`       | `'light' \| 'dark'`                                                    | inherits from host   |
| `shikiTheme`  | `string`                                                               | matches active theme |
