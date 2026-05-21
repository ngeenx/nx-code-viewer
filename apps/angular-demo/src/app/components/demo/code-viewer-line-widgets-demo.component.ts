import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  CodeViewerComponent,
  type CodeViewerLanguage,
  type LineWidgetClickEvent,
  type LineWidgetsInput,
} from '@ngeenx/nx-angular-code-viewer';
import type { BundledTheme } from 'shiki';
import {
  bindDemoOptions,
  readDemoOption,
  readInitialChromeTheme,
} from '../../utils/demo-options';
import { BookmarkWidgetComponent } from '../bookmark-widget.component';
import { CommentWidgetComponent } from '../comment-widget.component';
import { CommentFormComponent } from '../comment-form.component';

@Component({
  selector: 'app-code-viewer-line-widgets-demo',
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
      [lineWidgets]="lineWidgets"
      (lineWidgetClick)="onLineWidgetClick($event)"
      title="line-widgets.ts"
      fileExtension="ts" />
  `,
  styles: `
    nx-code-viewer {
      width: 600px;
    }
  `,
})
export default class CodeViewerLineWidgetsDemoComponent {
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

  protected readonly lineWidgets: LineWidgetsInput = [
    {
      position: 'left',
      display: 'hover',
      lineComponent: BookmarkWidgetComponent,
    },
    {
      position: 'right',
      display: 'hover',
      lineComponent: CommentWidgetComponent,
      insertComponent: CommentFormComponent,
    },
  ];

  protected readonly sample = `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <div class="counter">
      <h1>Count: {{ count() }}</h1>
      <button (click)="increment()">+</button>
      <button (click)="decrement()">-</button>
    </div>
  \`,
})
export class CounterComponent {
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

  protected onLineWidgetClick(event: LineWidgetClickEvent): void {
    console.log('Line widget clicked:', event);
  }
}
