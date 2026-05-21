import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  DiffViewerComponent,
  type CodeViewerLanguage,
  type DiffCollapsedLinesInput,
  type DiffViewMode,
} from '@ngeenx/nx-angular-code-viewer';
import type { BundledTheme } from 'shiki';
import {
  bindDemoOptions,
  readDemoOption,
  readInitialChromeTheme,
} from '../../utils/demo-options';

@Component({
  selector: 'app-code-diff-collapsed-demo',
  standalone: true,
  imports: [DiffViewerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrapper">
      <button class="toggle" type="button" (click)="toggleViewMode()">
        Switch to {{ viewMode() === 'unified' ? 'Split' : 'Unified' }} View
      </button>
      <nx-diff-viewer
        [class]="codeViewerThemeClass()"
        [oldCode]="oldCode"
        [newCode]="newCode"
        [language]="language"
        [theme]="theme()"
        [shikiTheme]="shikiTheme()"
        [viewMode]="viewMode()"
        [showLineNumbers]="true"
        [showHeader]="true"
        [collapsedLines]="collapsedLines"
        fileExtension="ts"
        oldFileName="user.component.ts"
        newFileName="user.component.ts" />
    </div>
  `,
  styles: `
    .wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 720px;
    }
    .toggle {
      align-self: flex-start;
      padding: 0.4rem 0.8rem;
      border: 1px solid currentColor;
      border-radius: 6px;
      background: transparent;
      color: inherit;
      cursor: pointer;
      font: inherit;
      opacity: 0.85;
    }
    .toggle:hover { opacity: 1; }
  `,
})
export default class CodeDiffCollapsedDemoComponent {
  protected readonly theme = signal<'light' | 'dark'>(readInitialChromeTheme());
  protected readonly shikiTheme = signal<BundledTheme>(
    readDemoOption('shikiTheme', 'github-light')
  );
  protected readonly codeViewerTheme = signal<string>(
    readDemoOption('codeViewerTheme', 'default')
  );
  protected readonly codeViewerThemeClass = computed(() => {
    const t = this.codeViewerTheme();
    return t === 'default' ? '' : `theme-${t}`;
  });

  protected readonly viewMode = signal<DiffViewMode>('unified');
  protected readonly language: CodeViewerLanguage = 'typescript';
  protected readonly collapsedLines: DiffCollapsedLinesInput = [
    { startIndex: 2, endIndex: 5 },
    { startIndex: 10, endIndex: 13 },
  ];

  protected readonly oldCode = `import { Component } from '@angular/core';

/**
 * UserComponent displays user information.
 * This is a multi-line comment block.
 */
@Component({
  selector: 'app-user',
  template: '<div>{{ name }}</div>',
})
export class UserComponent {
  name = 'John Doe';
  email = 'john@example.com';
}`;

  protected readonly newCode = `import { Component, signal } from '@angular/core';

/**
 * UserComponent displays user information.
 * This is a multi-line comment block.
 * Updated with signals support.
 */
@Component({
  selector: 'app-user',
  template: '<div>{{ name() }}</div>',
})
export class UserComponent {
  readonly name = signal('John Doe');
  readonly email = signal('john@example.com');
  readonly isActive = signal(true);
}`;

  protected toggleViewMode(): void {
    this.viewMode.update(v => (v === 'unified' ? 'split' : 'unified'));
  }

  constructor() {
    bindDemoOptions({
      onTheme: v => this.theme.set(v),
      onShikiTheme: v => this.shikiTheme.set(v),
      onCodeViewerTheme: v => this.codeViewerTheme.set(v),
    });
  }
}
