import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, inject, computed } from '@angular/core';
import { CodeBlockComponent } from './code-block.component';

// Pre-highlighted HTML samples (simulating Shiki output)
const highlightedTypeScript = `<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> { Component } </span><span style="color:#F97583">from</span><span style="color:#E1E4E8"> </span><span style="color:#9ECBFF">'@angular/core'</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">@</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8">({</span></span>
<span class="line"><span style="color:#E1E4E8">  selector: </span><span style="color:#9ECBFF">'app-example'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  template: </span><span style="color:#9ECBFF">'&lt;h1&gt;Hello&lt;/h1&gt;'</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">})</span></span>
<span class="line"><span style="color:#F97583">export</span><span style="color:#E1E4E8"> </span><span style="color:#F97583">class</span><span style="color:#E1E4E8"> </span><span style="color:#B392F0">ExampleComponent</span><span style="color:#E1E4E8"> {}</span></span></code></pre>`;

const highlightedTypeScriptLight = `<pre class="shiki github-light" style="background-color:#fff;color:#24292e" tabindex="0"><code><span class="line"><span style="color:#D73A49">import</span><span style="color:#24292E"> { Component } </span><span style="color:#D73A49">from</span><span style="color:#24292E"> </span><span style="color:#032F62">'@angular/core'</span><span style="color:#24292E">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E">@</span><span style="color:#6F42C1">Component</span><span style="color:#24292E">({</span></span>
<span class="line"><span style="color:#24292E">  selector: </span><span style="color:#032F62">'app-example'</span><span style="color:#24292E">,</span></span>
<span class="line"><span style="color:#24292E">  template: </span><span style="color:#032F62">'&lt;h1&gt;Hello&lt;/h1&gt;'</span><span style="color:#24292E">,</span></span>
<span class="line"><span style="color:#24292E">})</span></span>
<span class="line"><span style="color:#D73A49">export</span><span style="color:#24292E"> </span><span style="color:#D73A49">class</span><span style="color:#24292E"> </span><span style="color:#6F42C1">ExampleComponent</span><span style="color:#24292E"> {}</span></span></code></pre>`;

const highlightedManyLines = `<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code>${Array.from(
  { length: 50 },
  (_, i) => `<span class="line"><span style="color:#79B8FF">console</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Line ${i + 1}"</span><span style="color:#E1E4E8">);</span></span>`
).join('\n')}</code></pre>`;

// Wrapper component to handle SafeHtml
@Component({
  selector: 'story-wrapper',
  standalone: true,
  imports: [CodeBlockComponent],
  template: `
    <nx-code-block
      [content]="safeContent()"
      [lineCount]="lineCount"
      [theme]="theme"
      [showLineNumbers]="showLineNumbers"
      [wordWrap]="wordWrap"
      [maxHeight]="maxHeight"
      [isLoading]="isLoading"
      [showCopyButton]="showCopyButton"
      [copyState]="copyState"
      [copyClick]="copyClick"
      [highlightedLinesSet]="highlightedLinesSet"
    />
  `,
})
class StoryWrapperComponent {
  private readonly sanitizer = inject(DomSanitizer);

  content = '';
  lineCount = 7;
  theme: 'dark' | 'light' = 'dark';
  showLineNumbers = true;
  wordWrap = false;
  maxHeight = '';
  isLoading = false;
  showCopyButton = true;
  copyState: 'idle' | 'copied' | 'error' = 'idle';
  copyClick = () => console.log('Copy clicked');
  highlightedLinesSet = new Set<number>();

  readonly safeContent = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.content)
  );
}

const meta: Meta<StoryWrapperComponent> = {
  title: 'Molecules/CodeBlock',
  component: StoryWrapperComponent,
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'Highlighted HTML content',
    },
    lineCount: {
      control: 'number',
      description: 'Number of lines in the code',
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
    content: highlightedTypeScript,
    lineCount: 7,
    theme: 'dark',
    showLineNumbers: true,
    showCopyButton: true,
  },
};

export const LightTheme: Story = {
  args: {
    content: highlightedTypeScriptLight,
    lineCount: 7,
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
    content: highlightedTypeScript,
    lineCount: 7,
    theme: 'dark',
    showLineNumbers: false,
    showCopyButton: true,
  },
};

export const WithoutCopyButton: Story = {
  args: {
    content: highlightedTypeScript,
    lineCount: 7,
    theme: 'dark',
    showLineNumbers: true,
    showCopyButton: false,
  },
};

export const MinimalView: Story = {
  args: {
    content: highlightedTypeScript,
    lineCount: 7,
    theme: 'dark',
    showLineNumbers: false,
    showCopyButton: false,
  },
};

export const WithMaxHeight: Story = {
  args: {
    content: highlightedManyLines,
    lineCount: 50,
    theme: 'dark',
    showLineNumbers: true,
    showCopyButton: true,
    maxHeight: '200px',
  },
};

export const WithWordWrap: Story = {
  args: {
    content: `<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">const</span><span style="color:#E1E4E8"> </span><span style="color:#79B8FF">veryLongLine</span><span style="color:#E1E4E8"> </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> </span><span style="color:#9ECBFF">"This is a very long line that should wrap when word wrap is enabled. It contains a lot of text to demonstrate how the code viewer handles long lines with word wrapping enabled."</span><span style="color:#E1E4E8">;</span></span></code></pre>`,
    lineCount: 1,
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
    content: highlightedTypeScript,
    lineCount: 7,
    theme: 'dark',
    showLineNumbers: true,
    showCopyButton: true,
    copyState: 'idle',
  },
};

export const CopyButtonCopied: Story = {
  args: {
    content: highlightedTypeScript,
    lineCount: 7,
    theme: 'dark',
    showLineNumbers: true,
    showCopyButton: true,
    copyState: 'copied',
  },
};

export const CopyButtonError: Story = {
  args: {
    content: highlightedTypeScript,
    lineCount: 7,
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
    content: highlightedTypeScript,
    lineCount: 7,
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
    content: highlightedTypeScript,
    lineCount: 7,
    theme: 'dark',
    showLineNumbers: true,
    showCopyButton: true,
    highlightedLinesSet: new Set([3, 4, 5]),
  },
};

export const SingleHighlightedLine: Story = {
  args: {
    content: highlightedTypeScript,
    lineCount: 7,
    theme: 'dark',
    showLineNumbers: true,
    showCopyButton: true,
    highlightedLinesSet: new Set([4]),
  },
};
