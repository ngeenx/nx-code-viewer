import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { CodeViewerComponent } from './code-viewer.component';

const sampleTypescript = `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-example',
  template: '<h1>{{ title() }}</h1>',
  standalone: true,
})
export class ExampleComponent {
  readonly title = signal('Hello, World!');
}`;

const sampleJavaScript = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate first 10 fibonacci numbers
const numbers = Array.from({ length: 10 }, (_, i) => fibonacci(i));
console.log(numbers);`;

const samplePython = `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

# Example usage
result = quicksort([3, 6, 8, 10, 1, 2, 1])
print(result)`;

const sampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Example Page</title>
</head>
<body>
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>
  <main>
    <h1>Welcome</h1>
    <p>This is an example page.</p>
  </main>
</body>
</html>`;

const sampleCss = `.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}`;

const sampleJson = `{
  "name": "@ngeenx/nx-angular-code-viewer",
  "version": "1.0.0",
  "description": "Angular code viewer with syntax highlighting",
  "keywords": ["angular", "code-viewer", "syntax-highlighting"],
  "dependencies": {
    "shiki": "^1.0.0"
  },
  "peerDependencies": {
    "@angular/core": "^19.0.0"
  }
}`;

const sampleRust = `use std::collections::HashMap;

fn main() {
    let mut scores: HashMap<String, i32> = HashMap::new();

    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);

    for (key, value) in &scores {
        println!("{}: {}", key, value);
    }
}`;

const sampleBash = `#!/bin/bash

# Build and deploy script
set -e

echo "Starting build process..."

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build

echo "Build completed successfully!"`;

const longCode = Array.from(
  { length: 50 },
  (_, i) =>
    `console.log("Line ${i + 1}: This is a sample log message for testing scroll behavior");`
).join('\n');

const meta: Meta<CodeViewerComponent> = {
  title: 'Organisms/CodeViewer',
  component: CodeViewerComponent,
  tags: ['autodocs'],
  argTypes: {
    code: {
      control: 'text',
      description: 'Source code to display',
    },
    language: {
      control: 'select',
      options: [
        'typescript',
        'javascript',
        'python',
        'html',
        'css',
        'json',
        'rust',
        'bash',
        'plaintext',
      ],
      description: 'Programming language for syntax highlighting',
    },
    theme: {
      control: 'radio',
      options: ['dark', 'light'],
      description: 'Color theme',
    },
    title: {
      control: 'text',
      description: 'Optional title displayed in header',
    },
    fileExtension: {
      control: 'text',
      description: 'File extension for icon display',
    },
    showLineNumbers: {
      control: 'boolean',
      description: 'Whether to show line numbers',
    },
    showCopyButton: {
      control: 'boolean',
      description: 'Whether to show the copy button',
    },
    showHeader: {
      control: 'boolean',
      description: 'Whether to show the header section',
    },
    maxHeight: {
      control: 'text',
      description: 'Maximum height with scrolling',
    },
    wordWrap: {
      control: 'boolean',
      description: 'Enable word wrapping for long lines',
    },
    highlightedLines: {
      control: 'object',
      description: 'Pre-configured lines to highlight',
    },
    focusedLines: {
      control: 'object',
      description:
        'Lines to focus on (all other lines will be blurred). Hover to reveal blurred lines.',
    },
    collapsedLines: {
      control: 'object',
      description:
        'Line ranges to collapse. Format: [[start, end], ...]. Click the expand icon to reveal collapsed lines.',
    },
    borderStyle: {
      control: 'select',
      options: ['classic', 'grid-cross', 'corner-intersection', 'none'],
      description: 'Border style variant',
    },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<CodeViewerComponent>;

// ════════════════════════════════════════════════════════════════════════════
// Basic Examples
// ════════════════════════════════════════════════════════════════════════════

export const Default: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
  },
};

export const LightTheme: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'light',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const WithTitle: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    title: 'example.component.ts',
    fileExtension: '.ts',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Language Variants
// ════════════════════════════════════════════════════════════════════════════

export const TypeScript: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    title: 'example.component.ts',
    fileExtension: '.ts',
  },
};

export const JavaScript: Story = {
  args: {
    code: sampleJavaScript,
    language: 'javascript',
    theme: 'dark',
    title: 'fibonacci.js',
    fileExtension: '.js',
  },
};

export const Python: Story = {
  args: {
    code: samplePython,
    language: 'python',
    theme: 'dark',
    title: 'quicksort.py',
    fileExtension: '.py',
  },
};

