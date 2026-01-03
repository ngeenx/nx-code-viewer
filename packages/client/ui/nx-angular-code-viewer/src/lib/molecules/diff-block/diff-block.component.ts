import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
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
import type {
  DiffCollapsedLinesInput,
  DiffCollapsedRange,
  DiffCollapsedRangeState,
} from '../../types/diff-viewer.types';
import type {
  LineWidgetClickEvent,
  LineWidgetConfig,
  LineWidgetContext,
  LineWidgetsInput,
} from '../../types/line-widget.types';
import { toSplitViewLines, isDiffLineInCollapsedRange } from '../../utils';
import { DiffLineComponent } from '../../atoms/diff-line';
import { DiffCollapsedIndicatorComponent } from '../../atoms/diff-collapsed-indicator';
import { InsertWidgetContainerComponent } from '../../atoms/insert-widget-container';

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
  imports: [
    NgStyle,
    DiffLineComponent,
    DiffCollapsedIndicatorComponent,
    InsertWidgetContainerComponent,
  ],
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
   * Map of collapsed range states
   */
  readonly collapsedRangesState = input<Map<string, DiffCollapsedRangeState>>(
    new Map()
  );

  /**
   * Emitted when a collapsed range indicator is clicked
   */
  readonly collapsedRangeToggle = output<DiffCollapsedRange>();

  /**
   * Line widget configurations
   */
  readonly lineWidgets = input<LineWidgetsInput>();

  /**
   * Emits when a line widget is clicked
   */
  readonly lineWidgetClick = output<LineWidgetClickEvent>();

  /**
   * Currently active insert widget (for showing component between lines)
   */
  protected readonly activeInsertWidget = signal<{
    lineNumber: number;
    widget: LineWidgetConfig;
    line: string;
  } | null>(null);

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
  protected readonly isUnifiedView = computed(
    () => this.viewMode() === 'unified'
  );

  /**
   * Flattened unified view data with global line indices
   */
  protected readonly unifiedViewData = computed(() => {
    const result: {
      header: string;
      lines: { line: DiffLine; globalIndex: number }[];
    }[] = [];
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
    return this.hunks().map(hunk => {
      const lines = toSplitViewLines(hunk.lines).map(pair => {
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

  /**
   * Check if a line is in a collapsed range
   */
  protected getLineCollapseInfo(globalIndex: number): {
    isCollapsed: boolean;
    isFirstLine: boolean;
    range: DiffCollapsedRange | null;
    hiddenCount: number;
  } {
    return isDiffLineInCollapsedRange(globalIndex, this.collapsedRangesState());
  }

  /**
   * Check if a line should be visible
   */
  protected isLineVisible(globalIndex: number): boolean {
    const collapseInfo = this.getLineCollapseInfo(globalIndex);
    return !collapseInfo.isCollapsed || collapseInfo.isFirstLine;
  }

  /**
   * Handle collapsed range toggle
   */
  protected onCollapsedRangeToggle(range: DiffCollapsedRange): void {
    this.collapsedRangeToggle.emit(range);
  }

  /**
   * Handle line widget click
   */
  protected onLineWidgetClick(event: LineWidgetClickEvent, line: DiffLine): void {
    this.lineWidgetClick.emit(event);

    // Toggle insert widget if the widget has an insertComponent
    if (event.widget.insertComponent) {
      const current = this.activeInsertWidget();

      if (current?.lineNumber === event.lineNumber && current.widget === event.widget) {
        // Clicking same widget again closes it
        this.activeInsertWidget.set(null);
      } else {
        // Open new insert widget
        this.activeInsertWidget.set({
          lineNumber: event.lineNumber,
          widget: event.widget,
          line: line.content,
        });
      }
    }
  }

  /**
   * Check if insert widget should be shown after a specific line
   */
  protected shouldShowInsertWidget(lineNumber: number): boolean {
    const active = this.activeInsertWidget();
    return active !== null && active.lineNumber === lineNumber;
  }

  /**
   * Get context for the active insert widget
   */
  protected getInsertWidgetContext(): LineWidgetContext {
    const active = this.activeInsertWidget();
    return {
      line: active?.line ?? '',
      lineNumber: active?.lineNumber ?? 0,
      theme: this.theme(),
    };
  }
}
