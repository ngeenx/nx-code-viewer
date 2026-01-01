import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { DiffLineComponent } from './diff-line.component';
import type { DiffLine } from '../../types';

// Action handler for story interactions
const logAction = (name: string) => (value?: unknown) => {
  console.log(`[${name}]`, value);
};

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

// Sample diff lines
const unchangedLine = createLine('unchanged', 'import { Component } from "@angular/core";', 1, 1);
const addedLine = createLine('added', 'import { signal } from "@angular/core";', undefined, 2);
const removedLine = createLine('removed', 'const name = "World";', 3, undefined);
const headerLine = createLine('header', '@@ -1,5 +1,6 @@', undefined, undefined);

// Lines with syntax highlighting
const highlightedUnchangedLine = createLine(
  'unchanged',
  'const greeting = "Hello";',
  1,
  1,
  '<span style="color:#F97583">const</span><span style="color:#E1E4E8"> greeting </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> </span><span style="color:#9ECBFF">"Hello"</span><span style="color:#E1E4E8">;</span>'
);

const highlightedAddedLine = createLine(
  'added',
  'const greeting = signal("Hello");',
  undefined,
  2,
  '<span style="color:#F97583">const</span><span style="color:#E1E4E8"> greeting </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> </span><span style="color:#B392F0">signal</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello"</span><span style="color:#E1E4E8">);</span>'
);

const highlightedRemovedLine = createLine(
  'removed',
  'console.log(greeting);',
  2,
  undefined,
  '<span style="color:#79B8FF">console</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(greeting);</span>'
);

const longLine = createLine(
  'unchanged',
  'const veryLongVariableName = "This is a very long line that might overflow the container and require horizontal scrolling or word wrapping";',
  5,
  5
);

