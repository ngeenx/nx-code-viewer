import { describe, it, expect } from 'vitest';
import {
  rangeToKey,
  parseCollapsedRanges,
  createCollapsedRangesState,
  isLineInCollapsedRange,
  diffRangeToKey,
  parseDiffCollapsedRanges,
  createDiffCollapsedRangesState,
  isDiffLineInCollapsedRange,
} from './collapsed-lines.utils';

// ─── rangeToKey ───────────────────────────────────────────────────────────────

describe('rangeToKey', () => {
  it('formats a range as "start-end"', () => {
    expect(rangeToKey([1, 5])).toBe('1-5');
  });

  it('works with single-line boundary values', () => {
    expect(rangeToKey([10, 20])).toBe('10-20');
  });
});

// ─── parseCollapsedRanges ─────────────────────────────────────────────────────

describe('parseCollapsedRanges', () => {
  it('returns empty array for undefined input', () => {
    expect(parseCollapsedRanges(undefined)).toEqual([]);
  });

  it('returns empty array for empty array input', () => {
    expect(parseCollapsedRanges([])).toEqual([]);
  });

  it('returns a single valid range', () => {
    expect(parseCollapsedRanges([[2, 5]])).toEqual([[2, 5]]);
  });

  it('filters out ranges where start === end', () => {
    expect(parseCollapsedRanges([[3, 3]])).toEqual([]);
  });

  it('filters out ranges where start or end is zero', () => {
    expect(parseCollapsedRanges([[0, 5]])).toEqual([]);
    expect(parseCollapsedRanges([[1, 0]])).toEqual([]);
  });

  it('normalizes reversed ranges (end < start)', () => {
    expect(parseCollapsedRanges([[8, 3]])).toEqual([[3, 8]]);
  });

  it('sorts ranges by start', () => {
    const result = parseCollapsedRanges([
      [10, 15],
      [2, 5],
    ]);
    expect(result[0][0]).toBe(2);
    expect(result[1][0]).toBe(10);
  });

  it('merges overlapping ranges', () => {
    expect(
      parseCollapsedRanges([
        [1, 5],
        [3, 8],
      ])
    ).toEqual([[1, 8]]);
  });

  it('merges adjacent ranges', () => {
    expect(
      parseCollapsedRanges([
        [1, 5],
        [6, 10],
      ])
    ).toEqual([[1, 10]]);
  });

  it('keeps non-overlapping ranges separate', () => {
    expect(
      parseCollapsedRanges([
        [1, 3],
        [5, 8],
      ])
    ).toEqual([
      [1, 3],
      [5, 8],
    ]);
  });
});

// ─── createCollapsedRangesState ───────────────────────────────────────────────

describe('createCollapsedRangesState', () => {
  it('returns an empty map for no ranges', () => {
    expect(createCollapsedRangesState([]).size).toBe(0);
  });

  it('creates entries with correct keys', () => {
    const map = createCollapsedRangesState([[2, 6]]);
    expect(map.has('2-6')).toBe(true);
  });

  it('sets isExpanded to false', () => {
    const map = createCollapsedRangesState([[2, 6]]);
    expect(map.get('2-6')?.isExpanded).toBe(false);
  });

  it('sets lineCount correctly', () => {
    const map = createCollapsedRangesState([[2, 6]]);
    // range [2,6] has 5 lines: 2,3,4,5,6
    expect(map.get('2-6')?.lineCount).toBe(5);
  });

  it('stores multiple ranges', () => {
    const map = createCollapsedRangesState([
      [1, 3],
      [10, 15],
    ]);
    expect(map.size).toBe(2);
  });
});

// ─── isLineInCollapsedRange ───────────────────────────────────────────────────

describe('isLineInCollapsedRange', () => {
  function makeStates(ranges: [number, number][], expanded = false) {
    const map = createCollapsedRangesState(ranges as [number, number][]);
    if (expanded) {
      for (const [key, value] of map) {
        map.set(key, { ...value, isExpanded: true });
      }
    }
    return map;
  }

  it('returns not-collapsed for a line before the range', () => {
    const states = makeStates([[5, 10]]);
    const result = isLineInCollapsedRange(3, states);
    expect(result.isCollapsed).toBe(false);
    expect(result.range).toBeNull();
  });

  it('returns isFirstLine=true for the first line of range', () => {
    const states = makeStates([[5, 10]]);
    const result = isLineInCollapsedRange(5, states);
    expect(result.isCollapsed).toBe(true);
    expect(result.isFirstLine).toBe(true);
  });

  it('returns isFirstLine=false for a middle line of range', () => {
    const states = makeStates([[5, 10]]);
    const result = isLineInCollapsedRange(7, states);
    expect(result.isCollapsed).toBe(true);
    expect(result.isFirstLine).toBe(false);
  });

  it('returns not-collapsed for a line after the range', () => {
    const states = makeStates([[5, 10]]);
    const result = isLineInCollapsedRange(12, states);
    expect(result.isCollapsed).toBe(false);
  });

  it('skips expanded ranges', () => {
    const states = makeStates([[5, 10]], true);
    const result = isLineInCollapsedRange(7, states);
    expect(result.isCollapsed).toBe(false);
  });

  it('reports correct hiddenCount', () => {
    const states = makeStates([[5, 10]]);
    const result = isLineInCollapsedRange(5, states);
    // hiddenCount = end - start = 10 - 5 = 5
    expect(result.hiddenCount).toBe(5);
  });
});

