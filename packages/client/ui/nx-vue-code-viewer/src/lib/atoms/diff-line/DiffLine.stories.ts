import type { Meta, StoryObj } from '@storybook/vue3';
import DiffLineComponent from './DiffLine.vue';
import type { DiffLine } from '@ngeenx/nx-code-viewer-utils';

const createLine = (type: DiffLine['type'], content: string, oldLineNumber?: number, newLineNumber?: number, highlightedContent?: string): DiffLine =>
  ({ type, content, oldLineNumber, newLineNumber, highlightedContent });

const unchangedLine = createLine('unchanged', 'import { Component } from "@angular/core";', 1, 1);
const addedLine = createLine('added', 'import { signal } from "@angular/core";', undefined, 2);
const removedLine = createLine('removed', 'const name = "World";', 3, undefined);
const headerLine = createLine('header', '@@ -1,5 +1,6 @@', undefined, undefined);

const highlightedUnchangedLine = createLine('unchanged', 'const greeting = "Hello";', 1, 1,
  '<span style="color:#F97583">const</span><span style="color:#E1E4E8"> greeting </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> </span><span style="color:#9ECBFF">"Hello"</span><span style="color:#E1E4E8">;</span>');
const highlightedAddedLine = createLine('added', 'const greeting = signal("Hello");', undefined, 2,
  '<span style="color:#F97583">const</span><span style="color:#E1E4E8"> greeting </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> </span><span style="color:#B392F0">signal</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello"</span><span style="color:#E1E4E8">);</span>');
const highlightedRemovedLine = createLine('removed', 'console.log(greeting);', 2, undefined,
  '<span style="color:#79B8FF">console</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(greeting);</span>');
const longLine = createLine('unchanged', 'const veryLongVariableName = "This is a very long line that might overflow the container and require horizontal scrolling or word wrapping";', 5, 5);

const meta: Meta<typeof DiffLineComponent> = {
  title: 'Atoms/DiffLine',
  component: DiffLineComponent,
  tags: ['autodocs'],
  argTypes: {
    line: { control: 'object' },
    theme: { control: 'radio', options: ['dark', 'light'] },
    showLineNumbers: { control: 'boolean' },
    showPrefix: { control: 'boolean' },
    isHighlighted: { control: 'boolean' },
    lineIndex: { control: 'number' },
  },
  render: (args) => ({
    components: { DiffLineComponent },
    setup() { return { args }; },
    template: `<DiffLineComponent v-bind="args" />`,
  }),
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof DiffLineComponent>;

// ═══════════════ Line Types - Dark ═══════════════

export const Unchanged: Story = { args: { line: unchangedLine, theme: 'dark', showLineNumbers: true, showPrefix: true, isHighlighted: false, lineIndex: 0 } };
export const Added: Story = { args: { line: addedLine, theme: 'dark', showLineNumbers: true, showPrefix: true, isHighlighted: false, lineIndex: 1 } };
export const Removed: Story = { args: { line: removedLine, theme: 'dark', showLineNumbers: true, showPrefix: true, isHighlighted: false, lineIndex: 2 } };
export const Header: Story = { args: { line: headerLine, theme: 'dark', showLineNumbers: true, showPrefix: true, isHighlighted: false, lineIndex: 0 } };

// ═══════════════ Line Types - Light ═══════════════

export const UnchangedLight: Story = { args: { line: unchangedLine, theme: 'light', showLineNumbers: true, showPrefix: true, isHighlighted: false, lineIndex: 0 }, parameters: { backgrounds: { default: 'light' } } };
export const AddedLight: Story = { args: { line: addedLine, theme: 'light', showLineNumbers: true, showPrefix: true, isHighlighted: false, lineIndex: 1 }, parameters: { backgrounds: { default: 'light' } } };
export const RemovedLight: Story = { args: { line: removedLine, theme: 'light', showLineNumbers: true, showPrefix: true, isHighlighted: false, lineIndex: 2 }, parameters: { backgrounds: { default: 'light' } } };
export const HeaderLight: Story = { args: { line: headerLine, theme: 'light', showLineNumbers: true, showPrefix: true, isHighlighted: false, lineIndex: 0 }, parameters: { backgrounds: { default: 'light' } } };

// ═══════════════ Highlighted State ═══════════════

export const HighlightedUnchanged: Story = { args: { line: unchangedLine, theme: 'dark', showLineNumbers: true, showPrefix: true, isHighlighted: true, lineIndex: 0 } };
export const HighlightedAdded: Story = { args: { line: addedLine, theme: 'dark', showLineNumbers: true, showPrefix: true, isHighlighted: true, lineIndex: 1 } };
export const HighlightedRemoved: Story = { args: { line: removedLine, theme: 'dark', showLineNumbers: true, showPrefix: true, isHighlighted: true, lineIndex: 2 } };
export const HighlightedLight: Story = { args: { line: addedLine, theme: 'light', showLineNumbers: true, showPrefix: true, isHighlighted: true, lineIndex: 1 }, parameters: { backgrounds: { default: 'light' } } };

// ═══════════════ Syntax Highlighting ═══════════════

export const SyntaxHighlightedUnchanged: Story = { args: { line: highlightedUnchangedLine, theme: 'dark', showLineNumbers: true, showPrefix: true, isHighlighted: false, lineIndex: 0 } };
export const SyntaxHighlightedAdded: Story = { args: { line: highlightedAddedLine, theme: 'dark', showLineNumbers: true, showPrefix: true, isHighlighted: false, lineIndex: 1 } };
export const SyntaxHighlightedRemoved: Story = { args: { line: highlightedRemovedLine, theme: 'dark', showLineNumbers: true, showPrefix: true, isHighlighted: false, lineIndex: 2 } };

// ═══════════════ Feature Variants ═══════════════

export const WithoutLineNumbers: Story = { args: { line: addedLine, theme: 'dark', showLineNumbers: false, showPrefix: true, isHighlighted: false, lineIndex: 0 } };
export const WithoutPrefix: Story = { args: { line: addedLine, theme: 'dark', showLineNumbers: true, showPrefix: false, isHighlighted: false, lineIndex: 0 } };
export const MinimalView: Story = { args: { line: addedLine, theme: 'dark', showLineNumbers: false, showPrefix: false, isHighlighted: false, lineIndex: 0 } };

// ═══════════════ Edge Cases ═══════════════

export const EmptyLine: Story = { args: { line: createLine('unchanged', '', 5, 5), theme: 'dark', showLineNumbers: true, showPrefix: true, isHighlighted: false, lineIndex: 0 } };
export const LongLine: Story = { args: { line: longLine, theme: 'dark', showLineNumbers: true, showPrefix: true, isHighlighted: false, lineIndex: 0 } };
export const OnlyOldLineNumber: Story = { args: { line: createLine('removed', 'removed content', 10, undefined), theme: 'dark', showLineNumbers: true, showPrefix: true, isHighlighted: false, lineIndex: 0 } };
export const OnlyNewLineNumber: Story = { args: { line: createLine('added', 'added content', undefined, 15), theme: 'dark', showLineNumbers: true, showPrefix: true, isHighlighted: false, lineIndex: 0 } };
export const LargeLineNumbers: Story = { args: { line: createLine('unchanged', 'content at large line number', 1234, 5678), theme: 'dark', showLineNumbers: true, showPrefix: true, isHighlighted: false, lineIndex: 0 } };
