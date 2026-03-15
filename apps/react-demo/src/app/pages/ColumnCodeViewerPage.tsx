import { ColumnCodeViewer, type ColumnItem } from '@ngeenx/nx-react-code-viewer';
import { useTheme } from '../hooks/useTheme';

const frameworkColumns: ColumnItem[] = [
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

const mixedColumns: ColumnItem[] = [
  {
    id: 'code',
    type: 'code',
    title: 'api.service.ts',
    fileExtension: '.ts',
    language: 'typescript',
    code: `@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string) {
    return this.http.get<T>(url);
  }
}`,
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

export default function ColumnCodeViewerPage() {
  const { theme, getResolvedShikiTheme } = useTheme();

  return (
    <div className={`page-container ${theme}`}>
      <header className="page-header">
        <h1 className="page-title">Column Code Viewer</h1>
        <p className="page-description">
          Display multiple code blocks and diff views side by side in a columnar layout.
          Useful for comparing implementations across frameworks or reviewing changes alongside source code.
        </p>
      </header>

      <section className="demo-section">
        <h2 className="demo-section-title">Framework Comparison</h2>
        <p className="demo-section-description">
          Three code columns showing the same counter component in Angular, React, and Vue.
        </p>
        <ColumnCodeViewer
          columns={frameworkColumns}
          theme={theme}
          shikiTheme={getResolvedShikiTheme()}
          borderStyle="classic"
        />
      </section>

      <section className="demo-section">
        <h2 className="demo-section-title">Code + Diff Side by Side</h2>
        <p className="demo-section-description">
          Current source code alongside proposed changes in a diff view.
        </p>
        <ColumnCodeViewer
          columns={mixedColumns}
          theme={theme}
          shikiTheme={getResolvedShikiTheme()}
          borderStyle="classic"
        />
      </section>

      <section className="demo-section">
        <h2 className="demo-section-title">Corner-Intersection Border Style</h2>
        <p className="demo-section-description">
          Framework comparison with corner-intersection border styling.
        </p>
        <ColumnCodeViewer
          columns={frameworkColumns}
          theme={theme}
          shikiTheme={getResolvedShikiTheme()}
          borderStyle="corner-intersection"
        />
      </section>
    </div>
  );
}
