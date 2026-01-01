import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import type { SafeHtml } from '@angular/platform-browser';
import type { CodeViewerTheme, CopyButtonState } from '../../types';
import { LineNumbersComponent } from '../../atoms/line-numbers';
import { CodeContentComponent } from '../../atoms/code-content';
import { CopyButtonComponent } from '../../atoms/copy-button';

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
  imports: [NgStyle, LineNumbersComponent, CodeContentComponent, CopyButtonComponent],
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
   * Whether to show the copy button
   */
  readonly showCopyButton = input<boolean>(true);

  /**
   * Current state of the copy button
   */
  readonly copyState = input<CopyButtonState>('idle');

  /**
   * Copy button click handler
   */
  readonly copyClick = input<() => void>(() => {});

  /**
   * Currently hovered line index (1-based, 0 means no line hovered)
   */
  protected readonly hoveredLine = signal<number>(0);

  /**
   * Computed container styles for max height
   */
  protected readonly containerStyle = computed(() => {
    const height = this.maxHeight();
    return height ? { 'max-height': height } : {};
  });

  /**
   * Whether component has max height set (for conditional scrolling)
   */
  protected readonly hasMaxHeight = computed(() => !!this.maxHeight());

  /**
   * Handler for line hover events
   */
  protected onLineHover(lineNumber: number): void {
    this.hoveredLine.set(lineNumber);
  }

  /**
   * Handler for copy button click
   */
  protected onCopyClick(): void {
    this.copyClick()();
  }
}
