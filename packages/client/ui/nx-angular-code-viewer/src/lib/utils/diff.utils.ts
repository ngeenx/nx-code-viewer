import { diffLines } from 'diff';
import type { DiffLine, DiffHunk, ParsedDiff, SplitViewLine } from '../types';

/**
 * Regex pattern for unified diff hunk header
 * Matches: @@ -oldStart,oldCount +newStart,newCount @@
 */
const HUNK_HEADER_PATTERN = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/;

/**
 * Parses a unified diff string into structured diff data
 * @param diffString - Unified diff format string (git diff output)
 * @returns Parsed diff with hunks
 */
export function parseDiff(diffString: string): ParsedDiff {
  if (!diffString) {
    return { hunks: [] };
  }

  const lines = diffString.split('\n');
  const hunks: DiffHunk[] = [];
  let currentHunk: DiffHunk | null = null;
  let currentLines: DiffLine[] = [];
  let oldFileName: string | undefined;
  let newFileName: string | undefined;
  let oldLineNum = 0;
  let newLineNum = 0;

  for (const line of lines) {
    // Parse file names
    if (line.startsWith('--- ')) {
      oldFileName = line.slice(4).replace(/^a\//, '');
      continue;
    }
    if (line.startsWith('+++ ')) {
      newFileName = line.slice(4).replace(/^b\//, '');
      continue;
    }

    // Parse hunk header
    const hunkMatch = line.match(HUNK_HEADER_PATTERN);
    if (hunkMatch) {
      // Save previous hunk if exists
      if (currentHunk) {
        hunks.push({ ...currentHunk, lines: currentLines });
      }

      const oldStart = parseInt(hunkMatch[1], 10);
      const oldCount = parseInt(hunkMatch[2] ?? '1', 10);
      const newStart = parseInt(hunkMatch[3], 10);
      const newCount = parseInt(hunkMatch[4] ?? '1', 10);

      currentHunk = {
        header: line,
        lines: [],
        oldStart,
        oldCount,
        newStart,
        newCount,
      };
      currentLines = [];
      oldLineNum = oldStart;
      newLineNum = newStart;
      continue;
    }

    // Skip if no current hunk
    if (!currentHunk) {
      continue;
    }

    // Parse diff lines
    if (line.startsWith('+')) {
      currentLines.push({
        type: 'added',
        content: line.slice(1),
        newLineNumber: newLineNum++,
      });
    } else if (line.startsWith('-')) {
      currentLines.push({
        type: 'removed',
        content: line.slice(1),
        oldLineNumber: oldLineNum++,
      });
    } else if (line.startsWith(' ') || line === '') {
      currentLines.push({
        type: 'unchanged',
        content: line.startsWith(' ') ? line.slice(1) : line,
        oldLineNumber: oldLineNum++,
        newLineNumber: newLineNum++,
      });
    }
  }

  // Don't forget the last hunk
  if (currentHunk) {
    hunks.push({ ...currentHunk, lines: currentLines });
  }

  return {
    hunks,
    oldFileName,
    newFileName,
  };
}

/**
 * Computes a diff between two code strings
 * @param oldCode - Original code
 * @param newCode - Modified code
 * @returns Parsed diff with hunks
 */
export function computeDiff(oldCode: string, newCode: string): ParsedDiff {
  if (!oldCode && !newCode) {
    return { hunks: [] };
  }

  const changes = diffLines(oldCode, newCode);
  const lines: DiffLine[] = [];
  let oldLineNum = 1;
  let newLineNum = 1;

  for (const change of changes) {
    const changeLines = change.value.split('\n');
    // Remove last empty line from split if the value ends with \n
    if (changeLines[changeLines.length - 1] === '') {
      changeLines.pop();
    }

    for (const content of changeLines) {
      if (change.added) {
        lines.push({
          type: 'added',
          content,
          newLineNumber: newLineNum++,
        });
      } else if (change.removed) {
        lines.push({
          type: 'removed',
          content,
          oldLineNumber: oldLineNum++,
        });
      } else {
        lines.push({
          type: 'unchanged',
          content,
          oldLineNumber: oldLineNum++,
          newLineNumber: newLineNum++,
        });
      }
    }
  }

  // Create a single hunk containing all lines
  const hunk: DiffHunk = {
    header: `@@ -1,${oldLineNum - 1} +1,${newLineNum - 1} @@`,
    lines,
    oldStart: 1,
    oldCount: oldLineNum - 1,
    newStart: 1,
    newCount: newLineNum - 1,
  };

  return {
    hunks: lines.length > 0 ? [hunk] : [],
  };
}

/**
 * Converts diff lines to split view format for side-by-side display
 * @param lines - Array of diff lines
 * @returns Array of split view line pairs
 */
export function toSplitViewLines(lines: readonly DiffLine[]): SplitViewLine[] {
  const result: SplitViewLine[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.type === 'unchanged') {
      result.push({ left: line, right: line });
      i++;
    } else if (line.type === 'removed') {
      // Look ahead for matching added line
      let j = i + 1;
      while (j < lines.length && lines[j].type === 'removed') {
        j++;
      }

      // Collect all removed lines
      const removedLines = lines.slice(i, j);

      // Collect all added lines that follow
      let addedCount = 0;
      while (j + addedCount < lines.length && lines[j + addedCount].type === 'added') {
        addedCount++;
      }
      const addedLines = lines.slice(j, j + addedCount);

      // Pair up removed and added lines
      const maxLen = Math.max(removedLines.length, addedLines.length);
      for (let k = 0; k < maxLen; k++) {
        result.push({
          left: removedLines[k] ?? null,
          right: addedLines[k] ?? null,
        });
      }

      i = j + addedCount;
    } else if (line.type === 'added') {
      // Added line without preceding removed line
      result.push({ left: null, right: line });
      i++;
    } else {
      i++;
    }
  }

  return result;
}

/**
 * Gets the prefix character for a diff line type
 * @param type - Diff line type
 * @returns Prefix character (+, -, or space)
 */
export function getDiffLinePrefix(type: DiffLine['type']): string {
  switch (type) {
    case 'added':
      return '+';
    case 'removed':
      return '-';
    default:
      return ' ';
  }
}

/**
 * Counts total added, removed, and unchanged lines in a diff
 * @param diff - Parsed diff
 * @returns Object with counts
 */
export function getDiffStats(diff: ParsedDiff): {
  added: number;
  removed: number;
  unchanged: number;
} {
  let added = 0;
  let removed = 0;
  let unchanged = 0;

  for (const hunk of diff.hunks) {
    for (const line of hunk.lines) {
      switch (line.type) {
        case 'added':
          added++;
          break;
        case 'removed':
          removed++;
          break;
        case 'unchanged':
          unchanged++;
          break;
      }
    }
  }

  return { added, removed, unchanged };
}
