import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  untracked,
} from '@angular/core';
import type {
  CodeViewerBorderStyle,
  CodeViewerLanguage,
  CodeViewerTheme,
  DiffHunk,
  DiffLine,
  DiffViewMode,
  ParsedDiff,
} from '../../types';
import type {
  DiffCollapsedLinesInput,
  DiffCollapsedRange,
  DiffCollapsedRangeState,
  DiffCollapsedRangeToggleEvent,
} from '../../types/diff-viewer.types';
import type {
  LineWidgetClickEvent,
  LineWidgetsInput,
} from '../../types/line-widget.types';
import { DEFAULT_DIFF_VIEWER_CONFIG } from '../../types';
import {
  parseDiff,
  computeDiff,
  getDiffStats,
  parseDiffCollapsedRanges,
  createDiffCollapsedRangesState,
  diffRangeToKey,
} from '../../utils';
import { CodeHighlighterService } from '../../services';
import { CodeHeaderComponent } from '../../atoms/code-header';
import { DiffBlockComponent } from '../../molecules/diff-block';

/**
 * DiffViewer Organism Component
 *
 * Main component for displaying code diffs with syntax highlighting.
 * Supports both unified diff strings and oldCode/newCode input modes.
 *
 * @example
 * ```html
 * <!-- Using unified diff string -->
 * <nx-diff-viewer
 *   [diff]="gitDiffOutput"
 *   [language]="'typescript'"
 *   [theme]="'dark'"
 *   [viewMode]="'unified'"
 * />
 *
 * <!-- Using structured data -->
 * <nx-diff-viewer
 *   [oldCode]="originalCode"
 *   [newCode]="modifiedCode"
 *   [language]="'typescript'"
 *   [viewMode]="'split'"
 * />
 * ```
 */
@Component({
  selector: 'nx-diff-viewer',
  standalone: true,
  imports: [CodeHeaderComponent, DiffBlockComponent],
  templateUrl: './diff-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'nx-diff-viewer' },
})
export class DiffViewerComponent implements OnDestroy {
  /**
   * Abort controller for canceling pending highlight operations
   */
  private highlightAbortController: AbortController | null = null;

  /**
   * Injected services
   */
  private readonly highlighterService = inject(CodeHighlighterService);

  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS - Option 1: Unified diff string
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Unified diff string (git diff format)
   */
  readonly diff = input<string>('');

  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS - Option 2: Structured data
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Original code (for computing diff)
   */
  readonly oldCode = input<string>('');

  /**
   * Modified code (for computing diff)
   */
  readonly newCode = input<string>('');

  // ═══════════════════════════════════════════════════════════════════════════
  // INPUTS - Configuration
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Display mode: unified or split
   */
  readonly viewMode = input<DiffViewMode>(DEFAULT_DIFF_VIEWER_CONFIG.viewMode);

  /**
   * Programming language for header display
   */
  readonly language = input<CodeViewerLanguage>(
    DEFAULT_DIFF_VIEWER_CONFIG.language
  );

  /**
   * Color theme
   */
  readonly theme = input<CodeViewerTheme>(DEFAULT_DIFF_VIEWER_CONFIG.theme);

  /**
   * Whether to show line numbers
   */
  readonly showLineNumbers = input<boolean>(
    DEFAULT_DIFF_VIEWER_CONFIG.showLineNumbers
  );

  /**
   * Whether to show header section
   */
  readonly showHeader = input<boolean>(DEFAULT_DIFF_VIEWER_CONFIG.showHeader);

  /**
   * Maximum height with scrolling
   */
  readonly maxHeight = input<string>('');

  /**
   * Old file name (for header display)
   */
  readonly oldFileName = input<string>('');

  /**
   * New file name (for header display)
   */
  readonly newFileName = input<string>('');

  /**
   * File extension for icon display
   */
  readonly fileExtension = input<string>('');

  /**
   * Border style variant
   * - 'classic': Standard rounded border (default)
   * - 'grid-cross': Grid borders with corner cross marks
   * - 'corner-intersection': Long grid borders extending beyond corners
   * - 'none': No border styling
   */
  readonly borderStyle = input<CodeViewerBorderStyle>('classic');

  /**
   * Collapsed line ranges (0-based global indices)
   */
  readonly collapsedLines = input<DiffCollapsedLinesInput>();

  /**
   * Line widget configurations
   */
  readonly lineWidgets = input<LineWidgetsInput>();

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTPUTS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Emitted when a collapsed range is expanded or collapsed
   */
  readonly collapsedRangeToggle = output<DiffCollapsedRangeToggleEvent>();

  /**
   * Emitted when a line widget is clicked
   */
  readonly lineWidgetClick = output<LineWidgetClickEvent>();

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Parsed diff result
   */
  private readonly parsedDiff = signal<ParsedDiff>({ hunks: [] });

  /**
   * State for collapsed ranges (tracks which ranges are expanded)
   */
  protected readonly collapsedRangesState = signal<
    Map<string, DiffCollapsedRangeState>
  >(new Map());

  // ═══════════════════════════════════════════════════════════════════════════
  // COMPUTED
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Diff hunks for the diff block
   */
  protected readonly hunks = computed(() => this.parsedDiff().hunks);

  /**
   * Whether there are any changes to display
   */
  protected readonly hasChanges = computed(
    () => this.parsedDiff().hunks.length > 0
  );

