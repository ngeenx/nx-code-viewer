import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import {
  Component,
  inject,
  input,
  signal,
  effect,
  untracked,
  computed,
} from '@angular/core';
import type { SafeHtml } from '@angular/platform-browser';
import { CodeBlockComponent } from './code-block.component';
import { CodeHighlighterService } from '../../services';
import type { CodeViewerTheme, CopyButtonState } from '../../types';
import { countLines } from '../../utils';

// Sample code snippets
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

// Wrapper component that uses the actual CodeHighlighterService
@Component({
  selector: 'story-wrapper',
  standalone: true,
  imports: [CodeBlockComponent],
  providers: [CodeHighlighterService],
  template: `
    <nx-code-block
      [content]="highlightedContent()"
      [lineCount]="lineCount()"
      [theme]="theme()"
      [showLineNumbers]="showLineNumbers()"
      [wordWrap]="wordWrap()"
      [maxHeight]="maxHeight()"
      [isLoading]="isLoading()"
      [showCopyButton]="showCopyButton()"
      [copyState]="copyState()"
      [copyClick]="handleCopyClick"
      [highlightedLinesSet]="highlightedLinesSet()" />
  `,
})
class StoryWrapperComponent {
  private readonly highlighter = inject(CodeHighlighterService);

  readonly code = input<string>('');
  readonly theme = input<CodeViewerTheme>('dark');
  readonly showLineNumbers = input<boolean>(true);
  readonly wordWrap = input<boolean>(false);
  readonly maxHeight = input<string>('');
  readonly isLoading = input<boolean>(false);
  readonly showCopyButton = input<boolean>(true);
  readonly copyState = input<CopyButtonState>('idle');
  readonly highlightedLinesSet = input<Set<number>>(new Set());

  readonly highlightedContent = signal<SafeHtml | null>(null);

  readonly lineCount = computed(() => countLines(this.code()));

  readonly handleCopyClick = () => {
    console.log('Copy clicked');
  };

  constructor() {
    effect(() => {
      const codeValue = this.code();
      const themeValue = this.theme();

      untracked(() => {
        void this.highlight(codeValue, themeValue);
      });
    });
  }

  private async highlight(code: string, theme: CodeViewerTheme): Promise<void> {
    if (!code) {
      this.highlightedContent.set(null);
      return;
    }

    const result = await this.highlighter.highlightToSafeHtml({
      code,
      language: 'typescript',
      theme,
    });

    this.highlightedContent.set(result.html);
  }
}

const meta: Meta<StoryWrapperComponent> = {
  title: 'Molecules/CodeBlock',
  component: StoryWrapperComponent,
  tags: ['autodocs'],
  argTypes: {
    code: {
      control: 'text',
      description: 'Source code to highlight and display',
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
    wordWrap: {
      control: 'boolean',
      description: 'Whether to wrap long lines',
    },
    maxHeight: {
      control: 'text',
      description: 'Maximum height with scroll',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether content is loading',
    },
    showCopyButton: {
      control: 'boolean',
      description: 'Whether to show the copy button',
    },
    copyState: {
      control: 'radio',
      options: ['idle', 'copied', 'error'],
      description: 'Current state of the copy button',
    },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<StoryWrapperComponent>;

// ════════════════════════════════════════════════════════════════════════════
// Basic Examples
// ════════════════════════════════════════════════════════════════════════════

export const Default: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'dark',
    showLineNumbers: true,
    showCopyButton: true,
  },
};

export const LightTheme: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'light',
    showLineNumbers: true,
    showCopyButton: true,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Feature Variants
// ════════════════════════════════════════════════════════════════════════════

export const WithoutLineNumbers: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'dark',
    showLineNumbers: false,
    showCopyButton: true,
  },
};

export const WithoutCopyButton: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'dark',
    showLineNumbers: true,
    showCopyButton: false,
  },
};

export const MinimalView: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'dark',
    showLineNumbers: false,
    showCopyButton: false,
  },
};

export const WithMaxHeight: Story = {
  args: {
    code: sampleManyLines,
    theme: 'dark',
    showLineNumbers: true,
    showCopyButton: true,
    maxHeight: '200px',
  },
};

export const WithWordWrap: Story = {
  args: {
    code: sampleLongLine,
    theme: 'dark',
    showLineNumbers: true,
    showCopyButton: true,
    wordWrap: true,
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Copy Button States
// ════════════════════════════════════════════════════════════════════════════

export const CopyButtonIdle: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'dark',
    showLineNumbers: true,
    showCopyButton: true,
    copyState: 'idle',
  },
};

export const CopyButtonCopied: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'dark',
    showLineNumbers: true,
    showCopyButton: true,
    copyState: 'copied',
  },
};

export const CopyButtonError: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'dark',
    showLineNumbers: true,
    showCopyButton: true,
    copyState: 'error',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Loading State
// ════════════════════════════════════════════════════════════════════════════

export const Loading: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'dark',
    showLineNumbers: true,
    showCopyButton: true,
    isLoading: true,
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Highlighted Lines
// ════════════════════════════════════════════════════════════════════════════

export const WithHighlightedLines: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'dark',
    showLineNumbers: true,
    showCopyButton: true,
    highlightedLinesSet: new Set([3, 4, 5]),
  },
};

export const SingleHighlightedLine: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'dark',
    showLineNumbers: true,
    showCopyButton: true,
    highlightedLinesSet: new Set([4]),
  },
};
