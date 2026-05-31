import { ColumnCodeViewer, type ColumnItem } from '@ngeenx/nx-react-code-viewer';
import { useDemoOptions } from './_shared/useDemoOptions';

const columns: ColumnItem[] = [
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
<\/script>

<template>
  <button @click="increment">
    Count: {{ count }}
  </button>
<\/template>`,
  },
];

export default function CodeColumnsFrameworksDemo() {
  const { theme, shikiTheme, codeViewerThemeClass } = useDemoOptions();
  return (
    <div className={`crylith-demo-stage ${codeViewerThemeClass}`} style={{ width: 900 }}>
      <ColumnCodeViewer
        columns={columns}
        theme={theme}
        shikiTheme={shikiTheme}
        borderStyle="classic"
      />
    </div>
  );
}
