import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import type {
  CodeViewerTheme,
  DiffHunk,
  DiffViewMode,
  SplitViewLine,
} from '../../types';
import { toSplitViewLines } from '../../utils';
import { DiffLineComponent } from '../../atoms/diff-line';

/**
 * DiffBlock Molecule Component
 *
 * Renders diff hunks in either unified or split view mode.
 *
 * @example
 * ```html
 * <ngn-diff-block
 *   [hunks]="parsedDiff.hunks"
 *   [theme]="'dark'"
 *   [viewMode]="'unified'"
 *   [showLineNumbers]="true"
 * />
 * ```
 */
@Component({
  selector: 'ngn-diff-block',
  standalone: true,
  imports: [NgStyle, DiffLineComponent],
  templateUrl: './diff-block.component.html',
  styleUrl: './diff-block.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiffBlockComponent {
  /**
   * Diff hunks to display
   */
  readonly hunks = input.required<readonly DiffHunk[]>();

  /**
   * Theme for styling
   */
  readonly theme = input<CodeViewerTheme>('dark');

  /**
   * View mode: unified or split
   */
  readonly viewMode = input<DiffViewMode>('unified');

  /**
   * Whether to show line numbers
   */
  readonly showLineNumbers = input<boolean>(true);

  /**
   * Maximum height with scroll
   */
  readonly maxHeight = input<string>('');

  /**
   * Computed container styles for max height
   */
  protected readonly containerStyle = computed(() => {
    const height = this.maxHeight();
    return height ? { 'max-height': height } : {};
  });

  /**
   * Whether we're in unified view mode
   */
  protected readonly isUnifiedView = computed(() => this.viewMode() === 'unified');

  /**
   * Split view lines for each hunk (computed for split mode)
   */
  protected readonly splitViewHunks = computed(() => {
    return this.hunks().map((hunk) => ({
      header: hunk.header,
      lines: toSplitViewLines(hunk.lines),
    }));
  });

  /**
   * Track function for hunks
   */
  protected trackHunk(_index: number, hunk: DiffHunk): string {
    return hunk.header;
  }

  /**
   * Track function for split view lines
   */
  protected trackSplitLine(index: number, _line: SplitViewLine): number {
    return index;
  }
}
