import type { Meta, StoryObj } from '@storybook/svelte';
import CodeViewer from './CodeViewer.svelte';

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

const sampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hello</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>Welcome to the code viewer.</p>
</body>
</html>`;

const meta: Meta<CodeViewer> = {
  title: 'Organisms/CodeViewer',
  component: CodeViewer,
  tags: ['autodocs'],
  argTypes: {
    code: { control: 'text' },
    language: {
      control: 'select',
      options: ['typescript', 'javascript', 'python', 'html', 'css', 'json', 'rust', 'go'],
    },
    theme: { control: 'radio', options: ['dark', 'light'] },
    borderStyle: {
      control: 'select',
      options: ['classic', 'grid-cross', 'corner-intersection', 'none'],
    },
    showLineNumbers: { control: 'boolean' },
    showCopyButton: { control: 'boolean' },
    showHeader: { control: 'boolean' },
    wordWrap: { control: 'boolean' },
    enableLineHover: { control: 'boolean' },
    title: { control: 'text' },
    maxHeight: { control: 'text' },
  },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<CodeViewer>;

export const Default: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'classic',
  },
};

export const LightTheme: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'light',
    borderStyle: 'classic',
  },
  parameters: { backgrounds: { default: 'light' } },
};

export const Python: Story = {
  args: {
    code: samplePython,
    language: 'python',
    theme: 'dark',
    borderStyle: 'classic',
    title: 'counter.py',
    fileExtension: '.py',
  },
};

export const HtmlExample: Story = {
  args: {
    code: sampleHtml,
    language: 'html',
    theme: 'dark',
    borderStyle: 'classic',
    title: 'index.html',
    fileExtension: '.html',
  },
};

export const WithHighlightedLines: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'classic',
    highlightedLines: [[11, 14]],
  },
};

export const WithFocusedLines: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'classic',
    focusedLines: [[3, 9]],
  },
};

export const WithCollapsedLines: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'classic',
    collapsedLines: [[3, 9]],
  },
};

export const NoHeader: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'classic',
    showHeader: false,
  },
};

export const NoLineNumbers: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'classic',
    showLineNumbers: false,
  },
};

export const WithMaxHeight: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'classic',
    maxHeight: '200px',
  },
};

export const WordWrap: Story = {
  args: {
    code: 'const veryLongLine = "This is a very long line of code that should wrap when word wrap is enabled because it exceeds the typical viewport width of most code viewers and editors";',
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'classic',
    wordWrap: true,
  },
};

export const BorderStyleGridCross: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'grid-cross',
  },
  parameters: { layout: 'centered' },
};

export const BorderStyleCornerIntersection: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'corner-intersection',
  },
  parameters: { layout: 'centered' },
};

export const CustomShikiTheme: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'classic',
    shikiTheme: 'dracula',
  },
};
