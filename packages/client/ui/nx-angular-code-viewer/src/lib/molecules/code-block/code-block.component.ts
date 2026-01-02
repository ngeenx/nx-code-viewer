import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import type { SafeHtml } from '@angular/platform-browser';
import type {
  CodeViewerTheme,
  CollapsedRangeState,
  CopyButtonState,
  LineRange,
  ProcessedReference,
  ReferenceHoverEvent,
} from '../../types';
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
 * <nx-code-block
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
  selector: 'nx-code-block',
  standalone: true,
  imports: [
    NgStyle,
    LineNumbersComponent,
    CodeContentComponent,
    CopyButtonComponent,
  ],
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
   * Set of pre-configured highlighted line numbers
   */
  readonly highlightedLinesSet = input<Set<number>>(new Set());

  /**
   * Set of focused line numbers (lines NOT in this set will be blurred)
   */
  readonly focusedLinesSet = input<Set<number>>(new Set());

  /**
   * Map of processed reference IDs to their data
   */
  readonly processedReferences = input<Map<string, ProcessedReference>>(
    new Map()
  );

  /**
   * Map of collapsed range states
   */
  readonly collapsedRangesState = input<Map<string, CollapsedRangeState>>(
    new Map()
  );

  /**
   * Emitted when a reference is clicked
   */
  readonly referenceClick = output<ProcessedReference>();

  /**
   * Emitted when a reference is hovered
   */
  readonly referenceHover = output<ReferenceHoverEvent>();

  /**
   * Emitted when a collapsed range indicator is clicked
   */
  readonly collapsedRangeToggle = output<LineRange>();

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

  /**
   * Handler for reference click events
   */
  protected onReferenceClick(reference: ProcessedReference): void {
    this.referenceClick.emit(reference);
  }

  /**
   * Handler for reference hover events
   */
  protected onReferenceHover(event: ReferenceHoverEvent): void {
    this.referenceHover.emit(event);
  }

  /**
   * Handler for collapsed range toggle events
   */
  protected onCollapsedRangeToggle(range: LineRange): void {
    this.collapsedRangeToggle.emit(range);
  }
}
