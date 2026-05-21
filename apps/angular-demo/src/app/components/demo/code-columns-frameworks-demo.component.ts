import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  ColumnCodeViewerComponent,
  type ColumnItem,
} from '@ngeenx/nx-angular-code-viewer';
import type { BundledTheme } from 'shiki';
import {
  bindDemoOptions,
  readDemoOption,
  readInitialChromeTheme,
} from '../../utils/demo-options';

@Component({
  selector: 'app-code-columns-frameworks-demo',
  standalone: true,
  imports: [ColumnCodeViewerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nx-column-code-viewer
      [class]="codeViewerThemeClass()"
      [columns]="columns"
      [theme]="theme()"
      [shikiTheme]="shikiTheme()"
      borderStyle="classic" />
  `,
  styles: `
    nx-column-code-viewer {
      width: 900px;
    }
  `,
})
export default class CodeColumnsFrameworksDemoComponent {
  protected readonly theme = signal<'light' | 'dark'>(readInitialChromeTheme());
  protected readonly shikiTheme = signal<BundledTheme>(
    readDemoOption('shikiTheme', 'github-light')
  );
  protected readonly codeViewerTheme = signal<string>(
    readDemoOption('codeViewerTheme', 'default')
  );
  protected readonly codeViewerThemeClass = computed(() => {
    const t = this.codeViewerTheme();
    return t === 'default' ? '' : `theme-${t}`;
  });

  protected readonly columns: ColumnItem[] = [
    {
      id: 'angular',
      type: 'code',
      title: 'Angular',
      fileExtension: '.ts',
      language: 'typescript',
      code: `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <button (click)="increment()">
      Count: {{ count() }}
    </button>
  \`,
})
export class CounterComponent {
  readonly count = signal(0);

  increment(): void {
    this.count.update(v => v + 1);
  }
}`,
    },
    {
      id: 'react',
      type: 'code',
      title: 'React',
      fileExtension: '.tsx',
      language: 'tsx',
      code: `import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}`,
    },
    {
      id: 'vue',
      type: 'code',
      title: 'Vue',
      fileExtension: '.vue',
      language: 'vue',
      code: `<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

function increment() {
  count.value++;
}
</script>

<template>
  <button @click="increment">
    Count: {{ count }}
  </button>
</template>`,
    },
  ];

  constructor() {
    bindDemoOptions({
      onTheme: v => this.theme.set(v),
      onShikiTheme: v => this.shikiTheme.set(v),
      onCodeViewerTheme: v => this.codeViewerTheme.set(v),
    });
  }
}
