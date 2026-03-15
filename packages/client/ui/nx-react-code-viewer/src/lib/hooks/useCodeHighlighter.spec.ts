import { describe, it, expect } from 'vitest';
import { useCodeHighlighter } from './useCodeHighlighter';

describe('useCodeHighlighter', () => {
  const highlighter = useCodeHighlighter();

  describe('createInitialState', () => {
    it('returns correct shape with null html, false isLoading, null error', () => {
      const state = highlighter.createInitialState();

      expect(state).toEqual({
        html: null,
        rawHtml: null,
        isLoading: false,
        error: null,
      });
    });

    it('returns a new object on each call', () => {
      const a = highlighter.createInitialState();
      const b = highlighter.createInitialState();

      expect(a).toEqual(b);
      expect(a).not.toBe(b);
    });
  });

  describe('createLoadingState', () => {
    it('has isLoading set to true', () => {
      const state = highlighter.createLoadingState();

      expect(state.isLoading).toBe(true);
    });

    it('has null html, rawHtml, and error', () => {
      const state = highlighter.createLoadingState();

      expect(state.html).toBeNull();
      expect(state.rawHtml).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('createErrorState', () => {
    it('contains the provided error', () => {
      const error = new Error('test error');
      const state = highlighter.createErrorState(error);

      expect(state.error).toBe(error);
    });

    it('has isLoading false and html null', () => {
      const error = new Error('test error');
      const state = highlighter.createErrorState(error);

      expect(state.isLoading).toBe(false);
      expect(state.html).toBeNull();
      expect(state.rawHtml).toBeNull();
    });

    it('preserves error message', () => {
      const error = new Error('Something went wrong');
      const state = highlighter.createErrorState(error);

      expect(state.error?.message).toBe('Something went wrong');
    });
  });

  describe('buildFallbackHtml', () => {
    it('escapes HTML entities in code', () => {
      const html = highlighter.buildFallbackHtml('<div>test</div>');

      expect(html).toContain('&lt;div&gt;');
      expect(html).toContain('&lt;/div&gt;');
    });

    it('wraps each line in a span with class "line"', () => {
      const html = highlighter.buildFallbackHtml('line1\nline2');

      expect(html).toContain('<span class="line">line1</span>');
      expect(html).toContain('<span class="line">line2</span>');
    });

    it('handles single line code', () => {
      const html = highlighter.buildFallbackHtml('hello');

      expect(html).toBe('<span class="line">hello</span>');
    });

    it('handles empty string', () => {
      const html = highlighter.buildFallbackHtml('');

      expect(html).toBe('<span class="line"></span>');
    });

    it('escapes ampersands', () => {
      const html = highlighter.buildFallbackHtml('a & b');

      expect(html).toContain('a &amp; b');
    });

    it('escapes quotes', () => {
      const html = highlighter.buildFallbackHtml('say "hello"');

      expect(html).toContain('&quot;hello&quot;');
    });
  });

  describe('highlightToHtml', () => {
    it('returns initial state for empty code', async () => {
      const result = await highlighter.highlightToHtml({
        code: '',
        language: 'typescript',
        theme: 'dark',
      });

      expect(result).toEqual({
        html: null,
        rawHtml: null,
        isLoading: false,
        error: null,
      });
    });

    it('returns fallback html for plaintext language', async () => {
      const result = await highlighter.highlightToHtml({
        code: 'hello world',
        language: 'plaintext',
        theme: 'dark',
      });

      expect(result.html).toContain('hello world');
      expect(result.isLoading).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('highlightLines', () => {
    it('returns empty array for empty code', async () => {
      const result = await highlighter.highlightLines({
        code: '',
        language: 'typescript',
        theme: 'dark',
      });

      expect(result).toEqual([]);
    });

    it('returns escaped lines for plaintext', async () => {
      const result = await highlighter.highlightLines({
        code: '<div>\n</div>',
        language: 'plaintext',
        theme: 'dark',
      });

      expect(result).toHaveLength(2);
      expect(result[0]).toContain('&lt;div&gt;');
      expect(result[1]).toContain('&lt;/div&gt;');
    });
  });
});
