import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  CodeViewerComponent,
  type CodeViewerLanguage,
} from '@ngeenx/nx-angular-code-viewer';
import type { BundledTheme } from 'shiki';
import {
  bindDemoOptions,
  readDemoOption,
  readInitialChromeTheme,
} from '../../utils/demo-options';

@Component({
  selector: 'app-code-viewer-with-title-demo',
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
      title="greet.ts"
      fileExtension="ts" />
  `,
  styles: `
    nx-code-viewer {
      width: 500px;
    }
  `,
})
export default class CodeViewerWithTitleDemoComponent {
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

  protected readonly sample = `export const greet = (name: string): string =>
  \`Hello, \${name}!\`;
`;

  protected readonly language: CodeViewerLanguage = 'typescript';

  constructor() {
    bindDemoOptions({
      onTheme: v => this.theme.set(v),
      onShikiTheme: v => this.shikiTheme.set(v),
      onCodeViewerTheme: v => this.codeViewerTheme.set(v),
    });
  }
}