const meta: Meta<DiffLineComponent> = {
  title: 'Atoms/DiffLine',
  component: DiffLineComponent,
  tags: ['autodocs'],
  argTypes: {
    line: {
      control: 'object',
      description: 'The diff line to display',
    },
    theme: {
      control: 'radio',
      options: ['dark', 'light'],
      description: 'Theme for styling',
    },
    showLineNumbers: {
      control: 'boolean',
      description: 'Whether to show line numbers',
    },
    showPrefix: {
      control: 'boolean',
      description: 'Whether to show the +/- prefix',
    },
    isHighlighted: {
      control: 'boolean',
      description: 'Whether this line is highlighted (hovered)',
    },
    lineIndex: {
      control: 'number',
      description: 'Unique index for this line',
    },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<DiffLineComponent>;

// ════════════════════════════════════════════════════════════════════════════
// Line Type Variants - Dark Theme
// ════════════════════════════════════════════════════════════════════════════

export const Unchanged: Story = {
  args: {
    line: unchangedLine,
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: false,
    lineIndex: 0,
  },
};

export const Added: Story = {
  args: {
    line: addedLine,
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: false,
    lineIndex: 1,
  },
};

export const Removed: Story = {
  args: {
    line: removedLine,
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: false,
    lineIndex: 2,
  },
};

export const Header: Story = {
  args: {
    line: headerLine,
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: false,
    lineIndex: 0,
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Line Type Variants - Light Theme
// ════════════════════════════════════════════════════════════════════════════

export const UnchangedLight: Story = {
  args: {
    line: unchangedLine,
    theme: 'light',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: false,
    lineIndex: 0,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const AddedLight: Story = {
  args: {
    line: addedLine,
    theme: 'light',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: false,
    lineIndex: 1,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const RemovedLight: Story = {
  args: {
    line: removedLine,
    theme: 'light',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: false,
    lineIndex: 2,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const HeaderLight: Story = {
  args: {
    line: headerLine,
    theme: 'light',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: false,
    lineIndex: 0,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Highlighted State
// ════════════════════════════════════════════════════════════════════════════

export const HighlightedUnchanged: Story = {
  args: {
    line: unchangedLine,
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: true,
    lineIndex: 0,
  },
};

export const HighlightedAdded: Story = {
  args: {
    line: addedLine,
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: true,
    lineIndex: 1,
  },
};

export const HighlightedRemoved: Story = {
  args: {
    line: removedLine,
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: true,
    lineIndex: 2,
  },
};

export const HighlightedLight: Story = {
  args: {
    line: addedLine,
    theme: 'light',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: true,
    lineIndex: 1,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// With Syntax Highlighting
// ════════════════════════════════════════════════════════════════════════════

export const SyntaxHighlightedUnchanged: Story = {
  args: {
    line: highlightedUnchangedLine,
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: false,
    lineIndex: 0,
  },
};

export const SyntaxHighlightedAdded: Story = {
  args: {
    line: highlightedAddedLine,
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: false,
    lineIndex: 1,
  },
};

export const SyntaxHighlightedRemoved: Story = {
  args: {
    line: highlightedRemovedLine,
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: false,
    lineIndex: 2,
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Feature Variants
// ════════════════════════════════════════════════════════════════════════════

export const WithoutLineNumbers: Story = {
  args: {
    line: addedLine,
    theme: 'dark',
    showLineNumbers: false,
    showPrefix: true,
    isHighlighted: false,
    lineIndex: 0,
  },
};

export const WithoutPrefix: Story = {
  args: {
    line: addedLine,
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: false,
    isHighlighted: false,
    lineIndex: 0,
  },
};

export const MinimalView: Story = {
  args: {
    line: addedLine,
    theme: 'dark',
    showLineNumbers: false,
    showPrefix: false,
    isHighlighted: false,
    lineIndex: 0,
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Interactive Example
// ════════════════════════════════════════════════════════════════════════════

export const Interactive: Story = {
  args: {
    line: addedLine,
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: false,
    lineIndex: 0,
  },
  render: (args) => ({
    props: {
      ...args,
      onLineHover: logAction('lineHover'),
    },
    template: `
      <nx-diff-line
        [line]="line"
        [theme]="theme"
        [showLineNumbers]="showLineNumbers"
        [showPrefix]="showPrefix"
        [isHighlighted]="isHighlighted"
        [lineIndex]="lineIndex"
        (lineHover)="onLineHover($event)"
      />
    `,
  }),
};

// ════════════════════════════════════════════════════════════════════════════
// All Line Types Comparison
// ════════════════════════════════════════════════════════════════════════════

export const AllTypesDark: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2px;">
        <nx-diff-line [line]="headerLine" [theme]="'dark'" [showLineNumbers]="true" [showPrefix]="true" [lineIndex]="0" />
        <nx-diff-line [line]="unchangedLine" [theme]="'dark'" [showLineNumbers]="true" [showPrefix]="true" [lineIndex]="1" />
        <nx-diff-line [line]="removedLine" [theme]="'dark'" [showLineNumbers]="true" [showPrefix]="true" [lineIndex]="2" />
        <nx-diff-line [line]="addedLine" [theme]="'dark'" [showLineNumbers]="true" [showPrefix]="true" [lineIndex]="3" />
        <nx-diff-line [line]="unchangedLine2" [theme]="'dark'" [showLineNumbers]="true" [showPrefix]="true" [lineIndex]="4" />
      </div>
    `,
    props: {
      headerLine,
      unchangedLine,
      removedLine,
      addedLine,
      unchangedLine2: createLine('unchanged', 'console.log(name);', 4, 4),
    },
  }),
};

export const AllTypesLight: Story = {
  parameters: {
    backgrounds: { default: 'light' },
  },
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 2px;">
        <nx-diff-line [line]="headerLine" [theme]="'light'" [showLineNumbers]="true" [showPrefix]="true" [lineIndex]="0" />
        <nx-diff-line [line]="unchangedLine" [theme]="'light'" [showLineNumbers]="true" [showPrefix]="true" [lineIndex]="1" />
        <nx-diff-line [line]="removedLine" [theme]="'light'" [showLineNumbers]="true" [showPrefix]="true" [lineIndex]="2" />
        <nx-diff-line [line]="addedLine" [theme]="'light'" [showLineNumbers]="true" [showPrefix]="true" [lineIndex]="3" />
        <nx-diff-line [line]="unchangedLine2" [theme]="'light'" [showLineNumbers]="true" [showPrefix]="true" [lineIndex]="4" />
      </div>
    `,
    props: {
      headerLine,
      unchangedLine,
      removedLine,
      addedLine,
      unchangedLine2: createLine('unchanged', 'console.log(name);', 4, 4),
    },
  }),
};

// ════════════════════════════════════════════════════════════════════════════
// Edge Cases
// ════════════════════════════════════════════════════════════════════════════

export const EmptyLine: Story = {
  args: {
    line: createLine('unchanged', '', 5, 5),
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: false,
    lineIndex: 0,
  },
};

export const LongLine: Story = {
  args: {
    line: longLine,
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: false,
    lineIndex: 0,
  },
};

export const OnlyOldLineNumber: Story = {
  args: {
    line: createLine('removed', 'removed content', 10, undefined),
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: false,
    lineIndex: 0,
  },
};

export const OnlyNewLineNumber: Story = {
  args: {
    line: createLine('added', 'added content', undefined, 15),
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: false,
    lineIndex: 0,
  },
};

export const LargeLineNumbers: Story = {
  args: {
    line: createLine('unchanged', 'content at large line number', 1234, 5678),
    theme: 'dark',
    showLineNumbers: true,
    showPrefix: true,
    isHighlighted: false,
    lineIndex: 0,
  },
};
