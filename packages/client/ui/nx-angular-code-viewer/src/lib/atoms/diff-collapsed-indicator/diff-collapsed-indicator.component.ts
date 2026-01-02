import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import type { CodeViewerTheme } from '../../types';
import type { DiffCollapsedRange } from '../../types/diff-viewer.types';

/**
 * DiffCollapsedIndicator Atom Component
 *
 * Displays a row indicating that diff lines are collapsed, with an expand toggle.
 * Styled to match the diff-line component layout.
 *
 * @example
 * ```html
 * <nx-diff-collapsed-indicator
 *   [theme]="'dark'"
 *   [range]="{ startIndex: 10, endIndex: 20 }"
 *   [hiddenCount]="10"
 *   [showLineNumbers]="true"
 *   (toggle)="onToggle()"
 * />
 * ```
 */
@Component({
  selector: 'nx-diff-collapsed-indicator',
  standalone: true,
  imports: [],
  templateUrl: './diff-collapsed-indicator.component.html',
  styleUrl: './diff-collapsed-indicator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiffCollapsedIndicatorComponent {
  /**
   * Theme for styling
   */
  readonly theme = input<CodeViewerTheme>('dark');

  /**
   * The collapsed range
   */
  readonly range = input.required<DiffCollapsedRange>();

  /**
   * Number of hidden lines
   */
  readonly hiddenCount = input.required<number>();

  /**
   * Whether to show line number placeholders
   */
  readonly showLineNumbers = input<boolean>(true);

  /**
   * Whether to show the prefix placeholder
   */
  readonly showPrefix = input<boolean>(true);

  /**
   * Whether the range is currently expanded
   */
  readonly isExpanded = input<boolean>(false);

  /**
   * Emitted when the indicator is clicked to toggle expansion
   */
  readonly toggle = output<void>();

  /**
   * Computed CSS classes for the indicator
   */
  protected readonly indicatorClasses = computed(() => {
    const themeValue = this.theme();
    return `diff-collapsed-indicator ${themeValue}`.trim();
  });

  /**
   * Computed display text
   */
  protected readonly displayText = computed(() => {
    const count = this.hiddenCount();
    return count === 1 ? '1 line' : `${count} lines`;
  });

  /**
   * Computed aria label for accessibility
   */
  protected readonly ariaLabel = computed(() => {
    const count = this.hiddenCount();
    const expanded = this.isExpanded();
    const lines = count === 1 ? 'line' : 'lines';
    return expanded
      ? `Collapse ${count} ${lines}`
      : `Expand ${count} hidden ${lines}`;
  });

  /**
   * Handles click on the indicator
   */
  protected onToggle(): void {
    this.toggle.emit();
  }

  /**
   * Handles keyboard activation
   */
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle.emit();
    }
  }
}
