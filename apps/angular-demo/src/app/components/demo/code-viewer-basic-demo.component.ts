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
  selector: 'app-code-viewer-basic-demo',
  standalone: true,
  imports: [CodeViewerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nx-code-viewer
      [class]="codeViewerThemeClass()"
      [code]="sample"
      [language]="language"
      [theme]="theme()"
      [shikiTheme]="shikiTheme()" />
  `,
  // custom-theme.css already ships inside the iframe's bundled CSS via
  // the auto-detected globalStyles chain
  // (apps/angular-demo/src/styles.css -> @ngeenx/nx-demo-app-theme ->
  // custom-theme.css). Re-importing it here would break in the staged
  // adapter build because relative paths walk out of /tmp.
  styles: `
    nx-code-viewer {
      width: 500px;
    }
  `,
})
export default class CodeViewerBasicDemoComponent {
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

  protected readonly sample = `const greet = (name: string): string =>
  \`Hello, \${name}!\`;

console.log(greet('World'));`;

  protected readonly language: CodeViewerLanguage = 'typescript';

  constructor() {
    bindDemoOptions({
      onTheme: v => this.theme.set(v),
      onShikiTheme: v => this.shikiTheme.set(v),
      onCodeViewerTheme: v => this.codeViewerTheme.set(v),
    });
  }
}
