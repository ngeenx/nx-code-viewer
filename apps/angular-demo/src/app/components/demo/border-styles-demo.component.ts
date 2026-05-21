import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  CodeViewerComponent,
  type CodeViewerBorderStyle,
  type CodeViewerLanguage,
} from '@ngeenx/nx-angular-code-viewer';
import { BundledTheme } from 'shiki';

/**
 * Self-contained `nx-code-viewer` showcase that renders the same
 * snippet under each available `borderStyle` value.
 *
 * Designed to be consumed standalone — by the docs-app live-demo
 * pipeline AND by tests / Storybook — so it carries no injected
 * services. The two appearance knobs (theme + Shiki theme) are
 * exposed as signal inputs with sensible defaults; consumers can
 * override either via attribute binding.
 *
 * @example
 *   <app-border-styles-demo />
 *   <app-border-styles-demo theme="dark" shikiTheme="github-dark" />
 */
@Component({
  selector: 'app-border-styles-demo',
  standalone: true,
  imports: [CodeViewerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="border-styles-demo" [attr.data-theme]="theme()">
      @for (style of borderStyles; track style) {
        <figure class="border-styles-demo__item">
          <figcaption class="border-styles-demo__caption">
            {{ style }}
          </figcaption>
          <nx-code-viewer
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
  // `@reference` gives this component-scoped sheet access to Tailwind v4
  // tokens (theme variables, utility names) without emitting the whole
  // utility set - that's how `@apply` works inside scoped CSS in v4.
  // The actual utilities ship once via the iframe's global stylesheet,
  // so referencing here adds zero bytes to the bundle. Skip the broken
  // relative `@import`s of custom-theme.css / nx-code-viewer-theme;
  // those land via the global pipeline.
  styles: [
    `
      @reference 'tailwindcss';

      .border-styles-demo {
        @apply m-20;

        display: grid;
        gap: 1.25rem;
      }
      .border-styles-demo__item {
        margin: 0;
      }
      .border-styles-demo__caption {
        font:
          600 0.75rem/1 ui-monospace,
          SFMono-Regular,
          Menlo,
          monospace;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: color-mix(in oklab, currentColor 65%, transparent);
        margin-bottom: 0.5rem;
      }
    `,
  ],
})
export default class BorderStylesDemoComponent {
  readonly theme = input<'light' | 'dark'>('light');
  readonly shikiTheme = input<BundledTheme>('github-light');

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
}
