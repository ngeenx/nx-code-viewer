import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { DiffBlockComponent } from './diff-block.component';
import type { DiffHunk, DiffLine } from '../../types';

// Helper function to create DiffLine objects
const createLine = (
  type: DiffLine['type'],
  content: string,
  oldLineNumber?: number,
  newLineNumber?: number,
  highlightedContent?: string
): DiffLine => ({
  type,
  content,
  oldLineNumber,
  newLineNumber,
  highlightedContent,
});

// Sample diff hunks
const simpleHunks: readonly DiffHunk[] = [
  {
    header: '@@ -1,5 +1,6 @@',
    oldStart: 1,
    oldCount: 5,
    newStart: 1,
    newCount: 6,
    lines: [
      createLine('unchanged', 'import { Component } from "@angular/core";', 1, 1),
      createLine('added', 'import { signal } from "@angular/core";', undefined, 2),
      createLine('unchanged', '', 2, 3),
      createLine('removed', 'const name = "World";', 3, undefined),
      createLine('added', 'const name = signal("World");', undefined, 4),
      createLine('unchanged', '', 4, 5),
      createLine('unchanged', 'console.log(name);', 5, 6),
    ],
  },
];

const multipleHunks: readonly DiffHunk[] = [
  {
    header: '@@ -1,4 +1,5 @@',
    oldStart: 1,
    oldCount: 4,
    newStart: 1,
    newCount: 5,
    lines: [
      createLine('added', '// Utility functions', undefined, 1),
      createLine('unchanged', 'export function add(a: number, b: number): number {', 1, 2),
      createLine('unchanged', '  return a + b;', 2, 3),
      createLine('unchanged', '}', 3, 4),
      createLine('unchanged', '', 4, 5),
    ],
  },
  {
    header: '@@ -10,5 +11,8 @@',
    oldStart: 10,
    oldCount: 5,
    newStart: 11,
    newCount: 8,
    lines: [
      createLine('unchanged', 'export function multiply(a: number, b: number): number {', 10, 11),
      createLine('removed', '  return a * b;', 11, undefined),
      createLine('added', '  // Handle edge cases', undefined, 12),
      createLine('added', '  if (a === 0 || b === 0) return 0;', undefined, 13),
      createLine('added', '  return a * b;', undefined, 14),
      createLine('unchanged', '}', 12, 15),
      createLine('unchanged', '', 13, 16),
      createLine('added', 'export function divide(a: number, b: number): number {', undefined, 17),
      createLine('added', '  return a / b;', undefined, 18),
      createLine('added', '}', undefined, 19),
    ],
  },
];

const additionsOnlyHunk: readonly DiffHunk[] = [
  {
    header: '@@ -0,0 +1,5 @@',
    oldStart: 0,
    oldCount: 0,
    newStart: 1,
    newCount: 5,
    lines: [
      createLine('added', 'import { Injectable } from "@angular/core";', undefined, 1),
      createLine('added', '', undefined, 2),
      createLine('added', '@Injectable({ providedIn: "root" })', undefined, 3),
      createLine('added', 'export class DataService {', undefined, 4),
      createLine('added', '}', undefined, 5),
    ],
  },
];

const deletionsOnlyHunk: readonly DiffHunk[] = [
  {
    header: '@@ -1,5 +0,0 @@',
    oldStart: 1,
    oldCount: 5,
    newStart: 0,
    newCount: 0,
    lines: [
      createLine('removed', 'import { Injectable } from "@angular/core";', 1, undefined),
      createLine('removed', '', 2, undefined),
      createLine('removed', '@Injectable({ providedIn: "root" })', 3, undefined),
      createLine('removed', 'export class OldService {', 4, undefined),
      createLine('removed', '}', 5, undefined),
    ],
  },
];

const highlightedHunks: readonly DiffHunk[] = [
  {
    header: '@@ -1,3 +1,3 @@',
    oldStart: 1,
    oldCount: 3,
    newStart: 1,
    newCount: 3,
    lines: [
      createLine(
        'unchanged',
        'const greeting = "Hello";',
        1,
        1,
        '<span style="color:#F97583">const</span><span style="color:#E1E4E8"> greeting </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> </span><span style="color:#9ECBFF">"Hello"</span><span style="color:#E1E4E8">;</span>'
      ),
      createLine(
        'removed',
        'console.log(greeting);',
        2,
        undefined,
        '<span style="color:#79B8FF">console</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(greeting);</span>'
      ),
      createLine(
        'added',
        'console.info(greeting);',
        undefined,
        2,
        '<span style="color:#79B8FF">console</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">info</span><span style="color:#E1E4E8">(greeting);</span>'
      ),
      createLine(
        'unchanged',
        'export { greeting };',
        3,
        3,
        '<span style="color:#F97583">export</span><span style="color:#E1E4E8"> { greeting };</span>'
      ),
    ],
  },
];

const largeHunk: readonly DiffHunk[] = [
  {
    header: '@@ -1,30 +1,40 @@',
    oldStart: 1,
    oldCount: 30,
    newStart: 1,
    newCount: 40,
    lines: [
      ...Array.from({ length: 10 }, (_, i) =>
        createLine('unchanged', `// Line ${i + 1}`, i + 1, i + 1)
      ),
      ...Array.from({ length: 5 }, (_, i) =>
        createLine('removed', `const old${i + 1} = ${i + 1};`, 11 + i, undefined)
      ),
      ...Array.from({ length: 10 }, (_, i) =>
        createLine('added', `const new${i + 1} = "${i + 1}";`, undefined, 11 + i)
      ),
      ...Array.from({ length: 15 }, (_, i) =>
        createLine('unchanged', `// Line ${26 + i}`, 16 + i, 21 + i)
      ),
    ],
  },
];

