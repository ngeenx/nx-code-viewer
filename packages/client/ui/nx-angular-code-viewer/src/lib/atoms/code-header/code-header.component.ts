import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import type { CodeViewerLanguage, CodeViewerTheme, CopyButtonState } from '../../types';
import { getLanguageDisplayName } from '../../utils';
import { CopyButtonComponent } from '../copy-button';

/**
 * CodeHeader Atom Component
 *
 * Displays header section for code blocks with title/language and optional copy button.
 *
 * @example
 * ```html
 * <ngn-code-header
 *   [language]="'typescript'"
 *   [title]="'Example'"
 *   [theme]="'dark'"
 *   [showCopyButton]="true"
 *   [copyState]="copyState()"
 *   (copyClick)="onCopy()"
 * />
 * ```
 */
@Component({
  selector: 'ngn-code-header',
  standalone: true,
  imports: [CopyButtonComponent],
  templateUrl: './code-header.component.html',
  styleUrl: './code-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeHeaderComponent {
  /**
   * Programming language of the code
   */
  readonly language = input<CodeViewerLanguage>('plaintext');

  /**
   * Optional title to display instead of language
   */
  readonly title = input<string>('');

  /**
   * Theme for styling
   */
  readonly theme = input<CodeViewerTheme>('dark');

  /**
   * Whether to show the copy button
   */
  readonly showCopyButton = input<boolean>(true);

  /**
   * Current state of the copy button
   */
  readonly copyState = input<CopyButtonState>('idle');

  /**
   * Emits when the copy button is clicked
   */
  readonly copyClick = input<() => void>(() => {});

  /**
   * Computed display text (title or language name)
   */
  protected readonly displayText = computed(() => {
    const titleValue = this.title();
    if (titleValue) {
      return titleValue;
    }
    return getLanguageDisplayName(this.language());
  });

  /**
   * Handles copy button click
   */
  protected onCopyClick(): void {
    this.copyClick()();
  }
}
