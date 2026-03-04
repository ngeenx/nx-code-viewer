import { describe, it, expect } from 'vitest';
import {
  parseDiff,
  computeDiff,
  toSplitViewLines,
  getDiffLinePrefix,
  getDiffStats,
} from './diff.utils';

// ─── parseDiff ────────────────────────────────────────────────────────────────

describe('parseDiff', () => {
  it('returns empty hunks for empty string', () => {
    expect(parseDiff('')).toEqual({ hunks: [] });
  });

  it('parses added lines', () => {
    const diff = `@@ -1,0 +1,1 @@
+hello`;
    const result = parseDiff(diff);
    expect(result.hunks).toHaveLength(1);
    expect(result.hunks[0].lines[0]).toMatchObject({
      type: 'added',
      content: 'hello',
    });
  });

  it('parses removed lines', () => {
    const diff = `@@ -1,1 +1,0 @@
-goodbye`;
    const result = parseDiff(diff);
    expect(result.hunks[0].lines[0]).toMatchObject({
      type: 'removed',
      content: 'goodbye',
    });
  });

  it('parses unchanged lines', () => {
    const diff = `@@ -1,1 +1,1 @@
 context`;
    const result = parseDiff(diff);
    expect(result.hunks[0].lines[0]).toMatchObject({
      type: 'unchanged',
      content: 'context',
    });
  });

  it('parses hunk header oldStart and newStart', () => {
    const diff = `@@ -5,3 +10,3 @@
 line`;
    const result = parseDiff(diff);
    expect(result.hunks[0].oldStart).toBe(5);
    expect(result.hunks[0].newStart).toBe(10);
  });

  it('parses hunk count values', () => {
    const diff = `@@ -1,4 +1,6 @@
 line`;
    const result = parseDiff(diff);
    expect(result.hunks[0].oldCount).toBe(4);
    expect(result.hunks[0].newCount).toBe(6);
  });

  it('strips a/ prefix from old file name', () => {
    const diff = `--- a/src/foo.ts
+++ b/src/foo.ts
@@ -1,1 +1,1 @@
 line`;
    const result = parseDiff(diff);
    expect(result.oldFileName).toBe('src/foo.ts');
    expect(result.newFileName).toBe('src/foo.ts');
  });

  it('handles multiple hunks', () => {
    const diff = `@@ -1,1 +1,1 @@
 first
@@ -10,1 +10,1 @@
 second`;
    const result = parseDiff(diff);
    expect(result.hunks).toHaveLength(2);
  });

  it('tracks line numbers correctly for added lines', () => {
    const diff = `@@ -1,0 +1,2 @@
+line1
+line2`;
    const result = parseDiff(diff);
    expect(result.hunks[0].lines[0].newLineNumber).toBe(1);
    expect(result.hunks[0].lines[1].newLineNumber).toBe(2);
  });

  it('tracks line numbers correctly for removed lines', () => {
    const diff = `@@ -3,2 +3,0 @@
-lineA
-lineB`;
    const result = parseDiff(diff);
    expect(result.hunks[0].lines[0].oldLineNumber).toBe(3);
    expect(result.hunks[0].lines[1].oldLineNumber).toBe(4);
  });
});

// ─── computeDiff ──────────────────────────────────────────────────────────────

describe('computeDiff', () => {
  it('returns empty hunks for two empty strings', () => {
    expect(computeDiff('', '')).toEqual({ hunks: [] });
  });

  it('returns unchanged lines for identical strings', () => {
    const result = computeDiff('hello\n', 'hello\n');
    expect(result.hunks).toHaveLength(1);
    expect(result.hunks[0].lines[0]).toMatchObject({
      type: 'unchanged',
      content: 'hello',
    });
  });

  it('detects one addition', () => {
    const result = computeDiff('', 'new line\n');
    const addedLines = result.hunks[0].lines.filter((l) => l.type === 'added');
    expect(addedLines).toHaveLength(1);
    expect(addedLines[0].content).toBe('new line');
  });

  it('detects one removal', () => {
    const result = computeDiff('old line\n', '');
    const removedLines = result.hunks[0].lines.filter(
      (l) => l.type === 'removed'
    );
    expect(removedLines).toHaveLength(1);
    expect(removedLines[0].content).toBe('old line');
  });

  it('detects mixed changes', () => {
    const result = computeDiff('a\nb\n', 'a\nc\n');
    const types = result.hunks[0].lines.map((l) => l.type);
    expect(types).toContain('unchanged');
    expect(types).toContain('removed');
    expect(types).toContain('added');
  });
});

