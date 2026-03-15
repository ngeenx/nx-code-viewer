import type { Meta, StoryObj } from '@storybook/react';
import { ColumnCodeViewer } from './ColumnCodeViewer';
import type { ColumnCodeItem, ColumnDiffItem, ColumnItem } from '@ngeenx/nx-code-viewer-utils';

const sampleAngular = `import { Component, signal } from '@angular/core';

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
}`;

const sampleReact = `import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}`;

const sampleVue = `<script setup lang="ts">
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
</template>`;

const sampleSvelte = `<script lang="ts">
  let count = $state(0);

  function increment() {
    count++;
  }
</script>

<button onclick={increment}>
  Count: {count}
</button>`;

const twoColumns: ColumnCodeItem[] = [
  { id: 'angular', type: 'code', code: sampleAngular, language: 'typescript', title: 'Angular', fileExtension: '.ts' },
  { id: 'react', type: 'code', code: sampleReact, language: 'tsx', title: 'React', fileExtension: '.tsx' },
];

const threeColumns: ColumnCodeItem[] = [
  ...twoColumns,
  { id: 'vue', type: 'code', code: sampleVue, language: 'vue', title: 'Vue', fileExtension: '.vue' },
];

const fourColumns: ColumnCodeItem[] = [
  ...threeColumns,
  { id: 'svelte', type: 'code', code: sampleSvelte, language: 'svelte', title: 'Svelte', fileExtension: '.svelte' },
];

const twoDiffColumns: ColumnDiffItem[] = [
  {
    id: 'service',
    type: 'diff',
    title: 'user.service.ts',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: `export class UserService {
  getUser(id: number) {
    return fetch('/api/users/' + id);
  }
}`,
    newCode: `export class UserService {
  async getUser(id: number) {
    const res = await fetch(\`/api/users/\${id}\`);
    return res.json();
  }

  async updateUser(id: number, data: Partial<User>) {
    const res = await fetch(\`/api/users/\${id}\`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return res.json();
  }
}`,
  },
  {
    id: 'model',
    type: 'diff',
    title: 'user.model.ts',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: `interface User {
  id: number;
  name: string;
}`,
    newCode: `interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}`,
  },
];

const mixedColumns: ColumnItem[] = [
  {
    id: 'code',
    type: 'code',
    code: `@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string) {
    return this.http.get<T>(url);
  }
}`,
    language: 'typescript',
    title: 'Current Code',
    fileExtension: '.ts',
  },
  {
    id: 'diff',
    type: 'diff',
    title: 'Proposed Changes',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: `@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string) {
    return this.http.get<T>(url);
  }
}`,
    newCode: `@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string) {
    return this.http.get<T>(url).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  private handleError(error: unknown) {
    console.error('API error:', error);
    throw error;
  }
}`,
  },
];

const meta: Meta<typeof ColumnCodeViewer> = {
  title: 'Organisms/ColumnCodeViewer',
  component: ColumnCodeViewer,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'object' },
    theme: { control: 'radio', options: ['dark', 'light'] },
    borderStyle: {
      control: 'select',
      options: ['classic', 'grid-cross', 'corner-intersection', 'none'],
    },
    showColumnHeaders: { control: 'boolean' },
    maxHeight: { control: 'text' },
    enableLineHover: { control: 'boolean' },
  },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof ColumnCodeViewer>;

// ═══════════════ Code Columns ═══════════════

export const Default: Story = {
  args: { columns: twoColumns, theme: 'dark', borderStyle: 'classic' },
};

export const LightTheme: Story = {
  args: { columns: twoColumns, theme: 'light', borderStyle: 'classic' },
  parameters: { backgrounds: { default: 'light' } },
};

export const ThreeFrameworks: Story = {
  args: { columns: threeColumns, theme: 'dark', borderStyle: 'classic' },
};

export const FourFrameworks: Story = {
  args: { columns: fourColumns, theme: 'dark', borderStyle: 'classic' },
};

// ═══════════════ Diff Columns ═══════════════

export const TwoDiffColumns: Story = {
  args: { columns: twoDiffColumns, theme: 'dark', borderStyle: 'classic' },
};

export const DiffColumnsLightTheme: Story = {
  args: { columns: twoDiffColumns, theme: 'light', borderStyle: 'classic' },
  parameters: { backgrounds: { default: 'light' } },
};

// ═══════════════ Mixed Columns ═══════════════

export const MixedCodeAndDiff: Story = {
  args: { columns: mixedColumns, theme: 'dark', borderStyle: 'classic' },
};

// ═══════════════ Options ═══════════════

export const WithoutColumnHeaders: Story = {
  args: { columns: twoColumns, theme: 'dark', borderStyle: 'classic', showColumnHeaders: false },
};

export const WithMaxHeight: Story = {
  args: { columns: threeColumns, theme: 'dark', borderStyle: 'classic', maxHeight: '250px' },
};

// ═══════════════ Border Styles ═══════════════

export const BorderStyleGridCross: Story = {
  args: { columns: twoColumns, theme: 'dark', borderStyle: 'grid-cross' },
  parameters: { layout: 'centered' },
};

export const BorderStyleCornerIntersection: Story = {
  args: { columns: twoColumns, theme: 'dark', borderStyle: 'corner-intersection' },
  parameters: { layout: 'centered' },
};

export const BorderStyleNone: Story = {
  args: { columns: twoColumns, theme: 'dark', borderStyle: 'none' },
};

// ═══════════════ Edge Cases ═══════════════

export const SingleColumn: Story = {
  args: { columns: [twoColumns[0]], theme: 'dark', borderStyle: 'classic' },
};

export const CustomShikiTheme: Story = {
  args: { columns: twoColumns, theme: 'dark', borderStyle: 'classic', shikiTheme: 'dracula' },
};
