import type { Meta, StoryObj } from '@analogjs/storybook-angular';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DiffViewerComponent } from './diff-viewer.component';
import {
  LINE_WIDGET_CONTEXT,
  LINE_WIDGET_CLOSE,
  LineWidgetConfig,
} from '../../types';

// ════════════════════════════════════════════════════════════════════════════
// Sample Widget Components for Stories
// ════════════════════════════════════════════════════════════════════════════

/**
 * Approve/Reject widget for diff review
 */
@Component({
  selector: 'story-review-widget',
  standalone: true,
  template: `
    <div class="review-btns" [class]="context.theme">
      <button class="btn approve" (click)="approve()" title="Approve">✓</button>
      <button class="btn reject" (click)="reject()" title="Reject">✗</button>
    </div>
  `,
  styles: [`
    .review-btns {
      display: flex;
      gap: 4px;
    }
    .btn {
      width: 20px;
      height: 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }
    .review-btns.dark .approve {
      background: rgba(34, 197, 94, 0.2);
      color: #86efac;
    }
    .review-btns.dark .approve:hover {
      background: rgba(34, 197, 94, 0.4);
    }
    .review-btns.dark .reject {
      background: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
    }
    .review-btns.dark .reject:hover {
      background: rgba(239, 68, 68, 0.4);
    }
    .review-btns.light .approve {
      background: rgba(34, 197, 94, 0.1);
      color: #16a34a;
    }
    .review-btns.light .approve:hover {
      background: rgba(34, 197, 94, 0.2);
    }
    .review-btns.light .reject {
      background: rgba(239, 68, 68, 0.1);
      color: #dc2626;
    }
    .review-btns.light .reject:hover {
      background: rgba(239, 68, 68, 0.2);
    }
  `],
})
class ReviewWidgetComponent {
  protected readonly context = inject(LINE_WIDGET_CONTEXT);

  approve(): void {
    console.log(`Approved change on line ${this.context.lineNumber}`);
  }

  reject(): void {
    console.log(`Rejected change on line ${this.context.lineNumber}`);
  }
}

/**
 * Comment button for diff
 */
@Component({
  selector: 'story-diff-comment-btn',
  standalone: true,
  template: `
    <button class="comment-btn" [class]="context.theme" title="Add comment">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
  `,
  styles: [`
    .comment-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .comment-btn.dark {
      background: rgba(59, 130, 246, 0.2);
      color: #93c5fd;
    }
    .comment-btn.dark:hover {
      background: rgba(59, 130, 246, 0.4);
    }
    .comment-btn.light {
      background: rgba(59, 130, 246, 0.1);
      color: #2563eb;
    }
    .comment-btn.light:hover {
      background: rgba(59, 130, 246, 0.2);
    }
  `],
})
class DiffCommentButtonComponent {
  protected readonly context = inject(LINE_WIDGET_CONTEXT);
}

/**
 * Comment form for diff review
 */
