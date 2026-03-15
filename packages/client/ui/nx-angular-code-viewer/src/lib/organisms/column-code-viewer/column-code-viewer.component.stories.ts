import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { ColumnCodeViewerComponent } from './column-code-viewer.component';
import type { ColumnCodeItem, ColumnDiffItem, ColumnItem } from '@ngeenx/nx-code-viewer-utils';

// ════════════════════════════════════════════════════════════════════════════
// Sample Code
// ════════════════════════════════════════════════════════════════════════════

const sampleTypescript = `import { Component, signal } from '@angular/core';

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

const sampleJavascript = `import React, { useState } from 'react';

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

const sampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Counter</title>
</head>
<body>
  <button id="counter">Count: 0</button>
  <script>
    let count = 0;
    const btn = document.getElementById('counter');
    btn.addEventListener('click', () => {
      count++;
      btn.textContent = \`Count: \${count}\`;
    });
  </script>
</body>
</html>`;

const sampleCss = `.counter-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.counter-button:hover {
  transform: scale(1.05);
}

.counter-button:active {
  transform: scale(0.95);
}`;

const samplePython = `from dataclasses import dataclass

@dataclass
class Counter:
    count: int = 0

    def increment(self) -> None:
        self.count += 1

    def __str__(self) -> str:
        return f"Count: {self.count}"

counter = Counter()
counter.increment()
print(counter)`;

const sampleRust = `struct Counter {
    count: i32,
}

impl Counter {
    fn new() -> Self {
        Counter { count: 0 }
    }

    fn increment(&mut self) {
        self.count += 1;
    }
}

fn main() {
    let mut counter = Counter::new();
    counter.increment();
    println!("Count: {}", counter.count);
}`;

const sampleGo = `package main

import "fmt"

type Counter struct {
	count int
}

func (c *Counter) Increment() {
	c.count++
}

func (c Counter) String() string {
	return fmt.Sprintf("Count: %d", c.count)
}

func main() {
	counter := &Counter{}
	counter.Increment()
	fmt.Println(counter)
}`;

// ════════════════════════════════════════════════════════════════════════════
// Column Configurations - Code
// ════════════════════════════════════════════════════════════════════════════

const twoFrameworkColumns: ColumnCodeItem[] = [
  {
    id: 'angular',
    type: 'code',
    code: sampleTypescript,
    language: 'typescript',
    title: 'Angular',
    fileExtension: '.ts',
  },
  {
    id: 'react',
    type: 'code',
    code: sampleJavascript,
    language: 'javascript',
    title: 'React',
    fileExtension: '.jsx',
  },
];

const threeFrameworkColumns: ColumnCodeItem[] = [
  {
    id: 'angular',
    type: 'code',
    code: sampleTypescript,
    language: 'typescript',
    title: 'Angular',
    fileExtension: '.ts',
  },
  {
    id: 'react',
    type: 'code',
    code: sampleJavascript,
    language: 'javascript',
    title: 'React',
    fileExtension: '.jsx',
  },
  {
    id: 'vue',
    type: 'code',
    code: sampleVue,
    language: 'vue',
    title: 'Vue',
    fileExtension: '.vue',
  },
];

const fourFrameworkColumns: ColumnCodeItem[] = [
  ...threeFrameworkColumns,
  {
    id: 'svelte',
    type: 'code',
    code: sampleSvelte,
    language: 'svelte',
    title: 'Svelte',
    fileExtension: '.svelte',
  },
];

const multiLanguageColumns: ColumnCodeItem[] = [
  {
    id: 'typescript',
    type: 'code',
    code: sampleTypescript,
    language: 'typescript',
    title: 'TypeScript',
    fileExtension: '.ts',
  },
  {
    id: 'python',
    type: 'code',
    code: samplePython,
    language: 'python',
    title: 'Python',
    fileExtension: '.py',
  },
  {
    id: 'rust',
    type: 'code',
    code: sampleRust,
    language: 'rust',
    title: 'Rust',
    fileExtension: '.rs',
  },
  {
    id: 'go',
    type: 'code',
    code: sampleGo,
    language: 'go',
    title: 'Go',
    fileExtension: '.go',
  },
];

const htmlCssColumns: ColumnCodeItem[] = [
  {
    id: 'html',
    type: 'code',
    code: sampleHtml,
    language: 'html',
    title: 'index.html',
    fileExtension: '.html',
  },
  {
    id: 'css',
    type: 'code',
    code: sampleCss,
    language: 'css',
    title: 'styles.css',
    fileExtension: '.css',
  },
];

const highlightedColumns: ColumnCodeItem[] = [
  {
    id: 'angular',
    type: 'code',
    code: sampleTypescript,
    language: 'typescript',
    title: 'Angular',
    fileExtension: '.ts',
    highlightedLines: [[11, 14]],
  },
  {
    id: 'react',
    type: 'code',
    code: sampleJavascript,
    language: 'javascript',
    title: 'React',
    fileExtension: '.jsx',
    highlightedLines: [[4, 8]],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// Column Configurations - Diff
// ════════════════════════════════════════════════════════════════════════════

const twoDiffColumns: ColumnDiffItem[] = [
  {
    id: 'service-diff',
    type: 'diff',
    title: 'user.service.ts',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: `export class UserService {
  getUser(id: number) {
    return this.http.get<User>(\`/api/users/\${id}\`);
  }
}`,
    newCode: `export class UserService {
  getUser(id: number) {
    return this.http.get<User>(\`/api/users/\${id}\`);
  }

  updateUser(id: number, data: Partial<User>) {
    return this.http.patch<User>(\`/api/users/\${id}\`, data);
  }

  deleteUser(id: number) {
    return this.http.delete(\`/api/users/\${id}\`);
  }
}`,
  },
  {
    id: 'model-diff',
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

const mixedCodeAndDiffColumns: ColumnItem[] = [
  {
    id: 'current-code',
    type: 'code',
    code: `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
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
    id: 'changes',
    type: 'diff',
    title: 'Proposed Changes',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string) {
    return this.http.get<T>(url);
  }
}`,
    newCode: `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
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

const threeDiffColumns: ColumnDiffItem[] = [
  {
    id: 'component-diff',
    type: 'diff',
    title: 'component.ts',
    fileExtension: '.ts',
    language: 'typescript',
    oldCode: `@Component({
  selector: 'app-list',
  template: '<ul><li *ngFor="let item of items">{{item}}</li></ul>',
})
export class ListComponent {
  items = ['a', 'b', 'c'];
}`,
    newCode: `@Component({
  selector: 'app-list',
  template: \`
    <ul>
      @for (item of items(); track item) {
        <li>{{ item }}</li>
      }
    </ul>
  \`,
})
export class ListComponent {
  readonly items = signal(['a', 'b', 'c']);
}`,
  },
  {
    id: 'template-diff',
    type: 'diff',
    title: 'template.html',
    fileExtension: '.html',
    language: 'html',
    oldCode: `<div *ngIf="isLoading">
  <span>Loading...</span>
</div>
<div *ngIf="!isLoading">
  <p>{{ data }}</p>
</div>`,
    newCode: `@if (isLoading()) {
  <div>
    <span>Loading...</span>
  </div>
} @else {
  <div>
    <p>{{ data() }}</p>
  </div>
}`,
  },
  {
    id: 'styles-diff',
    type: 'diff',
    title: 'styles.css',
    fileExtension: '.css',
    language: 'css',
    oldCode: `.list {
  display: flex;
  flex-direction: column;
}

.list-item {
  padding: 8px;
  border-bottom: 1px solid #ccc;
}`,
    newCode: `.list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.list-item {
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  background: var(--surface-color);
  transition: background 0.15s ease;
}

.list-item:hover {
  background: var(--surface-hover);
}`,
  },
];

// ════════════════════════════════════════════════════════════════════════════
// Storybook Meta
// ════════════════════════════════════════════════════════════════════════════

const meta: Meta<ColumnCodeViewerComponent> = {
  title: 'Organisms/ColumnCodeViewer',
  component: ColumnCodeViewerComponent,
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'object',
      description: 'Array of column items to display side by side',
    },
    theme: {
      control: 'radio',
      options: ['dark', 'light'],
      description: 'Color theme',
    },
    borderStyle: {
      control: 'select',
      options: ['classic', 'grid-cross', 'corner-intersection', 'none'],
      description: 'Border style variant',
    },
    shikiTheme: {
      control: 'select',
      options: [
        undefined,
        'github-dark',
        'github-light',
        'dracula',
        'dracula-soft',
        'monokai',
        'nord',
        'one-dark-pro',
        'vitesse-dark',
        'vitesse-light',
        'catppuccin-frappe',
        'catppuccin-latte',
        'catppuccin-macchiato',
        'catppuccin-mocha',
        'night-owl',
        'rose-pine',
        'rose-pine-dawn',
        'rose-pine-moon',
      ],
      description: 'Shiki theme for syntax highlighting',
    },
    showColumnHeaders: {
      control: 'boolean',
      description: 'Whether to show column headers',
    },
    maxHeight: {
      control: 'text',
      description: 'Maximum height with scrolling (e.g., "300px")',
    },
    enableLineHover: {
      control: 'boolean',
      description: 'Enable line hover highlighting',
    },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<ColumnCodeViewerComponent>;

// ════════════════════════════════════════════════════════════════════════════
// Basic Code Examples
// ════════════════════════════════════════════════════════════════════════════

export const Default: Story = {
  args: {
    columns: twoFrameworkColumns,
    theme: 'dark',
    borderStyle: 'classic',
  },
};

export const LightTheme: Story = {
  args: {
    columns: twoFrameworkColumns,
    theme: 'light',
    borderStyle: 'classic',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Framework Comparisons
// ════════════════════════════════════════════════════════════════════════════

export const ThreeFrameworks: Story = {
  args: {
    columns: threeFrameworkColumns,
    theme: 'dark',
    borderStyle: 'classic',
  },
};

export const FourFrameworks: Story = {
  args: {
    columns: fourFrameworkColumns,
    theme: 'dark',
    borderStyle: 'classic',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Multi-Language Examples
// ════════════════════════════════════════════════════════════════════════════

export const MultiLanguage: Story = {
  args: {
    columns: multiLanguageColumns,
    theme: 'dark',
    borderStyle: 'classic',
  },
};

export const HtmlAndCss: Story = {
  args: {
    columns: htmlCssColumns,
    theme: 'dark',
    borderStyle: 'classic',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// With Highlighted Lines
// ════════════════════════════════════════════════════════════════════════════

export const HighlightedLines: Story = {
  args: {
    columns: highlightedColumns,
    theme: 'dark',
    borderStyle: 'classic',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Diff Columns
// ════════════════════════════════════════════════════════════════════════════

/**
 * Two diff viewers side by side showing changes in related files.
 */
export const TwoDiffColumns: Story = {
  args: {
    columns: twoDiffColumns,
    theme: 'dark',
    borderStyle: 'classic',
  },
};

/**
 * Three diff viewers side by side - useful for reviewing Angular migration
 * (component, template, and styles changes together).
 */
export const ThreeDiffColumns: Story = {
  args: {
    columns: threeDiffColumns,
    theme: 'dark',
    borderStyle: 'classic',
  },
};

/**
 * Light theme with diff columns.
 */
export const DiffColumnsLightTheme: Story = {
  args: {
    columns: twoDiffColumns,
    theme: 'light',
    borderStyle: 'classic',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Mixed Code + Diff Columns
// ════════════════════════════════════════════════════════════════════════════

/**
 * Current code alongside proposed changes - useful for code review workflows.
 */
export const MixedCodeAndDiff: Story = {
  args: {
    columns: mixedCodeAndDiffColumns,
    theme: 'dark',
    borderStyle: 'classic',
  },
};

/**
 * Mixed code and diff columns in light theme.
 */
export const MixedCodeAndDiffLightTheme: Story = {
  args: {
    columns: mixedCodeAndDiffColumns,
    theme: 'light',
    borderStyle: 'classic',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Without Headers
// ════════════════════════════════════════════════════════════════════════════

export const WithoutColumnHeaders: Story = {
  args: {
    columns: twoFrameworkColumns,
    theme: 'dark',
    borderStyle: 'classic',
    showColumnHeaders: false,
  },
};

// ════════════════════════════════════════════════════════════════════════════
// With Max Height
// ════════════════════════════════════════════════════════════════════════════

export const WithMaxHeight: Story = {
  args: {
    columns: threeFrameworkColumns,
    theme: 'dark',
    borderStyle: 'classic',
    maxHeight: '250px',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Border Styles
// ════════════════════════════════════════════════════════════════════════════

export const BorderStyleClassic: Story = {
  args: {
    columns: twoFrameworkColumns,
    theme: 'dark',
    borderStyle: 'classic',
  },
};

export const BorderStyleGridCross: Story = {
  args: {
    columns: twoFrameworkColumns,
    theme: 'dark',
    borderStyle: 'grid-cross',
  },
  parameters: {
    layout: 'centered',
  },
};

export const BorderStyleCornerIntersection: Story = {
  args: {
    columns: twoFrameworkColumns,
    theme: 'dark',
    borderStyle: 'corner-intersection',
  },
  parameters: {
    layout: 'centered',
  },
};

export const BorderStyleNone: Story = {
  args: {
    columns: twoFrameworkColumns,
    theme: 'dark',
    borderStyle: 'none',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Theme + Border Combinations
// ════════════════════════════════════════════════════════════════════════════

export const LightThemeGridCross: Story = {
  args: {
    columns: threeFrameworkColumns,
    theme: 'light',
    borderStyle: 'grid-cross',
  },
  parameters: {
    backgrounds: { default: 'light' },
    layout: 'centered',
  },
};

export const LightThemeCornerIntersection: Story = {
  args: {
    columns: threeFrameworkColumns,
    theme: 'light',
    borderStyle: 'corner-intersection',
  },
  parameters: {
    backgrounds: { default: 'light' },
    layout: 'centered',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Edge Cases
// ════════════════════════════════════════════════════════════════════════════

export const SingleColumn: Story = {
  args: {
    columns: [twoFrameworkColumns[0]],
    theme: 'dark',
    borderStyle: 'classic',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Custom Shiki Theme
// ════════════════════════════════════════════════════════════════════════════

export const CustomShikiTheme: Story = {
  args: {
    columns: twoFrameworkColumns,
    theme: 'dark',
    shikiTheme: 'dracula',
    borderStyle: 'classic',
  },
};
