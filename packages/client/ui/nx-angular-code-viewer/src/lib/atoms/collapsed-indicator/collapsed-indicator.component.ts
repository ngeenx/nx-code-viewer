import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import type { CodeViewerTheme, LineRange } from '../../types';

/**
 * CollapsedIndicator Atom Component
 *
 * Displays a row indicating that lines are collapsed, with an expand/collapse toggle.
 * Shows the number of hidden lines and provides click-to-expand functionality.
 *
 * @example
 * ```html
 * <nx-collapsed-indicator
 *   [theme]="'dark'"
 *   [range]="[10, 20]"
 *   [hiddenCount]="10"
 *   [isExpanded]="false"
 *   (toggle)="onToggle()"
 * />
 * ```
 */
@Component({
  selector: 'nx-collapsed-indicator',
  standalone: true,
  imports: [],
  templateUrl: './collapsed-indicator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'nx-collapsed-indicator' },
})
export class CollapsedIndicatorComponent {
  /**
   * Theme for styling
   */
  readonly theme = input<CodeViewerTheme>('dark');

  /**
   * The line range that is collapsed
   */
  readonly range = input.required<LineRange>();

  /**
   * Number of hidden lines (lines after the first one)
   */
  readonly hiddenCount = input.required<number>();

  /**
   * Whether the range is currently expanded
   */
  readonly isExpanded = input<boolean>(false);

  /**
   * Emitted when the indicator is clicked to toggle expansion
   */
  readonly toggle = output<void>();

  /**
   * Computed display text for the indicator
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