  /**
   * Display title from filenames or language
   */
  protected readonly displayTitle = computed(() => {
    const newFile = this.newFileName() || this.parsedDiff().newFileName;
    const oldFile = this.oldFileName() || this.parsedDiff().oldFileName;

    if (newFile && oldFile && newFile !== oldFile) {
      return `${oldFile} → ${newFile}`;
    }

    return newFile || oldFile || '';
  });

  /**
   * Diff statistics
   */
  protected readonly stats = computed(() => getDiffStats(this.parsedDiff()));

  // ═══════════════════════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════════════════════

  constructor() {
    // Effect to parse/compute diff and apply syntax highlighting
    effect(() => {
      const diffValue = this.diff();
      const oldCodeValue = this.oldCode();
      const newCodeValue = this.newCode();
      const languageValue = this.language();
      const themeValue = this.theme();

      untracked(() => {
        void this.processDiff(
          diffValue,
          oldCodeValue,
          newCodeValue,
          languageValue,
          themeValue
        );
      });
    });

    // Effect to initialize collapsed ranges state when input changes
    effect(() => {
      const collapsedInput = this.collapsedLines();

      untracked(() => {
        const parsedRanges = parseDiffCollapsedRanges(collapsedInput);
        this.collapsedRangesState.set(
          createDiffCollapsedRangesState(parsedRanges)
        );
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════

  ngOnDestroy(): void {
    this.abortPendingHighlight();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Process diff and apply syntax highlighting
   */
  private async processDiff(
    diffValue: string,
    oldCodeValue: string,
    newCodeValue: string,
    language: CodeViewerLanguage,
    theme: CodeViewerTheme
  ): Promise<void> {
    // Abort any pending highlight operation
    this.abortPendingHighlight();

    let parsed: ParsedDiff;

    if (diffValue) {
      parsed = parseDiff(diffValue);
    } else if (oldCodeValue || newCodeValue) {
      parsed = computeDiff(oldCodeValue, newCodeValue);
    } else {
      this.parsedDiff.set({ hunks: [] });
      return;
    }

    // Set initial parsed diff (without highlighting)
    this.parsedDiff.set(parsed);

    // Skip highlighting for plaintext
    if (language === 'plaintext') {
      return;
    }

    // Create abort controller for highlighting
    this.highlightAbortController = new AbortController();
    const { signal } = this.highlightAbortController;

    // Reconstruct old and new code from diff lines
    const oldLines: string[] = [];
    const newLines: string[] = [];

    for (const hunk of parsed.hunks) {
      for (const line of hunk.lines) {
        if (line.type === 'removed' || line.type === 'unchanged') {
          oldLines.push(line.content);
        }
        if (line.type === 'added' || line.type === 'unchanged') {
          newLines.push(line.content);
        }
      }
    }

    // Highlight both code versions
    const [highlightedOldLines, highlightedNewLines] = await Promise.all([
      this.highlighterService.highlightLines({
        code: oldLines.join('\n'),
        language,
        theme,
        signal,
      }),
      this.highlighterService.highlightLines({
        code: newLines.join('\n'),
        language,
        theme,
        signal,
      }),
    ]);

    if (signal.aborted) {
      return;
    }

    // Apply highlighted content to diff lines
    const highlightedHunks = this.applyHighlighting(
      parsed.hunks,
      highlightedOldLines,
      highlightedNewLines
    );

    this.parsedDiff.set({
      ...parsed,
      hunks: highlightedHunks,
    });
  }

  /**
   * Apply highlighted content to diff lines
   */
  private applyHighlighting(
    hunks: readonly DiffHunk[],
    highlightedOldLines: string[],
    highlightedNewLines: string[]
  ): DiffHunk[] {
    let oldIndex = 0;
    let newIndex = 0;

    return hunks.map(hunk => ({
      ...hunk,
      lines: hunk.lines.map((line): DiffLine => {
        let highlightedContent: string | undefined;

        if (line.type === 'removed') {
          highlightedContent = highlightedOldLines[oldIndex++];
        } else if (line.type === 'added') {
          highlightedContent = highlightedNewLines[newIndex++];
        } else if (line.type === 'unchanged') {
          // For unchanged lines, use old content (both are the same)
          highlightedContent = highlightedOldLines[oldIndex++];
          newIndex++;
        }

        return highlightedContent ? { ...line, highlightedContent } : line;
      }),
    }));
  }

  /**
   * Aborts any pending highlight operation
   */
  private abortPendingHighlight(): void {
    if (this.highlightAbortController) {
      this.highlightAbortController.abort();
      this.highlightAbortController = null;
    }
  }

  /**
   * Handler for collapsed range toggle events from diff block
   */
  protected onCollapsedRangeToggle(range: DiffCollapsedRange): void {
    const key = diffRangeToKey(range);
    const currentState = this.collapsedRangesState();
    const rangeState = currentState.get(key);

    if (rangeState) {
      const newIsExpanded = !rangeState.isExpanded;

      // Create new map with updated state
      const newState = new Map(currentState);
      newState.set(key, {
        ...rangeState,
        isExpanded: newIsExpanded,
      });

      this.collapsedRangesState.set(newState);

      // Emit toggle event
      this.collapsedRangeToggle.emit({
        range,
        isExpanded: newIsExpanded,
      });
    }
  }

  /**
   * Handler for line widget click events from diff block
   */
  protected onLineWidgetClick(event: LineWidgetClickEvent): void {
    this.lineWidgetClick.emit(event);
  }
}
