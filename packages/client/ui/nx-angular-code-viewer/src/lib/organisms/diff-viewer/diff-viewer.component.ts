import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  untracked,
} from '@angular/core';
import type {
  CodeViewerLanguage,
  CodeViewerTheme,
  DiffViewMode,
  ParsedDiff,
} from '../../types';
import { DEFAULT_DIFF_VIEWER_CONFIG } from '../../types';
import { parseDiff, computeDiff, getDiffStats } from '../../utils';
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
 * <ngn-diff-viewer
 *   [diff]="gitDiffOutput"
 *   [language]="'typescript'"
 *   [theme]="'dark'"
 *   [viewMode]="'unified'"
 * />
 *
 * <!-- Using structured data -->
 * <ngn-diff-viewer
 *   [oldCode]="originalCode"
 *   [newCode]="modifiedCode"
 *   [language]="'typescript'"
 *   [viewMode]="'split'"
 * />
 * ```
 */
@Component({
  selector: 'ngn-diff-viewer',
  standalone: true,
  imports: [CodeHeaderComponent, DiffBlockComponent],
  templateUrl: './diff-viewer.component.html',
  styleUrl: './diff-viewer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiffViewerComponent {
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
  readonly language = input<CodeViewerLanguage>(DEFAULT_DIFF_VIEWER_CONFIG.language);

  /**
   * Color theme
   */
  readonly theme = input<CodeViewerTheme>(DEFAULT_DIFF_VIEWER_CONFIG.theme);

  /**
   * Whether to show line numbers
   */
  readonly showLineNumbers = input<boolean>(DEFAULT_DIFF_VIEWER_CONFIG.showLineNumbers);

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

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Parsed diff result
   */
  private readonly parsedDiff = signal<ParsedDiff>({ hunks: [] });

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
  protected readonly hasChanges = computed(() => this.parsedDiff().hunks.length > 0);

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
    // Effect to parse/compute diff when inputs change
    effect(() => {
      const diffValue = this.diff();
      const oldCodeValue = this.oldCode();
      const newCodeValue = this.newCode();

      untracked(() => {
        if (diffValue) {
          // Parse unified diff string
          this.parsedDiff.set(parseDiff(diffValue));
        } else if (oldCodeValue || newCodeValue) {
          // Compute diff from old/new code
          this.parsedDiff.set(computeDiff(oldCodeValue, newCodeValue));
        } else {
          this.parsedDiff.set({ hunks: [] });
        }
      });
    });
  }
}