const meta: Meta<DiffBlockComponent> = {
  title: 'Molecules/DiffBlock',
  component: DiffBlockComponent,
  tags: ['autodocs'],
  argTypes: {
    hunks: {
      control: 'object',
      description: 'Diff hunks to display',
    },
    theme: {
      control: 'radio',
      options: ['dark', 'light'],
      description: 'Theme for styling',
    },
    viewMode: {
      control: 'radio',
      options: ['unified', 'split'],
      description: 'View mode: unified or split',
    },
    showLineNumbers: {
      control: 'boolean',
      description: 'Whether to show line numbers',
    },
    maxHeight: {
      control: 'text',
      description: 'Maximum height with scroll',
    },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<DiffBlockComponent>;

// ════════════════════════════════════════════════════════════════════════════
// Basic Examples
// ════════════════════════════════════════════════════════════════════════════

export const Default: Story = {
  args: {
    hunks: simpleHunks,
    theme: 'dark',
    viewMode: 'unified',
    showLineNumbers: true,
  },
};

export const LightTheme: Story = {
  args: {
    hunks: simpleHunks,
    theme: 'light',
    viewMode: 'unified',
    showLineNumbers: true,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// View Modes
// ════════════════════════════════════════════════════════════════════════════

export const UnifiedView: Story = {
  args: {
    hunks: simpleHunks,
    theme: 'dark',
    viewMode: 'unified',
    showLineNumbers: true,
  },
};

export const SplitView: Story = {
  args: {
    hunks: simpleHunks,
    theme: 'dark',
    viewMode: 'split',
    showLineNumbers: true,
  },
};

export const SplitViewLightTheme: Story = {
  args: {
    hunks: simpleHunks,
    theme: 'light',
    viewMode: 'split',
    showLineNumbers: true,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Multiple Hunks
// ════════════════════════════════════════════════════════════════════════════

export const MultipleHunksUnified: Story = {
  args: {
    hunks: multipleHunks,
    theme: 'dark',
    viewMode: 'unified',
    showLineNumbers: true,
  },
};

export const MultipleHunksSplit: Story = {
  args: {
    hunks: multipleHunks,
    theme: 'dark',
    viewMode: 'split',
    showLineNumbers: true,
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Line Type Variants
// ════════════════════════════════════════════════════════════════════════════

export const AdditionsOnly: Story = {
  args: {
    hunks: additionsOnlyHunk,
    theme: 'dark',
    viewMode: 'unified',
    showLineNumbers: true,
  },
};

export const DeletionsOnly: Story = {
  args: {
    hunks: deletionsOnlyHunk,
    theme: 'dark',
    viewMode: 'unified',
    showLineNumbers: true,
  },
};

export const AdditionsOnlySplit: Story = {
  args: {
    hunks: additionsOnlyHunk,
    theme: 'dark',
    viewMode: 'split',
    showLineNumbers: true,
  },
};

export const DeletionsOnlySplit: Story = {
  args: {
    hunks: deletionsOnlyHunk,
    theme: 'dark',
    viewMode: 'split',
    showLineNumbers: true,
  },
};

// ════════════════════════════════════════════════════════════════════════════
// With Syntax Highlighting
// ════════════════════════════════════════════════════════════════════════════

export const WithSyntaxHighlighting: Story = {
  args: {
    hunks: highlightedHunks,
    theme: 'dark',
    viewMode: 'unified',
    showLineNumbers: true,
  },
};

export const WithSyntaxHighlightingSplit: Story = {
  args: {
    hunks: highlightedHunks,
    theme: 'dark',
    viewMode: 'split',
    showLineNumbers: true,
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Feature Variants
// ════════════════════════════════════════════════════════════════════════════

export const WithoutLineNumbers: Story = {
  args: {
    hunks: simpleHunks,
    theme: 'dark',
    viewMode: 'unified',
    showLineNumbers: false,
  },
};

export const WithMaxHeight: Story = {
  args: {
    hunks: largeHunk,
    theme: 'dark',
    viewMode: 'unified',
    showLineNumbers: true,
    maxHeight: '300px',
  },
};

export const SplitViewWithMaxHeight: Story = {
  args: {
    hunks: largeHunk,
    theme: 'dark',
    viewMode: 'split',
    showLineNumbers: true,
    maxHeight: '300px',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Edge Cases
// ════════════════════════════════════════════════════════════════════════════

export const EmptyHunks: Story = {
  args: {
    hunks: [],
    theme: 'dark',
    viewMode: 'unified',
    showLineNumbers: true,
  },
};

export const SingleLineChange: Story = {
  args: {
    hunks: [
      {
        header: '@@ -1,1 +1,1 @@',
        oldStart: 1,
        oldCount: 1,
        newStart: 1,
        newCount: 1,
        lines: [
          createLine('removed', 'const x = 1;', 1, undefined),
          createLine('added', 'const x = 2;', undefined, 1),
        ],
      },
    ],
    theme: 'dark',
    viewMode: 'unified',
    showLineNumbers: true,
  },
};
