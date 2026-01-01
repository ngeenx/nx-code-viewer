import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import type {
  CodeViewerTheme,
  DiffHunk,
  DiffLine,
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
 * <nx-diff-block
 *   [hunks]="parsedDiff.hunks"
 *   [theme]="'dark'"
 *   [viewMode]="'unified'"
 *   [showLineNumbers]="true"
 * />
 * ```
 */
@Component({
  selector: 'nx-diff-block',
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
   * Flattened unified view data with global line indices
   */
  protected readonly unifiedViewData = computed(() => {
    const result: { header: string; lines: { line: DiffLine; globalIndex: number }[] }[] = [];
    let globalIndex = 0;

    for (const hunk of this.hunks()) {
      const lines: { line: DiffLine; globalIndex: number }[] = [];
      for (const line of hunk.lines) {
        lines.push({ line, globalIndex });
        globalIndex++;
      }
      result.push({ header: hunk.header, lines });
    }

    return result;
  });

  /**
   * Split view lines for each hunk (computed for split mode)
   */
  protected readonly splitViewHunks = computed(() => {
    let globalIndex = 0;
    return this.hunks().map((hunk) => {
      const lines = toSplitViewLines(hunk.lines).map((pair) => {
        const result = { ...pair, globalIndex };
        globalIndex++;
        return result;
      });
      return { header: hunk.header, lines };
    });
  });

  /**
   * Currently hovered line index (-1 = none)
   */
  protected readonly hoveredLineIndex = signal<number>(-1);

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

  /**
   * Handle line hover event
   */
  protected onLineHover(lineIndex: number): void {
    this.hoveredLineIndex.set(lineIndex);
  }

  /**
   * Clear hover state on mouse leave
   */
  protected onMouseLeave(): void {
    this.hoveredLineIndex.set(-1);
  }
}