export const HTML: Story = {
  args: {
    code: sampleHtml,
    language: 'html',
    theme: 'dark',
    title: 'index.html',
    fileExtension: '.html',
  },
};

export const CSS: Story = {
  args: {
    code: sampleCss,
    language: 'css',
    theme: 'dark',
    title: 'styles.css',
    fileExtension: '.css',
  },
};

export const JSON: Story = {
  args: {
    code: sampleJson,
    language: 'json',
    theme: 'dark',
    title: 'package.json',
    fileExtension: '.json',
  },
};

export const Rust: Story = {
  args: {
    code: sampleRust,
    language: 'rust',
    theme: 'dark',
    title: 'main.rs',
    fileExtension: '.rs',
  },
};

export const Bash: Story = {
  args: {
    code: sampleBash,
    language: 'bash',
    theme: 'dark',
    title: 'deploy.sh',
    fileExtension: '.sh',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Feature Variants
// ════════════════════════════════════════════════════════════════════════════

export const WithoutLineNumbers: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    showLineNumbers: false,
  },
};

export const WithoutCopyButton: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    showCopyButton: false,
  },
};

export const WithoutHeader: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    showHeader: false,
  },
};

export const MinimalView: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    showHeader: false,
    showLineNumbers: false,
    showCopyButton: false,
  },
};

export const WithWordWrap: Story = {
  args: {
    code: 'const veryLongLine = "This is a very long line that should wrap when word wrap is enabled. It contains a lot of text to demonstrate how the code viewer handles long lines with word wrapping enabled.";',
    language: 'javascript',
    theme: 'dark',
    wordWrap: true,
    title: 'long-line.js',
  },
};

export const WithMaxHeight: Story = {
  args: {
    code: longCode,
    language: 'javascript',
    theme: 'dark',
    maxHeight: '300px',
    title: 'scrollable.js',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Highlighted Lines
// ════════════════════════════════════════════════════════════════════════════

export const HighlightedSingleLine: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    highlightedLines: 3,
    title: 'highlighted-single.ts',
  },
};

export const HighlightedMultipleLines: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    highlightedLines: [1, 3, 5, 7],
    title: 'highlighted-multiple.ts',
  },
};

export const HighlightedLineRange: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    highlightedLines: [[3, 6]],
    title: 'highlighted-range.ts',
  },
};

export const HighlightedMixed: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    highlightedLines: [1, [4, 6], 8, [10, 11]],
    title: 'highlighted-mixed.ts',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Focused Lines (blurs unfocused lines, hover to reveal)
// ════════════════════════════════════════════════════════════════════════════

export const FocusedSingleLine: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    focusedLines: 3,
    title: 'focused-single.ts',
  },
};

export const FocusedMultipleLines: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    focusedLines: [1, 3, 5, 7],
    title: 'focused-multiple.ts',
  },
};

export const FocusedLineRange: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    focusedLines: [[3, 6]],
    title: 'focused-range.ts',
  },
};

export const FocusedMixed: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    focusedLines: [1, [4, 6], 8, [10, 11]],
    title: 'focused-mixed.ts',
  },
};

export const FocusedLightTheme: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'light',
    focusedLines: [[3, 6]],
    title: 'focused-light.ts',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const FocusedAndHighlighted: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    focusedLines: [[3, 11]],
    highlightedLines: [4, 5, 8],
    title: 'focused-highlighted.ts',
  },
};

export const FocusedAndHighlightedLight: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'light',
    focusedLines: [[3, 11]],
    highlightedLines: [4, 5, 8],
    title: 'focused-highlighted-light.ts',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Collapsed Lines (hide line ranges, click to expand)
// ════════════════════════════════════════════════════════════════════════════

export const CollapsedSingleRange: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    collapsedLines: [[4, 8]],
    title: 'collapsed-single-range.ts',
  },
};

export const CollapsedMultipleRanges: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    collapsedLines: [
      [2, 3],
      [6, 10],
    ],
    title: 'collapsed-multiple-ranges.ts',
  },
};

export const CollapsedLightTheme: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'light',
    collapsedLines: [[4, 8]],
    title: 'collapsed-light.ts',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const CollapsedWithHighlights: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    collapsedLines: [[5, 9]],
    highlightedLines: [3, 4, 11],
    title: 'collapsed-with-highlights.ts',
  },
};

export const CollapsedWithFocusedLines: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    collapsedLines: [[6, 10]],
    focusedLines: [[1, 5], 12, 13],
    title: 'collapsed-with-focused.ts',
  },
};

