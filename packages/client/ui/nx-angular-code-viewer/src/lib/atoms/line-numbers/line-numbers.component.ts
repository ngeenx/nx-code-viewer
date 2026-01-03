import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import type {
  ActiveInsertWidget,
  CodeViewerTheme,
  CollapsedRangeState,
  LineRange,
} from '../../types';
import {
  generateLineNumbers,
  formatLineNumber,
  isLineInCollapsedRange,
} from '../../utils';

/**
 * LineNumbers Atom Component
 *
 * Displays line numbers for code blocks.
 * Automatically generates and formats line numbers based on total line count.
 *
 * @example
 * ```html
 * <nx-line-numbers
 *   [lineCount]="10"
 *   [theme]="'dark'"
 * />
 * ```
 */
@Component({
  selector: 'nx-line-numbers',
  standalone: true,
  imports: [],
  templateUrl: './line-numbers.component.html',
  styleUrl: './line-numbers.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineNumbersComponent {
  /**
   * Total number of lines to display
   */
  readonly lineCount = input.required<number>();

  /**
   * Theme for styling
   */
  readonly theme = input<CodeViewerTheme>('dark');

  /**
   * Currently hovered line (1-based, 0 means no line hovered)
   */
  readonly hoveredLine = input<number>(0);

  /**
   * Set of pre-configured highlighted line numbers
   */
  readonly highlightedLinesSet = input<Set<number>>(new Set());

  /**
   * Map of collapsed range states
   */
  readonly collapsedRangesState = input<Map<string, CollapsedRangeState>>(
    new Map()
  );

  /**
   * Emitted when a line is hovered
   */
  readonly lineHover = output<number>();

  /**
   * Emitted when a collapsed range indicator is clicked
   */
  readonly collapsedRangeToggle = output<LineRange>();

  /**
   * Currently active insert widget (if any)
   */
  readonly activeInsertWidget = input<ActiveInsertWidget | null>(null);

  /**
   * Height of the active insert widget in pixels
   */
  readonly insertWidgetHeight = input<number>(0);

  /**
   * Computed array of line numbers
   */
  protected readonly lineNumbers = computed(() => {
    return generateLineNumbers(this.lineCount());
  });

  /**
   * Formats a line number with consistent width
   * @param lineNumber - Line number to format
   * @returns Formatted line number string
   */
  protected formatLine(lineNumber: number): string {
    return formatLineNumber(lineNumber, this.lineCount());
  }

  /**
   * TrackBy function for ngFor optimization
   */
  protected trackByLineNumber(_: number, lineNumber: number): number {
    return lineNumber;
  }

  /**
   * Checks if a line is currently highlighted (by hover or pre-configured)
   */
  protected isHighlighted(lineNumber: number): boolean {
    return (
      this.hoveredLine() === lineNumber ||
      this.highlightedLinesSet().has(lineNumber)
    );
  }

  /**
   * Handles mouseenter on a line number
   */
  protected onMouseEnter(lineNumber: number): void {
    this.lineHover.emit(lineNumber);
  }

  /**
   * Gets collapse info for a line number
   */
  protected getLineCollapseInfo(lineNumber: number): {
    isCollapsed: boolean;
    isFirstLine: boolean;
    range: LineRange | null;
    hiddenCount: number;
  } {
    return isLineInCollapsedRange(lineNumber, this.collapsedRangesState());
  }

  /**
   * Handles click on expand toggle
   */
  protected onExpandToggle(range: LineRange): void {
    this.collapsedRangeToggle.emit(range);
  }

  /**
   * Checks if a line should be visible (not in a collapsed range, except first line)
   */
  protected isLineVisible(lineNumber: number): boolean {
    const collapseInfo = this.getLineCollapseInfo(lineNumber);
    return !collapseInfo.isCollapsed || collapseInfo.isFirstLine;
  }

  /**
   * Checks if an insert widget should appear after this line
   */
  protected hasInsertWidgetAfter(lineNumber: number): boolean {
    const widget = this.activeInsertWidget();
    return widget !== null && widget.lineNumber === lineNumber;
  }
}
