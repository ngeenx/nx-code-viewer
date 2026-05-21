import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  DiffViewerComponent,
  type CodeViewerLanguage,
  type DiffViewMode,
} from '@ngeenx/nx-angular-code-viewer';
import type { BundledTheme } from 'shiki';
import {
  bindDemoOptions,
  readDemoOption,
  readInitialChromeTheme,
} from '../../utils/demo-options';

@Component({
  selector: 'app-code-diff-basic-demo',
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
        fileExtension="ts"
        oldFileName="user.ts"
        newFileName="user.ts" />
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
export default class CodeDiffBasicDemoComponent {
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

  protected readonly oldCode = `interface User {
  id: number;
  name: string;
}

function getUser(id: number): User {
  return { id, name: 'John' };
}`;

  protected readonly newCode = `interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

function getUser(id: number): User | null {
  if (id <= 0) return null;
  return {
    id,
    name: 'John',
    email: 'john@example.com',
    createdAt: new Date()
  };
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
