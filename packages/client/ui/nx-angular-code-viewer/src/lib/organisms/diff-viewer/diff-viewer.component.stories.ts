import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { DiffViewerComponent } from './diff-viewer.component';

// Helper constant for AdditionsOnly/DeletionsOnly stories
const sampleCode = `import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data: string[] = [];

  add(item: string): void {
    this.data.push(item);
  }

  getAll(): string[] {
    return [...this.data];
  }
}`;

// Sample code pairs for demonstrating diff functionality
const oldTypeScript = `import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  template: '<h1>Hello</h1>',
})
export class HelloComponent {
  name = 'World';
}`;

const newTypeScript = `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-greeting',
  template: '<h1>{{ greeting() }}</h1>',
  standalone: true,
})
export class GreetingComponent {
  readonly name = signal('World');
  readonly greeting = signal(\`Hello, \${this.name()}!\`);
}`;

const oldPython = `def greet(name):
    print("Hello, " + name)

greet("World")`;

const newPython = `def greet(name: str) -> None:
    """Greet a person by name."""
    print(f"Hello, {name}!")

def main() -> None:
    greet("World")
    greet("Angular")

if __name__ == "__main__":
    main()`;

const oldJavaScript = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

const newJavaScript = `function calculateTotal(items) {
  return items.reduce((total, item) => {
    const discount = item.discount || 0;
    const price = item.price * (1 - discount);
    return total + price;
  }, 0);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}`;

const oldCSS = `.button {
  background: blue;
  color: white;
  padding: 10px;
}`;

const newCSS = `.button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
}

.button:active {
  transform: translateY(0);
}`;

const oldJSON = `{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js"
  }
}`;

const newJSON = `{
  "name": "my-app",
  "version": "2.0.0",
  "description": "My awesome application",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}`;

// Sample unified diff strings
const unifiedDiff = `--- a/src/app.ts
+++ b/src/app.ts
@@ -1,5 +1,7 @@
 import { Component } from '@angular/core';
+import { signal } from '@angular/core';

 @Component({
   selector: 'app-root',
-  template: '<h1>Hello</h1>',
+  template: '<h1>{{ title() }}</h1>',
+  standalone: true,
 })`;

const multiHunkDiff = `--- a/src/utils.ts
+++ b/src/utils.ts
@@ -1,8 +1,10 @@
+// Utility functions for the application
+
 export function add(a: number, b: number): number {
   return a + b;
 }

-export function subtract(a: number, b: number): number {
-  return a - b;
+export function subtract(a: number, b: number): number {
+  return Math.abs(a - b);
 }
@@ -15,4 +17,8 @@
 export function divide(a: number, b: number): number {
   return a / b;
 }
+
+export function modulo(a: number, b: number): number {
+  return a % b;
+}`;

// Large diff for testing scroll
const oldLargeCode = Array.from(
  { length: 30 },
  (_, i) => `const variable${i + 1} = ${i + 1};`
).join('\n');

const newLargeCode = Array.from({ length: 40 }, (_, i) => {
  if (i < 10) return `const variable${i + 1} = ${i + 1};`;
  if (i < 20) return `// Modified line ${i + 1}`;
  if (i < 30) return `const newVariable${i + 1} = "${i + 1}";`;
  return `const addedVariable${i + 1} = ${(i + 1) * 10};`;
}).join('\n');

const meta: Meta<DiffViewerComponent> = {
  title: 'Organisms/DiffViewer',
  component: DiffViewerComponent,
  tags: ['autodocs'],
  argTypes: {
    diff: {
      control: 'text',
      description: 'Unified diff string (git diff format)',
    },
    oldCode: {
      control: 'text',
      description: 'Original code for computing diff',
    },
    newCode: {
      control: 'text',
      description: 'Modified code for computing diff',
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
        'plaintext',
      ],
      description: 'Programming language for syntax highlighting',
    },
    theme: {
      control: 'radio',
      options: ['dark', 'light'],
      description: 'Color theme',
    },
    viewMode: {
      control: 'radio',
      options: ['unified', 'split'],
      description: 'Display mode',
    },
    showLineNumbers: {
      control: 'boolean',
      description: 'Whether to show line numbers',
    },
    showHeader: {
      control: 'boolean',
      description: 'Whether to show the header section',
    },
    maxHeight: {
      control: 'text',
      description: 'Maximum height with scrolling',
    },
    oldFileName: {
      control: 'text',
      description: 'Old file name for header display',
    },
    newFileName: {
      control: 'text',
      description: 'New file name for header display',
    },
    fileExtension: {
      control: 'text',
      description: 'File extension for icon display',
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
type Story = StoryObj<DiffViewerComponent>;

// ════════════════════════════════════════════════════════════════════════════
// Basic Examples
// ════════════════════════════════════════════════════════════════════════════

export const Default: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
  },
};

export const LightTheme: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'light',
    viewMode: 'unified',
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
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
    oldFileName: 'hello.component.ts',
    newFileName: 'greeting.component.ts',
    fileExtension: '.ts',
  },
};

export const SplitView: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'split',
    oldFileName: 'hello.component.ts',
    newFileName: 'greeting.component.ts',
    fileExtension: '.ts',
  },
};

