import type { Meta, StoryObj } from '@storybook/svelte';
import CodeBlockStoryWrapper from './CodeBlockStoryWrapper.svelte';

const sampleTypeScript = `import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: '<h1>Hello</h1>',
})
export class ExampleComponent {}`;

const sampleLongLine = `const veryLongLine = "This is a very long line that should wrap when word wrap is enabled. It contains a lot of text to demonstrate how the code viewer handles long lines with word wrapping enabled.";`;

const sampleManyLines = Array.from(
  { length: 50 },
  (_, i) => `console.log("Line ${i + 1}");`
).join('\n');

const meta: Meta<CodeBlockStoryWrapper> = {
  title: 'Molecules/CodeBlock',
  component: CodeBlockStoryWrapper,
  tags: ['autodocs'],
  argTypes: {
    code: { control: 'text' },
    theme: { control: 'radio', options: ['dark', 'light'] },
    showLineNumbers: { control: 'boolean' },
    wordWrap: { control: 'boolean' },
    maxHeight: { control: 'text' },
    isLoading: { control: 'boolean' },
    showCopyButton: { control: 'boolean' },
    copyState: { control: 'radio', options: ['idle', 'copied', 'error'] },
  },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<CodeBlockStoryWrapper>;

// ═══════════════ Basic ═══════════════

export const Default: Story = { args: { code: sampleTypeScript, theme: 'dark', showLineNumbers: true, showCopyButton: true } };

export const LightTheme: Story = {
  args: { code: sampleTypeScript, theme: 'light', showLineNumbers: true, showCopyButton: true },
  parameters: { backgrounds: { default: 'light' } },
};

// ═══════════════ Feature Variants ═══════════════

export const WithoutLineNumbers: Story = { args: { code: sampleTypeScript, theme: 'dark', showLineNumbers: false, showCopyButton: true } };
export const WithoutCopyButton: Story = { args: { code: sampleTypeScript, theme: 'dark', showLineNumbers: true, showCopyButton: false } };
export const MinimalView: Story = { args: { code: sampleTypeScript, theme: 'dark', showLineNumbers: false, showCopyButton: false } };
export const WithMaxHeight: Story = { args: { code: sampleManyLines, theme: 'dark', showLineNumbers: true, showCopyButton: true, maxHeight: '200px' } };
export const WithWordWrap: Story = { args: { code: sampleLongLine, theme: 'dark', showLineNumbers: true, showCopyButton: true, wordWrap: true } };

// ═══════════════ Copy Button States ═══════════════

export const CopyButtonIdle: Story = { args: { code: sampleTypeScript, theme: 'dark', showLineNumbers: true, showCopyButton: true, copyState: 'idle' } };
export const CopyButtonCopied: Story = { args: { code: sampleTypeScript, theme: 'dark', showLineNumbers: true, showCopyButton: true, copyState: 'copied' } };
export const CopyButtonError: Story = { args: { code: sampleTypeScript, theme: 'dark', showLineNumbers: true, showCopyButton: true, copyState: 'error' } };

// ═══════════════ Loading State ═══════════════

export const Loading: Story = { args: { code: sampleTypeScript, theme: 'dark', showLineNumbers: true, showCopyButton: true, isLoading: true } };

// ═══════════════ Highlighted Lines ═══════════════

export const WithHighlightedLines: Story = { args: { code: sampleTypeScript, theme: 'dark', showLineNumbers: true, showCopyButton: true, highlightedLinesSet: new Set([3, 4, 5]) } };
export const SingleHighlightedLine: Story = { args: { code: sampleTypeScript, theme: 'dark', showLineNumbers: true, showCopyButton: true, highlightedLinesSet: new Set([4]) } };