// ─── toSplitViewLines ─────────────────────────────────────────────────────────

describe('toSplitViewLines', () => {
  it('pairs unchanged line on both sides', () => {
    const lines = [
      { type: 'unchanged' as const, content: 'x', oldLineNumber: 1, newLineNumber: 1 },
    ];
    const result = toSplitViewLines(lines);
    expect(result).toHaveLength(1);
    expect(result[0].left).toBe(lines[0]);
    expect(result[0].right).toBe(lines[0]);
  });

  it('pairs removed and added lines side by side', () => {
    const lines = [
      { type: 'removed' as const, content: 'old', oldLineNumber: 1 },
      { type: 'added' as const, content: 'new', newLineNumber: 1 },
    ];
    const result = toSplitViewLines(lines);
    expect(result).toHaveLength(1);
    expect(result[0].left?.type).toBe('removed');
    expect(result[0].right?.type).toBe('added');
  });

  it('puts standalone added line on right with null left', () => {
    const lines = [
      { type: 'added' as const, content: 'only added', newLineNumber: 1 },
    ];
    const result = toSplitViewLines(lines);
    expect(result[0].left).toBeNull();
    expect(result[0].right?.content).toBe('only added');
  });

  it('handles multiple changes', () => {
    const lines = [
      { type: 'unchanged' as const, content: 'a', oldLineNumber: 1, newLineNumber: 1 },
      { type: 'removed' as const, content: 'b', oldLineNumber: 2 },
      { type: 'added' as const, content: 'c', newLineNumber: 2 },
      { type: 'unchanged' as const, content: 'd', oldLineNumber: 3, newLineNumber: 3 },
    ];
    const result = toSplitViewLines(lines);
    expect(result).toHaveLength(3);
    expect(result[0].left?.content).toBe('a');
    expect(result[1].left?.content).toBe('b');
    expect(result[1].right?.content).toBe('c');
    expect(result[2].left?.content).toBe('d');
  });
});

// ─── getDiffLinePrefix ────────────────────────────────────────────────────────

describe('getDiffLinePrefix', () => {
  it('returns "+" for added', () => {
    expect(getDiffLinePrefix('added')).toBe('+');
  });

  it('returns "-" for removed', () => {
    expect(getDiffLinePrefix('removed')).toBe('-');
  });

  it('returns " " for unchanged', () => {
    expect(getDiffLinePrefix('unchanged')).toBe(' ');
  });
});

// ─── getDiffStats ─────────────────────────────────────────────────────────────

describe('getDiffStats', () => {
  it('returns zeros for diff with no hunks', () => {
    expect(getDiffStats({ hunks: [] })).toEqual({
      added: 0,
      removed: 0,
      unchanged: 0,
    });
  });

  it('counts added, removed, and unchanged lines', () => {
    const diff = {
      hunks: [
        {
          header: '',
          oldStart: 1,
          oldCount: 2,
          newStart: 1,
          newCount: 2,
          lines: [
            { type: 'added' as const, content: 'a', newLineNumber: 1 },
            { type: 'added' as const, content: 'b', newLineNumber: 2 },
            { type: 'removed' as const, content: 'c', oldLineNumber: 1 },
            { type: 'unchanged' as const, content: 'd', oldLineNumber: 2, newLineNumber: 3 },
          ],
        },
      ],
    };
    expect(getDiffStats(diff)).toEqual({ added: 2, removed: 1, unchanged: 1 });
  });

  it('sums across multiple hunks', () => {
    const makeHunk = (type: 'added' | 'removed' | 'unchanged') => ({
      header: '',
      oldStart: 1,
      oldCount: 1,
      newStart: 1,
      newCount: 1,
      lines: [{ type, content: 'x', oldLineNumber: 1, newLineNumber: 1 }],
    });
    const diff = {
      hunks: [makeHunk('added'), makeHunk('removed'), makeHunk('unchanged')],
    };
    expect(getDiffStats(diff)).toEqual({ added: 1, removed: 1, unchanged: 1 });
  });
});
