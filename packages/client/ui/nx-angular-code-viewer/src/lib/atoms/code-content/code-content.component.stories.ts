import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, inject, computed } from '@angular/core';
import { CodeContentComponent } from './code-content.component';

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

const highlightedLongLine = `<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#F97583">const</span><span style="color:#E1E4E8"> </span><span style="color:#79B8FF">veryLongLine</span><span style="color:#E1E4E8"> </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> </span><span style="color:#9ECBFF">"This is a very long line that should wrap when word wrap is enabled. It contains a lot of text to demonstrate how the code viewer handles long lines with word wrapping enabled. This line is intentionally long to test the word wrap functionality properly."</span><span style="color:#E1E4E8">;</span></span></code></pre>`;

const highlightedManyLines = `<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code>${Array.from(
  { length: 20 },
  (_, i) =>
    `<span class="line"><span style="color:#79B8FF">console</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Line ${i + 1}"</span><span style="color:#E1E4E8">);</span></span>`
).join('\n')}</code></pre>`;

// Wrapper component to handle SafeHtml
@Component({
  selector: 'story-wrapper',
  standalone: true,
  imports: [CodeContentComponent],
  template: `
    <nx-code-content
      [content]="safeContent()"
      [theme]="theme"
      [wordWrap]="wordWrap"
      [isLoading]="isLoading"
      [hoveredLine]="hoveredLine"
      [highlightedLinesSet]="highlightedLinesSet"
      (lineHover)="onLineHover($event)" />
  `,
})
class StoryWrapperComponent {
  private readonly sanitizer = inject(DomSanitizer);

  content = '';
  theme: 'dark' | 'light' = 'dark';
  wordWrap = false;
  isLoading = false;
  hoveredLine = 0;
  highlightedLinesSet = new Set<number>();

  readonly safeContent = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.content)
  );

  onLineHover(line: number): void {
    console.log('Line hovered:', line);
  }
}

const meta: Meta<StoryWrapperComponent> = {
  title: 'Atoms/CodeContent',
  component: StoryWrapperComponent,
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'Highlighted HTML content (must be sanitized)',
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
    content: highlightedTypeScript,
    theme: 'dark',
    wordWrap: false,
    isLoading: false,
  },
};

export const LightTheme: Story = {
  args: {
    content: highlightedTypeScriptLight,
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
    content: highlightedLongLine,
    theme: 'dark',
    wordWrap: false,
    isLoading: false,
  },
};

export const WithWordWrap: Story = {
  args: {
    content: highlightedLongLine,
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
    content: highlightedTypeScript,
    theme: 'dark',
    wordWrap: false,
    isLoading: true,
  },
};

export const LoadingLightTheme: Story = {
  args: {
    content: highlightedTypeScriptLight,
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
    content: highlightedTypeScript,
    theme: 'dark',
    wordWrap: false,
    isLoading: false,
    hoveredLine: 3,
  },
};

export const WithHoveredLineLightTheme: Story = {
  args: {
    content: highlightedTypeScriptLight,
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
    content: highlightedTypeScript,
    theme: 'dark',
    wordWrap: false,
    isLoading: false,
    highlightedLinesSet: new Set([3, 4, 5]),
  },
};

export const SingleHighlightedLine: Story = {
  args: {
    content: highlightedTypeScript,
    theme: 'dark',
    wordWrap: false,
    isLoading: false,
    highlightedLinesSet: new Set([4]),
    hoveredLine: 4,
  },
};

export const WithHighlightedLinesLight: Story = {
  args: {
    content: highlightedTypeScriptLight,
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
    content: highlightedTypeScript,
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
    content: highlightedManyLines,
    theme: 'dark',
    wordWrap: false,
    isLoading: false,
  },
};

export const ManyLinesWithHighlights: Story = {
  args: {
    content: highlightedManyLines,
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
    content: `<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"><span style="color:#79B8FF">console</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"Hello"</span><span style="color:#E1E4E8">);</span></span></code></pre>`,
    theme: 'dark',
    wordWrap: false,
    isLoading: false,
  },
};

export const EmptyContent: Story = {
  args: {
    content: `<pre class="shiki github-dark" style="background-color:#24292e;color:#e1e4e8" tabindex="0"><code><span class="line"></span></code></pre>`,
    theme: 'dark',
    wordWrap: false,
    isLoading: false,
  },
};
