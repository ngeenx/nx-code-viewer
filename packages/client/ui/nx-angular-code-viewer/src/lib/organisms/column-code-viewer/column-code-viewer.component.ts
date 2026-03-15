import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  DEFAULT_COLUMN_CODE_VIEWER_CONFIG,
  type CodeViewerBorderStyle,
  type CodeViewerTheme,
  type ColumnCodeItem,
  type ShikiThemeName,
} from '@ngeenx/nx-code-viewer-utils';
import { CodeViewerComponent } from '../code-viewer';

/**
 * ColumnCodeViewer Organism Component
 *
 * Displays multiple code blocks side by side in a columnar layout.
 * Each column has its own code content, language, and configuration.
 * Useful for comparing code snippets, showing multi-file examples,
 * or displaying code in different languages simultaneously.
 *
 * @example
 * ```html
 * <nx-column-code-viewer
 *   [columns]="[
 *     { id: 'ts', code: tsCode, language: 'typescript', title: 'TypeScript' },
 *     { id: 'js', code: jsCode, language: 'javascript', title: 'JavaScript' }
 *   ]"
 *   [theme]="'dark'"
 *   [borderStyle]="'classic'"
 * />
 * ```
 */
@Component({
  selector: 'nx-column-code-viewer',
  imports: [CodeViewerComponent],
  templateUrl: './column-code-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'nx-column-code-viewer' },
})
export class ColumnCodeViewerComponent {
  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Array of column items to display side by side
   */
  readonly columns = input.required<readonly ColumnCodeItem[]>();

  /**
   * Color theme
   */
  readonly theme = input<CodeViewerTheme>(
    DEFAULT_COLUMN_CODE_VIEWER_CONFIG.theme
  );

  /**
   * Shiki theme name for syntax highlighting
   * When provided, overrides the default theme-based mapping (github-dark/github-light)
   */
  readonly shikiTheme = input<ShikiThemeName>();

  /**
   * Border style variant
   */
  readonly borderStyle = input<CodeViewerBorderStyle>(
    DEFAULT_COLUMN_CODE_VIEWER_CONFIG.borderStyle
  );

  /**
   * Whether to show individual column headers
   */
  readonly showColumnHeaders = input<boolean>(
    DEFAULT_COLUMN_CODE_VIEWER_CONFIG.showColumnHeaders
  );

  /**
   * Maximum height with scrolling (applied to each column)
   */
  readonly maxHeight = input<string>('');

  /**
   * Enable line hover highlighting
   */
  readonly enableLineHover = input<boolean>(true);

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Emits when code is copied from a column, with the column id
   */
  readonly codeCopied = output<string>();

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Handle code copied event from a column's code viewer
   */
  protected onCodeCopied(columnId: string): void {
    this.codeCopied.emit(columnId);
  }
}
