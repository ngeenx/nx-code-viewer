import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  CodeViewerComponent,
  type CodeViewerLanguage,
  type ReferenceConfig,
} from '@ngeenx/nx-angular-code-viewer';
import type { BundledTheme } from 'shiki';
import {
  bindDemoOptions,
  readDemoOption,
  readInitialChromeTheme,
} from '../../utils/demo-options';
import { TodoInfoComponent } from '../todo-info.component';

@Component({
  selector: 'app-code-viewer-reference-links-demo',
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
      [references]="references"
      title="reference-links.ts"
      fileExtension="ts" />
  `,
  styles: `
    nx-code-viewer {
      width: 600px;
    }
  `,
})
export default class CodeViewerReferenceLinksDemoComponent {
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

  protected readonly sample = `import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-example',
  template: '<h1>{{ title() }}</h1>',
  imports: [CommonModule, RouterModule],
})
export class ExampleComponent {
  // TODO: Add more features here
  readonly title = signal('Hello, World!');
}`;

  protected readonly references: ReferenceConfig[] = [
    {
      textMatch: /@angular\/core/g,
      type: ['link', 'info'] as const,
      link: 'https://angular.dev/api#angular_core',
      target: '_blank',
      content: 'Core Angular library - Component, signal, and more',
    },
    {
      textMatch: /@angular\/common/g,
      type: ['link', 'info'] as const,
      link: 'https://angular.dev/api#angular_common',
      target: '_blank',
      content: 'Common Angular directives like @if, @for etc',
    },
    {
      textMatch: /@angular\/router/g,
      type: ['link', 'info'] as const,
      link: 'https://angular.dev/api#angular_router',
      target: '_blank',
      content: 'Angular Router for navigation and routing',
    },
    {
      textMatch: /TODO:.*/g,
      type: 'info',
      content: TodoInfoComponent,
    },
    {
      textMatch: /@Component/g,
      type: 'info',
      content:
        'Decorator that marks a class as an Angular component and provides configuration metadata.',
    },
    {
      textMatch: /signal\(/g,
      type: 'info',
      content: 'Creates a reactive signal that can be read and updated',
    },
  ];

  constructor() {
    bindDemoOptions({
      onTheme: v => this.theme.set(v),
      onShikiTheme: v => this.shikiTheme.set(v),
      onCodeViewerTheme: v => this.codeViewerTheme.set(v),
    });
  }
}
