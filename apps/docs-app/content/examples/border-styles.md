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

:::

## Example

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

## Inputs

| Input         | Type                                                           | Default              |
| ------------- | -------------------------------------------------------------- | -------------------- |
| `borderStyle` | `'classic' \| 'grid-cross' \| 'corner-intersection' \| 'none'` | `'classic'`          |
| `code`        | `string`                                                       | required             |
| `language`    | `CodeViewerLanguage`                                           | required             |
| `theme`       | `'light' \| 'dark'`                                            | inherits from host   |
| `shikiTheme`  | `string`                                                       | matches active theme |
