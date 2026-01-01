import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import type { CodeViewerTheme } from '../../types';
import { generateLineNumbers, formatLineNumber } from '../../utils';

/**
 * LineNumbers Atom Component
 *
 * Displays line numbers for code blocks.
 * Automatically generates and formats line numbers based on total line count.
 *
 * @example
 * ```html
 * <ngn-line-numbers
 *   [lineCount]="10"
 *   [theme]="'dark'"
 * />
 * ```
 */
@Component({
  selector: 'ngn-line-numbers',
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
   * Emitted when a line is hovered
   */
  readonly lineHover = output<number>();

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
   * Checks if a line is currently highlighted
   */
  protected isHighlighted(lineNumber: number): boolean {
    return this.hoveredLine() === lineNumber;
  }

  /**
   * Handles mouseenter on a line number
   */
  protected onMouseEnter(lineNumber: number): void {
    this.lineHover.emit(lineNumber);
  }
}