// ─── diffRangeToKey ───────────────────────────────────────────────────────────

describe('diffRangeToKey', () => {
  it('formats a diff range as "startIndex-endIndex"', () => {
    expect(diffRangeToKey({ startIndex: 0, endIndex: 4 })).toBe('0-4');
  });
});

// ─── parseDiffCollapsedRanges ─────────────────────────────────────────────────

describe('parseDiffCollapsedRanges', () => {
  it('returns empty array for undefined', () => {
    expect(parseDiffCollapsedRanges(undefined)).toEqual([]);
  });

  it('returns empty array for empty input', () => {
    expect(parseDiffCollapsedRanges([])).toEqual([]);
  });

  it('filters out ranges where startIndex === endIndex', () => {
    expect(parseDiffCollapsedRanges([{ startIndex: 3, endIndex: 3 }])).toEqual(
      []
    );
  });

  it('normalizes reversed ranges', () => {
    expect(
      parseDiffCollapsedRanges([{ startIndex: 8, endIndex: 2 }])
    ).toEqual([{ startIndex: 2, endIndex: 8 }]);
  });

  it('sorts ranges by startIndex', () => {
    const result = parseDiffCollapsedRanges([
      { startIndex: 10, endIndex: 15 },
      { startIndex: 0, endIndex: 5 },
    ]);
    expect(result[0].startIndex).toBe(0);
    expect(result[1].startIndex).toBe(10);
  });

  it('keeps valid ranges', () => {
    const result = parseDiffCollapsedRanges([{ startIndex: 1, endIndex: 4 }]);
    expect(result).toEqual([{ startIndex: 1, endIndex: 4 }]);
  });
});

// ─── createDiffCollapsedRangesState ──────────────────────────────────────────

describe('createDiffCollapsedRangesState', () => {
  it('returns empty map for no ranges', () => {
    expect(createDiffCollapsedRangesState([]).size).toBe(0);
  });

  it('creates correct keys', () => {
    const map = createDiffCollapsedRangesState([{ startIndex: 0, endIndex: 3 }]);
    expect(map.has('0-3')).toBe(true);
  });

  it('sets isExpanded to false', () => {
    const map = createDiffCollapsedRangesState([{ startIndex: 0, endIndex: 3 }]);
    expect(map.get('0-3')?.isExpanded).toBe(false);
  });

  it('sets lineCount correctly', () => {
    const map = createDiffCollapsedRangesState([{ startIndex: 0, endIndex: 3 }]);
    // 0,1,2,3 = 4 lines
    expect(map.get('0-3')?.lineCount).toBe(4);
  });
});

// ─── isDiffLineInCollapsedRange ───────────────────────────────────────────────

describe('isDiffLineInCollapsedRange', () => {
  function makeStates(
    ranges: { startIndex: number; endIndex: number }[],
    expanded = false
  ) {
    const map = createDiffCollapsedRangesState(ranges);
    if (expanded) {
      for (const [key, value] of map) {
        map.set(key, { ...value, isExpanded: true });
      }
    }
    return map;
  }

  it('returns not-collapsed for a line before the range', () => {
    const states = makeStates([{ startIndex: 5, endIndex: 10 }]);
    expect(isDiffLineInCollapsedRange(2, states).isCollapsed).toBe(false);
  });

  it('returns isFirstLine=true for the first index of range', () => {
    const states = makeStates([{ startIndex: 5, endIndex: 10 }]);
    const result = isDiffLineInCollapsedRange(5, states);
    expect(result.isCollapsed).toBe(true);
    expect(result.isFirstLine).toBe(true);
  });

  it('returns isFirstLine=false for a middle index of range', () => {
    const states = makeStates([{ startIndex: 5, endIndex: 10 }]);
    const result = isDiffLineInCollapsedRange(7, states);
    expect(result.isCollapsed).toBe(true);
    expect(result.isFirstLine).toBe(false);
  });

  it('returns not-collapsed for a line after the range', () => {
    const states = makeStates([{ startIndex: 5, endIndex: 10 }]);
    expect(isDiffLineInCollapsedRange(11, states).isCollapsed).toBe(false);
  });

  it('skips expanded ranges', () => {
    const states = makeStates([{ startIndex: 5, endIndex: 10 }], true);
    expect(isDiffLineInCollapsedRange(7, states).isCollapsed).toBe(false);
  });

  it('reports correct hiddenCount', () => {
    const states = makeStates([{ startIndex: 5, endIndex: 10 }]);
    // hiddenCount = endIndex - startIndex = 5
    expect(isDiffLineInCollapsedRange(5, states).hiddenCount).toBe(5);
  });
});