export const CollapsedLongFile: Story = {
  args: {
    code: longCode,
    language: 'javascript',
    theme: 'dark',
    collapsedLines: [
      [5, 15],
      [25, 35],
      [40, 45],
    ],
    maxHeight: '400px',
    title: 'collapsed-long-file.js',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Theme Comparisons
// ════════════════════════════════════════════════════════════════════════════

export const DarkThemeTypeScript: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    title: 'dark-theme.ts',
  },
};

export const LightThemeTypeScript: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'light',
    title: 'light-theme.ts',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkThemePython: Story = {
  args: {
    code: samplePython,
    language: 'python',
    theme: 'dark',
    title: 'dark-theme.py',
  },
};

export const LightThemePython: Story = {
  args: {
    code: samplePython,
    language: 'python',
    theme: 'light',
    title: 'light-theme.py',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Edge Cases
// ════════════════════════════════════════════════════════════════════════════

export const SingleLine: Story = {
  args: {
    code: 'console.log("Hello, World!");',
    language: 'javascript',
    theme: 'dark',
  },
};

export const EmptyCode: Story = {
  args: {
    code: '',
    language: 'plaintext',
    theme: 'dark',
  },
};

export const PlainText: Story = {
  args: {
    code: `This is plain text without any syntax highlighting.
It can contain multiple lines.
And special characters like <, >, &, "quotes", and 'apostrophes'.`,
    language: 'plaintext',
    theme: 'dark',
  },
};

export const CodeWithArray: Story = {
  args: {
    code: [
      'const a = 1;',
      'const b = 2;',
      'const sum = a + b;',
      'console.log(sum);',
    ],
    language: 'javascript',
    theme: 'dark',
    title: 'array-input.js',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Border Styles
// ════════════════════════════════════════════════════════════════════════════

export const BorderStyleClassic: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'classic',
    showHeader: false,
  },
};

export const BorderStyleGridCross: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'grid-cross',
    showHeader: false,
  },
  parameters: {
    layout: 'centered',
  },
};

export const BorderStyleCornerIntersection: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'corner-intersection',
    showHeader: false,
  },
  parameters: {
    layout: 'centered',
  },
};

export const BorderStyleNone: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'dark',
    borderStyle: 'none',
    showHeader: false,
  },
};

export const BorderStyleGridCrossLight: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'light',
    borderStyle: 'grid-cross',
    showHeader: false,
  },
  parameters: {
    backgrounds: { default: 'light' },
    layout: 'centered',
  },
};

