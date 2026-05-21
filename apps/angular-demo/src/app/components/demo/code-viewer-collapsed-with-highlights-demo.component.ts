import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  CodeViewerComponent,
  type CodeViewerLanguage,
  type CollapsedLinesInput,
  type HighlightedLinesInput,
} from '@ngeenx/nx-angular-code-viewer';
import type { BundledTheme } from 'shiki';
import {
  bindDemoOptions,
  readDemoOption,
  readInitialChromeTheme,
} from '../../utils/demo-options';

@Component({
  selector: 'app-code-viewer-collapsed-with-highlights-demo',
  standalone: true,
  imports: [CodeViewerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nx-code-viewer
      [class]="codeViewerThemeClass()"
      [code]="sample"
      [language]="language"
      [theme]="theme()"
      [shikiTheme]="shikiTheme()"
      [collapsedLines]="collapsedLines"
      [highlightedLines]="highlightedLines"
      title="Collapsed + Highlights"
      fileExtension="ts" />
  `,
  styles: `
    nx-code-viewer {
      width: 600px;
    }
  `,
})
export default class CodeViewerCollapsedWithHighlightsDemoComponent {
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

  protected readonly language: CodeViewerLanguage = 'typescript';
  protected readonly collapsedLines: CollapsedLinesInput = [[4, 8]];
  protected readonly highlightedLines: HighlightedLinesInput = [10, 11, 22, 23];

  protected readonly sample = `import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ExampleComponent demonstrates the collapsed lines feature.
 * This comment block is initially collapsed.
 * Click the expand icon to reveal it.
 */
@Component({
  selector: 'app-example',
  template: '<h1>{{ title() }}</h1>',
  imports: [CommonModule],
})
export class ExampleComponent {
  readonly title = signal('Hello, World!');
  readonly count = signal(0);

  increment(): void {
    this.count.update(n => n + 1);
  }

  decrement(): void {
    this.count.update(n => n - 1);
  }
}`;

  constructor() {
    bindDemoOptions({
      onTheme: v => this.theme.set(v),
      onShikiTheme: v => this.shikiTheme.set(v),
      onCodeViewerTheme: v => this.codeViewerTheme.set(v),
    });
  }
}