@Component({
  selector: 'story-diff-comment-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="diff-comment-form" [class]="context.theme">
      <textarea
        class="input"
        [(ngModel)]="comment"
        placeholder="Add review comment..."
        rows="2"></textarea>
      <div class="actions">
        <button class="btn cancel" (click)="cancel()">Cancel</button>
        <button class="btn submit" (click)="submit()">Comment</button>
      </div>
    </div>
  `,
  styles: [`
    .diff-comment-form {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .diff-comment-form.dark { background: #1e293b; }
    .diff-comment-form.light { background: #f1f5f9; }
    .input {
      width: 97%;
      padding: 8px;
      border-radius: 4px;
      font-size: 13px;
      resize: vertical;
    }
    .diff-comment-form.dark .input {
      background: #334155;
      border: 1px solid #475569;
      color: #e2e8f0;
    }
    .diff-comment-form.light .input {
      background: white;
      border: 1px solid #cbd5e1;
      color: #1e293b;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .btn {
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
    }
    .cancel {
      background: transparent;
      border: 1px solid #64748b;
      color: #64748b;
    }
    .submit {
      background: #3b82f6;
      border: none;
      color: white;
    }
    .submit:hover { background: #2563eb; }
  `],
})
class DiffCommentFormComponent {
  protected readonly context = inject(LINE_WIDGET_CONTEXT);
  protected readonly close = inject(LINE_WIDGET_CLOSE);
  protected readonly comment = signal('');

  cancel(): void {
    this.close();
  }

  submit(): void {
    console.log(`Comment on line ${this.context.lineNumber}:`, this.comment());
    this.close();
  }
}

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
  template: '<h1>${'{{'}greeting()${'}}'}</h1>',
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

const oldPhp = `<?php

class UserController
{
    public function index()
    {
        $users = User::all();
        return $users;
    }

    public function show($id)
    {
        return User::find($id);
    }
}`;

const newPhp = `<?php

namespace App\\Controllers;

use App\\Models\\User;

class UserController
{
    public function index(): array
    {
        $users = User::all();
        return ['users' => $users, 'count' => count($users)];
    }

    public function show(int $id): ?User
    {
        $user = User::find($id);
        if (!$user) {
            throw new NotFoundException("User not found");
        }
        return $user;
    }

    public function store(array $data): User
    {
        return User::create($data);
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
+  template: '<h1>${'{{'}title()${'}}'}</h1>',
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
        'php',
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
    shikiTheme: {
      control: 'select',
      options: [
        undefined,
        'github-dark',
        'github-light',
        'dracula',
        'dracula-soft',
        'monokai',
        'nord',
        'one-dark-pro',
        'vitesse-dark',
        'vitesse-light',
        'slack-dark',
        'slack-ochin',
        'min-dark',
        'min-light',
        'rose-pine',
        'rose-pine-dawn',
        'rose-pine-moon',
        'catppuccin-frappe',
        'catppuccin-latte',
        'catppuccin-macchiato',
        'catppuccin-mocha',
        'night-owl',
        'material-theme',
        'material-theme-darker',
        'material-theme-ocean',
        'material-theme-palenight',
        'solarized-dark',
        'solarized-light',
      ],
      description:
        'Shiki theme for syntax highlighting. When undefined, uses default theme-based mapping (github-dark/github-light).',
    },
    collapsedLines: {
      control: 'object',
      description:
        'Global line index ranges to collapse. Format: [{ startIndex, endIndex }, ...]. Uses 0-based indices.',
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

export const PHPDiff: Story = {
  args: {
    oldCode: oldPhp,
    newCode: newPhp,
    language: 'php',
    theme: 'dark',
    viewMode: 'unified',
    oldFileName: 'UserController.php',
    newFileName: 'UserController.php',
    fileExtension: '.php',
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

// ════════════════════════════════════════════════════════════════════════════
// Collapsed Lines (hide diff line ranges, click to expand)
// ════════════════════════════════════════════════════════════════════════════

export const CollapsedLinesUnified: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
    collapsedLines: [{ startIndex: 3, endIndex: 7 }],
    oldFileName: 'hello.component.ts',
    newFileName: 'greeting.component.ts',
    fileExtension: '.ts',
  },
};

export const CollapsedLinesSplit: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'split',
    collapsedLines: [{ startIndex: 3, endIndex: 7 }],
    oldFileName: 'hello.component.ts',
    newFileName: 'greeting.component.ts',
    fileExtension: '.ts',
  },
};

export const CollapsedLinesMultipleRanges: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
    collapsedLines: [
      { startIndex: 1, endIndex: 3 },
      { startIndex: 6, endIndex: 9 },
    ],
    oldFileName: 'hello.component.ts',
    newFileName: 'greeting.component.ts',
    fileExtension: '.ts',
  },
};

export const CollapsedLinesLightTheme: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'light',
    viewMode: 'unified',
    collapsedLines: [{ startIndex: 3, endIndex: 7 }],
    oldFileName: 'hello.component.ts',
    newFileName: 'greeting.component.ts',
    fileExtension: '.ts',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const CollapsedLinesLargeDiff: Story = {
  args: {
    oldCode: oldLargeCode,
    newCode: newLargeCode,
    language: 'javascript',
    theme: 'dark',
    viewMode: 'unified',
    collapsedLines: [
      { startIndex: 5, endIndex: 15 },
      { startIndex: 25, endIndex: 35 },
    ],
    maxHeight: '400px',
    oldFileName: 'variables.js',
    newFileName: 'variables.js',
  },
};

export const CollapsedLinesSplitLargeDiff: Story = {
  args: {
    oldCode: oldLargeCode,
    newCode: newLargeCode,
    language: 'javascript',
    theme: 'dark',
    viewMode: 'split',
    collapsedLines: [
      { startIndex: 5, endIndex: 15 },
      { startIndex: 25, endIndex: 35 },
    ],
    maxHeight: '400px',
    oldFileName: 'variables.js',
    newFileName: 'variables.js',
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Line Widgets
// ════════════════════════════════════════════════════════════════════════════

/**
 * Review widget on hover - approve/reject buttons appear on line hover.
 */
export const LineWidgetReviewUnified: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
    oldFileName: 'hello.component.ts',
    newFileName: 'greeting.component.ts',
    lineWidgets: [
      {
        position: 'right',
        display: 'hover',
        lineComponent: ReviewWidgetComponent,
      },
    ] as LineWidgetConfig[],
  },
};

/**
 * Review widget in split view.
 */
export const LineWidgetReviewSplit: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'split',
    oldFileName: 'hello.component.ts',
    newFileName: 'greeting.component.ts',
    lineWidgets: [
      {
        position: 'right',
        display: 'hover',
        lineComponent: ReviewWidgetComponent,
      },
    ] as LineWidgetConfig[],
  },
};

/**
 * Comment widget with insert form - click to add comment between lines.
 */
export const LineWidgetCommentUnified: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
    oldFileName: 'hello.component.ts',
    newFileName: 'greeting.component.ts',
    lineWidgets: [
      {
        position: 'right',
        display: 'hover',
        lineComponent: DiffCommentButtonComponent,
        insertComponent: DiffCommentFormComponent,
      },
    ] as LineWidgetConfig[],
  },
};

/**
 * Comment widget in split view.
 */
export const LineWidgetCommentSplit: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'split',
    oldFileName: 'hello.component.ts',
    newFileName: 'greeting.component.ts',
    lineWidgets: [
      {
        position: 'right',
        display: 'hover',
        lineComponent: DiffCommentButtonComponent,
        insertComponent: DiffCommentFormComponent,
      },
    ] as LineWidgetConfig[],
  },
};

