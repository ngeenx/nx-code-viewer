import type {
  LineRange,
  CollapsedLinesInput,
  CollapsedRangeState,
} from '../types';
import type {
  DiffCollapsedRange,
  DiffCollapsedLinesInput,
  DiffCollapsedRangeState,
} from '../types/diff-viewer.types';

// ═══════════════════════════════════════════════════════════════════════════
// CODE VIEWER COLLAPSED LINES UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Converts a LineRange to a string key for Map storage
 */
export function rangeToKey(range: LineRange): string {
  return `${range[0]}-${range[1]}`;
}

/**
 * Merges overlapping or adjacent ranges
 */
function mergeOverlappingRanges(ranges: readonly LineRange[]): LineRange[] {
  if (ranges.length === 0) return [];

  const merged: LineRange[] = [[ranges[0][0], ranges[0][1]]];

  for (let i = 1; i < ranges.length; i++) {
    const current = ranges[i];
    const last = merged[merged.length - 1];

    // Check if ranges overlap or are adjacent
    if (current[0] <= last[1] + 1) {
      merged[merged.length - 1] = [last[0], Math.max(last[1], current[1])];
    } else {
      merged.push([current[0], current[1]]);
    }
  }

  return merged;
}

/**
 * Parses collapsed lines input into normalized, merged ranges
 * Validates and sorts ranges, merges overlapping ones
 * @param input - The collapsed lines specification
 * @returns Array of normalized LineRange tuples
 */
export function parseCollapsedRanges(
  input: CollapsedLinesInput | undefined
): LineRange[] {
  if (!input || input.length === 0) return [];

  // Normalize ranges: ensure start <= end and filter invalid ranges
  const normalized = input
    .filter((range) => range[0] > 0 && range[1] > 0 && range[0] !== range[1])
    .map(
      ([start, end]) =>
        [Math.min(start, end), Math.max(start, end)] as LineRange
    )
    .sort((a, b) => a[0] - b[0]);

  // Merge overlapping ranges
  return mergeOverlappingRanges(normalized);
}

/**
 * Creates initial state map for collapsed ranges
 * All ranges start in collapsed state (isExpanded: false)
 * @param ranges - Array of line ranges
 * @returns Map with range keys to CollapsedRangeState
 */
export function createCollapsedRangesState(
  ranges: readonly LineRange[]
): Map<string, CollapsedRangeState> {
  const stateMap = new Map<string, CollapsedRangeState>();

  for (const range of ranges) {
    const key = rangeToKey(range);
    stateMap.set(key, {
      range,
      isExpanded: false,
      lineCount: range[1] - range[0] + 1,
    });
  }

  return stateMap;
}

/**
 * Result of checking if a line is in a collapsed range
 */
export interface LineCollapseInfo {
  /** Whether the line is within any collapsed (non-expanded) range */
  readonly isCollapsed: boolean;
  /** Whether this is the first line of a collapsed range (shows indicator) */
  readonly isFirstLine: boolean;
  /** The range this line belongs to, or null if not in any range */
  readonly range: LineRange | null;
  /** Number of hidden lines (only relevant if isFirstLine is true) */
  readonly hiddenCount: number;
}

/**
 * Checks if a line number is within any collapsed (non-expanded) range
 * @param lineNumber - The line number to check (1-based)
 * @param collapsedStates - Map of collapsed range states
 * @returns Information about the line's collapse status
 */
export function isLineInCollapsedRange(
  lineNumber: number,
  collapsedStates: Map<string, CollapsedRangeState>
): LineCollapseInfo {
  for (const state of collapsedStates.values()) {
    // Skip expanded ranges - their lines should be visible
    if (state.isExpanded) continue;

    const [start, end] = state.range;
    if (lineNumber >= start && lineNumber <= end) {
      return {
        isCollapsed: true,
        isFirstLine: lineNumber === start,
        range: state.range,
        hiddenCount: end - start, // Lines after the first one are hidden
      };
    }
  }

  return { isCollapsed: false, isFirstLine: false, range: null, hiddenCount: 0 };
}

// ═══════════════════════════════════════════════════════════════════════════
// DIFF VIEWER COLLAPSED LINES UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Converts a DiffCollapsedRange to a string key for Map storage
 */
export function diffRangeToKey(range: DiffCollapsedRange): string {
  return `${range.startIndex}-${range.endIndex}`;
}

/**
 * Parses diff collapsed lines input into normalized ranges
 * @param input - The collapsed lines specification
 * @returns Array of validated DiffCollapsedRange objects
 */
export function parseDiffCollapsedRanges(
  input: DiffCollapsedLinesInput | undefined
): DiffCollapsedRange[] {
  if (!input || input.length === 0) return [];

  // Validate and normalize ranges
  return input
    .filter(
      (range) =>
        range.startIndex >= 0 &&
        range.endIndex >= 0 &&
        range.startIndex !== range.endIndex
    )
    .map((range) => ({
      startIndex: Math.min(range.startIndex, range.endIndex),
      endIndex: Math.max(range.startIndex, range.endIndex),
    }))
    .sort((a, b) => a.startIndex - b.startIndex);
}

/**
 * Creates initial state map for diff collapsed ranges
 * @param ranges - Array of diff collapsed ranges
 * @returns Map with range keys to DiffCollapsedRangeState
 */
export function createDiffCollapsedRangesState(
  ranges: readonly DiffCollapsedRange[]
): Map<string, DiffCollapsedRangeState> {
  const stateMap = new Map<string, DiffCollapsedRangeState>();

  for (const range of ranges) {
    const key = diffRangeToKey(range);
    stateMap.set(key, {
      range,
      isExpanded: false,
      lineCount: range.endIndex - range.startIndex + 1,
    });
  }

  return stateMap;
}

/**
 * Result of checking if a diff line is in a collapsed range
 */
export interface DiffLineCollapseInfo {
  /** Whether the line is within any collapsed (non-expanded) range */
  readonly isCollapsed: boolean;
  /** Whether this is the first line of a collapsed range */
  readonly isFirstLine: boolean;
  /** The range this line belongs to, or null if not in any range */
  readonly range: DiffCollapsedRange | null;
  /** Number of hidden lines */
  readonly hiddenCount: number;
}

/**
 * Checks if a diff line index is within any collapsed range
 * @param lineIndex - The line index to check (0-based)
 * @param collapsedStates - Map of collapsed range states
 * @returns Information about the line's collapse status
 */
export function isDiffLineInCollapsedRange(
  lineIndex: number,
  collapsedStates: Map<string, DiffCollapsedRangeState>
): DiffLineCollapseInfo {
  for (const state of collapsedStates.values()) {
    if (state.isExpanded) continue;

    const { startIndex, endIndex } = state.range;
    if (lineIndex >= startIndex && lineIndex <= endIndex) {
      return {
        isCollapsed: true,
        isFirstLine: lineIndex === startIndex,
        range: state.range,
        hiddenCount: endIndex - startIndex,
      };
    }
  }

  return {
    isCollapsed: false,
    isFirstLine: false,
    range: null,
    hiddenCount: 0,
  };
}
