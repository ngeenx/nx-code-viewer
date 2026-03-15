import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { ColumnCodeViewerComponent } from './column-code-viewer.component';
import type { ColumnCodeItem } from '@ngeenx/nx-code-viewer-utils';

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
// Column Configurations
// ════════════════════════════════════════════════════════════════════════════

const twoFrameworkColumns: ColumnCodeItem[] = [
  {
    id: 'angular',
    code: sampleTypescript,
    language: 'typescript',
    title: 'Angular',
    fileExtension: '.ts',
  },
  {
    id: 'react',
    code: sampleJavascript,
    language: 'javascript',
    title: 'React',
    fileExtension: '.jsx',
  },
];

const threeFrameworkColumns: ColumnCodeItem[] = [
  {
    id: 'angular',
    code: sampleTypescript,
    language: 'typescript',
    title: 'Angular',
    fileExtension: '.ts',
  },
  {
    id: 'react',
    code: sampleJavascript,
    language: 'javascript',
    title: 'React',
    fileExtension: '.jsx',
  },
  {
    id: 'vue',
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
    code: sampleSvelte,
    language: 'svelte',
    title: 'Svelte',
    fileExtension: '.svelte',
  },
];

const multiLanguageColumns: ColumnCodeItem[] = [
  {
    id: 'typescript',
    code: sampleTypescript,
    language: 'typescript',
    title: 'TypeScript',
    fileExtension: '.ts',
  },
  {
    id: 'python',
    code: samplePython,
    language: 'python',
    title: 'Python',
    fileExtension: '.py',
  },
  {
    id: 'rust',
    code: sampleRust,
    language: 'rust',
    title: 'Rust',
    fileExtension: '.rs',
  },
  {
    id: 'go',
    code: sampleGo,
    language: 'go',
    title: 'Go',
    fileExtension: '.go',
  },
];

const htmlCssColumns: ColumnCodeItem[] = [
  {
    id: 'html',
    code: sampleHtml,
    language: 'html',
    title: 'index.html',
    fileExtension: '.html',
  },
  {
    id: 'css',
    code: sampleCss,
    language: 'css',
    title: 'styles.css',
    fileExtension: '.css',
  },
];

const highlightedColumns: ColumnCodeItem[] = [
  {
    id: 'angular',
    code: sampleTypescript,
    language: 'typescript',
    title: 'Angular',
    fileExtension: '.ts',
    highlightedLines: [[11, 14]],
  },
  {
    id: 'react',
    code: sampleJavascript,
    language: 'javascript',
    title: 'React',
    fileExtension: '.jsx',
    highlightedLines: [[4, 8]],
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
// Basic Examples
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