/**
 * Multiple widgets - review and comment on each line.
 */
export const LineWidgetMultiple: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    viewMode: 'unified',
    oldFileName: 'hello.component.ts',
    newFileName: 'greeting.component.ts',
    lineWidgets: [
      {
        position: 'left',
        display: 'hover',
        lineComponent: ReviewWidgetComponent,
      },
      {
        position: 'right',
        display: 'hover',
        lineComponent: DiffCommentButtonComponent,
        insertComponent: DiffCommentFormComponent,
      },
    ] as LineWidgetConfig[],
  },
};

/**
 * Line widgets with light theme.
 */
export const LineWidgetLightTheme: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'light',
    viewMode: 'unified',
    oldFileName: 'hello.component.ts',
    newFileName: 'greeting.component.ts',
    lineWidgets: [
      {
        position: 'right',
        display: 'hover',
        lineComponent: DiffCommentButtonComponent,
        insertComponent: DiffCommentFormComponent,
      },
    ] as LineWidgetConfig[],
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ════════════════════════════════════════════════════════════════════════════
// Custom Shiki Theme
// ════════════════════════════════════════════════════════════════════════════

/**
 * Example with custom Shiki theme.
 * Use the shikiTheme control to try different syntax highlighting themes.
 */
export const CustomShikiTheme: Story = {
  args: {
    oldCode: oldTypeScript,
    newCode: newTypeScript,
    language: 'typescript',
    theme: 'dark',
    shikiTheme: 'dracula',
    viewMode: 'unified',
    oldFileName: 'hello.component.ts',
    newFileName: 'greeting.component.ts',
    fileExtension: '.ts',
  },
};