export const SplitViewLightTheme: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'light',
    viewMode: 'split',
    oldFileName: 'hello.component.ts',
    newFileName: 'greeting.component.ts',
    fileExtension: '.ts',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Using Unified Diff String
// ════════════════════════════════════════════════════════════════════════════

export const WithUnifiedDiffString: Story = {
  args: {
    diff: unifiedDiff,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
  },
};

export const MultiHunkDiff: Story = {
  args: {
    diff: multiHunkDiff,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
  },
};

export const MultiHunkSplitView: Story = {
  args: {
    diff: multiHunkDiff,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'split',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Language Variants
// ════════════════════════════════════════════════════════════════════════════

export const TypeScriptDiff: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
    oldFileName: 'before.ts',
    newFileName: 'after.ts',
    fileExtension: '.ts',
  },
};

export const JavaScriptDiff: Story = {
  args: {
    oldCode: oldJavaScript,
    newCode: newJavaScript,
    language: 'javascript',
    theme: 'dark',
    viewMode: 'unified',
    oldFileName: 'utils.js',
    newFileName: 'utils.js',
    fileExtension: '.js',
  },
};

export const PythonDiff: Story = {
  args: {
    oldCode: oldPython,
    newCode: newPython,
    language: 'python',
    theme: 'dark',
    viewMode: 'unified',
    oldFileName: 'greet.py',
    newFileName: 'greet.py',
    fileExtension: '.py',
  },
};

export const CSSDiff: Story = {
  args: {
    oldCode: oldCSS,
    newCode: newCSS,
    language: 'css',
    theme: 'dark',
    viewMode: 'unified',
    oldFileName: 'button.css',
    newFileName: 'button.css',
    fileExtension: '.css',
  },
};

export const JSONDiff: Story = {
  args: {
    oldCode: oldJSON,
    newCode: newJSON,
    language: 'json',
    theme: 'dark',
    viewMode: 'unified',
    oldFileName: 'package.json',
    newFileName: 'package.json',
    fileExtension: '.json',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Feature Variants
// ════════════════════════════════════════════════════════════════════════════

export const WithoutLineNumbers: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
    showLineNumbers: false,
  },
};

export const WithoutHeader: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
    showHeader: false,
  },
};

export const WithMaxHeight: Story = {
  args: {
    oldCode: oldLargeCode,
    newCode: newLargeCode,
    language: 'javascript',
    theme: 'dark',
    viewMode: 'unified',
    maxHeight: '300px',
    oldFileName: 'variables.js',
    newFileName: 'variables.js',
  },
};

export const SplitViewWithMaxHeight: Story = {
  args: {
    oldCode: oldLargeCode,
    newCode: newLargeCode,
    language: 'javascript',
    theme: 'dark',
    viewMode: 'split',
    maxHeight: '300px',
    oldFileName: 'variables.js',
    newFileName: 'variables.js',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// File Rename
// ════════════════════════════════════════════════════════════════════════════

export const FileRenamed: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
    oldFileName: 'hello.component.ts',
    newFileName: 'greeting.component.ts',
    fileExtension: '.ts',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Edge Cases
// ════════════════════════════════════════════════════════════════════════════

export const AdditionsOnly: Story = {
  args: {
    oldCode: '',
    newCode: sampleCode,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
    newFileName: 'new-file.ts',
  },
};

export const DeletionsOnly: Story = {
  args: {
    oldCode: sampleCode,
    newCode: '',
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
    oldFileName: 'deleted-file.ts',
  },
};

export const NoChanges: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: oldTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
    oldFileName: 'unchanged.ts',
    newFileName: 'unchanged.ts',
  },
};

export const PlainTextDiff: Story = {
  args: {
    oldCode: 'This is the old text.\nSecond line here.',
    newCode: 'This is the new text.\nSecond line here.\nThird line added.',
    language: 'plaintext',
    theme: 'dark',
    viewMode: 'unified',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Border Styles
// ════════════════════════════════════════════════════════════════════════════

export const BorderStyleClassic: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
    borderStyle: 'classic',
    showHeader: false,
  },
};

export const BorderStyleGridCross: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
    borderStyle: 'grid-cross',
    showHeader: false,
  },
  parameters: {
    layout: 'centered',
  },
};

export const BorderStyleCornerIntersection: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
    borderStyle: 'corner-intersection',
    showHeader: false,
  },
  parameters: {
    layout: 'centered',
  },
};

export const BorderStyleNone: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
    borderStyle: 'none',
    showHeader: false,
  },
};

export const BorderStyleGridCrossLight: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'light',
    viewMode: 'unified',
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
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'light',
    viewMode: 'unified',
    borderStyle: 'corner-intersection',
    showHeader: false,
  },
  parameters: {
    backgrounds: { default: 'light' },
    layout: 'centered',
  },
};

export const BorderStyleGridCrossSplitView: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'split',
    borderStyle: 'grid-cross',
    showHeader: false,
  },
  parameters: {
    layout: 'centered',
  },
};

export const BorderStyleCornerIntersectionSplitView: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'split',
    borderStyle: 'corner-intersection',
    showHeader: false,
  },
  parameters: {
    layout: 'centered',
  },
};
