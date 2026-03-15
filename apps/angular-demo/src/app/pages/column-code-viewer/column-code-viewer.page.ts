import { Component, inject } from '@angular/core';
import {
  ColumnCodeViewerComponent,
  type ColumnItem,
} from '@ngeenx/nx-angular-code-viewer';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-column-code-viewer',
  imports: [ColumnCodeViewerComponent],
  templateUrl: './column-code-viewer.page.html',
  styleUrls: ['../page.css'],
})
export class ColumnCodeViewerPage {
  protected readonly themeService = inject(ThemeService);
  protected readonly theme = this.themeService.theme;
  protected readonly shikiTheme = this.themeService.getResolvedShikiTheme.bind(
    this.themeService
  );

  protected readonly frameworkColumns: ColumnItem[] = [
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

  protected readonly mixedColumns: ColumnItem[] = [
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
}
