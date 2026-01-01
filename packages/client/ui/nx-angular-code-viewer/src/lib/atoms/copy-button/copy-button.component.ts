import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { LucideAngularModule, Copy, Check, X } from 'lucide-angular';
import type { CopyButtonState, CodeViewerTheme } from '../../types';
import { THEME_CSS_CLASSES } from '../../types';

/**
 * CopyButton Atom Component
 *
 * A minimal, reusable button for copy-to-clipboard functionality.
 * Displays different icons based on copy state (idle, copied, error).
 *
 * @example
 * ```html
 * <ngn-copy-button
 *   [state]="copyState()"
 *   [theme]="'dark'"
 *   (copyClick)="onCopy()"
 * />
 * ```
 */
@Component({
  selector: 'ngn-copy-button',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './copy-button.component.html',
  styleUrl: './copy-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyButtonComponent {
  /**
   * Current state of the copy button
   */
  readonly state = input<CopyButtonState>('idle');

  /**
   * Theme for styling
   */
  readonly theme = input<CodeViewerTheme>('dark');

  /**
   * Whether the button is disabled
   */
  readonly disabled = input<boolean>(false);

  /**
   * Emits when the copy button is clicked
   */
  readonly copyClick = output<void>();

  /**
   * Icon references for lucide-angular
   */
  protected readonly icons = {
    copy: Copy,
    check: Check,
    error: X,
  } as const;

  /**
   * Computed icon based on current state
   */
  protected readonly currentIcon = computed(() => {
    const currentState = this.state();
    switch (currentState) {
      case 'copied':
        return this.icons.check;
      case 'error':
        return this.icons.error;
      default:
        return this.icons.copy;
    }
  });

  /**
   * Computed CSS classes based on theme and state
   */
  protected readonly buttonClasses = computed(() => {
    const currentTheme = this.theme();
    const currentState = this.state();
    const themeClasses = THEME_CSS_CLASSES[currentTheme];

    const baseClasses = 'p-1.5 rounded transition-colors duration-200';
    const stateClasses = currentState === 'copied'
      ? 'text-green-500'
      : currentState === 'error'
        ? 'text-red-500'
        : themeClasses.copyButton;

    return `${baseClasses} ${stateClasses}`;
  });

  /**
   * Computed aria-label based on state
   */
  protected readonly ariaLabel = computed(() => {
    const currentState = this.state();
    switch (currentState) {
      case 'copied':
        return 'Copied to clipboard';
      case 'error':
        return 'Failed to copy';
      default:
        return 'Copy to clipboard';
    }
  });

  /**
   * Handles button click
   */
  protected onClick(): void {
    if (!this.disabled()) {
      this.copyClick.emit();
    }
  }
}
