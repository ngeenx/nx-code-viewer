<script lang="ts">
  import { MultiCodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  import type { MultiCodeViewerTabItem } from '@ngeenx/nx-code-viewer-utils';
  import { useTheme } from '../stores/theme.svelte';

  const { theme, getResolvedShikiTheme } = useTheme();

  const multiCodeViewerTabs: MultiCodeViewerTabItem[] = [
    {
      id: 'component',
      type: 'code',
      fileName: 'Counter.svelte',
      fileExtension: '.svelte',
      language: 'svelte',
      code: `<script lang="ts">
  let count = $state(0);

  function increment() {
    count += 1;
  }
</script>

<button onclick={increment}>
  count is {count}
</button>`,
    },
    {
      id: 'store',
      type: 'code',
      fileName: 'useCounter.svelte.ts',
      fileExtension: '.ts',
      language: 'typescript',
      code: `let count = $state(0);
const doubled = $derived(count * 2);

export function useCounter() {
  function increment(): void {
    count++;
  }

  function decrement(): void {
    count--;
  }

  return {
    get count() { return count; },
    get doubled() { return doubled; },
    increment,
    decrement,
  };
}`,
    },
    {
      id: 'styles',
      type: 'code',
      fileName: 'counter.css',
      fileExtension: '.css',
      language: 'css',
      code: `.counter-card {
  padding: 1rem;
  border-radius: 0.5rem;
  background: var(--card-bg);
}

.counter-card button {
  margin: 0 0.5rem;
  font-size: 1.25rem;
}`,
    },
    {
      id: 'changes',
      type: 'diff',
      fileName: 'counter.service.ts',
      fileExtension: '.ts',
      language: 'typescript',
      oldCode: `export class CounterService {
  getCount() {
    return fetch('/api/counter');
  }
}`,
      newCode: `export class CounterService {
  async getCount() {
    const response = await fetch('/api/counter');
    return response.json();
  }

  async updateCount(value: number) {
    const response = await fetch('/api/counter', {
      method: 'PATCH',
      body: JSON.stringify({ value }),
    });
    return response.json();
  }
}`,
    },
  ];
</script>

<div class="page-container {theme}">
  <header class="page-header">
    <h1 class="page-title">Multi-Code Viewer</h1>
    <p class="page-description">
      Tabbed interface for viewing multiple files including code and diff views.
      Click tabs to switch between files.
    </p>
  </header>

  <section class="demo-section">
    <h2 class="demo-section-title">Classic Border Style</h2>
    <p class="demo-section-description">
      Multi-code viewer with classic border styling showing component files and a diff tab.
    </p>
    <MultiCodeViewer
      tabs={multiCodeViewerTabs}
      {theme}
      shikiTheme={getResolvedShikiTheme()}
      borderStyle="classic"
    />
  </section>

  <section class="demo-section">
    <h2 class="demo-section-title">Corner-Intersection Border Style</h2>
    <p class="demo-section-description">
      Same content with corner-intersection border styling for a different visual appearance.
    </p>
    <MultiCodeViewer
      tabs={multiCodeViewerTabs}
      {theme}
      shikiTheme={getResolvedShikiTheme()}
      borderStyle="corner-intersection"
    />
  </section>
</div>
