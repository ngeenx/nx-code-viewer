import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  CodeViewerComponent,
  type CodeViewerBorderStyle,
  type CodeViewerLanguage,
} from '@ngeenx/nx-angular-code-viewer';
import type { BundledTheme } from 'shiki';
import {
  bindDemoOptions,
  readDemoOption,
  readInitialChromeTheme,
} from '../../utils/demo-options';

/**
 * Self-contained `nx-code-viewer` showcase that renders the same
 * snippet under each available `borderStyle` value. Mounts standalone
 * inside the docs-app live-demo iframe and follows the chrome's
 * dark/light + sidebar selects via the shared `bindDemoOptions`
 * helper.
 *
 * @example
 *   <app-border-styles-demo />
 */
@Component({
  selector: 'app-border-styles-demo',
  standalone: true,
  imports: [CodeViewerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="border-styles-demo" [attr.data-theme]="theme()">
      @for (style of borderStyles; track style) {
        <figure class="item">
          <figcaption class="caption">{{ style }}</figcaption>

          <nx-code-viewer
            [class]="codeViewerThemeClass()"
            [code]="sample"
            [language]="language"
            [theme]="theme()"
            [shikiTheme]="shikiTheme()"
            [borderStyle]="style"
            [showHeader]="false"
            [showLineNumbers]="false" />
        </figure>
      }
    </div>
  `,
  styles: [
    `
      @reference 'tailwindcss';

      .border-styles-demo {
        @apply m-20 grid gap-5;

        .item {
          @apply m-0;
        }

        .caption {
          @apply mb-8 font-mono text-base text-center font-semibold uppercase
            leading-none tracking-[0.04em] underline decoration-1;

          color: color-mix(in oklab, currentColor 65%, transparent);
        }
      }
    `,
  ],
})
export default class BorderStylesDemoComponent {
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

  protected readonly borderStyles: CodeViewerBorderStyle[] = [
    'classic',
    'grid-cross',
    'corner-intersection',
    'none',
  ];

  protected readonly sample = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

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
