<script lang="ts">
  import { ColumnCodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type { ColumnItem } from '@ngeenx/nx-code-viewer-utils';
  import { useDemoOptions } from './_shared/useDemoOptions.svelte';

  const options = useDemoOptions();

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
</script>

<div class="stage {options.codeViewerThemeClass}">
  <ColumnCodeViewer
    {columns}
    theme={options.theme}
    shikiTheme={options.shikiTheme}
    borderStyle="classic"
  />
</div>

<style>
  .stage {
    width: 900px;
  }
  .stage :global(.nx-column-code-viewer) {
    width: 100%;
  }
</style>
