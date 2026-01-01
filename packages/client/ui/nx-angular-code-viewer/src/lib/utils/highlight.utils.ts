import type { HighlightedLinesInput, LineRange } from '../types';

/**
 * Checks if a value is a line range tuple [start, end]
 */
function isLineRange(value: number | LineRange): value is LineRange {
  return Array.isArray(value) && value.length === 2;
}

/**
 * Parses highlighted lines input into a Set of line numbers for O(1) lookup
 * @param input - The highlighted lines specification
 * @returns Set of line numbers that should be highlighted
 */
export function parseHighlightedLines(input: HighlightedLinesInput | undefined): Set<number> {
  const lines = new Set<number>();

  if (input === undefined || input === null) {
    return lines;
  }

  // Single number
  if (typeof input === 'number') {
    lines.add(input);
    return lines;
  }

  // Array of numbers and/or ranges
  for (const item of input) {
    if (typeof item === 'number') {
      lines.add(item);
    } else if (isLineRange(item)) {
      const [start, end] = item;
      const actualStart = Math.min(start, end);
      const actualEnd = Math.max(start, end);
      for (let i = actualStart; i <= actualEnd; i++) {
        lines.add(i);
      }
    }
  }

  return lines;
}

/**
 * Checks if a specific line number is highlighted
 * @param lineNumber - The line number to check (1-based)
 * @param highlightedSet - Set of highlighted line numbers
 * @returns true if the line should be highlighted
 */
export function isLineHighlighted(lineNumber: number, highlightedSet: Set<number>): boolean {
  return highlightedSet.has(lineNumber);
}
