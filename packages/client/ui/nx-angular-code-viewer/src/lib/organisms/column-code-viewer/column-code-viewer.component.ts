import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  DEFAULT_COLUMN_CODE_VIEWER_CONFIG,
  isColumnCodeItem,
  isColumnDiffItem,
  type CodeViewerBorderStyle,
  type CodeViewerTheme,
  type ColumnItem,
  type ShikiThemeName,
} from '@ngeenx/nx-code-viewer-utils';
import { CodeViewerComponent } from '../code-viewer';
import { DiffViewerComponent } from '../diff-viewer';

/**
 * ColumnCodeViewer Organism Component
 *
 * Displays multiple code blocks and/or diff viewers side by side in a columnar layout.
 * Each column has its own content, language, and configuration.
 * Useful for comparing code snippets, showing multi-file examples,
 * or displaying code in different languages simultaneously.
 *
 * @example
 * ```html
 * <nx-column-code-viewer
 *   [columns]="[
 *     { id: 'ts', type: 'code', code: tsCode, language: 'typescript', title: 'TypeScript' },
 *     { id: 'diff', type: 'diff', oldCode: oldCode, newCode: newCode, language: 'typescript', title: 'Changes' }
 *   ]"
 *   [theme]="'dark'"
 *   [borderStyle]="'classic'"
 * />
 * ```
 */
@Component({
  selector: 'nx-column-code-viewer',
  imports: [CodeViewerComponent, DiffViewerComponent],
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
  readonly columns = input.required<readonly ColumnItem[]>();

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
  // TYPE GUARDS
  // ═══════════════════════════════════════════════════════════════════════════

  protected readonly isCodeColumn = isColumnCodeItem;
  protected readonly isDiffColumn = isColumnDiffItem;

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
