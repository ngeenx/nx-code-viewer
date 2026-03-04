import { describe, it, expect } from 'vitest';
import {
  parseHighlightedLines,
  isLineHighlighted,
} from './highlight.utils';

// ─── parseHighlightedLines ────────────────────────────────────────────────────

describe('parseHighlightedLines', () => {
  it('returns empty set for undefined', () => {
    expect(parseHighlightedLines(undefined).size).toBe(0);
  });

  it('returns empty set for null', () => {
    // cast to any to simulate null being passed despite TS type
    expect(parseHighlightedLines(null as any).size).toBe(0);
  });

  it('handles a single number', () => {
    const set = parseHighlightedLines(5);
    expect(set.has(5)).toBe(true);
    expect(set.size).toBe(1);
  });

  it('handles an array of numbers', () => {
    const set = parseHighlightedLines([1, 3, 7]);
    expect(set.has(1)).toBe(true);
    expect(set.has(3)).toBe(true);
    expect(set.has(7)).toBe(true);
    expect(set.size).toBe(3);
  });

  it('handles a single range tuple', () => {
    const set = parseHighlightedLines([[2, 5]]);
    expect(set.has(2)).toBe(true);
    expect(set.has(3)).toBe(true);
    expect(set.has(4)).toBe(true);
    expect(set.has(5)).toBe(true);
    expect(set.size).toBe(4);
  });

  it('handles multiple range tuples', () => {
    const set = parseHighlightedLines([
      [1, 2],
      [5, 6],
    ]);
    expect(set.has(1)).toBe(true);
    expect(set.has(2)).toBe(true);
    expect(set.has(5)).toBe(true);
    expect(set.has(6)).toBe(true);
    expect(set.size).toBe(4);
  });

  it('handles mixed array of numbers and ranges', () => {
    const set = parseHighlightedLines([1, [3, 5], 8]);
    expect(set.has(1)).toBe(true);
    expect(set.has(3)).toBe(true);
    expect(set.has(4)).toBe(true);
    expect(set.has(5)).toBe(true);
    expect(set.has(8)).toBe(true);
    expect(set.size).toBe(5);
  });

  it('normalizes a reversed range [end, start]', () => {
    const set = parseHighlightedLines([[5, 2]]);
    expect(set.has(2)).toBe(true);
    expect(set.has(3)).toBe(true);
    expect(set.has(4)).toBe(true);
    expect(set.has(5)).toBe(true);
    expect(set.size).toBe(4);
  });
});

// ─── isLineHighlighted ────────────────────────────────────────────────────────

describe('isLineHighlighted', () => {
  it('returns true for a line in the set', () => {
    const set = new Set([1, 2, 3]);
    expect(isLineHighlighted(2, set)).toBe(true);
  });

  it('returns false for a line not in the set', () => {
    const set = new Set([1, 2, 3]);
    expect(isLineHighlighted(5, set)).toBe(false);
  });

  it('returns false for an empty set', () => {
    expect(isLineHighlighted(1, new Set())).toBe(false);
  });
});
