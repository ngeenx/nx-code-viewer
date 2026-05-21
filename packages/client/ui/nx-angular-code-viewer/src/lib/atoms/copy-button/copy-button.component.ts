import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import type {
  CopyButtonState,
  CodeViewerTheme,
} from '@ngeenx/nx-code-viewer-utils';

/**
 * CopyButton Atom Component
 *
 * A minimal, reusable button for copy-to-clipboard functionality.
 * Displays different icons based on copy state (idle, copied, error).
 *
 * Icons are inlined from lucide.dev (Copy, Check, X) so the binding
 * does not require `lucide-angular` as a peer dependency for three
 * static glyphs.
 *
 * @example
 * ```html
 * <nx-copy-button
 *   [state]="copyState()"
 *   [theme]="'dark'"
 *   (copyClick)="onCopy()"
 * />
 * ```
 */
@Component({
  selector: 'nx-copy-button',
  templateUrl: './copy-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'nx-copy-button' },
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
   * Computed CSS classes based on theme and state
   */
  protected readonly buttonClasses = computed(() => {
    const currentTheme = this.theme();
    const currentState = this.state();

    // Theme class is always applied
    // State class overrides theme styling when in copied/error state
    const classes: string[] = [currentTheme];
    if (currentState !== 'idle') {
      classes.push(currentState);
    }

    return classes.join(' ');
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
