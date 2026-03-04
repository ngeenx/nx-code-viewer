import { describe, it, expect, vi } from 'vitest';
import {
  matchesLine,
  getMatchingWidgets,
  getMatchingWidgetsByDisplay,
  getMatchingWidgetsByPosition,
  hasMatchingWidgetsWithDisplay,
} from './line-widget.utils';
import type { LineWidgetConfig } from '../types';

// ─── helpers ──────────────────────────────────────────────────────────────────

function makeWidget(
  overrides: Partial<LineWidgetConfig> = {}
): LineWidgetConfig {
  return {
    position: 'right',
    display: 'always',
    lineComponent: class {} as any,
    ...overrides,
  };
}

// ─── matchesLine ──────────────────────────────────────────────────────────────

describe('matchesLine', () => {
  it('returns true when match is undefined', () => {
    expect(matchesLine(undefined, 'hello', 1)).toBe(true);
  });

  it('returns true when match is true', () => {
    expect(matchesLine(true, 'hello', 1)).toBe(true);
  });

  it('returns false when match is false', () => {
    expect(matchesLine(false, 'hello', 1)).toBe(false);
  });

  it('returns true when RegExp matches line content', () => {
    expect(matchesLine(/TODO/, 'TODO: fix this', 1)).toBe(true);
  });

  it('returns false when RegExp does not match', () => {
    expect(matchesLine(/TODO/, 'normal line', 1)).toBe(false);
  });

  it('calls function match with line and lineNumber', () => {
    const fn = vi.fn().mockReturnValue(true);
    matchesLine(fn, 'content', 5);
    expect(fn).toHaveBeenCalledWith('content', 5);
  });

  it('returns function match result when true', () => {
    expect(matchesLine((_l, n) => n > 3, 'x', 4)).toBe(true);
  });

  it('returns function match result when false', () => {
    expect(matchesLine((_l, n) => n > 3, 'x', 2)).toBe(false);
  });
});

// ─── getMatchingWidgets ───────────────────────────────────────────────────────

describe('getMatchingWidgets', () => {
  it('returns empty array for undefined widgets', () => {
    expect(getMatchingWidgets(undefined, 'line', 1)).toEqual([]);
  });

  it('returns empty array for empty array', () => {
    expect(getMatchingWidgets([], 'line', 1)).toEqual([]);
  });

  it('returns widget when match is undefined (matches all)', () => {
    const w = makeWidget();
    expect(getMatchingWidgets([w], 'line', 1)).toEqual([w]);
  });

  it('excludes widget when match is false', () => {
    const w = makeWidget({ match: false });
    expect(getMatchingWidgets([w], 'line', 1)).toEqual([]);
  });

  it('returns only matching widgets from mixed array', () => {
    const w1 = makeWidget({ match: true });
    const w2 = makeWidget({ match: false });
    const w3 = makeWidget({ match: /hello/ });
    const result = getMatchingWidgets([w1, w2, w3], 'hello world', 1);
    expect(result).toContain(w1);
    expect(result).not.toContain(w2);
    expect(result).toContain(w3);
  });
});

// ─── getMatchingWidgetsByDisplay ──────────────────────────────────────────────

describe('getMatchingWidgetsByDisplay', () => {
  it('returns only widgets with matching display mode', () => {
    const hover = makeWidget({ display: 'hover' });
    const always = makeWidget({ display: 'always' });
    const result = getMatchingWidgetsByDisplay([hover, always], 'line', 1, 'hover');
    expect(result).toContain(hover);
    expect(result).not.toContain(always);
  });

  it('returns empty array when no widgets match display', () => {
    const w = makeWidget({ display: 'always' });
    expect(getMatchingWidgetsByDisplay([w], 'line', 1, 'hover')).toEqual([]);
  });
});

// ─── getMatchingWidgetsByPosition ─────────────────────────────────────────────

describe('getMatchingWidgetsByPosition', () => {
  it('returns only widgets with matching position', () => {
    const left = makeWidget({ position: 'left' });
    const right = makeWidget({ position: 'right' });
    const result = getMatchingWidgetsByPosition([left, right], 'line', 1, 'left');
    expect(result).toContain(left);
    expect(result).not.toContain(right);
  });

  it('returns empty array when no widgets match position', () => {
    const w = makeWidget({ position: 'right' });
    expect(getMatchingWidgetsByPosition([w], 'line', 1, 'left')).toEqual([]);
  });
});

// ─── hasMatchingWidgetsWithDisplay ────────────────────────────────────────────

describe('hasMatchingWidgetsWithDisplay', () => {
  it('returns true when at least one widget matches display mode', () => {
    const w = makeWidget({ display: 'hover' });
    expect(hasMatchingWidgetsWithDisplay([w], 'line', 1, 'hover')).toBe(true);
  });

  it('returns false when no widgets match display mode', () => {
    const w = makeWidget({ display: 'always' });
    expect(hasMatchingWidgetsWithDisplay([w], 'line', 1, 'hover')).toBe(false);
  });

  it('returns false for undefined widgets', () => {
    expect(hasMatchingWidgetsWithDisplay(undefined, 'line', 1, 'always')).toBe(
      false
    );
  });

  it('returns false when widget match is false even if display matches', () => {
    const w = makeWidget({ match: false, display: 'hover' });
    expect(hasMatchingWidgetsWithDisplay([w], 'line', 1, 'hover')).toBe(false);
  });
});
