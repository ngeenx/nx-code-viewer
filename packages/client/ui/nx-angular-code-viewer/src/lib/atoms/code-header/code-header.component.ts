import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import type { CodeViewerLanguage, CodeViewerTheme } from '../../types';
import { getLanguageDisplayName, getFileIconUrl, getExtensionFromLanguage } from '../../utils';

/**
 * CodeHeader Atom Component
 *
 * Displays header section for code blocks with title/language and file icon.
 *
 * @example
 * ```html
 * <ngn-code-header
 *   [language]="'typescript'"
 *   [title]="'Example'"
 *   [theme]="'dark'"
 * />
 * ```
 */
@Component({
  selector: 'ngn-code-header',
  standalone: true,
  imports: [],
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
   * File extension for icon display (e.g., '.ts', '.js')
   */
  readonly fileExtension = input<string>('');

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
   * Computed icon URL from file extension or language
   */
  protected readonly iconUrl = computed(() => {
    const ext = this.fileExtension();
    if (ext) {
      return getFileIconUrl(ext);
    }

    // Fallback: guess extension from language
    const langExt = getExtensionFromLanguage(this.language());
    if (langExt) {
      return getFileIconUrl(langExt);
    }

    return null;
  });
}
