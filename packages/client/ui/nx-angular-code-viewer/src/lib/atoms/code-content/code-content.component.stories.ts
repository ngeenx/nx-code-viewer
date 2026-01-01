import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import {
  Component,
  inject,
  input,
  signal,
  effect,
  untracked,
} from '@angular/core';
import type { SafeHtml } from '@angular/platform-browser';
import { CodeContentComponent } from './code-content.component';
import { CodeHighlighterService } from '../../services';
import type { CodeViewerTheme } from '../../types';

// Sample code snippets
const sampleTypeScript = `import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: '<h1>Hello</h1>',
})
export class ExampleComponent {}`;

const sampleLongLine = `const veryLongLine = "This is a very long line that should wrap when word wrap is enabled. It contains a lot of text to demonstrate how the code viewer handles long lines with word wrapping enabled. This line is intentionally long to test the word wrap functionality properly.";`;

const sampleManyLines = Array.from(
  { length: 20 },
  (_, i) => `console.log("Line ${i + 1}");`
).join('\n');

const sampleSingleLine = `console.log("Hello");`;

// Wrapper component that uses the actual CodeHighlighterService
@Component({
  selector: 'story-wrapper',
  standalone: true,
  imports: [CodeContentComponent],
  providers: [CodeHighlighterService],
  template: `
    <nx-code-content
      [content]="highlightedContent()"
      [theme]="theme()"
      [wordWrap]="wordWrap()"
      [isLoading]="isLoading()"
      [hoveredLine]="hoveredLine()"
      [highlightedLinesSet]="highlightedLinesSet()"
      (lineHover)="onLineHover($event)"
    />
  `,
})
class StoryWrapperComponent {
  private readonly highlighter = inject(CodeHighlighterService);

  readonly code = input<string>('');
  readonly theme = input<CodeViewerTheme>('dark');
  readonly wordWrap = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly hoveredLine = input<number>(0);
  readonly highlightedLinesSet = input<Set<number>>(new Set());

  readonly highlightedContent = signal<SafeHtml | null>(null);

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

  onLineHover(line: number): void {
    console.log('Line hovered:', line);
  }
}

const meta: Meta<StoryWrapperComponent> = {
  title: 'Atoms/CodeContent',
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
    wordWrap: {
      control: 'boolean',
      description: 'Whether to wrap long lines',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether content is loading',
    },
    hoveredLine: {
      control: 'number',
      description: 'Currently hovered line (1-based, 0 = no line hovered)',
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
    wordWrap: false,
    isLoading: false,
  },
};

export const LightTheme: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'light',
    wordWrap: false,
    isLoading: false,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Word Wrap Variants
// ════════════════════════════════════════════════════════════════════════════

export const WithoutWordWrap: Story = {
  args: {
    code: sampleLongLine,
    theme: 'dark',
    wordWrap: false,
    isLoading: false,
  },
};

export const WithWordWrap: Story = {
  args: {
    code: sampleLongLine,
    theme: 'dark',
    wordWrap: true,
    isLoading: false,
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Loading State
// ════════════════════════════════════════════════════════════════════════════

export const Loading: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'dark',
    wordWrap: false,
    isLoading: true,
  },
};

export const LoadingLightTheme: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'light',
    wordWrap: false,
    isLoading: true,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Hovered Lines
// ════════════════════════════════════════════════════════════════════════════

export const WithHoveredLine: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'dark',
    wordWrap: false,
    isLoading: false,
    hoveredLine: 3,
  },
};

export const WithHoveredLineLightTheme: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'light',
    wordWrap: false,
    isLoading: false,
    hoveredLine: 3,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Highlighted Lines (Pre-configured)
// ════════════════════════════════════════════════════════════════════════════

export const WithHighlightedLines: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'dark',
    wordWrap: false,
    isLoading: false,
    highlightedLinesSet: new Set([3, 4, 5]),
  },
};

export const SingleHighlightedLine: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'dark',
    wordWrap: false,
    isLoading: false,
    highlightedLinesSet: new Set([4]),
    hoveredLine: 4,
  },
};

export const WithHighlightedLinesLight: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'light',
    wordWrap: false,
    isLoading: false,
    highlightedLinesSet: new Set([3, 4, 5]),
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Combined States
// ════════════════════════════════════════════════════════════════════════════

export const HoveredAndHighlighted: Story = {
  args: {
    code: sampleTypeScript,
    theme: 'dark',
    wordWrap: false,
    isLoading: false,
    hoveredLine: 4,
    highlightedLinesSet: new Set([3, 5]),
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Multiple Lines
// ════════════════════════════════════════════════════════════════════════════

export const ManyLines: Story = {
  args: {
    code: sampleManyLines,
    theme: 'dark',
    wordWrap: false,
    isLoading: false,
  },
};

export const ManyLinesWithHighlights: Story = {
  args: {
    code: sampleManyLines,
    theme: 'dark',
    wordWrap: false,
    isLoading: false,
    highlightedLinesSet: new Set([5, 6, 7, 15, 16]),
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Edge Cases
// ════════════════════════════════════════════════════════════════════════════

export const SingleLine: Story = {
  args: {
    code: sampleSingleLine,
    theme: 'dark',
    wordWrap: false,
    isLoading: false,
  },
};

export const EmptyContent: Story = {
  args: {
    code: '',
    theme: 'dark',
    wordWrap: false,
    isLoading: false,
  },
};
