import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import type { SafeHtml } from '@angular/platform-browser';
import type { CodeViewerTheme } from '../../types';
import { LineNumbersComponent } from '../../atoms/line-numbers';
import { CodeContentComponent } from '../../atoms/code-content';

/**
 * CodeBlock Molecule Component
 *
 * Combines line numbers and code content atoms into a cohesive code block.
 * Handles layout and scrolling for the code display area.
 *
 * @example
 * ```html
 * <ngn-code-block
 *   [content]="highlightedHtml()"
 *   [lineCount]="10"
 *   [theme]="'dark'"
 *   [showLineNumbers]="true"
 *   [wordWrap]="false"
 *   [maxHeight]="'400px'"
 * />
 * ```
 */
@Component({
  selector: 'ngn-code-block',
  standalone: true,
  imports: [NgStyle, LineNumbersComponent, CodeContentComponent],
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlockComponent {
  /**
   * Highlighted HTML content
   */
  readonly content = input.required<SafeHtml | null>();

  /**
   * Number of lines in the code
   */
  readonly lineCount = input.required<number>();

  /**
   * Theme for styling
   */
  readonly theme = input<CodeViewerTheme>('dark');

  /**
   * Whether to show line numbers
   */
  readonly showLineNumbers = input<boolean>(true);

  /**
   * Whether to wrap long lines
   */
  readonly wordWrap = input<boolean>(false);

  /**
   * Maximum height with scroll
   */
  readonly maxHeight = input<string>('');

  /**
   * Whether content is loading
   */
  readonly isLoading = input<boolean>(false);

  /**
   * Computed container styles for max height
   */
  protected readonly containerStyle = computed(() => {
    const height = this.maxHeight();
    return height ? { 'max-height': height } : {};
  });

  /**
   * Computed CSS classes for the container
   */
  protected readonly containerClasses = computed(() => {
    const height = this.maxHeight();
    return height ? 'overflow-auto' : '';
  });
}
