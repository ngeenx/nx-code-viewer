import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import type { SafeHtml } from '@angular/platform-browser';
import type { CodeViewerTheme } from '../../types';

/**
 * CodeContent Atom Component
 *
 * Displays syntax-highlighted code content.
 * Accepts SafeHtml for pre-sanitized highlighted content.
 *
 * @example
 * ```html
 * <ngn-code-content
 *   [content]="highlightedHtml()"
 *   [theme]="'dark'"
 *   [wordWrap]="false"
 * />
 * ```
 */
@Component({
  selector: 'ngn-code-content',
  standalone: true,
  imports: [],
  templateUrl: './code-content.component.html',
  styleUrl: './code-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeContentComponent {
  /**
   * Highlighted HTML content (must be sanitized)
   */
  readonly content = input.required<SafeHtml | null>();

  /**
   * Theme for styling
   */
  readonly theme = input<CodeViewerTheme>('dark');

  /**
   * Whether to wrap long lines
   */
  readonly wordWrap = input<boolean>(false);

  /**
   * Whether content is loading
   */
  readonly isLoading = input<boolean>(false);

  /**
   * Computed CSS classes for the code container
   */
  protected readonly containerClasses = computed(() => {
    const currentTheme = this.theme();
    const shouldWrap = this.wordWrap();

    return `${currentTheme} ${shouldWrap ? 'wrap' : 'nowrap'}`;
  });
}
