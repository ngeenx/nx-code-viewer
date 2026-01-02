import type { CodeViewerLanguage, CodeViewerTheme } from './code-viewer.types';

/**
 * Diff line types
 */
export type DiffLineType = 'added' | 'removed' | 'unchanged' | 'header';

/**
 * Single diff line representation
 */
export interface DiffLine {
  readonly type: DiffLineType;
  readonly content: string;
  readonly highlightedContent?: string;
  readonly oldLineNumber?: number;
  readonly newLineNumber?: number;
}

/**
 * Diff hunk (section of changes)
 */
export interface DiffHunk {
  readonly header: string;
  readonly lines: readonly DiffLine[];
  readonly oldStart: number;
  readonly oldCount: number;
  readonly newStart: number;
  readonly newCount: number;
}

/**
 * Parsed diff result
 */
export interface ParsedDiff {
  readonly hunks: readonly DiffHunk[];
  readonly oldFileName?: string;
  readonly newFileName?: string;
}

/**
 * Display mode for diff viewer
 */
export type DiffViewMode = 'unified' | 'split';

/**
 * Configuration for diff viewer component
 */
export interface DiffViewerConfig {
  readonly viewMode: DiffViewMode;
  readonly showLineNumbers: boolean;
  readonly showHeader: boolean;
  readonly theme: CodeViewerTheme;
  readonly language: CodeViewerLanguage;
}

/**
 * Default configuration values for diff viewer
 */
export const DEFAULT_DIFF_VIEWER_CONFIG: DiffViewerConfig = {
  viewMode: 'unified',
  showLineNumbers: true,
  showHeader: true,
  theme: 'dark',
  language: 'plaintext',
} as const;

/**
 * Split view line pair for side-by-side display
 */
export interface SplitViewLine {
  readonly left: DiffLine | null;
  readonly right: DiffLine | null;
}

/**
 * Collapsed range for diff viewer
 * Uses global line indices (0-based) since diff lines don't have consistent line numbers
 */
export interface DiffCollapsedRange {
  /** Start index (0-based, inclusive) */
  readonly startIndex: number;
  /** End index (0-based, inclusive) */
  readonly endIndex: number;
}

/**
 * Collapsed lines input for diff viewer
 */
export type DiffCollapsedLinesInput = readonly DiffCollapsedRange[];

/**
 * State of a collapsed range in diff viewer
 */
export interface DiffCollapsedRangeState {
  /** The index range */
  readonly range: DiffCollapsedRange;
  /** Whether the range is currently expanded */
  readonly isExpanded: boolean;
  /** Number of lines in this range */
  readonly lineCount: number;
}

/**
 * Event emitted when a diff collapsed range is toggled
 */
export interface DiffCollapsedRangeToggleEvent {
  /** The range that was toggled */
  readonly range: DiffCollapsedRange;
  /** New expansion state */
  readonly isExpanded: boolean;
}