export const BorderStyleCornerIntersectionLight: Story = {
  args: {
    code: sampleTypescript,
    language: 'typescript',
    theme: 'light',
    borderStyle: 'corner-intersection',
    showHeader: false,
  },
  parameters: {
    backgrounds: { default: 'light' },
    layout: 'centered',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Reference Links
// ════════════════════════════════════════════════════════════════════════════

const sampleCodeWithReferences = `import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-example',
  template: '<h1>{{ title() }}</h1>',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ExampleComponent {
  // TODO: Add more features here
  readonly title = signal('Hello, World!');
}`;

/**
 * External links to Angular documentation.
 * Uses capture groups to dynamically construct URLs.
 */
export const ReferenceLinksExternal: Story = {
  args: {
    code: sampleCodeWithReferences,
    language: 'typescript',
    theme: 'dark',
    title: 'external-links.ts',
    fileExtension: '.ts',
    references: [
      {
        textMatch: /@angular\/\w+/g,
        linkMatch: /@angular\/(\w+)/g,
        type: 'link',
        link: 'https://angular.dev/api/$1',
        target: '_blank',
      },
    ],
  },
};

/**
 * Info popovers that appear on hover.
 * Demonstrates @Component decorator info (spans multiple tokens).
 */
export const ReferenceLinksInfoPopover: Story = {
  args: {
    code: sampleCodeWithReferences,
    language: 'typescript',
    theme: 'dark',
    title: 'info-popover.ts',
    fileExtension: '.ts',
    references: [
      {
        textMatch: /@Component/g,
        type: 'info',
        content:
          'Decorator that marks a class as an Angular component and provides configuration metadata.',
      },
      {
        textMatch: /TODO:.*/g,
        type: 'info',
        content: 'This task needs to be completed before the next release.',
      },
      {
        textMatch: /signal/g,
        type: 'info',
        content:
          'A reactive primitive that holds a value and notifies consumers when that value changes.',
      },
    ],
  },
};

/**
 * Info popovers with light theme.
 */
export const ReferenceLinksInfoPopoverLight: Story = {
  args: {
    code: sampleCodeWithReferences,
    language: 'typescript',
    theme: 'light',
    title: 'info-popover-light.ts',
    fileExtension: '.ts',
    references: [
      {
        textMatch: /@Component/g,
        type: 'info',
        content:
          'Decorator that marks a class as an Angular component and provides configuration metadata.',
      },
      {
        textMatch: /TODO:.*/g,
        type: 'info',
        content: 'This task needs to be completed before the next release.',
      },
    ],
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

/**
 * Combined link + info: clickable links that also show info on hover.
 */
export const ReferenceLinksCombined: Story = {
  args: {
    code: sampleCodeWithReferences,
    language: 'typescript',
    theme: 'dark',
    title: 'combined-link-info.ts',
    fileExtension: '.ts',
    references: [
      {
        textMatch: /@angular\/core/g,
        type: ['link', 'info'] as const,
        link: 'https://angular.dev/api/core',
        target: '_blank',
        content:
          'Core Angular library - Component, signal, inject, and more fundamental APIs.',
      },
      {
        textMatch: /@angular\/common/g,
        type: ['link', 'info'] as const,
        link: 'https://angular.dev/api/common',
        target: '_blank',
        content: 'Common Angular directives like @if, @for, pipes, and utilities.',
      },
      {
        textMatch: /@angular\/router/g,
        type: ['link', 'info'] as const,
        link: 'https://angular.dev/api/router',
        target: '_blank',
        content: 'Angular Router for navigation, route guards, and lazy loading.',
      },
    ],
  },
};

/**
 * Multiple reference patterns with different types.
 */
export const ReferenceLinksMultiplePatterns: Story = {
  args: {
    code: sampleCodeWithReferences,
    language: 'typescript',
    theme: 'dark',
    title: 'multiple-patterns.ts',
    fileExtension: '.ts',
    references: [
      {
        textMatch: /@angular\/\w+/g,
        linkMatch: /@angular\/(\w+)/g,
        type: 'link',
        link: 'https://angular.dev/api/$1',
        target: '_blank',
      },
      {
        textMatch: /@Component/g,
        type: 'info',
        content: 'Angular Component decorator - defines a component class.',
      },
      {
        textMatch: /signal/g,
        type: 'info',
        content: 'Angular Signals - reactive state management primitive.',
      },
      {
        textMatch: /TODO:.*/g,
        type: 'info',
        content: 'Action item that needs attention.',
      },
    ],
  },
};

/**
 * References combined with focused lines.
 * Blurs unfocused lines while keeping references interactive.
 */
export const ReferenceLinksWithFocusedLines: Story = {
  args: {
    code: sampleCodeWithReferences,
    language: 'typescript',
    theme: 'dark',
    title: 'focused-with-refs.ts',
    fileExtension: '.ts',
    focusedLines: [[5, 10]],
    references: [
      {
        textMatch: /@Component/g,
        type: 'info',
        content: 'Angular Component decorator - the key part of this example.',
      },
      {
        textMatch: /selector|template|standalone|imports/g,
        type: 'info',
        content: 'Component metadata property.',
      },
    ],
  },
};

/**
 * References combined with highlighted lines.
 */
export const ReferenceLinksWithHighlightedLines: Story = {
  args: {
    code: sampleCodeWithReferences,
    language: 'typescript',
    theme: 'dark',
    title: 'highlighted-with-refs.ts',
    fileExtension: '.ts',
    highlightedLines: [1, 2, 3, 5],
    references: [
      {
        textMatch: /@angular\/\w+/g,
        linkMatch: /@angular\/(\w+)/g,
        type: ['link', 'info'] as const,
        link: 'https://angular.dev/api/$1',
        target: '_blank',
        content: 'Click to view Angular documentation.',
      },
      {
        textMatch: /@Component/g,
        type: 'info',
        content: 'Angular Component decorator.',
      },
    ],
  },
};

/**
 * References with custom CSS class.
 */
export const ReferenceLinksCustomStyle: Story = {
  args: {
    code: sampleCodeWithReferences,
    language: 'typescript',
    theme: 'dark',
    title: 'custom-style.ts',
    fileExtension: '.ts',
    references: [
      {
        textMatch: /TODO:.*/g,
        type: 'info',
        content: 'High priority task!',
        cssClass: 'todo-highlight',
      },
      {
        textMatch: /@angular\/\w+/g,
        type: 'link',
        linkMatch: /@angular\/(\w+)/g,
        link: 'https://angular.dev/api/$1',
        target: '_blank',
      },
    ],
  },
};
